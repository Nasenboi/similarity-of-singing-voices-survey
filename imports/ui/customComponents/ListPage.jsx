import {Dialog} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import React from "react";
import {AudioPlayer} from "./AudioPlayer";

export function ListPage({children, className, dialogOpen, onDialogOpen}) {
  return (
    <div className={cn("w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center", className)}>
      <div className="w-full flex flex-col justify-between items-center">
        <Dialog open={dialogOpen} onOpenChange={(open) => onDialogOpen(open)}>
          <div className="py-4">{children}</div>
          <AudioPlayer />
        </Dialog>
      </div>
    </div>
  );
}
