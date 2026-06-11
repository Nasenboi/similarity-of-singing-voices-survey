import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import React from "react";
import {FieldWrapper} from "./FieldWrapper";
import {NumberInput} from "./NumberInput";
import {Slider} from "./slider";

/**
 *
 * @param {List} fieldProps.allowedValues => can be either a list of strings or a list of objects {value: string, label: strig}
 * @returns
 */
export function AutoField({
  type,
  form,
  name,
  label,
  className,
  description,
  orientation,
  fieldProps,
  customField,
  customFieldState,
  autoComplete = "off",
}) {
  const minWidths = {
    input: "min-w-40",
    text: "min-w-40",
    password: "min-w-40",
    number: "min-w-40",
    bool: "min-w-30",
    slider: "min-w-40",
    select: "min-w-40",
  };

  return (
    <FieldWrapper
      className={cn(minWidths[type], className)}
      form={form}
      name={name}
      label={label}
      description={description}
      orientation={orientation}
      customField={customField}
      customFieldState={customFieldState}
    >
      {({field, fieldState}) => {
        switch (type) {
          case "input":
            return <Input {...field} autoComplete={autoComplete} id={field.name} aria-invalid={fieldState.invalid} />;
          case "text":
            return <Textarea {...field} autoComplete={autoComplete} id={field.name} aria-invalid={fieldState.invalid} />;
          case "password":
            return (
              <PasswordInput {...field} autoComplete={autoComplete} id={field.name} aria-invalid={fieldState.invalid} />
            );
          case "number":
            return <NumberInput {...field} autoComplete={autoComplete} id={field.name} aria-invalid={fieldState.invalid} />;
          case "bool":
            return (
              <div>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </div>
            );
          case "slider":
          case "slider":
            return (
              <Slider
                value={field.value !== undefined ? [field.value] : [fieldProps?.min ?? 0]}
                onValueChange={(vals) => field.onChange(vals[0])}
                onValueCommit={(vals) => field.onChange(vals[0])}
                min={fieldProps?.min ?? 0}
                max={fieldProps?.max ?? 100}
                step={fieldProps?.step ?? 1}
                disabled={fieldProps?.disabled}
                name={field.name}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
            );
          case "select":
            return (
              <Select
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
                aria-invalid={fieldState.invalid}
                autoComplete={autoComplete}
              >
                <SelectTrigger ref={field.ref}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full max-h-50">
                  <SelectGroup>
                    {fieldProps.allowedValues?.map((x) => {
                      const value = typeof x === "string" || typeof x === "number" ? x : x.value;
                      const label = typeof x === "string" || typeof x === "number" ? x : x.label;

                      return (
                        <SelectItem key={`${name}.${value}`} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
        }
      }}
    </FieldWrapper>
  );
}
