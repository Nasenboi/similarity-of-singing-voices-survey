import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {ArrowLeft, Settings} from "lucide-react";
import React from "react";

export function SideBarToggle() {
  const {open, toggleSidebar} = useSidebar();

  return (
    <div className="fixed md:top-4 md:left-4 top-1 left-1 z-50">
      <Button size="icon" onClick={toggleSidebar}>
        {open ? <ArrowLeft /> : <Settings />}
      </Button>
    </div>
  );
}
