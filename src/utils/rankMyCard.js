export const DEFAULT_DOLLAR_RATE = 5.5;
export const DEFAULT_MONTHLY_SPEND = 5000;

// Points earned per R$ spent. Cards with currency "dolar" earn points per US$,
// so the R$ spent is converted at the dollar rate charged by the bank first.
export function pointsPerReal(card, dollarRate) {
  return card.currency === "dolar"
    ? card.accumulationFactor / dollarRate
    : card.accumulationFactor;
}

// Indicator 1: miles earned per R$ spent. Leaves the annuity out.
export function milesPerReal(card, dollarRate) {
  return pointsPerReal(card, dollarRate) * card.conversionRatio;
}

// A card with no valid earning (no points, or a bad rate) has no indicators.
export const hasValidScore = card => Number.isFinite(card.milesPerReal) && card.milesPerReal > 0;

// Adds the per-profile values to a card: `milesPerReal`, `annualMiles` and indicator 3, the
// Índice Milheirador: everything paid in a year (spend + annuity) per mile earned. It is not
// the market price of a mile, since the spend also buys goods and services. `annuity` is the
// annuity the user actually pays (0 with an exemption).
export function evaluateCard(card, { monthlySpend, dollarRate }) {
  const cardMilesPerReal = milesPerReal(card, dollarRate);
  const annualMiles = monthlySpend * 12 * cardMilesPerReal;
  const milheiradorIndex =
    annualMiles > 0 ? (monthlySpend * 12 + card.annuity) / annualMiles : Infinity;
  return { ...card, milesPerReal: cardMilesPerReal, annualMiles, milheiradorIndex };
}

// The free card (annuity 0) with the most annual miles among evaluated `cards`, or undefined.
export const freeReferenceCard = cards =>
  cards
    .filter(c => c.annuity === 0 && hasValidScore(c))
    .reduce((best, c) => (!best || c.annualMiles > best.annualMiles ? c : best), undefined);

// Indicator 2: additional annual miles per R$ of annuity, against the free reference card.
// null for free cards (not applicable) and when there is no reference or no valid score.
const additionalMilesPerFeeReal = (card, reference) =>
  card.annuity === 0 || !reference || !hasValidScore(card)
    ? null
    : (card.annualMiles - reference.annualMiles) / (card.annuity - reference.annuity);

// Ways to order the ranking. Cards without a value go last; ties fall back to the index.
const byIndex = (a, b) =>
  a.milheiradorIndex === b.milheiradorIndex ? 0 : a.milheiradorIndex < b.milheiradorIndex ? -1 : 1;
const descending = key => (a, b) =>
  a[key] === b[key] ? byIndex(a, b) : a[key] === null ? 1 : b[key] === null ? -1 : b[key] - a[key];

export const RANKING_CRITERIA = {
  index: { label: "Menor Índice Milheirador", compare: byIndex },
  milesPerReal: { label: "Mais milhas por real gasto", compare: descending("milesPerReal") },
  feeEfficiency: {
    label: "Mais milhas extras por real de anuidade",
    compare: descending("additionalMilesPerFeeReal"),
  },
};
export const DEFAULT_CRITERION = "index";

export const sortCards = (cards, criterion = DEFAULT_CRITERION) =>
  [...cards].sort(RANKING_CRITERIA[criterion].compare);

// Evaluates the cards for one profile and sorts them (lowest Índice Milheirador first by
// default). Every card is compared with the same free reference card (freeReferenceCard).
export function rankCards(cards, settings, criterion = DEFAULT_CRITERION) {
  const evaluated = cards.map(card => evaluateCard(card, settings));
  const reference = freeReferenceCard(evaluated);
  return sortCards(
    evaluated.map(card => ({ ...card, additionalMilesPerFeeReal: additionalMilesPerFeeReal(card, reference) })),
    criterion
  );
}
