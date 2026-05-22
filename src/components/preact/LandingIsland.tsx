import { useRef, useCallback } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { currentLang, t, getFooterText } from "../../stores/lang";
import { useShuffleBag } from "../../hooks/useShuffleBag";
import Toast from "./Toast";
import CorruptionOverlay from "./CorruptionOverlay";
import NukedScreen from "./NukedScreen";

// Icon imports as URLs for public assets
import languageIcon from "../../assets/icons/language.svg";
import sunIcon from "../../assets/icons/sun.svg";
import ballotBoxIcon from "../../assets/icons/ballot-box.svg";
import rickAvatar from "../../assets/avatars/rick-avatar.png";
import testTubeIcon from "../../assets/icons/test-tube.svg";
import shieldIcon from "../../assets/icons/shield.svg";
import beerMugIcon from "../../assets/icons/beer-mug.svg";
import dnaIcon from "../../assets/icons/dna.svg";

const proposalIcons = [testTubeIcon, shieldIcon, beerMugIcon, dnaIcon];

function pixelateIP(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.███.███.${parts[3]}`;
  }
  return ip.slice(0, 3) + "█".repeat(ip.length - 5) + ip.slice(-2);
}

export default function LandingIsland() {
  const toastMessage = useSignal("");
  const toastVisible = useSignal(false);
  const themeClicks = useRef(0);
  const userIP = useRef<string | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showCorruption = useSignal(false);
  const corruptionIP = useSignal("");
  const isNuked = useSignal(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("rick-nuked") === "true"
  );

  const { getFromBag, resetBag } = useShuffleBag();

  const trans = useComputed(() => t());
  const footer = useComputed(() => getFooterText());

  const showToast = useCallback(
    (message: string, duration = 5000) => {
      toastMessage.value = message;
      toastVisible.value = true;
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => {
        toastVisible.value = false;
      }, duration);
    },
    [toastMessage, toastVisible]
  );

  const fetchIP = useCallback(async (): Promise<string> => {
    if (userIP.current) return userIP.current;
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      userIP.current = data.ip;
    } catch {
      userIP.current = "192.168.X.X";
    }
    return userIP.current!;
  }, []);

  const handleVote = useCallback(() => {
    const tr = t();
    showToast(getFromBag("vote", tr.voteQuotes));
  }, [getFromBag, showToast]);

  const handleTheme = useCallback(async () => {
    themeClicks.current++;
    const clicks = themeClicks.current;
    const tr = t();

    if (clicks <= 5) {
      showToast(getFromBag("themeInsult", tr.themeInsults));
    } else if (clicks <= 10) {
      const ip = await fetchIP();
      const pixelated = pixelateIP(ip);
      const threat = getFromBag("themeThreat", tr.themeThreats).replace(
        "{ip}",
        pixelated
      );
      showToast(threat, 7000);
    } else if (clicks <= 15) {
      showToast(getFromBag("themeWarning", tr.themeWarnings), 6000);
    } else {
      const ip = await fetchIP();
      toastVisible.value = false;
      corruptionIP.value = ip;
      showCorruption.value = true;

      // Update favicon
      const link = document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement | null;
      if (link) link.href = "/icons/globe-broken.svg";
      document.title = tr.corruptTitle;
    }
  }, [fetchIP, getFromBag, showToast, toastVisible, corruptionIP, showCorruption]);

  const handleLang = useCallback(() => {
    currentLang.value = currentLang.value === "es" ? "en" : "es";
    document.documentElement.lang = currentLang.value;

    // Reset shuffle bags for new language
    resetBag("vote");
    resetBag("themeInsult");
    resetBag("themeThreat");
    resetBag("themeWarning");
    resetBag("langInsult");

    const tr = t();
    document.title = tr.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", tr.meta.description);

    showToast(getFromBag("langInsult", tr.langInsults));
  }, [getFromBag, resetBag, showToast]);

  const handleCorruptionComplete = useCallback(() => {
    localStorage.setItem("rick-nuked", "true");
    showCorruption.value = false;
    isNuked.value = true;
  }, [showCorruption, isNuked]);

  const langLabel = useComputed(() =>
    currentLang.value === "es" ? "EN" : "ES"
  );

  if (isNuked.value) {
    return <NukedScreen />;
  }

  return (
    <>
      {/* Nav buttons */}
      <nav class="topnav" aria-label="Settings">
        <button
          class="topnav__btn"
          type="button"
          title="Change language"
          onClick={handleLang}
        >
          <img
            src={languageIcon.src}
            alt=""
            class="topnav__icon"
            draggable={false}
          />
          <span>{langLabel}</span>
        </button>
        <button
          class="topnav__btn"
          type="button"
          title="Change theme"
          onClick={handleTheme}
        >
          <img
            src={sunIcon.src}
            alt=""
            class="topnav__icon"
            draggable={false}
          />
        </button>
      </nav>

      {/* Hero */}
      <header class="hero">
        <div class="hero__particles" aria-hidden="true" />
        <div class="hero__content">
          <div class="hero__avatar">
            <img
              src={rickAvatar.src}
              draggable={false}
              alt="Rick Sanchez avatar"
              class="hero__img"
            />
          </div>
          <h1 class="hero__name">Rick Sanchez</h1>
          <p class="hero__subtitle">{trans.value.hero.subtitle}</p>
          <p class="hero__slogan">{trans.value.hero.slogan}</p>
        </div>
      </header>

      {/* About */}
      <section class="about" id="about">
        <h2 class="section__title">{trans.value.about.title}</h2>
        <p class="about__text">{trans.value.about.text}</p>
      </section>

      {/* Proposals */}
      <section class="proposals" id="proposals">
        <h2 class="section__title">{trans.value.proposals.title}</h2>
        <div class="proposals__grid">
          {trans.value.proposals.items.map((item, i) => (
            <article class="proposal-card" key={i}>
              <img
                src={proposalIcons[i].src}
                alt=""
                class="proposal-card__icon"
                draggable={false}
              />
              <h3 class="proposal-card__title">{item.title}</h3>
              <p class="proposal-card__text">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section class="cta" id="cta">
        <button class="cta__button" type="button" onClick={handleVote}>
          <img
            src={ballotBoxIcon.src}
            alt=""
            class="cta__icon"
            draggable={false}
          />
          <span>{trans.value.cta}</span>
        </button>
      </section>

      {/* Toast */}
      <Toast message={toastMessage.value} visible={toastVisible.value} />

      {/* Footer */}
      <footer class="footer">
        <p>{footer}</p>
      </footer>

      {/* Corruption overlay */}
      {showCorruption.value && (
        <CorruptionOverlay
          ip={corruptionIP.value}
          onComplete={handleCorruptionComplete}
        />
      )}
    </>
  );
}
