import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import {cn} from "../../../lib/utils";

export const Slider = React.forwardRef(
  (
    {className, showTicks = false, showLabels = false, orientation = "horizontal", min = 0, max = 100, step = 1, ...props},
    ref,
  ) => {
    const vertical = orientation === "vertical";

    const ticks = React.useMemo(() => {
      if (!showTicks && !showLabels) return [];

      const result = [];
      for (let value = min; value <= max; value += step) {
        result.push(value);
      }

      return result;
    }, [min, max, step, showTicks, showLabels]);

    return (
      <SliderPrimitive.Root
        ref={ref}
        orientation={orientation}
        min={min}
        max={max}
        step={step}
        className={cn(
          "relative flex touch-none select-none",
          vertical ? "h-full w-8 flex-col items-center" : "w-full items-center -my-4 py-4",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative overflow-hidden rounded-full bg-primary/20",
            vertical ? "h-full w-1.5" : "h-1.5 w-full grow",
          )}
        >
          <SliderPrimitive.Range className={cn("absolute bg-primary", vertical ? "bottom-0 w-full" : "left-0 h-full")} />

          {(showTicks || showLabels) &&
            ticks.map((tick) => {
              const pct = ((tick - min) / (max - min)) * 100;

              return (
                <div
                  key={tick}
                  className={cn(
                    "absolute",
                    vertical
                      ? "left-full ml-2 -translate-y-1/2 flex items-center gap-2"
                      : "top-full mt-2 -translate-x-1/2 flex flex-col items-center",
                  )}
                  style={vertical ? {bottom: `${pct}%`} : {left: `${pct}%`}}
                >
                  {showTicks && <div className={cn("bg-muted-foreground", vertical ? "h-px w-2" : "h-2 w-px")} />}

                  {showLabels && <span className="text-xs text-muted-foreground">{tick}</span>}
                </div>
              );
            })}
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = "Slider";
