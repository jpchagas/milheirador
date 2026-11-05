import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import CardPicker from "@/components/CardPicker";
import DollarRateField from "@/components/DollarRateField";
import MoneyField from "@/components/MoneyField";
import {
  cardName,
  formatAccumulation,
  formatBRL,
  formatDecimal,
  formatSignedBRL,
  parseNumber,
  programLabel,
} from "@/utils/format";
import { settingsFromProfile } from "@/utils/profile";
import { DEFAULT_REFERENCE_MILE_PRICE, SUGGESTED_MILE_PRICE, compareStores } from "@/utils/purchase";

// Starts with an example, so there is something to compare once a card is picked.
const emptyStore = {
  name: "",
  productPrice: "",
  shippingCost: "",
  discount: "",
  partnerPointsPerReal: "",
  partnerConversionFactor: "1",
  eligiblePartnerAmount: "",
  cardEligibleAmount: "",
};
const exampleStores = [
  { ...emptyStore, id: 1, name: "Loja A", productPrice: "14,90" },
  { ...emptyStore, id: 2, name: "Loja B", productPrice: "17,88", partnerPointsPerReal: "2" },
];

const MIN_STORES = 2;
// Fields behind "Mais detalhes".
const DETAIL_FIELDS = ["shippingCost", "discount", "partnerConversionFactor", "eligiblePartnerAmount", "cardEligibleAmount"];

const storeName = (form, i) => form.name.trim() || `Loja ${i + 1}`;

// Blank optional amounts are 0, or null for the eligible amounts (the final price).
const optional = (text, blank) => (text.trim() === "" ? blank : parseNumber(text));
const isAmount = value => value === null || value >= 0;

// The store for compareStores, or the errors of its fields.
const parseStore = (form, i) => {
  const store = {
    id: form.id,
    name: storeName(form, i),
    productPrice: parseNumber(form.productPrice),
    shippingCost: optional(form.shippingCost, 0),
    discount: optional(form.discount, 0),
    partnerPointsPerReal: optional(form.partnerPointsPerReal, 0),
    partnerConversionFactor: parseNumber(form.partnerConversionFactor),
    eligiblePartnerAmount: optional(form.eligiblePartnerAmount, null),
    cardEligibleAmount: optional(form.cardEligibleAmount, null),
    partnerPointsMode: "additional",
  };
  const errors = {};
  if (!(store.productPrice > 0)) errors.productPrice = "Informe o preço.";
  if (!isAmount(store.shippingCost)) errors.shippingCost = "Informe um valor (0 se for grátis).";
  if (!isAmount(store.discount)) errors.discount = "Informe um valor (0 se não houver).";
  else if (store.productPrice + store.shippingCost - store.discount < 0)
    errors.discount = "O desconto não pode passar do preço com frete.";
  if (!isAmount(store.partnerPointsPerReal)) errors.partnerPointsPerReal = "Informe um número (0 se não houver).";
  if (!(store.partnerConversionFactor > 0)) errors.partnerConversionFactor = "Informe a conversão (1 se for 1:1).";
  if (!isAmount(store.eligiblePartnerAmount)) errors.eligiblePartnerAmount = "Informe um valor ou deixe vazio.";
  if (!isAmount(store.cardEligibleAmount)) errors.cardEligibleAmount = "Informe um valor ou deixe vazio.";
  return Object.keys(errors).length ? { errors } : { store, errors };
};

// A number typed as text, optionally in R$, whose validation is done by the caller.
const NumberField = ({ id, label, value, onChange, money = false, placeholder, description, error }) => {
  const inputProps = {
    id,
    inputMode: "decimal",
    value,
    placeholder,
    onChange: e => onChange(e.target.value),
    "aria-invalid": !!error || undefined,
  };
  return (
    <Field data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {money ? (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>R$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput {...inputProps} />
        </InputGroup>
      ) : (
        <Input {...inputProps} />
      )}
      {error ? <FieldError>{error}</FieldError> : description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
};

const miles = value => `${formatDecimal(value)} ${value === 1 ? "milha" : "milhas"}`;

// What one store's comparison with the reference (the lowest price) says, from compareStores.
const comparisonText = (store, reference, referenceMilePrice) => {
  const c = store.comparison;
  switch (c.kind) {
    case "reference":
      return "Menor preço: é a referência das comparações.";
    case "tie":
      return `Mesmo preço e mesmas milhas que ${reference.name}: empate.`;
    case "noAdvantage":
      return c.additionalCost > 0
        ? `Custa ${formatBRL(c.additionalCost)} a mais que ${reference.name} sem render mais milhas.`
        : `Mesmo preço que ${reference.name}, com menos milhas.`;
    case "freeMiles":
      return `Mesmo preço que ${reference.name} e ${miles(c.additionalMiles)} a mais, sem custo extra.`;
    default: {
      const maxPrice =
        c.maxWorthPrice === Infinity
          ? "Com esse milheiro, as milhas valem mais que cada real a mais, então compensa a qualquer preço."
          : `Compensa até um preço final de ${formatBRL(c.maxWorthPrice)} nesta loja.`;
      return (
        `Custa ${formatBRL(c.additionalCost)} a mais que ${reference.name} por ${miles(c.additionalMiles)} extras: ` +
        `${formatBRL(c.additionalThousandMilesCost)} o milheiro adicional, contra a sua referência de ${formatBRL(referenceMilePrice)}. ` +
        `As milhas extras valem ${formatBRL(c.maximumExtraPayment)}, o máximo que vale pagar a mais por elas; ` +
        `trocar de loja dá ${formatSignedBRL(c.netSwitchBenefit)}. ${maxPrice}`
      );
    }
  }
};

// Why the best store wins, against the runner-up (or, when the best is not the lowest price,
// against the lowest price).
const verdictText = (result, referenceMilePrice) => {
  const [best] = result.best;
  const milheiro = `com o milheiro a ${formatBRL(referenceMilePrice)}`;
  if (result.best.length > 1) {
    return `Mesmo custo líquido estimado, mesmo preço e mesmas milhas ${milheiro}.`;
  }
  if (best.comparison.kind !== "reference") {
    const c = best.comparison;
    return `Custa ${formatBRL(c.additionalCost)} a mais que ${result.reference.name} e rende ${miles(c.additionalMiles)} a mais, que valem ${formatBRL(c.additionalMilesValue)} ${milheiro}. Vantagem estimada: ${formatBRL(c.netSwitchBenefit)}.`;
  }
  const runnerUp = result.stores[1];
  const c = runnerUp.comparison;
  if (c.kind === "noAdvantage") {
    return `${runnerUp.name} custa ${formatBRL(c.additionalCost)} a mais e não rende mais milhas.`;
  }
  return `${runnerUp.name} custa ${formatBRL(c.additionalCost)} a mais e rende ${miles(c.additionalMiles)} a mais, que valem ${formatBRL(c.additionalMilesValue)} ${milheiro}. Vantagem estimada de ${best.name}: ${formatBRL(-c.netSwitchBenefit)}.`;
};

// Compares stores for the same product by final price minus the estimated value of the miles
// the purchase earns (card points plus partner campaign points). The card comes from App's
// `profile` (shared with the home form through the URL); the stores and the milheiro value
// are local to this page. `ptax` is today's dollar rate, or null.
const WorthCalculator = ({ cards, profile, card, ptax, onProfileChange }) => {
  const [stores, setStores] = useState(exampleStores);
  const [expanded, setExpanded] = useState([]);
  const [milePriceText, setMilePriceText] = useState(String(DEFAULT_REFERENCE_MILE_PRICE));
  const update = changes => onProfileChange({ ...profile, ...changes });

  const setStore = (id, changes) =>
    setStores(prev => prev.map(s => (s.id === id ? { ...s, ...changes } : s)));
  const addStore = () =>
    setStores(prev => [...prev, { ...emptyStore, id: Math.max(...prev.map(s => s.id)) + 1 }]);
  const removeStore = id => setStores(prev => prev.filter(s => s.id !== id));
  const toggleDetails = id =>
    setExpanded(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));

  const parsed = stores.map(parseStore);
  const validStores = parsed.map(p => p.store).filter(Boolean);
  const referenceMilePrice = parseNumber(milePriceText);
  const result =
    card && validStores.length >= MIN_STORES && referenceMilePrice > 0
      ? compareStores(validStores, {
          card,
          dollarRate: settingsFromProfile(profile).dollarRate,
          referenceMilePrice,
        })
      : null;
  const skipped = stores.length - validStores.length;
  const hasPartnerPoints = validStores.some(s => s.partnerPointsPerReal > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sua compra</CardTitle>
          <CardDescription>Escolha o seu cartão e informe o preço do produto em cada loja.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Seu cartão</h3>
            <CardPicker cards={cards} profile={profile} onChange={update} />
            {card && (
              <p className="text-sm text-muted-foreground">
                {cardName(card)}: {formatAccumulation(card)}
                {card.program && ` em ${programLabel(card.program)}`}, {formatDecimal(card.conversionRatio)}{" "}
                {card.conversionRatio === 1 ? "milha" : "milhas"} por ponto.
              </p>
            )}
          </div>

          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <DollarRateField profile={profile} ptax={ptax} onChange={update} />
            <MoneyField
              id="referenceMilePrice"
              label="Valor de referência do milheiro"
              value={milePriceText}
              onChange={setMilePriceText}
              description={`Quanto valem 1.000 milhas para você. Sugestão: entre ${formatBRL(SUGGESTED_MILE_PRICE.min)} e ${formatBRL(SUGGESTED_MILE_PRICE.max)}. É uma estimativa, não uma cotação de compra ou venda de milhas.`}
              error="Informe um valor maior que zero."
            />
          </FieldGroup>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Lojas</h3>
            {stores.map((form, i) => {
              const { errors, store } = parsed[i];
              const showDetails = expanded.includes(form.id) || DETAIL_FIELDS.some(f => errors[f]);
              const totalPrice = store && store.productPrice + store.shippingCost - store.discount;
              return (
                <div key={form.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex gap-2">
                    <Input
                      value={form.name}
                      onChange={e => setStore(form.id, { name: e.target.value })}
                      placeholder={`Loja ${i + 1}`}
                      aria-label="Nome da loja"
                    />
                    {stores.length > MIN_STORES && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStore(form.id)}
                        aria-label={`Remover ${storeName(form, i)}`}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                  <FieldGroup className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      id={`productPrice-${form.id}`}
                      label="Preço do produto"
                      money
                      value={form.productPrice}
                      onChange={value => setStore(form.id, { productPrice: value })}
                      error={errors.productPrice}
                    />
                    <NumberField
                      id={`partnerPointsPerReal-${form.id}`}
                      label="Pontos do parceiro por R$"
                      value={form.partnerPointsPerReal}
                      onChange={value => setStore(form.id, { partnerPointsPerReal: value })}
                      placeholder="0"
                      description="Pontos da campanha, além dos do cartão. Vazio conta como 0."
                      error={errors.partnerPointsPerReal}
                    />
                  </FieldGroup>

                  {showDetails && (
                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        id={`shippingCost-${form.id}`}
                        label="Frete"
                        money
                        value={form.shippingCost}
                        onChange={value => setStore(form.id, { shippingCost: value })}
                        placeholder="0"
                        error={errors.shippingCost}
                      />
                      <NumberField
                        id={`discount-${form.id}`}
                        label="Desconto"
                        money
                        value={form.discount}
                        onChange={value => setStore(form.id, { discount: value })}
                        placeholder="0"
                        error={errors.discount}
                      />
                      <NumberField
                        id={`partnerConversionFactor-${form.id}`}
                        label="Milhas por ponto do parceiro"
                        value={form.partnerConversionFactor}
                        onChange={value => setStore(form.id, { partnerConversionFactor: value })}
                        description="Ajuste se a campanha é de outro programa ou não transfere 1:1."
                        error={errors.partnerConversionFactor}
                      />
                      <NumberField
                        id={`eligiblePartnerAmount-${form.id}`}
                        label="Valor que pontua no parceiro"
                        money
                        value={form.eligiblePartnerAmount}
                        onChange={value => setStore(form.id, { eligiblePartnerAmount: value })}
                        description="Vazio: o preço final. Ex.: sem o frete, se ele não pontua."
                        error={errors.eligiblePartnerAmount}
                      />
                      <NumberField
                        id={`cardEligibleAmount-${form.id}`}
                        label="Valor que pontua no cartão"
                        money
                        value={form.cardEligibleAmount}
                        onChange={value => setStore(form.id, { cardEligibleAmount: value })}
                        description="Vazio: o preço final cobrado no cartão."
                        error={errors.cardEligibleAmount}
                      />
                    </FieldGroup>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="link"
                      className="touch-target h-auto px-0"
                      onClick={() => toggleDetails(form.id)}
                      aria-expanded={showDetails}
                    >
                      {showDetails ? <ChevronUp /> : <ChevronDown />}
                      {showDetails ? "Menos detalhes" : "Frete, desconto e valores que pontuam"}
                    </Button>
                    {store && (
                      <span className="text-sm text-muted-foreground">
                        Preço final: <span className="font-medium text-foreground">{formatBRL(totalPrice)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <Button type="button" variant="outline" onClick={addStore}>
              <Plus /> Adicionar loja
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        {result ? (
          <>
            <CardHeader>
              <CardTitle className="text-xl">
                {result.best.length > 1
                  ? `${result.best.map(s => s.name).join(" e ")} empatam`
                  : `Melhor compra: ${result.best[0].name}`}
              </CardTitle>
              <CardDescription>{verdictText(result, referenceMilePrice)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-2 text-sm sm:grid-cols-3">
                {[
                  ["Menor preço", result.reference.name],
                  ["Mais milhas", result.mostMiles.name],
                  ["Menor custo líquido", result.best.map(s => s.name).join(" e ")],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border px-3 py-2">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>

              <ol className="divide-y rounded-lg border">
                {result.stores.map(store => {
                  const isBest = result.best.some(s => s.id === store.id);
                  return (
                    <li key={store.id} className={isBest ? "bg-highlight/10 px-4 py-3" : "px-4 py-3"}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 font-medium">
                            {store.name}
                            {isBest && <Badge className="bg-highlight text-highlight-foreground">Melhor compra</Badge>}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            Preço final {formatBRL(store.totalPrice)} · {miles(store.totalMiles)} (
                            {formatDecimal(store.cardMiles)} do cartão
                            {store.partnerMiles > 0 && ` + ${formatDecimal(store.partnerMiles)} do parceiro`})
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="font-semibold tabular-nums">{formatBRL(store.estimatedNetCost)}</div>
                          <div className="text-xs text-muted-foreground">
                            custo líquido estimado
                            <br />
                            milhas valem {formatBRL(store.estimatedMilesValue)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {comparisonText(store, result.reference, referenceMilePrice)}
                      </p>
                    </li>
                  );
                })}
              </ol>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="font-medium">Premissas do cálculo</p>
                <ul className="list-disc space-y-1 pl-4">
                  {hasPartnerPoints && (
                    <li>
                      Os pontos do parceiro foram somados aos do cartão. Confirme no regulamento da
                      campanha se as duas pontuações acumulam.
                    </li>
                  )}
                  <li>Valores que pontuam não informados usam o preço final, com frete e desconto.</li>
                  <li>A anuidade não entra: a comparação supõe que você já tem o cartão.</li>
                  <li>
                    O custo líquido é uma estimativa com o milheiro a {formatBRL(referenceMilePrice)},
                    não um desconto dado pela loja.
                  </li>
                  {skipped > 0 && (
                    <li>
                      {skipped === 1 ? "Uma loja com campos incompletos ficou" : `${skipped} lojas com campos incompletos ficaram`}{" "}
                      de fora.
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent>
            <p className="py-4 text-center text-sm text-muted-foreground">
              {!card
                ? "Selecione o seu cartão para comparar as lojas."
                : "Preencha o preço de pelo menos duas lojas e o valor do milheiro para ver o resultado."}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default WorthCalculator;
