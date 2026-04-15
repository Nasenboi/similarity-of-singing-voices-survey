import {SidebarProvider} from "@/components/ui/sidebar";
import React, {Suspense, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import {AudioProvider} from "./contextProvider/AudioContext";
import {MobileProvider} from "./contextProvider/MobileContext";
import {ParticipantProvider} from "./contextProvider/ParticipantContext";
import {ThemeProvider} from "./contextProvider/ThemeProvider";
import {SideBarToggle} from "./customComponents/SideBarToggle";
import {RoutedContentArea} from "./RoutedContentArea";

const DeferredAppSideBar = React.lazy(() => import("./customComponents/AppSideBar"));

const DeferredGlobalKeyEvents = React.lazy(() => import("./customComponents/GlobalKeyEvents"));

function OptionalGlobalKeyEvents({children}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let timeoutID;
    let idleID;

    if (typeof window.requestIdleCallback === "function") {
      idleID = window.requestIdleCallback(() => setEnabled(true));
    } else {
      timeoutID = window.setTimeout(() => setEnabled(true), 250);
    }

    return () => {
      if (idleID) {
        window.cancelIdleCallback(idleID);
      }
      if (timeoutID) {
        window.clearTimeout(timeoutID);
      }
    };
  }, []);

  if (!enabled) return children;

  return (
    <Suspense fallback={children}>
      <DeferredGlobalKeyEvents>{children}</DeferredGlobalKeyEvents>
    </Suspense>
  );
}

function OptionalAppSideBar() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timeoutID = window.setTimeout(() => setEnabled(true), 250);
    return () => window.clearTimeout(timeoutID);
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <DeferredAppSideBar />
    </Suspense>
  );
}

export const App = () => {
  return (
    <div className="min-w-screen min-h-screen max-h-screen mx-auto flex-col justify-center bg-background">
      <MobileProvider>
        <SidebarProvider defaultOpen={false}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AudioProvider>
              <ParticipantProvider>
                <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
                  <OptionalGlobalKeyEvents>
                    <SideBarToggle />
                    <OptionalAppSideBar />
                    <RoutedContentArea />
                  </OptionalGlobalKeyEvents>
                </BrowserRouter>
              </ParticipantProvider>
            </AudioProvider>
          </ThemeProvider>
        </SidebarProvider>
      </MobileProvider>
    </div>
  );
};
