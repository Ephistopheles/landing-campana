import { useRef, useCallback, useEffect } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { currentLang, t, getFooterText } from "../../stores/lang";
import { useGameApi } from "../../hooks/useGameApi";
import type { Translations } from "../../i18n/types";
import Toast from "./Toast";
import CorruptionOverlay from "./CorruptionOverlay";
import NukedScreen from "./NukedScreen";

import languageIcon from "../../assets/icons/language.svg";
import sunIcon from "../../assets/icons/sun.svg";
import ballotBoxIcon from "../../assets/icons/ballot-box.svg";
import rickAvatar from "../../assets/avatars/rick-avatar.png";
import testTubeIcon from "../../assets/icons/test-tube.svg";
import shieldIcon from "../../assets/icons/shield.svg";
import beerMugIcon from "../../assets/icons/beer-mug.svg";
import dnaIcon from "../../assets/icons/dna.svg";

const proposalIcons = [testTubeIcon, shieldIcon, beerMugIcon, dnaIcon];

function getMessageByKey(tr: Translations, key: string, index: number): string {
  const collection = tr[key as keyof Translations];
  if (Array.isArray(collection)) {
    return (collection as string[])[index] ?? "";
  }
  return "";
}

export default function LandingIsland() {
  const toastMessage = useSignal("");
  const toastVisible = useSignal(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showCorruption = useSignal(false);
  const corruptionIP = useSignal("");
  const isNuked = useSignal(false);
  const sessionLoaded = useSignal(false);

  const api = useGameApi();

  const trans = useComputed(() => t());
  const footer = useComputed(() => getFooterText());

  // Check session state on mount
  useEffect(() => {
    api.getSession().then((session) => {
      isNuked.value = session.isNuked;
      sessionLoaded.value = true;
    }).catch(() => {
      // Fallback to localStorage if backend is unreachable
      isNuked.value =
        typeof localStorage !== "undefined" &&
        localStorage.getItem("rick-nuked") === "true";
      sessionLoaded.value = true;
    });
  }, []);

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

  const handleVote = useCallback(async () => {
    try {
      const { key, index } = await api.vote();
      const tr = t();
      const message = getMessageByKey(tr, key, index);
      showToast(message);
    } catch {
      // Silent fallback
    }
  }, [api, showToast]);

  const handleTheme = useCallback(async () => {
    try {
      const result = await api.themeClick();
      const tr = t();

      switch (result.phase) {
        case "insult": {
          const message = getMessageByKey(tr, result.key!, result.index!);
          showToast(message);
          break;
        }
        case "threat": {
          const message = getMessageByKey(tr, result.key!, result.index!).replace(
            "{ip}",
            result.pixelatedIp ?? ""
          );
          showToast(message, 7000);
          break;
        }
        case "warning": {
          const message = getMessageByKey(tr, result.key!, result.index!);
          showToast(message, 6000);
          break;
        }
        case "corrupt": {
          toastVisible.value = false;
          corruptionIP.value = result.ip ?? "";
          showCorruption.value = true;

          const link = document.querySelector(
            "link[rel='icon']"
          ) as HTMLLinkElement | null;
          if (link) link.href = "/icons/globe-broken.svg";
          document.title = tr.corruptTitle;
          break;
        }
      }
    } catch {
      // Silent fallback
    }
  }, [api, showToast, toastVisible, corruptionIP, showCorruption]);

  const handleLang = useCallback(async () => {
    currentLang.value = currentLang.value === "es" ? "en" : "es";
    document.documentElement.lang = currentLang.value;

    const tr = t();
    document.title = tr.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", tr.meta.description);

    try {
      const { key, index } = await api.langSwitch();
      const message = getMessageByKey(tr, key, index);
      showToast(message);
    } catch {
      // Silent fallback
    }
  }, [api, showToast]);

  const handleCorruptionComplete = useCallback(async () => {
    try {
      await api.nuke();
    } catch {
      // Persist locally as fallback
      localStorage.setItem("rick-nuked", "true");
    }
    showCorruption.value = false;
    isNuked.value = true;
  }, [api, showCorruption, isNuked]);

  const langLabel = useComputed(() =>
    currentLang.value === "es" ? "EN" : "ES"
  );

  if (!sessionLoaded.value) {
    return null;
  }

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
