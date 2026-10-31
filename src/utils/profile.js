import { DEFAULT_DOLLAR_RATE, DEFAULT_MONTHLY_SPEND } from "@/utils/rankMyCard";
import { parseNumber } from "@/utils/format";
import { emptyManualCard, manualCardFromForm, validateManualCard } from "@/utils/manualCard";

// Every view is a real page load (AdSense vignettes only show on link navigation), so the
// form travels in the query string: /resultado?gasto=5000&dolar=5,50&banco=itau&cartao=…
export const HOME_PATH = "/";
export const RESULT_PATH = "/resultado";
export const RANKING_PATH = "/ranking";

export const defaultProfile = {
  monthlySpend: String(DEFAULT_MONTHLY_SPEND),
  dollarRate: DEFAULT_DOLLAR_RATE.toFixed(2).replace(".", ","),
  manual: false,
  issuer: "",
  cardId: "",
  manualCard: emptyManualCard,
};

// Query parameter for each manual card field.
const MANUAL_PARAMS = {
  issuer: "banco",
  type: "nome",
  brand: "bandeira",
  currency: "moeda",
  accumulationFactor: "pontos",
  conversionRatio: "conversao",
  annuity: "anuidade",
};

export const profileHref = (path, profile) => {
  const params = new URLSearchParams({ gasto: profile.monthlySpend, dolar: profile.dollarRate });
  if (profile.manual) {
    params.set("manual", "1");
    for (const [key, name] of Object.entries(MANUAL_PARAMS)) params.set(name, profile.manualCard[key]);
  } else {
    if (profile.issuer) params.set("banco", profile.issuer);
    if (profile.cardId) params.set("cartao", profile.cardId);
  }
  return `${path}?${params}`;
};

export const profileFromSearch = search => {
  const params = new URLSearchParams(search);
  const get = (name, fallback) => params.get(name) ?? fallback;
  const manual = params.get("manual") === "1";
  return {
    monthlySpend: get("gasto", defaultProfile.monthlySpend),
    dollarRate: get("dolar", defaultProfile.dollarRate),
    manual,
    issuer: manual ? "" : get("banco", ""),
    cardId: manual ? "" : get("cartao", ""),
    manualCard: manual
      ? Object.fromEntries(Object.entries(MANUAL_PARAMS).map(([key, name]) => [key, get(name, emptyManualCard[key])]))
      : emptyManualCard,
  };
};

export const settingsFromProfile = profile => ({
  monthlySpend: parseNumber(profile.monthlySpend) || 0,
  dollarRate: parseNumber(profile.dollarRate) || DEFAULT_DOLLAR_RATE,
});

// The card the profile describes, or null while the form is incomplete or invalid.
export const cardFromProfile = (profile, cards) => {
  if (!(parseNumber(profile.monthlySpend) > 0) || !(parseNumber(profile.dollarRate) > 0)) return null;
  if (profile.manual) {
    const valid = Object.keys(validateManualCard(profile.manualCard)).length === 0;
    return valid ? manualCardFromForm(profile.manualCard) : null;
  }
  return cards.find(c => c.id === profile.cardId) ?? null;
};
