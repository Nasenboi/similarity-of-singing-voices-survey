import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {SidebarMenuAction, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
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
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <span>{t("Sidebar.skipSilence")}</span>
          </SidebarMenuButton>
          <SidebarMenuAction>{jumpToFirstOnset ? <SkipForward /> : <ArrowDownNarrowWide />}</SidebarMenuAction>
        </SidebarMenuItem>
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
