import React from "react";
import { Button } from "@/components/ui/button";
import MoneyField from "@/components/MoneyField";
import { formatBRL } from "@/utils/format";
import { dollarRateText } from "@/utils/profile";

// "2026-11-04" -> "04/11/2026"
const formatDate = isoDate => isoDate.split("-").reverse().join("/");

// The dollar rate of `profile`, which follows today's PTAX (`ptax`, null until it loads or if
// the API fails) until the user types another rate. `onChange` gets the changed profile fields.
const DollarRateField = ({ profile, ptax, onChange }) => {
  let description = "Usada nos cartões que pontuam por dólar.";
  if (ptax && profile.dollarRateAuto) {
    description = `Cotação PTAX de venda do Banco Central em ${formatDate(ptax.date)}. Ajuste se o seu banco usar outra.`;
  } else if (ptax) {
    description = (
      <>
        Cotação PTAX em {formatDate(ptax.date)}: {formatBRL(ptax.rate)}.{" "}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={() => onChange({ dollarRate: dollarRateText(ptax.rate), dollarRateAuto: true })}
        >
          Usar essa cotação
        </Button>
      </>
    );
  }

  return (
    <MoneyField
      id="dollarRate"
      label="Cotação do dólar no cartão"
      value={profile.dollarRate}
      onChange={value => onChange({ dollarRate: value, dollarRateAuto: false })}
      description={description}
      error="Informe uma cotação válida."
    />
  );
};

export default DollarRateField;
