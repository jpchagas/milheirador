import { pointsPerReal } from "@/utils/rankMyCard";

// Store comparison for /onde-comprar: where to buy one product, counting the miles each
// purchase earns. It assumes the user already has the card, so the annuity is left out.

// The user's value of MILES_UNIT miles in R$ ("milheiro"), and the range suggested in the form.
// An estimate, not a price to buy, sell or redeem miles.
export const MILES_UNIT = 1000;
export const DEFAULT_REFERENCE_MILE_PRICE = 35;
export const SUGGESTED_MILE_PRICE = { min: 20, max: 50 };

// Money and miles closer than this are the same (a cent, a hundredth of a mile), so values
// that print equal also compare equal.
const TOLERANCE = 0.005;
const same = (a, b) => Math.abs(a - b) < TOLERANCE;

const milesValue = (miles, referenceMilePrice) => (miles / MILES_UNIT) * referenceMilePrice;

// A store is `{ id, name, productPrice, shippingCost, discount, partnerPointsPerReal,
// partnerConversionFactor, eligiblePartnerAmount, cardEligibleAmount, partnerPointsMode }`.
// A null eligible amount means the final price, so it moves with the price (see maxWorthPrice).
// `partnerPointsMode` is always "additional" for now: the campaign's points add to the card's.
// Campaigns whose advertised rate already includes a base rate would need another mode.
export function evaluateStore(store, { card, dollarRate, referenceMilePrice }) {
  const totalPrice = store.productPrice + store.shippingCost - store.discount;
  const cardEligibleAmount = store.cardEligibleAmount ?? totalPrice;
  const partnerEligibleAmount = store.eligiblePartnerAmount ?? totalPrice;

  // Card and partner points can belong to different programs, so each converts to miles
  // with its own factor before they are added.
  const cardMilesPerReal = pointsPerReal(card, dollarRate) * card.conversionRatio;
  const partnerMilesPerReal = store.partnerPointsPerReal * store.partnerConversionFactor;
  const cardPoints = cardEligibleAmount * pointsPerReal(card, dollarRate);
  const cardMiles = cardPoints * card.conversionRatio;
  const partnerPoints = partnerEligibleAmount * store.partnerPointsPerReal;
  const partnerMiles = partnerPoints * store.partnerConversionFactor;
  const totalMiles = cardMiles + partnerMiles;

  // Miles per R$ of final price from the amounts that follow the price.
  const proportionalMilesPerReal =
    (store.cardEligibleAmount === null ? cardMilesPerReal : 0) +
    (store.eligiblePartnerAmount === null ? partnerMilesPerReal : 0);

  const estimatedMilesValue = milesValue(totalMiles, referenceMilePrice);
  return {
    ...store,
    totalPrice,
    cardEligibleAmount,
    partnerEligibleAmount,
    cardPoints,
    cardMiles,
    partnerPoints,
    partnerMiles,
    totalMiles,
    proportionalMilesPerReal,
    estimatedMilesValue,
    estimatedNetCost: totalPrice - estimatedMilesValue,
  };
}

// The highest final price at which `store` still matches the reference's net cost. The miles
// from amounts that follow the price grow with it, so this solves
//   p − (fixedMiles + p × proportionalMilesPerReal) ÷ 1.000 × milheiro = reference net cost.
// Infinity when each R$ more earns miles worth at least R$ 1.
const maxWorthPrice = (store, reference, referenceMilePrice) => {
  const fixedMiles = store.totalMiles - store.proportionalMilesPerReal * store.totalPrice;
  const valuePerReal = milesValue(store.proportionalMilesPerReal, referenceMilePrice);
  if (valuePerReal >= 1) return Infinity;
  return (reference.estimatedNetCost + milesValue(fixedMiles, referenceMilePrice)) / (1 - valuePerReal);
};

// How `store` compares with the reference (the lowest price). `kind` is:
// "reference" (the reference itself), "tie" (same price and miles), "noAdvantage" (costs
// more, or the same, without more miles), "freeMiles" (more miles at the same price) or
// "extraMiles" (more miles for more money, with the cost of the additional milheiro).
const compareWithReference = (store, reference, referenceMilePrice) => {
  if (store === reference) return { kind: "reference" };
  const additionalCost = store.totalPrice - reference.totalPrice;
  const additionalMiles = store.totalMiles - reference.totalMiles;
  const additionalMilesValue = milesValue(additionalMiles, referenceMilePrice);
  const comparison = {
    additionalCost,
    additionalMiles,
    additionalMilesValue,
    netSwitchBenefit: additionalMilesValue - additionalCost,
  };
  if (same(additionalCost, 0) && same(additionalMiles, 0)) return { ...comparison, kind: "tie" };
  if (additionalMiles <= 0 || same(additionalMiles, 0)) return { ...comparison, kind: "noAdvantage" };
  if (same(additionalCost, 0)) return { ...comparison, kind: "freeMiles" };
  return {
    ...comparison,
    kind: "extraMiles",
    additionalThousandMilesCost: (additionalCost / additionalMiles) * MILES_UNIT,
    // What the additional miles are worth: the most worth paying for them at this price.
    maximumExtraPayment: additionalMilesValue,
    maxWorthPrice: maxWorthPrice(store, reference, referenceMilePrice),
  };
};

// Lowest net cost first; then the lower price; then more miles.
const byRecommendation = (a, b) => {
  if (!same(a.estimatedNetCost, b.estimatedNetCost)) return a.estimatedNetCost - b.estimatedNetCost;
  if (!same(a.totalPrice, b.totalPrice)) return a.totalPrice - b.totalPrice;
  if (!same(a.totalMiles, b.totalMiles)) return b.totalMiles - a.totalMiles;
  return 0;
};

// Compares two or more stores. Returns the stores in recommendation order, each with its
// `comparison` to the reference; the `reference` (lowest price, then more miles); `best`
// (the lowest net cost, more than one when they tie on net cost, price and miles); and
// `mostMiles` (then the lower price). These can point to different stores.
export function compareStores(stores, settings) {
  const evaluated = stores.map(store => evaluateStore(store, settings));
  const reference = evaluated.reduce((ref, s) =>
    !same(s.totalPrice, ref.totalPrice)
      ? (s.totalPrice < ref.totalPrice ? s : ref)
      : s.totalMiles > ref.totalMiles && !same(s.totalMiles, ref.totalMiles) ? s : ref
  );
  const mostMiles = evaluated.reduce((top, s) =>
    !same(s.totalMiles, top.totalMiles)
      ? (s.totalMiles > top.totalMiles ? s : top)
      : s.totalPrice < top.totalPrice && !same(s.totalPrice, top.totalPrice) ? s : top
  );
  const ranked = [...evaluated].sort(byRecommendation);
  const withComparison = store => ({
    ...store,
    comparison: compareWithReference(store, reference, settings.referenceMilePrice),
  });
  return {
    stores: ranked.map(withComparison),
    reference: withComparison(reference),
    best: ranked.filter(s => byRecommendation(s, ranked[0]) === 0).map(withComparison),
    mostMiles,
  };
}
