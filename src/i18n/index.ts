import es from "./es";
import en from "./en";
import type { Translations, Lang } from "./types";

export type { Translations, Lang };

export const translations: Record<Lang, Translations> = { es, en };

export function getCurrentYear(): number {
  return new Date().getFullYear();
}
