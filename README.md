# Rick Sanchez — Presidential Campaign Landing Page

> **This is a parody project.** It is not affiliated with, endorsed by, or connected to Adult Swim, Cartoon Network, or any official Rick and Morty property. This is a fan-made, non-commercial project created purely for entertainment and educational purposes.

A fully interactive presidential campaign landing page for Rick Sanchez (from *Rick and Morty*), built as a front-end exercise in vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

---

## 🧪 What Is This?

An over-the-top fake campaign website where Rick Sanchez runs for President of the Citadel. The page features:

- **Hero section** with animated avatar, portal-green palette, and particle background
- **About section** with Rick's "qualifications"
- **4 proposal cards** with SVG icons (science, security, economy, healthcare)
- **Vote button** that shows sarcastic Rick quotes (shuffle bag — no repeats)
- **Theme toggle** with a 4-phase escalation system:
  1. Sarcastic insults
  2. IP-based threats (fetched via ipify API, pixelated for display)
  3. Angry warnings referencing the Omega Device
  4. Full page corruption → permanent "nuke" screen stored in localStorage
- **Language toggle** (ES/EN) with insults delivered in the new language
- **Nuked state** referencing the Omega Device from the series — shows a live variant elimination counter, dimension purge log, and a final incomprehensible number (ℵ₀×∞)
- **Custom scrollbar**, responsive design, SVG icons, favicon management

---

## 🏗️ How It Was Built

Built entirely with **vanilla technologies** — no frameworks, no bundlers:

- **HTML5** — Semantic structure with `data-i18n` attributes for internationalization
- **CSS3** — Custom properties (Rick & Morty palette), `clamp()` for fluid typography, keyframe animations (glitch, scanlines, static noise, flicker), custom scrollbars (webkit + Firefox)
- **JavaScript (ES Modules)** — `import`/`export` for i18n files, shuffle bag pattern for non-repeating randomization, `Temporal` API with `Date` fallback for dynamic year, `fetch` for IP retrieval, `localStorage` for persistent nuke state

### Project Structure

```
index.html
src/
  scripts/
    scripts.js          # All app logic (i18n, toasts, escalation, corruption, nuke)
  styles/
    styles.css          # Full styling (~750 lines)
  i18n/
    es.js               # Spanish translations
    en.js               # English translations
  assets/
    avatars/            # Rick avatar
    icons/              # SVGs (skull, globe, test-tube, etc.)
```

---

## 📺 Credits

**Rick and Morty** was created by **Justin Roiland** and **Dan Harmon**. The series is produced by Starburns Industries and airs on Adult Swim (Cartoon Network). All characters, references, and lore belong to their respective owners.

---

## 🔗 Related Technologies

- [Vanilla JS](http://vanilla-js.com/)
- [ipify API](https://www.ipify.org/)

---

## 👤 Author

**Johan Amed**  
GitHub: https://github.com/Ephistopheles
Email: [rjohanamed@gmail.com](mailto:rjohanamed@gmail.com)

---

## 📄 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it.
