import es from "../i18n/es.js";
import en from "../i18n/en.js";

(() => {
  const translations = { es, en };
  let currentLang = "es";
  let themeClicks = 0;
  let userIP = null;

  const toast = document.getElementById("toast");
  const rickBtn = document.getElementById("rick-btn");
  const themeBtn = document.getElementById("theme-btn");
  const langBtn = document.getElementById("lang-btn");

  let hideTimeout = null;

  // ── Toast helper ────────────────────────────────
  function showToast(message, duration = 5000) {
    toast.textContent = message;
    clearTimeout(hideTimeout);
    toast.classList.add("toast--visible");
    hideTimeout = setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, duration);
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ── i18n ────────────────────────────────────────
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function applyLanguage(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.title = t.meta.title;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedValue(t, key);
      if (value) el.textContent = value;
    });

    // Update lang button label to show the OTHER language
    const other = lang === "es" ? "EN" : "ES";
    langBtn.textContent = `🌐 ${other}`;
  }

  // ── Vote button ─────────────────────────────────
  rickBtn.addEventListener("click", () => {
    const t = translations[currentLang];
    showToast(randomFrom(t.voteQuotes));
  });

  // ── Theme button (blocker) ──────────────────────
  async function fetchIP() {
    if (userIP) return userIP;
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      userIP = data.ip;
    } catch {
      userIP = "[CLASSIFIED]";
    }
    return userIP;
  }

  themeBtn.addEventListener("click", async () => {
    themeClicks++;
    const t = translations[currentLang];

    if (themeClicks <= 5) {
      showToast(randomFrom(t.themeInsults));
    } else {
      const ip = await fetchIP();
      const threat = t.themeThreat.replace("{ip}", ip);
      showToast(threat, 7000);
    }
  });

  // ── Language toggle ─────────────────────────────
  langBtn.addEventListener("click", () => {
    const oldLang = currentLang;
    currentLang = currentLang === "es" ? "en" : "es";
    applyLanguage(currentLang);

    // Insult in the NEW language about not knowing the OLD one
    const t = translations[currentLang];
    showToast(randomFrom(t.langInsults));
  });
})();

