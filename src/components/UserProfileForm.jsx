import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CardInputForm from "@/components/CardInputForm";
import { cardName, issuerLabel, parseNumber } from "@/utils/format";

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

const UserProfileForm = ({
  cards,
  monthlySpend,
  dollarRate,
  userCard,
  onMonthlySpendChange,
  onDollarRateChange,
  onCardChange,
}) => {
  const [issuer, setIssuer] = useState(userCard?.issuer ?? "");
  const [manual, setManual] = useState(false);

  const issuers = [...new Set(cards.map(c => c.issuer))].sort((a, b) =>
    issuerLabel(a).localeCompare(issuerLabel(b))
  );
  const issuerCards = cards
    .filter(c => c.issuer === issuer)
    .sort((a, b) => cardName(a).localeCompare(cardName(b)));

  const handleIssuerChange = value => {
    setIssuer(value);
    onCardChange(null);
  };

  const toggleManual = () => {
    setManual(prev => !prev);
    setIssuer("");
    onCardChange(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu perfil de gastos</CardTitle>
        <CardDescription>O ranking é recalculado a cada alteração.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldGroup>
          <MoneyField
            id="monthlySpend"
            label="Gasto mensal no cartão"
            value={monthlySpend}
            onChange={onMonthlySpendChange}
            error="Informe um valor maior que zero."
          />
          <MoneyField
            id="dollarRate"
            label="Cotação do dólar no cartão"
            value={dollarRate}
            onChange={onDollarRateChange}
            description="Usada nos cartões que pontuam por dólar."
            error="Informe uma cotação válida."
          />
        </FieldGroup>

        <Separator />

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Seu cartão atual</h3>
            <p className="text-sm text-muted-foreground">
              Opcional. Mostramos onde ele fica e quais cartões rendem mais.
            </p>
          </div>
          {manual ? (
            <CardInputForm issuers={issuers} onSubmit={onCardChange} />
          ) : (
            <div className="grid gap-3">
              <Select value={issuer} onValueChange={handleIssuerChange}>
                <SelectTrigger className="w-full" aria-label="Banco">
                  <SelectValue placeholder="Banco" />
                </SelectTrigger>
                <SelectContent>
                  {issuers.map(i => (
                    <SelectItem key={i} value={i}>{issuerLabel(i)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={userCard?.id ?? ""}
                onValueChange={id => onCardChange(cards.find(c => c.id === id) ?? null)}
                disabled={!issuer}
              >
                <SelectTrigger className="w-full" aria-label="Cartão">
                  <SelectValue placeholder="Cartão" />
                </SelectTrigger>
                <SelectContent>
                  {issuerCards.map(c => (
                    <SelectItem key={c.id} value={c.id}>{cardName(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button variant="link" className="h-auto px-0" onClick={toggleManual}>
            {manual ? "Escolher meu cartão da lista" : "Meu cartão não está na lista"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
