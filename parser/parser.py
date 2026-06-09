from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from pydantic import BaseModel, HttpUrl, ValidationError, field_validator

ROOT = Path(__file__).resolve().parent.parent
INPUT = ROOT / "taaft.json"
OUTPUT = ROOT / "tools_clean.json"
ERRORS = ROOT / "parsing_errors.json"

PRICING_MAP = {
    "free": "Бесплатно",
    "freemium": "Фримиум",
    "paid": "Платно",
    "trial": "Пробный период",
    "subscription": "Платно",
}

CATEGORY_HINTS = [
    "текст",
    "copy",
    "seo",
    "video",
    "image",
    "design",
    "analytics",
    "email",
    "social",
    "content",
    "marketing",
    "sales",
]

class ToolModel(BaseModel):
    name: str
    url: HttpUrl
    description: str
    category: str
    pricing: str
    domain: str
    tags: list[str]

    @field_validator("name", "description", "category", "pricing", "domain")
    @classmethod
    def strip_text(cls, value: str) -> str:
        value = re.sub(r"\s+", " ", value).strip()
        if not value:
            raise ValueError("пустое значение")
        return value

    @field_validator("pricing")
    @classmethod
    def normalize_pricing(cls, value: str) -> str:
        lower = value.lower()
        for key, normalized in PRICING_MAP.items():
            if key in lower:
                return normalized
        return "Платно"

    @field_validator("domain")
    @classmethod
    def normalize_domain(cls, value: str) -> str:
        parsed = urlparse(value if value.startswith("http") else f"https://{value}")
        if not parsed.hostname:
            raise ValueError("некорректный домен")
        return parsed.hostname.lower().removeprefix("www.")

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, value: list[str]) -> list[str]:
        cleaned = []
        for item in value:
            item = re.sub(r"[\[\]_*`>#]", "", item).strip()
            if item and item not in cleaned:
                cleaned.append(item)
        return cleaned[:12]


@dataclass
class ParseError:
    source: str
    error: str
    raw: Any


def load_input() -> str:
    if not INPUT.exists():
        raise FileNotFoundError(f"Не найден файл {INPUT}")
    return INPUT.read_text(encoding="utf-8-sig")


def strip_markdown(text: str) -> str:
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"!\[[^\]]*\]\([^\)]*\)", " ", text)
    text = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1", text)
    text = re.sub(r"[#>*_`~]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_blocks(text: str) -> list[str]:
    patterns = [
        r"(?:^|\n)#+\s*(.+?)(?=\n#+\s|\Z)",
        r"(?:^|\n)(?:-\s+|\*\s+|\d+\.\s+)(.+?)(?=\n(?:-\s+|\*\s+|\d+\.\s+)|\Z)",
    ]
    blocks: list[str] = []
    for pattern in patterns:
        blocks.extend(match.group(1).strip() for match in re.finditer(pattern, text, re.S | re.M))
    if blocks:
        return blocks

    # fallback state machine
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    current: list[str] = []
    for line in lines:
        if line.startswith("-") or line.startswith("*") or re.match(r"^\d+\.", line):
            if current:
                blocks.append(" ".join(current))
                current = []
            current.append(line)
        else:
            current.append(line)
    if current:
        blocks.append(" ".join(current))
    return blocks


def infer_category(text: str) -> str:
    lower = text.lower()
    for hint in CATEGORY_HINTS:
        if hint in lower:
            return hint.title()
    return "Маркетинг"


def infer_pricing(text: str) -> str:
    lower = text.lower()
    if any(word in lower for word in ["free", "бесплат", "free plan"]):
        return "Бесплатно"
    if any(word in lower for word in ["trial", "пробн"]):
        return "Пробный период"
    if any(word in lower for word in ["freemium", "план", "subscription", "$", "usd", "month"]):
        return "Платно"
    return "Фримиум"


def build_candidate(block: str) -> dict[str, Any] | None:
    cleaned = strip_markdown(block)
    url_match = re.search(r"https?://[^\s)]+", block)
    if not url_match:
        return None

    url = url_match.group(0).rstrip(".,;")
    domain = urlparse(url).hostname or ""
    pieces = [piece.strip() for piece in re.split(r"[\n•|–—-]", cleaned) if piece.strip()]
    name = pieces[0][:120] if pieces else domain
    description = " ".join(pieces[1:])[:500] if len(pieces) > 1 else cleaned[:500]
    tags = []
    for word in re.findall(r"[A-Za-zА-Яа-я0-9#]{3,}", cleaned):
        lowered = word.lower()
        if lowered not in {name.lower(), domain.lower()} and lowered not in [tag.lower() for tag in tags]:
            tags.append(word)
        if len(tags) >= 8:
            break

    return {
        "name": name,
        "url": url,
        "description": description,
        "category": infer_category(cleaned),
        "pricing": infer_pricing(cleaned),
        "domain": domain,
        "tags": tags,
        "source": cleaned,
    }


def fallback_parse(text: str) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for block in extract_blocks(text):
        candidate = build_candidate(block)
        if candidate:
            candidates.append(candidate)
    return candidates


def dedupe_by_domain(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    unique: dict[str, dict[str, Any]] = {}
    for row in rows:
        domain = row["domain"]
        if domain not in unique or len(row["description"]) > len(unique[domain]["description"]):
            unique[domain] = row
    return list(unique.values())


def main() -> None:
    errors: list[dict[str, Any]] = []
    text = load_input()
    rows: list[dict[str, Any]] = []

    for block in extract_blocks(text):
        candidate = build_candidate(block)
        if not candidate:
            continue
        try:
            model = ToolModel.model_validate(candidate)
            rows.append(model.model_dump(mode="json"))
        except ValidationError as exc:
            errors.append({"source": candidate.get("source", block), "error": exc.errors(), "raw": candidate})
        except Exception as exc:
            errors.append({"source": candidate.get("source", block), "error": str(exc), "raw": candidate})

    if not rows:
        for candidate in fallback_parse(text):
            try:
                model = ToolModel.model_validate(candidate)
                rows.append(model.model_dump(mode="json"))
            except ValidationError as exc:
                errors.append({"source": candidate.get("source", "fallback"), "error": exc.errors(), "raw": candidate})

    rows = dedupe_by_domain(rows)
    OUTPUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    ERRORS.write_text(json.dumps(errors, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(rows)} tools to {OUTPUT.name}")
    print(f"Saved {len(errors)} parsing errors to {ERRORS.name}")


if __name__ == "__main__":
    main()
