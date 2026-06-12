import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import {cn} from "../../../lib/utils";

export const Slider = React.forwardRef(({className, showTicks = false, showLabels = false, ...props}, ref) => {
  const {min = 0, max = 100, step = 1} = props;

  const ticks = React.useMemo(() => {
    if (!showTicks && !showLabels) return [];
    const result = [];
    for (let v = min; v <= max; v += step) result.push(v);
    return result;
  }, [min, max, step, showTicks, showLabels]);

  return (
    <div className="w-full">
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", "-my-4 py-4", className)}
        min={min}
        max={max}
        step={step}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
          {(showTicks || showLabels) && (
            <div className="relative w-full top-0">
              {ticks.map((tick) => {
                const pct = ((tick - min) / (max - min)) * 100;
                return (
                  <div key={tick} className="absolute flex flex-col items-center -translate-x-1/2" style={{left: `${pct}%`}}>
                    {showTicks && <div className="w-px h-1.5 bg-primary/40" />}
                    {showLabels && <span className="text-[10px] text-muted-foreground mt-0.5">{tick}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  );
});
