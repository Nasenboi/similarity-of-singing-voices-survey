import {Sidebar, SidebarContent, SidebarGroup, SidebarHeader} from "@/components/ui/sidebar";
import React from "react";
import {ThemeToggle} from "./ThemeToggle";

export function AppSideBar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="m-2 mt-16">
          <h1 className="text-2xl font-semibold leading-none tracking-tight text-center justify-center m-2">Settings</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full">
        <SidebarGroup className="w-full flex items-center">
          <ThemeToggle />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
