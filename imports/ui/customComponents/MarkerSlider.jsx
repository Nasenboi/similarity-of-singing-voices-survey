import {Button} from "@/components/ui/button";
import {Slider} from "@/imports/ui/customComponents/slider";
import React from "react";

function Marker({index, value, position, onValueChange}) {
  return (
    <div className="absolute h-full top-0 py-2 flex flex-col items-start justify-center " style={{left: `${position}%`}}>
      <Button size="sm" className="rounded-l-none" onClick={() => onValueChange([position])}>
        {index + 1}
      </Button>
      <div className="h-full border w-0 border-accent-foreground" />
    </div>
  );
}

export function MarkerSlider({className, duration, markerPoints, onValueChange, ...sliderProps}) {
  const calcMarkerPointPosition = (value) => {
    if (!value || !duration) {
      return;
    }
    return (100 * value) / duration;
  };

  return (
    <div className={`relative ${className} w-full h-full flex items-center justify-center`}>
      <Slider onValueChange={onValueChange} {...sliderProps} />

      {markerPoints?.map((m, i) => {
        const pos = calcMarkerPointPosition(m);
        if (!m || pos >= 95) {
          return;
        } else return <Marker key={`marker-${m}`} index={i} value={m} position={pos} onValueChange={onValueChange} />;
      })}
    </div>
  );
}
