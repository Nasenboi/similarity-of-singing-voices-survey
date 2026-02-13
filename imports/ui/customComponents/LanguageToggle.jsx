import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Languages} from "lucide-react";
import React from "react";
import i18n from "../utils/LanguageSettings";
import {cookies} from "./Cookies";

export function LanguageToggle() {
  const changeLanguage = (lng) => {
    cookies.set("language", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-l m-2 font-bold">Language</h1>
          <Button size="icon">
            <Languages />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>EN</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("de")}>DE</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
