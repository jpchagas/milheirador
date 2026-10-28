const ISSUERS = {
  bradesco: "Bradesco",
  itau: "Itaú",
  santander: "Santander",
  c6: "C6 Bank",
  xp: "XP",
  inter: "Inter",
  btg: "BTG Pactual",
  brb: "BRB",
  outro: "Outro banco",
};

const BRANDS = {
  visa: "Visa",
  mastercard: "Mastercard",
  elo: "Elo",
  "american express": "American Express",
};

const PROGRAMS = {
  livelo: "Livelo",
  esfera: "Esfera",
  "latam pass": "LATAM Pass",
  "azul fidelidade": "Azul Fidelidade",
  smiles: "Smiles",
  aadvantage: "AAdvantage",
  "tap miles&go": "TAP Miles&Go",
  proprio: "Programa do banco",
};

const WORDS = { latampass: "LATAM Pass", aadvantage: "AAdvantage", tap: "TAP", de: "de" };

const titleCase = text =>
  text
    .split(" ")
    .map(w => WORDS[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const issuerLabel = issuer => ISSUERS[issuer] ?? titleCase(issuer);
export const brandLabel = brand => (brand ? BRANDS[brand] ?? titleCase(brand) : "—");
export const programLabel = program => PROGRAMS[program] ?? titleCase(program);
export const cardName = card => `${issuerLabel(card.issuer)} ${titleCase(card.type)}`;

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const signedInteger = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export const formatBRL = value => (Number.isFinite(value) ? brl.format(value) : "—");
export const formatMiles = value => integer.format(value);
export const formatMilesDelta = value => signedInteger.format(value);
export const formatAccumulation = card =>
  `${decimal.format(card.accumulationFactor)} pts/${card.currency === "dolar" ? "US$" : "R$"}`;

// Accepts both "5,50" and "5.50" from the inputs.
export const parseNumber = text => Number(String(text).replace(",", "."));
