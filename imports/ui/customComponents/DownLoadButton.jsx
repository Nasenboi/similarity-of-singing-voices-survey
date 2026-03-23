import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import React from "react";

export function DownloadButton({method, filename}) {
  const onDownloadClick = async () => {
    try {
      const csv = await method();

      const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    } catch (er) {
      if (err) return console.error(err);
    }
  };

  return (
    <Button onClick={onDownloadClick}>
      <Download />
    </Button>
  );
}
