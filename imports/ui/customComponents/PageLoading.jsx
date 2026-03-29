import {Spinner} from "@/components/ui/spinner";
import React from "react";

export function PageLoading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Spinner className="w-40 h-40" />
    </div>
  );
}
