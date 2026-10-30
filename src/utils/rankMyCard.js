export const DEFAULT_DOLLAR_RATE = 5.5;
export const DEFAULT_MONTHLY_SPEND = 5000;

// Miles earned per R$ spent. Cards with currency "dolar" earn points per US$,
// so the R$ spent is converted at the dollar rate charged by the bank first.
export function milesPerReal(card, dollarRate) {
  const pointsPerReal =
    card.currency === "dolar"
      ? card.accumulationFactor / dollarRate
      : card.accumulationFactor;
  return pointsPerReal * card.conversionRatio;
}

// Cost per mile from the README: (annual spend + annuity) ÷ miles earned in a year.
export function evaluateCard(card, { monthlySpend, dollarRate }) {
  const annualSpend = monthlySpend * 12;
  const annualMiles = annualSpend * milesPerReal(card, dollarRate);
  const costPerMile =
    annualMiles > 0 ? (annualSpend + card.annuity) / annualMiles : Infinity;
  return { ...card, annualMiles, costPerMile };
}

// Cheapest miles first.
export function rankCards(cards, settings) {
  return cards
    .map(card => evaluateCard(card, settings))
    .sort((a, b) => a.costPerMile - b.costPerMile);
}
