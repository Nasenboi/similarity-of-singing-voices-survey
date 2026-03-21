import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import React from "react";
import {FieldWrapper} from "./FieldWrapper";
import {NumberInput} from "./NumberInput";

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
  return (
    <FieldWrapper
      className={className}
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
