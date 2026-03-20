import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {SidebarMenuAction, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {Languages} from "lucide-react";
import React from "react";
import {useTranslation} from "react-i18next";
import i18n from "../utils/LanguageSettings";
import {cookies} from "./Cookies";

export function LanguageToggle() {
  const {t} = useTranslation();

  const changeLanguage = (lng) => {
    cookies.set("language", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <span>{t("Sidebar.language")}</span>
          </SidebarMenuButton>
          <SidebarMenuAction>
            <Languages />
          </SidebarMenuAction>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("de")}>Deutsch</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
