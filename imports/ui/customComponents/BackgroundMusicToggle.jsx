import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {SidebarMenuAction, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
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
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <span>{t("Sidebar.backgroundMusic")}</span>
          </SidebarMenuButton>
          <SidebarMenuAction>{useBackgroundMusic ? <Guitar /> : <Speech />}</SidebarMenuAction>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setUseBackgroundMusic(true)}>
          <Guitar />
          {t("Common.yes")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setUseBackgroundMusic(false)}>
          <Speech />
          {t("Common.no")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
