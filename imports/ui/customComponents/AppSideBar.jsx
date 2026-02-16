import {Sidebar, SidebarContent, SidebarGroup, SidebarHeader} from "@/components/ui/sidebar";
import React from "react";
import {useTranslation} from "react-i18next";
import {LanguageToggle} from "./LanguageToggle";
import {ThemeToggle} from "./ThemeToggle";

export function AppSideBar() {
  const {t} = useTranslation();

  return (
    <Sidebar className="z-40">
      <SidebarHeader className="border-b-2">
        <div className="m-2 md:ml-16">
          <h1 className="text-2xl font-semibold leading-none tracking-tight text-center justify-center m-2">
            {t("Sidebar.settings")}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full px-8">
        <SidebarGroup className="w-full flex items-center space-y-4">
          <ThemeToggle />
          <LanguageToggle />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
