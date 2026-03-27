import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Slider} from "@/imports/ui/customComponents/slider";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {cookies} from "./Cookies";
import {P} from "./Typography";

function TooltipWrapper({children}) {
  const {t} = useTranslation();
  const [tooltipOpen, setTooltipOpen] = React.useState(() => {
    return !cookies.get("flagsTooltipRead");
  });

  const dismissTooltip = () => {
    cookies.set("flagsTooltipRead", true);
    setTooltipOpen(false);
  };

  return (
    <Tooltip open={tooltipOpen}>
      <TooltipContent side="top" className="m-4" sideOffset="0">
        <div className="flex flex-col space-y-4 p-2 justify-center items-center">
          <P>{t("Tooltips.settings")}</P>
          <div className="w-full flex justify-end items-center">
            <Button size="sm" onClick={dismissTooltip}>
              {t("Tooltips.dismiss")}
            </Button>
          </div>
        </div>
      </TooltipContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
    </Tooltip>
  );
}

function Marker({index, position, onValueChange}) {
  const baseMarker = (
    <div className="absolute h-full top-0 py-2 flex flex-col items-start justify-center" style={{left: `${position}%`}}>
      <Button size="sm" className="rounded-l-none" onClick={() => onValueChange([position])}>
        {index + 1}
      </Button>
      <div className="h-full border w-0 border-accent-foreground" />
    </div>
  );

  return index === 0 ? <TooltipWrapper>{baseMarker}</TooltipWrapper> : baseMarker;
}

export function MarkerSlider({className, duration, markerPoints, onValueChange, ...sliderProps}) {
  const calcMarkerPointPosition = (value) => {
    if (!value || !duration) {
      return;
    }
    return (100 * value) / duration;
  };

  return (
    <div className={`relative ${className} size-full flex items-center justify-center`}>
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
