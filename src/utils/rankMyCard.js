export function calculateScore(card) {
  return card.rewards * 10 - card.interestRate * 0.5 - card.annualFee * 0.1;
}

export function getCardRanking(userCard, allCards) {
  const all = [...allCards, { ...userCard, name: "Your Card" }];
  const ranked = all
    .map(card => ({ ...card, score: calculateScore(card) }))
    .sort((a, b) => b.score - a.score);

  const position = ranked.findIndex(c => c.name === "Your Card") + 1;
  return { ranked, position };
}
