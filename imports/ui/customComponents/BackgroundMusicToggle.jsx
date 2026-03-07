import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Guitar, Speech} from "lucide-react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../contextProvider/AudioContext";

// ToDo: maybe rename background music to instrument, or not
export function BackgroundMusicToggle() {
  const {t} = useTranslation();
  const {useBackgroundMusic, setUseBackgroundMusic} = useAudioContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-l m-2 font-bold">{t("Sidebar.backgroundMusic")}</h1>
          <Button size="icon">{useBackgroundMusic ? <Guitar /> : <Speech />}</Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setUseBackgroundMusic(true)}>
          <Guitar />
          An
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setUseBackgroundMusic(false)}>
          <Speech />
          Aus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
