import {Kbd, KbdGroup} from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import {useTranslation} from "react-i18next";
import {BackgroundMusicToggle} from "./BackgroundMusicToggle";
import {JumpToFirstOnsetToggle} from "./JumpToFirstOnsetToggle";
import {LanguageToggle} from "./LanguageToggle";
import {LoginButton} from "./LoginButton";
import {NavigationArea} from "./NavigationArea";
import {ThemeToggle} from "./ThemeToggle";

function ControlsKey({name, children}) {
  return (
    <SidebarMenuItem className="grid grid-cols-3 gap-1 mx-1">
      <div className="col-span-2 flex justify-start items-center">{name}</div>
      <div className="col-span-1 flex justify-start items-center">{children}</div>
    </SidebarMenuItem>
  );
}

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
          <SidebarGroupLabel>{t("Sidebar.controls")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ControlsKey name={t("Sidebar.Controls.settings")}>
                <Kbd>Esc</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.navigate")}>
                <Kbd>{"<"}</Kbd>, <Kbd>{">"}</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.toggle")}>
                <Kbd>T</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.submit")}>
                <Kbd>↵</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.playPause")}>
                <Kbd>␣</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.playX")}>
                <Kbd>1</Kbd>, <Kbd>X</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.playA")}>
                <Kbd>2</Kbd>, <Kbd>A</Kbd>
              </ControlsKey>
              <ControlsKey name={t("Sidebar.Controls.playB")}>
                <Kbd>3</Kbd>, <Kbd>B</Kbd>
              </ControlsKey>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <LoginButton />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
