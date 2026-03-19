import {Sidebar, SidebarContent, SidebarGroup, SidebarHeader} from "@/components/ui/sidebar";
import React from "react";
import {useTranslation} from "react-i18next";
import {BackgroundMusicToggle} from "./BackgroundMusicToggle";
import {LanguageToggle} from "./LanguageToggle";
import {LoginButton} from "./LoginButton";
import {ThemeToggle} from "./ThemeToggle";

// ToDo: add translations for toggle buttons
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
      <SidebarContent className="w-full px-8 h-full flex justify-between">
        <SidebarGroup className="w-full flex items-center space-y-4">
          <ThemeToggle />
          <LanguageToggle />
          <BackgroundMusicToggle />
        </SidebarGroup>
        <SidebarGroup className="w-full flex items-center space-y-4">
          <LoginButton />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
