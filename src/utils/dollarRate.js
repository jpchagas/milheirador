// Today's dollar rate: the PTAX selling rate published by the Banco Central (free, no key,
// and its API allows requests from the browser). Every navigation is a full page load, so the
// last rate is cached in localStorage and only fetched again after CACHE_MS.
const PTAX_URL =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)";
const CACHE_KEY = "ptax";
const CACHE_MS = 3 * 60 * 60 * 1000;
// Weekends and holidays have no quote, so ask for the last days and take the latest one.
const LOOKBACK_DAYS = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

// The API takes dates as 'MM-DD-YYYY', quotes included.
const ptaxDate = date =>
  `'${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}'`;

// `{ rate, date, fetchedAt }` from the last fetch, or null (none yet, storage blocked, or
// prerendering at build time).
export function cachedDollarRate() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached?.rate > 0 ? cached : null;
  } catch {
    return null;
  }
}

// The cached rate while it is fresh, otherwise the latest PTAX quote; null when the API fails.
export async function fetchDollarRate() {
  const cached = cachedDollarRate();
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) return cached;

  // A day past today, in case the user's clock is a day behind Brasília.
  const now = Date.now();
  const params = {
    "@dataInicial": ptaxDate(new Date(now - LOOKBACK_DAYS * DAY_MS)),
    "@dataFinalCotacao": ptaxDate(new Date(now + DAY_MS)),
    $top: "1",
    $orderby: "dataHoraCotacao desc",
    $format: "json",
  };
  // Encoded by hand: URLSearchParams would turn the space in $orderby into "+".
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const response = await fetch(`${PTAX_URL}?${query}`);
    if (!response.ok) return cached;
    const quote = (await response.json()).value?.[0];
    if (!(quote?.cotacaoVenda > 0)) return cached;
    // "2026-11-04 13:05:19.232051" -> "2026-11-04"
    const result = { rate: quote.cotacaoVenda, date: quote.dataHoraCotacao.slice(0, 10), fetchedAt: now };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {
      // Storage unavailable: fetch again on the next page.
    }
    return result;
  } catch {
    // Offline or blocked: a stale rate is still better than the default.
    return cached;
  }
}
