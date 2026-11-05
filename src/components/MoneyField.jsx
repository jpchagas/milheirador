import React from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { parseNumber } from "@/utils/format";

// A R$ amount typed as text (parsed with parseNumber); anything not above zero shows `error`.
// An `optional` field may be blank or zero instead.
const MoneyField = ({ id, label, value, onChange, description, error, optional = false, placeholder }) => {
  const invalid = optional ? !(value.trim() === "" || parseNumber(value) >= 0) : !(parseNumber(value) > 0);
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
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
        />
      </InputGroup>
      {invalid ? <FieldError>{error}</FieldError> : description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
};

export default MoneyField;
