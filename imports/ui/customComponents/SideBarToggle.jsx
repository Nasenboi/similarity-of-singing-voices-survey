import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ArrowLeft, Settings} from "lucide-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {cookies} from "./Cookies";
import {P} from "./Typography";

export function SideBarToggle() {
  const {open, toggleSidebar} = useSidebar();
  const {t} = useTranslation();
  const [tooltipOpen, setTooltipOpen] = useState(() => {
    return !cookies.get("settingsTooltipRead");
  });

  const dismissTooltip = () => {
    cookies.set("settingsTooltipRead", true);
    setTooltipOpen(false);
  };

  return (
    <div className="fixed md:top-4 md:left-4 top-1 left-1 z-50">
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={() => {
              dismissTooltip();
              toggleSidebar();
            }}
          >
            {open ? <ArrowLeft /> : <Settings />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-screen" sideOffset={0}>
          <div className="flex flex-col space-y-4 p-2 justify-center items-center">
            <P>{t("Tooltips.settings")}</P>
            <div className="w-full flex justify-end items-center">
              <Button size="sm" onClick={dismissTooltip}>
                {t("Tooltips.dismiss")}
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
