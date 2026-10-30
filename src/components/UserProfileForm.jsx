import React, { useState } from "react";
import { Calculator, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CardInputForm from "@/components/CardInputForm";
import { cardName, issuerLabel, parseNumber } from "@/utils/format";
import { manualCardFromForm, validateManualCard } from "@/utils/manualCard";

const MoneyField = ({ id, label, value, onChange, description, error }) => {
  const invalid = !(parseNumber(value) > 0);
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
        />
      </InputGroup>
      {invalid ? <FieldError>{error}</FieldError> : description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
};

// Controlled by App, which owns `profile` (spend, dollar rate and the card picker or
// manual card fields) so that any change can clear the last result.
const UserProfileForm = ({ cards, profile, rankingHref, onChange, onCalculate }) => {
  const { monthlySpend, dollarRate, manual, issuer, cardId, manualCard } = profile;
  const [submitted, setSubmitted] = useState(false);
  const update = changes => onChange({ ...profile, ...changes });

  const issuers = [...new Set(cards.map(c => c.issuer))].sort((a, b) =>
    issuerLabel(a).localeCompare(issuerLabel(b))
  );
  const issuerCards = cards
    .filter(c => c.issuer === issuer)
    .sort((a, b) => cardName(a).localeCompare(cardName(b)));

  const manualErrors = submitted && manual ? validateManualCard(manualCard) : {};
  const cardError = submitted && !manual && !cardId ? "Selecione o seu cartão." : null;

  const toggleManual = () => {
    update({ manual: !manual });
    setSubmitted(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    if (!(parseNumber(monthlySpend) > 0) || !(parseNumber(dollarRate) > 0)) return;
    if (manual) {
      if (Object.keys(validateManualCard(manualCard)).length > 0) return;
      onCalculate(manualCardFromForm(manualCard));
    } else {
      const card = cards.find(c => c.id === cardId);
      if (card) onCalculate(card);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu perfil de gastos</CardTitle>
        <CardDescription>Informe seus gastos e o cartão que você usa hoje.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <MoneyField
              id="monthlySpend"
              label="Gasto mensal no cartão"
              value={monthlySpend}
              onChange={value => update({ monthlySpend: value })}
              error="Informe um valor maior que zero."
            />
            <MoneyField
              id="dollarRate"
              label="Cotação do dólar no cartão"
              value={dollarRate}
              onChange={value => update({ dollarRate: value })}
              description="Usada nos cartões que pontuam por dólar."
              error="Informe uma cotação válida."
            />
          </FieldGroup>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Seu cartão atual</h3>
            {manual ? (
              <CardInputForm
                issuers={issuers}
                form={manualCard}
                errors={manualErrors}
                onChange={value => update({ manualCard: value })}
              />
            ) : (
              <Field data-invalid={!!cardError || undefined}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select value={issuer} onValueChange={value => update({ issuer: value, cardId: "" })}>
                    <SelectTrigger className="w-full" aria-label="Banco">
                      <SelectValue placeholder="Banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {issuers.map(i => (
                        <SelectItem key={i} value={i}>{issuerLabel(i)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={cardId} onValueChange={value => update({ cardId: value })} disabled={!issuer}>
                    <SelectTrigger className="w-full" aria-label="Cartão" aria-invalid={!!cardError || undefined}>
                      <SelectValue placeholder="Cartão" />
                    </SelectTrigger>
                    <SelectContent>
                      {issuerCards.map(c => (
                        <SelectItem key={c.id} value={c.id}>{cardName(c)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FieldError>{cardError}</FieldError>
              </Field>
            )}
            <Button type="button" variant="link" className="h-auto px-0" onClick={toggleManual}>
              {manual ? "Escolher meu cartão da lista" : "Meu cartão não está na lista"}
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" size="lg" className="flex-1">
              <Calculator /> Calcular
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <a href={rankingHref}>
                <ListOrdered /> Ver ranking
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
