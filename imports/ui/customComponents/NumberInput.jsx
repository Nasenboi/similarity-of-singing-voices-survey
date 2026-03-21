import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ChevronDown, ChevronUp} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {NumericFormat} from "react-number-format";

export const NumberInput = forwardRef(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      min = -Infinity,
      max = Infinity,
      onValueChange, // optional external callback
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      prefix,
      value, // from RHF
      onChange, // from RHF
      onBlur, // from RHF
      ...props
    },
    ref,
  ) => {
    const handleChange = (values) => {
      const newValue = values.floatValue === undefined ? undefined : values.floatValue;
      // Update RHF
      if (onChange) onChange(newValue);
      // Call external callback if provided
      if (onValueChange) onValueChange(newValue);
    };

    const handleIncrement = useCallback(() => {
      const step = stepper ?? 1;
      const newValue = value === undefined ? step : Math.min(value + step, max);
      if (onChange) onChange(newValue);
    }, [stepper, max, value, onChange]);

    const handleDecrement = useCallback(() => {
      const step = stepper ?? 1;
      const newValue = value === undefined ? -step : Math.max(value - step, min);
      if (onChange) onChange(newValue);
    }, [stepper, min, value, onChange]);

    const handleBlur = () => {
      let clamped = value;
      if (value !== undefined) {
        if (value < min) clamped = min;
        else if (value > max) clamped = max;
      }
      if (clamped !== value && onChange) {
        onChange(clamped);
      }
      // Always call RHF onBlur
      if (onBlur) onBlur();
    };

    return (
      <div className="flex items-center">
        <NumericFormat
          value={value}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          valueIsNumericString
          onBlur={handleBlur}
          max={max}
          min={min}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-r-none relative"
          getInputRef={ref}
          {...props}
        />
        <div className="flex flex-col">
          <Button
            aria-label="Increase value"
            className="px-2 h-5 rounded-l-none rounded-br-none border-input border-l-0 border-b-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleIncrement}
            disabled={value === max}
            type="button"
          >
            <ChevronUp size={15} />
          </Button>
          <Button
            aria-label="Decrease value"
            className="px-2 h-5 rounded-l-none rounded-tr-none border-input border-l-0 border-t-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleDecrement}
            disabled={value === min}
            type="button"
          >
            <ChevronDown size={15} />
          </Button>
        </div>
      </div>
    );
  },
);
