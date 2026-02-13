import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
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
        <div className="w-full flex justify-between items-center">
          <h1 className="text-l m-2 font-bold">{t("Sidebar.language")}</h1>
          <Button size="icon">
            <Languages />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("de")}>Deutsch</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
