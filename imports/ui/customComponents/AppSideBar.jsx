import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import React from "react";
import {useTranslation} from "react-i18next";
import {BackgroundMusicToggle} from "./BackgroundMusicToggle";
import {JumpToFirstOnsetToggle} from "./JumpToFirstOnsetToggle";
import {LanguageToggle} from "./LanguageToggle";
import {LoginButton} from "./LoginButton";
import {NavigationArea} from "./NavigationArea";
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Sidebar.settings")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ThemeToggle />
              <LanguageToggle />
              <BackgroundMusicToggle />
              <JumpToFirstOnsetToggle />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavigationArea />
        <SidebarGroup>
          <LoginButton />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
