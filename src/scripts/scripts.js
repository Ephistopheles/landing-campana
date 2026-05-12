import es from "../i18n/es.js";
import en from "../i18n/en.js";

const translations = { es, en };

// ── Get current year (Temporal API or fallback) ──
function getCurrentYear() {
  try {
    if (typeof Temporal !== "undefined" && Temporal.Now) {
      return Temporal.Now.plainDateISO().year;
    }
  } catch {
    // Temporal not available
  }
  return new Date().getFullYear();
}

const CURRENT_YEAR = getCurrentYear();

// ── Favicon helper ────────────────────────────────
function setFavicon(path) {
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }
  link.href = path;
}

// ── Check if page was nuked previously ──────────
if (localStorage.getItem("rick-nuked") === "true") {
  nukePagePermanently();
} else {
  initApp();
}

function initApp() {
  let currentLang = "es";
  let themeClicks = 0;
  let userIP = null;

  const toast = document.getElementById("toast");
  const rickBtn = document.getElementById("rick-btn");
  const themeBtn = document.getElementById("theme-btn");
  const langBtn = document.getElementById("lang-btn");
  const langLabel = document.getElementById("lang-label");

  let hideTimeout = null;

  // Set normal favicon
  setFavicon("./src/assets/icons/globe.svg");

  // ── Shuffle bag (no repeats until all used) ─────
  const shuffleBags = {};

  function getFromBag(key, sourceArray) {
    if (!shuffleBags[key] || shuffleBags[key].length === 0) {
      shuffleBags[key] = [...sourceArray].sort(() => Math.random() - 0.5);
    }
    return shuffleBags[key].pop();
  }

  // ── Toast helper ────────────────────────────────
  function showToast(message, duration = 5000) {
    toast.textContent = message;
    clearTimeout(hideTimeout);
    toast.classList.add("toast--visible");
    hideTimeout = setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, duration);
  }

  // ── Pixelate IP ─────────────────────────────────
  function pixelateIP(ip) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.███.███.${parts[3]}`;
    }
    return ip.slice(0, 3) + "█".repeat(ip.length - 5) + ip.slice(-2);
  }

  // ── i18n ────────────────────────────────────────
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function applyLanguage(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.title = t.meta.title;

    const metaDesc = document.querySelector("[data-i18n-attr]");
    if (metaDesc) {
      metaDesc.setAttribute("content", t.meta.description);
    }

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      let value = getNestedValue(t, key);
      if (value) {
        value = value.replace("{year}", CURRENT_YEAR);
        el.textContent = value;
      }
    });

    const other = lang === "es" ? "EN" : "ES";
    langLabel.textContent = other;

    delete shuffleBags["vote"];
    delete shuffleBags["themeInsult"];
    delete shuffleBags["themeThreat"];
    delete shuffleBags["themeWarning"];
    delete shuffleBags["langInsult"];
  }

  // Apply default language on load
  applyLanguage(currentLang);

  // ── Vote button ─────────────────────────────────
  rickBtn.addEventListener("click", () => {
    const t = translations[currentLang];
    showToast(getFromBag("vote", t.voteQuotes));
  });

  // ── Fetch IP ────────────────────────────────────
  async function fetchIP() {
    if (userIP) return userIP;
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      userIP = data.ip;
    } catch {
      userIP = "192.168.X.X";
    }
    return userIP;
  }

  // ── Theme button (escalating) ───────────────────
  themeBtn.addEventListener("click", async () => {
    themeClicks++;
    const t = translations[currentLang];

    if (themeClicks <= 5) {
      // Phase 1: Sarcastic insults
      showToast(getFromBag("themeInsult", t.themeInsults));
    } else if (themeClicks <= 10) {
      // Phase 2: IP threats (varied)
      const ip = await fetchIP();
      const pixelated = pixelateIP(ip);
      const threat = getFromBag("themeThreat", t.themeThreats).replace("{ip}", pixelated);
      showToast(threat, 7000);
    } else if (themeClicks <= 15) {
      // Phase 3: Angry escalation warnings
      showToast(getFromBag("themeWarning", t.themeWarnings), 6000);
    } else {
      // Phase 4: Corruption / Omega Device
      const ip = await fetchIP();
      triggerCorruption(ip, t);
    }
  });

  // ── Corruption / Eradication sequence ───────────
  function triggerCorruption(ip, t) {
    rickBtn.disabled = true;
    langBtn.disabled = true;
    themeBtn.disabled = true;
    toast.classList.remove("toast--visible");

    // Switch favicon to broken
    setFavicon("./src/assets/icons/globe-broken.svg");
    document.title = t.corruptTitle;

    const overlay = document.createElement("div");
    overlay.className = "corruption-overlay";
    overlay.innerHTML = `
      <div class="corruption__glitch" aria-hidden="true"></div>
      <div class="corruption__content">
        <h1 class="corruption__title">${t.corruptTitle}</h1>
        <p class="corruption__warning">${t.corruptWarning}</p>
        <p class="corruption__ip">${t.corruptSubtitle.replace("{ip}", ip)}</p>
        <div class="corruption__countdown" id="corruption-countdown">10</div>
      </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add("corruption-overlay--active");
      });
    });

    let count = 10;
    const countdownEl = document.getElementById("corruption-countdown");
    const interval = setInterval(() => {
      count--;
      countdownEl.textContent = count;
      if (count <= 3) {
        countdownEl.classList.add("corruption__countdown--critical");
      }
      if (count <= 0) {
        clearInterval(interval);
        localStorage.setItem("rick-nuked", "true");
        nukePagePermanently();
      }
    }, 1000);
  }

  // ── Language toggle ─────────────────────────────
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    applyLanguage(currentLang);

    // Insult in the NEW language so they understand the sarcasm
    const t = translations[currentLang];
    showToast(getFromBag("langInsult", t.langInsults));
  });
}

// ── Permanent nuke (works on fresh load too) ────
function nukePagePermanently() {
  const lang = document.documentElement.lang || "es";
  const t = translations[lang] || translations.es;

  // Broken favicon + nuked title
  setFavicon("./src/assets/icons/globe-broken.svg");

  document.head.innerHTML = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t.nukedTitle}</title>
    <link rel="icon" type="image/svg+xml" href="./src/assets/icons/globe-broken.svg" />
    <link rel="stylesheet" href="./src/styles/styles.css" />
  `;

  document.body.innerHTML = "";
  document.body.className = "nuked";

  const container = document.createElement("div");
  container.className = "nuked__container";
  container.innerHTML = `
    <div class="nuked__static" aria-hidden="true"></div>
    <img src="./src/assets/icons/skull.svg" alt="" class="nuked__skull" draggable="false" />
    <h1 class="nuked__title" id="nuked-title">${t.nukedTitleEliminating}</h1>
    <p class="nuked__subtitle" id="nuked-subtitle">${t.nukedSubtitleEliminating}</p>
    <p class="nuked__text nuked__text--hidden" id="nuked-text">${t.nukedText}</p>
    <div class="nuked__stats">
      <div class="nuked__stat">
        <span class="nuked__stat-value" id="variant-counter">0</span>
        <span class="nuked__stat-label" id="counter-label">${t.nukedCounterEliminating}</span>
      </div>
      <div class="nuked__stat">
        <span class="nuked__stat-value nuked__stat-value--dim" id="last-dim">—</span>
        <span class="nuked__stat-label">${t.nukedDimLabel}</span>
      </div>
    </div>
    <div class="nuked__log" id="purge-log" aria-label="Dimension purge log"></div>
  `;
  document.body.appendChild(container);

  // ── Phase 1: Eliminating variants (1 per second) ──
  const titleEl = document.getElementById("nuked-title");
  const subtitleEl = document.getElementById("nuked-subtitle");
  const textEl = document.getElementById("nuked-text");
  const counterEl = document.getElementById("variant-counter");
  const counterLabelEl = document.getElementById("counter-label");
  const lastDimEl = document.getElementById("last-dim");
  const logEl = document.getElementById("purge-log");

  let variantCount = 0;
  const greekLetters = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
  const maxLogLines = 12;
  // Random target between 30-60 ticks before "executed"
  const targetTicks = 30 + Math.floor(Math.random() * 31);
  let tickCount = 0;

  function randomDimension() {
    const letter = greekLetters[Math.floor(Math.random() * greekLetters.length)];
    const num = Math.floor(Math.random() * 9000) + 100;
    const suffix = Math.random() > 0.3 ? "" : ["a", "b", "ω", "′", "⁻¹"][Math.floor(Math.random() * 5)];
    return `${letter}-${num}${suffix}`;
  }

  // Generate a massive incomprehensible final number
  function generateFinalCount() {
    // Something like 8.3291×10^∞ or a huge nonsensical number
    const bases = [
      () => `${(Math.random() * 9 + 1).toFixed(4)}×10^∞`,
      () => `∞^${Math.floor(Math.random() * 900) + 100}`,
      () => {
        const big = Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
        return `${big}...`;
      },
      () => `ℵ₀×${(Math.random() * 9 + 1).toFixed(2)}^${Math.floor(Math.random() * 999) + 1}`,
    ];
    return bases[Math.floor(Math.random() * bases.length)]();
  }

  function addPurgeLine() {
    const dim = randomDimension();
    const variants = Math.floor(Math.random() * 4) + 1;
    variantCount += variants;
    tickCount++;

    counterEl.textContent = variantCount.toLocaleString();
    lastDimEl.textContent = dim;

    const line = document.createElement("div");
    line.className = "nuked__log-line";
    line.textContent = `[${dim}] ██ ×${variants} — PURGED`;
    logEl.appendChild(line);

    if (logEl.children.length > maxLogLines) {
      logEl.firstChild.remove();
    }

    logEl.scrollTop = logEl.scrollHeight;

    // Phase 2: transition to EXECUTED
    if (tickCount >= targetTicks) {
      clearInterval(purgeInterval);
      transitionToExecuted();
    }
  }

  function transitionToExecuted() {
    // Glitch flash effect
    titleEl.classList.add("nuked__title--flash");

    setTimeout(() => {
      titleEl.textContent = t.nukedTitle;
      subtitleEl.textContent = t.nukedSubtitle;
      counterEl.textContent = generateFinalCount();
      counterEl.classList.add("nuked__stat-value--final");
      counterLabelEl.textContent = t.nukedCounter;
      lastDimEl.textContent = "ALL / ∞";
      textEl.classList.remove("nuked__text--hidden");

      // Final log line
      const finalLine = document.createElement("div");
      finalLine.className = "nuked__log-line nuked__log-line--final";
      finalLine.textContent = `[CFC-∞] ████████ — ALL VARIANTS PURGED — OMEGA COMPLETE`;
      logEl.appendChild(finalLine);
      logEl.scrollTop = logEl.scrollHeight;
    }, 600);
  }

  const purgeInterval = setInterval(addPurgeLine, 1000);

  // Block absolutely everything
  const block = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  };

  const events = [
    "keydown", "keyup", "keypress",
    "click", "dblclick", "mousedown", "mouseup",
    "contextmenu", "copy", "cut", "paste",
    "selectstart", "dragstart", "drop",
    "touchstart", "touchend",
  ];

  events.forEach((evt) => {
    document.addEventListener(evt, block, true);
    window.addEventListener(evt, block, true);
  });
}


