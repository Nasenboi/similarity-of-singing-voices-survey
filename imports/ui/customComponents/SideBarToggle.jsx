import {Button} from "@/components/ui/button";
import {useSidebar} from "@/components/ui/sidebar";
import {ArrowLeft, Settings} from "lucide-react";
import React from "react";

export function SideBarToggle() {
  const {open, toggleSidebar} = useSidebar();

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button size="icon" onClick={toggleSidebar}>
        {open ? <ArrowLeft /> : <Settings />}
      </Button>
    </div>
  );
}
