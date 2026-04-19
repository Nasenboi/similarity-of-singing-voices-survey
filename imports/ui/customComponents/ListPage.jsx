import {Dialog} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import React from "react";
import {AudioPlayer} from "./AudioPlayer";

export function ListPage({children, className, dialogOpen = null, onDialogOpen = null}) {
  return (
    <div className={cn("w-screen h-screen max-w-screen max-h-screen flex flex-col", className)}>
      <Dialog open={dialogOpen} onOpenChange={(open) => onDialogOpen(open)}>
        <div className="flex flex-col flex-1 min-h-0 p-4 md:px-20">{children}</div>
        <AudioPlayer />
      </Dialog>
    </div>
  );
}
