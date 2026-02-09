import {SidebarProvider, useSidebar} from "@/components/ui/sidebar";
import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import {AudioProvider} from "./contextProvider/AudioContext";
import {ThemeProvider} from "./contextProvider/ThemeProvider";
import {AppSideBar} from "./customComponents/AppSideBar";
import {SideBarToggle} from "./customComponents/SideBarToggle";
import {RoutedContentArea} from "./RoutedContentArea";

export const App = () => {
  return (
    <div className="min-w-screen min-h-screen max-h-screen mx-auto flex-col justify-center bg-background">
      <SidebarProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AudioProvider>
            <BrowserRouter>
              <SideBarToggle />
              <AppSideBar />
              <RoutedContentArea />
            </BrowserRouter>
          </AudioProvider>
        </ThemeProvider>
      </SidebarProvider>
    </div>
  );
};
