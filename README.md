# Landing Rick — Frontend

Astro + Preact + TypeScript frontend for the Rick Sanchez interdimensional presidential campaign landing page.

> **Parody project.** Not affiliated with Adult Swim, Cartoon Network, or any Rick and Morty property. Fan-made, non-commercial, for entertainment and educational purposes.

---

## What Is This?

An over-the-top fake campaign website where Rick Sanchez runs for President of the Citadel. Features:

- **Hero section** with animated avatar, portal-green palette, and particle background
- **About section** with Rick's "qualifications"
- **4 proposal cards** with SVG icons (science, security, economy, healthcare)
- **Vote button** — sarcastic Rick quotes via shuffle bag (no repeats until pool exhausted)
- **Theme toggle** with a 4-phase escalation system:
  1. Sarcastic insults (clicks 1–5)
  2. IP-based threats with pixelated IP display (clicks 6–10)
  3. Angry warnings referencing the Omega Device (clicks 11–15)
  4. Full page corruption (clicks 16+)
- **Omega Device (nuke)** — permanent session state, live variant elimination counter, dimension purge log
- **Language toggle** (ES/EN) — insults delivered in the newly selected language
- **Responsive design**, custom scrollbar, SVG icons, favicon

---

## Tech Stack

- **Astro 6** — static site framework, islands architecture
- **Preact 10 + @preact/signals** — reactive client islands
- **TypeScript** — strict mode throughout
- **Native fetch** — communicates with the NestJS backend (`credentials: "include"` for cookies)
- **CSS custom properties** — Rick & Morty palette, animations (glitch, scanlines, flicker, static noise)

---

## Requirements

- Node.js ≥ 20
- npm ≥ 10
- The [landingrick-back](../landingrick-back) backend running

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the value:

```bash
cp .env.example .env
```

```env
# Full base URL of the backend API (no trailing slash, must include /api)
PUBLIC_API_URL=http://localhost:3001/api
```

> **Never commit `.env`** — it is already in `.gitignore`.

### 3. Start the backend

Before running the frontend, make sure the backend is running. See [landingrick-back/README.md](../landingrick-back/README.md).

### 4. Run in development

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### 5. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server or CDN.

---

## Project Structure

```
src/
  pages/
    index.astro              # Entry point — mounts the Preact island
  layouts/
    Layout.astro             # Base HTML layout (meta, fonts, global CSS)
  components/
    preact/
      LandingIsland.tsx      # Main interactive island (session, vote, escalation)
      Toast.tsx              # Notification toast component
      CorruptionOverlay.tsx  # Corruption phase overlay
      NukedScreen.tsx        # Omega Device final screen
  hooks/
    useGameApi.ts            # Typed fetch wrappers for all backend endpoints
  stores/
    lang.ts                  # Signal-based language store with t() helper
  i18n/
    en.ts                    # English translations
    es.ts                    # Spanish translations
    types.ts                 # Shared translation types
    index.ts                 # Re-exports
  styles/
    global.css               # All styles (animations, corruption, nuked screens)
public/
  favicon.svg
  icons/                     # SVG icons used by the landing
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build static output to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Credits

**Rick and Morty** was created by **Justin Roiland** and **Dan Harmon**. Produced by Starburns Industries, airs on Adult Swim (Cartoon Network). All characters, references, and lore belong to their respective owners.

---

## Author

**Johan Amed**  
GitHub: [Ephistopheles](https://github.com/Ephistopheles)  
Email: [rjohanamed@gmail.com](mailto:rjohanamed@gmail.com)

---

## License

MIT

