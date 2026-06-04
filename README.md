# AI Money Master

A modern landing page for **AI Money Master**, built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and **Tailwind CSS**.

## Features

- Responsive landing page (mobile + desktop) with a sticky, collapsible header
- Hero section with animated gradient headline, floating dashboard mockup, and stats
- Feature grid, "How it works" steps, pricing tiers, and a working contact form
- Reusable components: `Header`, `Footer`, `Button`, `Card`, `Hero`, `ContactForm`
- Tailwind-powered animations (fade-in, float, animated gradient)

## Project structure

```
app/
  layout.tsx     # Root layout (Header + Footer + fonts)
  page.tsx       # Home page (Hero, Features, Pricing, Contact)
  globals.css    # Tailwind directives + base styles
  icon.svg       # App favicon
components/
  Header.tsx
  Footer.tsx
  Button.tsx
  Card.tsx
  Hero.tsx
  ContactForm.tsx
public/
  logo.svg
```

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Build the production bundle          |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint (next lint)               |
