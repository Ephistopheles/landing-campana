export interface ProposalItem {
  icon: string;
  title: string;
  text: string;
}

export interface Translations {
  lang: string;
  meta: {
    description: string;
    title: string;
  };
  hero: {
    subtitle: string;
    slogan: string;
  };
  about: {
    title: string;
    text: string;
  };
  proposals: {
    title: string;
    items: ProposalItem[];
  };
  cta: string;
  footer: string;
  voteQuotes: string[];
  themeInsults: string[];
  themeThreats: string[];
  themeWarnings: string[];
  corruptTitle: string;
  corruptSubtitle: string;
  corruptWarning: string;
  nukedTitleEliminating: string;
  nukedSubtitleEliminating: string;
  nukedCounterEliminating: string;
  nukedTitle: string;
  nukedSubtitle: string;
  nukedText: string;
  nukedCounter: string;
  nukedDimLabel: string;
  langInsults: string[];
}

export type Lang = "es" | "en";
