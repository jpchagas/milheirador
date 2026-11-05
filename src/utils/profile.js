import { DEFAULT_DOLLAR_RATE, DEFAULT_MONTHLY_SPEND } from "@/utils/rankMyCard";
import { parseNumber } from "@/utils/format";
import { emptyManualCard, manualCardFromForm, validateManualCard } from "@/utils/manualCard";

// Every view is a real page load (AdSense vignettes only show on link navigation), so the
// form travels in the query string: /resultado?gasto=5000&dolar=5,50&banco=itau&cartao=…
export const HOME_PATH = "/";
export const RESULT_PATH = "/resultado";
export const RANKING_PATH = "/ranking";
export const PURCHASE_PATH = "/onde-comprar";

// `dollarRateAuto` is true until the user sets a rate (typed in, or `dolar` in the URL); while
// it is, the rate follows today's PTAX (withDollarRate) and stays out of the URL.
export const defaultProfile = {
  monthlySpend: String(DEFAULT_MONTHLY_SPEND),
  dollarRate: DEFAULT_DOLLAR_RATE.toFixed(2).replace(".", ","),
  dollarRateAuto: true,
  manual: false,
  issuer: "",
  cardId: "",
  // The annuity the user pays for the card picked from the list; "" is the full annuity.
  annuity: "",
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
  const params = new URLSearchParams({ gasto: profile.monthlySpend });
  if (!profile.dollarRateAuto) params.set("dolar", profile.dollarRate);
  if (profile.manual) {
    params.set("manual", "1");
    for (const [key, name] of Object.entries(MANUAL_PARAMS)) params.set(name, profile.manualCard[key]);
  } else {
    if (profile.issuer) params.set("banco", profile.issuer);
    if (profile.cardId) params.set("cartao", profile.cardId);
    // Same name as the manual card's annuity; only one of them is ever in the URL.
    if (profile.annuity) params.set("anuidade", profile.annuity);
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
    dollarRateAuto: !params.has("dolar"),
    manual,
    issuer: manual ? "" : get("banco", ""),
    cardId: manual ? "" : get("cartao", ""),
    annuity: manual ? "" : get("anuidade", ""),
    manualCard: manual
      ? Object.fromEntries(Object.entries(MANUAL_PARAMS).map(([key, name]) => [key, get(name, emptyManualCard[key])]))
      : emptyManualCard,
  };
};

// `ptax` is `{ rate }` from utils/dollarRate.js, or null; it only replaces an automatic rate.
export const withDollarRate = (profile, ptax) =>
  profile.dollarRateAuto && ptax ? { ...profile, dollarRate: dollarRateText(ptax.rate) } : profile;

// The PTAX has four decimals, written the pt-BR way: 5.4778 -> "5,4778".
export const dollarRateText = rate => rate.toFixed(4).replace(".", ",");

export const settingsFromProfile = profile => ({
  monthlySpend: parseNumber(profile.monthlySpend) || 0,
  dollarRate: parseNumber(profile.dollarRate) || DEFAULT_DOLLAR_RATE,
});

// The annuity typed for a card from the list: null when blank (the full annuity), NaN when invalid.
export const annuityOverride = profile => {
  if (!profile.annuity.trim()) return null;
  const annuity = parseNumber(profile.annuity);
  return annuity >= 0 ? annuity : NaN;
};

// The card the profile describes, with the annuity the user pays, or null while the form is
// incomplete or invalid.
export const cardFromProfile = (profile, cards) => {
  if (!(parseNumber(profile.monthlySpend) > 0) || !(parseNumber(profile.dollarRate) > 0)) return null;
  if (profile.manual) {
    const valid = Object.keys(validateManualCard(profile.manualCard)).length === 0;
    return valid ? manualCardFromForm(profile.manualCard) : null;
  }
  const card = cards.find(c => c.id === profile.cardId);
  const annuity = annuityOverride(profile);
  if (!card || Number.isNaN(annuity)) return null;
  return annuity === null ? card : { ...card, annuity };
};
