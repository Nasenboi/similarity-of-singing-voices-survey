import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ArrowDownNarrowWide, SkipForward} from "lucide-react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../contextProvider/AudioContext";

// ToDo: maybe rename background music to instrument, or not
export function JumpToFirstOnsetToggle() {
  const {t} = useTranslation();
  const {jumpToFirstOnset, setJumpToFirstOnset} = useAudioContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-l m-2 font-bold">{t("Sidebar.skipSilence")}</h1>
          <Button size="icon">{jumpToFirstOnset ? <SkipForward /> : <ArrowDownNarrowWide />}</Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setJumpToFirstOnset(true)}>
          <SkipForward />
          {t("Common.yes")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setJumpToFirstOnset(false)}>
          <ArrowDownNarrowWide />
          {t("Common.no")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
