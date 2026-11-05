import React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CardInputForm from "@/components/CardInputForm";
import { cardName, issuerLabel } from "@/utils/format";
import { validateManualCard } from "@/utils/manualCard";

// The user's card: a bank and card from the dataset, or the manual card fields. Reads the
// card fields of `profile` and passes the changed ones to `onChange` (a new card clears the
// annuity typed for the previous one). Errors only show with `showErrors` (after a submit).
const CardPicker = ({ cards, profile, showErrors = false, onChange }) => {
  const { manual, issuer, cardId, manualCard } = profile;

  const issuers = [...new Set(cards.map(c => c.issuer))].sort((a, b) =>
    issuerLabel(a).localeCompare(issuerLabel(b))
  );
  const issuerCards = cards
    .filter(c => c.issuer === issuer)
    .sort((a, b) => cardName(a).localeCompare(cardName(b)));

  const manualErrors = showErrors && manual ? validateManualCard(manualCard) : {};
  const cardError = showErrors && !manual && !cardId ? "Selecione o seu cartão." : null;

  return (
    <>
      {manual ? (
        <CardInputForm
          issuers={issuers}
          form={manualCard}
          errors={manualErrors}
          onChange={value => onChange({ manualCard: value })}
        />
      ) : (
        <Field data-invalid={!!cardError || undefined}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select value={issuer} onValueChange={value => onChange({ issuer: value, cardId: "", annuity: "" })}>
              <SelectTrigger className="w-full" aria-label="Banco">
                <SelectValue placeholder="Banco" />
              </SelectTrigger>
              <SelectContent>
                {issuers.map(i => (
                  <SelectItem key={i} value={i}>{issuerLabel(i)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cardId} onValueChange={value => onChange({ cardId: value, annuity: "" })} disabled={!issuer}>
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
      <Button type="button" variant="link" className="touch-target h-auto px-0" onClick={() => onChange({ manual: !manual })}>
        {manual ? "Escolher meu cartão da lista" : "Meu cartão não está na lista"}
      </Button>
    </>
  );
};

export default CardPicker;
