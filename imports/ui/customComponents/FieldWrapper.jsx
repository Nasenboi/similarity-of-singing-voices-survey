import {Field, FieldDescription, FieldError, FieldLabel} from "@/components/ui/field";
import React from "react";
import {Controller} from "react-hook-form";

/**
 *
 * @param {Object} customField
 * @param {Object} customFieldState
 * @returns
 */
export const FieldWrapper = ({
  form,
  customField,
  customFieldState,
  name,
  label,
  className,
  description,
  orientation,
  children,
}) => {
  if (form) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({field, fieldState}) => (
          <Field data-invalid={fieldState.invalid} className={className} orientation={orientation}>
            {label && orientation !== "horizontal" && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            {children({field, fieldState})}
            {label && orientation === "horizontal" && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  } else {
    return (
      <Field data-invalid={customFieldState.invalid} className={className} orientation={orientation}>
        {label && orientation !== "horizontal" && <FieldLabel htmlFor={customField.name}>{label}</FieldLabel>}
        {children({field: customField, fieldState: customFieldState})}
        {label && orientation === "horizontal" && <FieldLabel htmlFor={customField.name}>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
    );
  }
};
