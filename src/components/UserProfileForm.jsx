import React, { useState } from "react";
import { Calculator, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import CardPicker from "@/components/CardPicker";
import DollarRateField from "@/components/DollarRateField";
import MoneyField from "@/components/MoneyField";
import { formatBRL, formatDecimal } from "@/utils/format";

// Controlled by App, which owns `profile` (spend, dollar rate and the card picker or
// manual card fields) so that any change can clear the last result. `card` is the card the
// profile describes, or null while the form is invalid. `ptax` is today's dollar rate, or null.
const UserProfileForm = ({ cards, profile, card, ptax, resultHref, rankingHref, onChange }) => {
  const { monthlySpend } = profile;
  const [submitted, setSubmitted] = useState(false);
  // The picked card as listed, for its full annuity (`card` has the one the user pays).
  const listCard = !profile.manual && cards.find(c => c.id === profile.cardId);
  const update = changes => onChange({ ...profile, ...changes });

  // Switching between the list and the manual fields starts over without errors.
  const handleCardChange = changes => {
    update(changes);
    if ("manual" in changes) setSubmitted(false);
  };

  // Reached by the Enter key, or by Calcular while the form is invalid (to show the errors).
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    if (card) window.location.assign(resultHref);
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
            <DollarRateField profile={profile} ptax={ptax} onChange={update} />
          </FieldGroup>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Seu cartão atual</h3>
            <CardPicker cards={cards} profile={profile} showErrors={submitted} onChange={handleCardChange} />
            {listCard && (
              <MoneyField
                id="annuity"
                label="Anuidade que você paga"
                optional
                value={profile.annuity}
                placeholder={formatDecimal(listCard.annuity)}
                onChange={value => update({ annuity: value })}
                description={`Vazio: a anuidade cheia, ${formatBRL(listCard.annuity)}. Use 0 se tiver isenção.`}
                error="Informe a anuidade (0 se tiver isenção) ou deixe vazio."
              />
            )}
          </div>

          {/* Stacked on phones. `sm:flex-1` only: in a column, flex-1 (basis 0) would override
              the button height and squash the buttons to their text. */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* A valid form makes Calcular a plain link, so AdSense can show a vignette on it. */}
            {card ? (
              <Button asChild size="lg" className="h-11 text-base sm:flex-1">
                <a href={resultHref}>
                  <Calculator /> Calcular
                </a>
              </Button>
            ) : (
              <Button type="submit" size="lg" className="h-11 text-base sm:flex-1">
                <Calculator /> Calcular
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="h-11 text-base sm:flex-1">
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
