# CLAUDE.md — Mooroon5 Portfolio Website

This file is the project context for Claude Code. Read it fully at the start of every session before making any changes.

---

## Project Overview

**Project name**: Mooroon5 Website  
**Type**: One-page portfolio and tools showcase  
**Purpose**: Present the Mooroon5 SIGL group, its members, and the tools they build. This website serves as the public face and reference hub for all group projects.  
**Status**: In active development

---

## Team

| Name | Role |
|---|---|
| Nazim | Member |
| Basile | Member |
| Maia | Member |
| Gabriel | Member |
| Tieoule | Member |
| Thomas | Member |

**Group name**: Mooroon5  
**Group motto**: "Be better be Moore"  
**Footer tagline**: "Powered by the greatest minds"  
**Logo**: `src/assets/logo.png` — never replace, never rename, always reference this exact path

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| UI components | shadcn/ui (Radix preset, Nova, Stone base) |
| Animations | Framer Motion exclusively — no other animation library |
| Icons | Lucide React exclusively — no other icon library |
| Fonts | Google Fonts — Cinzel, Playfair Display, EB Garamond |
| Backend | None for now |

### Path alias
All imports use `@/` which resolves to `src/`. Example: `import { Hero } from '@/components/Hero'`

### Tailwind config
Tailwind is configured via the `@tailwindcss/vite` plugin — there is no `tailwind.config.ts` file. All theme overrides go in `src/index.css` using CSS variables.

---

## Theme — Dark Academia / Magical Royalty

The entire aesthetic is built around: **Harry Potter, magic, library, books, bookshelf, royalty, education**.

The mood is **dark academia** — rich, aged, mysterious, and grand. Think candlelit library, ancient spellbooks, enchanted manuscripts.

### Color Palette (CSS variables in `src/index.css`)

```css
:root {
  --background: #1a1008;        /* Deep dark — almost black with warm undertone */
  --foreground: #f5e6c8;        /* Parchment — aged paper */
  --primary: #c9a84c;           /* Aged gold */
  --primary-hover: #e2c06a;     /* Bright gold on hover */
  --secondary: #6b1e2a;         /* Deep burgundy */
  --accent: #2d4a2d;            /* Dark forest green */
  --muted: #3d2b1a;             /* Dark brown — card backgrounds */
  --muted-foreground: #b8995a;  /* Warm tan — secondary text */
  --border: #4a3520;            /* Aged wood border */
  --glow: #c9a84c40;            /* Gold glow for shadows */
}
```

### Typography

| Font | Usage | Weight |
|---|---|---|
| **Cinzel** | Main headings, group name, section titles | 400, 700, 900 |
| **Playfair Display** | Subheadings, member names, card titles | 400, 700, italic |
| **EB Garamond** | Body text, descriptions, footer | 400, italic |

**Rule**: Never use Inter, Roboto, Arial, or any system font anywhere in this project.

### Animation Rules (Framer Motion)

- **Entrance**: `opacity: 0 → 1` + `y: 20 → 0`, duration `0.6s`, easing `easeOut`
- **Stagger**: Use `staggerChildren: 0.1` for lists (team names, tool cards)
- **Scroll reveal**: `whileInView` + `viewport={{ once: true }}` on every section
- **Hover**: Cards use `whileHover={{ y: -4, boxShadow: "0 8px 30px var(--glow)" }}`
- **Always** wrap animations with `useReducedMotion()` check — if reduced motion is preferred, disable all animations
- **No heavy effects** — subtle is the rule. One well-orchestrated entrance beats ten scattered micro-animations

### Magic Effects (CSS only)
- Floating dust particles: pure CSS `@keyframes` with random `animation-delay`
- Candle flicker: CSS `@keyframes` on `opacity` and `transform: scale()`
- Gold shimmer on text: CSS `background-clip: text` with animated gradient
- Parchment texture: `background-image` with subtle noise overlay

---

## Page Structure

Single scrollable page. No routing needed.

### Section 1 — Hero
- Team logo (`src/assets/logo.png`) centered, with soft golden glow
- "Mooroon5" in Cinzel, large, with gold shimmer animation
- Six member names in Playfair Display, staggered entrance
- Motto "Be better be Moore" styled as an engraved stone inscription
- Floating magic dust particles in background

### Section 2 — Tools Grimoire
- Section title: "Our Grimoire of Tools" (Cinzel, with `BookOpen` icon)
- Grid of tool cards — styled as enchanted tomes
- Each card: icon + tool name + short description
- Hover: gold glow + `y: -4` lift (Framer Motion `whileHover`)
- Placeholder cards until real tools are defined

### Section 3 — The Magical Book
- Large open book centered on screen
- Visual details: leather cover, aged page edges, stitching, spine
- Two blank pages (left + right) — content intentionally empty, placeholder for future
- Page hover: subtle `rotateY` via Framer Motion
- Floating candle or particle near the book
- **Do not add content to the pages** — leave them blank

### Footer
- Logo (`src/assets/logo.png`) smaller version
- Tagline: "Powered by the greatest minds" in EB Garamond italic
- Minimal — no links, no nav, no social icons for now

---

## File Structure

```
src/
├── assets/
│   └── logo.png                 # Team logo — never replace
├── components/
│   ├── Hero.tsx                 # Section 1
│   ├── Tools.tsx                # Section 2
│   ├── MagicalBook.tsx          # Section 3
│   └── Footer.tsx               # Footer
├── lib/
│   └── utils.ts                 # shadcn cn() utility
├── App.tsx                      # Root component, imports all sections
└── index.css                    # Global styles, CSS variables, font imports
```

---

## Code Conventions

- **Components**: PascalCase, one component per file
- **CSS classes**: Tailwind utilities only, no custom class names unless absolutely necessary
- **Animations**: always defined with `const variants = { ... }` outside the component, never inline
- **Icons**: always imported individually from `lucide-react` — never import the full library
- **Images**: always use `alt` attributes for accessibility
- **No inline styles** — use Tailwind classes or CSS variables only
- **TypeScript**: strict mode, no `any`, always type props interfaces

---

## What NOT to do

- ❌ Never use Inter, Roboto, Arial, or system fonts
- ❌ Never use purple gradients or generic AI color schemes
- ❌ Never add a backend, router, or auth — not needed yet
- ❌ Never replace or rename `src/assets/logo.png`
- ❌ Never add content to the book pages in Section 3
- ❌ Never use any animation library other than Framer Motion
- ❌ Never use any icon library other than Lucide React
- ❌ Never skip the `useReducedMotion()` check on animations

---

## Installed shadcn Components

```bash
# Add new components with:
npx shadcn@latest add <component-name>
```

Currently installed: `card`, `badge`, `button`, `dialog`, `tooltip`, `separator`

---

## Future Plans (do not implement yet)

- Individual tool pages with routing (React Router)
- The magical book Section 3 will display dynamic content
- Possible backend for tool documentation or a contact form