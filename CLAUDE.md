# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Milheirador ("Cartão Milheiro") is a client-only React 19 + Vite SPA, built with react-bootstrap, that ranks Brazilian credit cards by how many airline miles they earn. The UI text is in Portuguese (pt-BR). There is no backend, router, or state library, and no test framework is set up.

## Commands

```bash
npm install
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint (flat config, eslint.config.js)
```

## Architecture

- `src/data/cards.js` exports `creditCards`, a hand-maintained static array that serves as the whole dataset. Each entry has the fields `brand, issuer, type, accumulationFactor, accumulationFactorAbroad, conversionRatio, currency, annuity`.
- `src/utils/rankMyCard.js` holds the scoring logic. `calculateScore(card)` gives a number used for sorting, and `getCardRanking(userCard, allCards)` adds the user's card under the name `"Your Card"`, sorts the list, and returns its 1-based `position`.
- `src/App.jsx` ranks `creditCards` on mount and passes the result to `CardRankingList`. `CardRankingList` paginates the cards client-side (8 per page) and opens `card.link` when a card is clicked. When `CardInputForm` is submitted, App calls `getCardRanking` and shows the user's rank in a Modal.
- `src/components/GoogleAds.jsx` injects the AdSense script. The client and slot IDs are still placeholders (`ca-pub-XXXX…`).

### Known data-shape inconsistencies (check before changing ranking logic)

The three layers use different field names and do not line up:
- `calculateScore` reads `rewards`, `interestRate`, and `annualFee`, but none of these fields exist in `cards.js`. As a result every score is `NaN` and the sort order is effectively meaningless.
- `CardInputForm` produces Portuguese and snake_case keys (`bandeira, emissor, tipo, accumulation_factor, accumulation_factor_abroad, conversion_ratio, currency, annuity`). The dataset uses camelCase English keys.
- `CardRankingList` uses `card.id` as the React key and `card.link` for the click-through. Neither field exists in the data.
- In `CardRankingList` the labels are swapped: "Bandeira" (brand) shows `issuer`.

## Intended scoring formula (from README)

The README describes the target metric, miles earned per real (BRL) spent:

```
milhas por real = (pontos por dólar × milhas por ponto) ÷ cotação do dólar
```

For example, (1.5 × 1) ÷ 5.50 ≈ 0.2727 miles per BRL. To estimate the return, multiply by an estimated value per mile (~R$0.02). In the data, `accumulationFactor` / `accumulationFactorAbroad` are points per dollar, `conversionRatio` converts points to miles, and `annuity` is the annual fee in BRL.
