import { parseNumber } from "@/utils/format";

// Form values for a card the user types in (CardInputForm) and their conversion to a card.
export const emptyManualCard = {
  issuer: "",
  type: "",
  brand: "",
  currency: "dolar",
  accumulationFactor: "",
  conversionRatio: "1",
  annuity: "0",
};

export const validateManualCard = form => {
  const errors = {};
  if (!form.issuer) errors.issuer = "Selecione o banco.";
  if (!form.type.trim()) errors.type = "Informe o nome do cartão.";
  if (!form.brand) errors.brand = "Selecione a bandeira.";
  if (!(parseNumber(form.accumulationFactor) > 0)) errors.accumulationFactor = "Informe os pontos acumulados.";
  if (!(parseNumber(form.conversionRatio) > 0)) errors.conversionRatio = "Informe a conversão.";
  if (!(parseNumber(form.annuity) >= 0) || form.annuity === "") errors.annuity = "Informe a anuidade (0 se for grátis).";
  return errors;
};

// Turns valid form values into a card with the same shape as cards.js.
export const manualCardFromForm = form => {
  const accumulationFactor = parseNumber(form.accumulationFactor);
  return {
    id: "my-card",
    issuer: form.issuer,
    type: form.type.trim().toLowerCase(),
    brand: form.brand,
    accumulationFactor,
    accumulationFactorAbroad: accumulationFactor,
    conversionRatio: parseNumber(form.conversionRatio),
    currency: form.currency,
    annuity: parseNumber(form.annuity),
  };
};
