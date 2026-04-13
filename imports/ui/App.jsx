import {SidebarProvider} from "@/components/ui/sidebar";
import React from "react";
import {BrowserRouter} from "react-router-dom";
import {AudioProvider} from "./contextProvider/AudioContext";
import {ParticipantProvider} from "./contextProvider/ParticipantContext";
import {ThemeProvider} from "./contextProvider/ThemeProvider";
import {AppSideBar} from "./customComponents/AppSideBar";
import {GlobalKeyEvents} from "./customComponents/GlobalKeyEvents";
import {SideBarToggle} from "./customComponents/SideBarToggle";
import {RoutedContentArea} from "./RoutedContentArea";

export const App = () => {
  return (
    <div className="min-w-screen min-h-screen max-h-screen mx-auto flex-col justify-center bg-background">
      <SidebarProvider defaultOpen={false}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AudioProvider>
            <ParticipantProvider>
              <GlobalKeyEvents>
                <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
                  <SideBarToggle />
                  <AppSideBar />
                  <RoutedContentArea />
                </BrowserRouter>
              </GlobalKeyEvents>
            </ParticipantProvider>
          </AudioProvider>
        </ThemeProvider>
      </SidebarProvider>
    </div>
  );
};
