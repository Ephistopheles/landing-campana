import { signal } from "@preact/signals";
import type { Lang, Translations } from "../i18n/types";
import { translations, getCurrentYear } from "../i18n";

export const currentLang = signal<Lang>("es");

export function t(): Translations {
  return translations[currentLang.value];
}

export function getFooterText(): string {
  return t().footer.replace("{year}", String(getCurrentYear()));
}
