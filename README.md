# Sunlight Design System

A reusable design system extracted from [sunlightapi.com](https://www.sunlightapi.com/) — everything you need to build new apps that look and feel like Sunlight.

## What's inside

| File | Purpose |
|------|---------|
| `style-guide.html` | **Open this first.** A self-contained, interactive reference showing every color, type style, and component. Double-click to view in any browser. |
| `tokens.css` | Design tokens as CSS custom properties (`--sl-*`). Import once at your app root. Stack-neutral. |
| `tokens.json` | The same tokens as data — feed into Figma, Style Dictionary, or your own tooling. |
| `tailwind.config.js` | Drop-in Tailwind preset mapping the tokens to utility classes (`bg-brand`, `text-muted`, `rounded-pill`, etc.). |
| `components.css` | Framework-neutral component styles (`.sl-btn`, `.sl-card`, `.sl-badge`…). Depends on `tokens.css`. |
| `react/components.jsx` | React component library (`Button`, `Card`, `Badge`, `Input`, `Navbar`, `Logo`, `LogoMark`…) rendering those classes. |
| `assets/logo-full.svg` | Official Sunlight logo lockup (mark + wordmark). |
| `assets/logo-mark.svg` | Logo mark only — uses `currentColor`, so it recolors via CSS. |

## Brand at a glance

- **Signature color:** Sunlight yellow `#FFD503`
- **Logo color:** deep plum `#540F28` (the official mark)
- **Ink (text):** near-black `#0C0A08`; body copy slate `#435366`
- **Surfaces:** white, warm sand `#F4F2F0`, dark panel `#2E2E2E`
- **Typeface:** Figtree (Google Fonts) — medium/semibold headings with tight tracking
- **Shape language:** rounded (8–16px) cards, pill (9999px) nav buttons and badges, soft shadows
- **Logo:** use `assets/logo-mark.svg` with `color: var(--sl-color-plum)`. On dark backgrounds set `color: #fff`. The React `<Logo />` / `<LogoMark />` components do this for you.

## Quick start

### Plain HTML / any framework
```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components.css" />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />

<button class="sl-btn sl-btn--primary sl-btn--pill">Contact Sales</button>
```

### React
```jsx
import "../tokens.css";
import "../components.css";
import { Button, Card, Badge, Navbar } from "./react/components.jsx";

export default function App() {
  return (
    <>
      <Navbar links={[{label:"Products"},{label:"Developers"}]} />
      <Card hover>
        <Badge variant="soft">New</Badge>
        <Card.Title>Agentic Portal Payments</Card.Title>
        <Card.Body>Execute card payments across any supplier portal.</Card.Body>
        <Button variant="primary">Get Started</Button>
      </Card>
    </>
  );
}
```

### Tailwind
```js
// tailwind.config.js
module.exports = { presets: [require("./tailwind.config.js")] };
// → bg-brand, text-ink, text-muted, bg-sand, rounded-pill, shadow-brand, font-sans
```

## Notes
- Tokens were read from the live site's computed styles, so colors and type sizes match production. Hover/active brand shades and status colors are sensible derived additions, marked in `tokens.css`.
- Everything is stack-neutral by design (you mentioned the stack isn't decided yet): the CSS variables and component classes work anywhere, and the React + Tailwind layers sit on top without locking you in.
