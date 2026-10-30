import React from "react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brandLabel, issuerLabel } from "@/utils/format";

const brands = ["visa", "mastercard", "elo", "american express"];

// Fields for cards that are not in the dataset. The parent form owns the values and
// submits them; `errors` comes from validateManualCard (utils/manualCard.js).
const CardInputForm = ({ issuers, form, errors, onChange }) => {
  const setField = name => value => onChange({ ...form, [name]: value });

  const selectField = (name, label, options, optionLabel) => (
    <Field data-invalid={!!errors[name] || undefined}>
      <FieldLabel>{label}</FieldLabel>
      <Select value={form[name]} onValueChange={setField(name)}>
        <SelectTrigger className="w-full" aria-label={label} aria-invalid={!!errors[name] || undefined}>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o} value={o}>{optionLabel(o)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError>{errors[name]}</FieldError>
    </Field>
  );

  return (
    <FieldGroup className="gap-4">
      {selectField("issuer", "Banco", [...issuers, "outro"], issuerLabel)}
      <Field data-invalid={!!errors.type || undefined}>
        <FieldLabel htmlFor="manualType">Nome do cartão</FieldLabel>
        <Input
          id="manualType"
          value={form.type}
          onChange={e => setField("type")(e.target.value)}
          placeholder="Ex.: Platinum"
          aria-invalid={!!errors.type || undefined}
        />
        <FieldError>{errors.type}</FieldError>
      </Field>
      {selectField("brand", "Bandeira", brands, brandLabel)}
      <Field data-invalid={!!errors.accumulationFactor || undefined}>
        <FieldLabel htmlFor="manualAccumulation">Pontos acumulados</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="manualAccumulation"
            inputMode="decimal"
            value={form.accumulationFactor}
            onChange={e => setField("accumulationFactor")(e.target.value)}
            placeholder="Ex.: 2,2"
            aria-invalid={!!errors.accumulationFactor || undefined}
          />
          <Select value={form.currency} onValueChange={setField("currency")}>
            <SelectTrigger className="w-28 shrink-0" aria-label="Moeda do acúmulo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dolar">por US$</SelectItem>
              <SelectItem value="real">por R$</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FieldError>{errors.accumulationFactor}</FieldError>
      </Field>
      <Field data-invalid={!!errors.conversionRatio || undefined}>
        <FieldLabel htmlFor="manualConversion">Milhas por ponto</FieldLabel>
        <Input
          id="manualConversion"
          inputMode="decimal"
          value={form.conversionRatio}
          onChange={e => setField("conversionRatio")(e.target.value)}
          aria-invalid={!!errors.conversionRatio || undefined}
        />
        {errors.conversionRatio
          ? <FieldError>{errors.conversionRatio}</FieldError>
          : <FieldDescription>Na transferência 1:1, use 1.</FieldDescription>}
      </Field>
      <Field data-invalid={!!errors.annuity || undefined}>
        <FieldLabel htmlFor="manualAnnuity">Anuidade (por ano)</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>R$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="manualAnnuity"
            inputMode="decimal"
            value={form.annuity}
            onChange={e => setField("annuity")(e.target.value)}
            aria-invalid={!!errors.annuity || undefined}
          />
        </InputGroup>
        <FieldError>{errors.annuity}</FieldError>
      </Field>
    </FieldGroup>
  );
};

export default CardInputForm;
