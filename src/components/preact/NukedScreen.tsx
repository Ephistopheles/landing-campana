import { useEffect, useRef } from "preact/hooks";
import { useComputed } from "@preact/signals";
import { t } from "../../stores/lang";
import skullIcon from "../../assets/icons/skull.svg";

const GREEK_LETTERS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const MAX_LOG_LINES = 12;

function randomDimension(): string {
  const letter = GREEK_LETTERS[Math.floor(Math.random() * GREEK_LETTERS.length)];
  const num = Math.floor(Math.random() * 9000) + 100;
  const suffixes = ["a", "b", "ω", "′", "⁻¹"];
  const suffix =
    Math.random() > 0.3
      ? ""
      : suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${letter}-${num}${suffix}`;
}

function generateFinalCount(): string {
  const bases = [
    () => `${(Math.random() * 9 + 1).toFixed(4)}×10^∞`,
    () => `∞^${Math.floor(Math.random() * 900) + 100}`,
    () => {
      const big = Array.from({ length: 18 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
      return `${big}...`;
    },
    () =>
      `ℵ₀×${(Math.random() * 9 + 1).toFixed(2)}^${Math.floor(Math.random() * 999) + 1}`,
  ];
  return bases[Math.floor(Math.random() * bases.length)]();
}

export default function NukedScreen() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterLabelRef = useRef<HTMLSpanElement>(null);
  const lastDimRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const trans = useComputed(() => t());

  useEffect(() => {
    // Set nuked body class and favicon
    document.body.className = "nuked";
    const link = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null;
    if (link) link.href = "/icons/globe-broken.svg";
    document.title = trans.value.nukedTitle;

    // Block all interaction
    const block = (e: Event) => {
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

    // Purge animation
    let variantCount = 0;
    let tickCount = 0;
    const targetTicks = 30 + Math.floor(Math.random() * 31);

    const purgeInterval = setInterval(() => {
      const dim = randomDimension();
      const variants = Math.floor(Math.random() * 4) + 1;
      variantCount += variants;
      tickCount++;

      if (counterRef.current)
        counterRef.current.textContent = variantCount.toLocaleString();
      if (lastDimRef.current) lastDimRef.current.textContent = dim;

      if (logRef.current) {
        const line = document.createElement("div");
        line.className = "nuked__log-line";
        line.textContent = `[${dim}] ██ ×${variants} — PURGED`;
        logRef.current.appendChild(line);

        if (logRef.current.children.length > MAX_LOG_LINES) {
          logRef.current.firstChild?.remove();
        }
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }

      if (tickCount >= targetTicks) {
        clearInterval(purgeInterval);
        transitionToExecuted();
      }
    }, 1000);

    function transitionToExecuted() {
      titleRef.current?.classList.add("nuked__title--flash");

      setTimeout(() => {
        const tr = trans.value;
        if (titleRef.current) titleRef.current.textContent = tr.nukedTitle;
        if (subtitleRef.current)
          subtitleRef.current.textContent = tr.nukedSubtitle;
        if (counterRef.current) {
          counterRef.current.textContent = generateFinalCount();
          counterRef.current.classList.add("nuked__stat-value--final");
        }
        if (counterLabelRef.current)
          counterLabelRef.current.textContent = tr.nukedCounter;
        if (lastDimRef.current) lastDimRef.current.textContent = "ALL / ∞";
        if (textRef.current)
          textRef.current.classList.remove("nuked__text--hidden");

        if (logRef.current) {
          const finalLine = document.createElement("div");
          finalLine.className = "nuked__log-line nuked__log-line--final";
          finalLine.textContent = `[CFC-∞] ████████ — ALL VARIANTS PURGED — OMEGA COMPLETE`;
          logRef.current.appendChild(finalLine);
          logRef.current.scrollTop = logRef.current.scrollHeight;
        }
      }, 600);
    }

    return () => {
      clearInterval(purgeInterval);
      events.forEach((evt) => {
        document.removeEventListener(evt, block, true);
        window.removeEventListener(evt, block, true);
      });
      document.body.className = "";
    };
  }, [trans]);

  const tr = trans.value;

  return (
    <div class="nuked__container">
      <div class="nuked__static" aria-hidden="true" />
      <img
        src={skullIcon.src}
        alt=""
        class="nuked__skull"
        draggable={false}
      />
      <h1 class="nuked__title" ref={titleRef}>
        {tr.nukedTitleEliminating}
      </h1>
      <p class="nuked__subtitle" ref={subtitleRef}>
        {tr.nukedSubtitleEliminating}
      </p>
      <p class="nuked__text nuked__text--hidden" ref={textRef}>
        {tr.nukedText}
      </p>
      <div class="nuked__stats">
        <div class="nuked__stat">
          <span class="nuked__stat-value" ref={counterRef}>
            0
          </span>
          <span class="nuked__stat-label" ref={counterLabelRef}>
            {tr.nukedCounterEliminating}
          </span>
        </div>
        <div class="nuked__stat">
          <span class="nuked__stat-value nuked__stat-value--dim" ref={lastDimRef}>
            —
          </span>
          <span class="nuked__stat-label">{tr.nukedDimLabel}</span>
        </div>
      </div>
      <div
        class="nuked__log"
        ref={logRef}
        aria-label="Dimension purge log"
      />
    </div>
  );
}
