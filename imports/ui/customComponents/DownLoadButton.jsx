import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {Meteor} from "meteor/meteor";
import React from "react";

export function DownloadButton({downloadMethod, downloadFilename}) {
  const onDownloadClick = async () => {
    try {
      const csv = await downloadMethod.callAsync({});

      const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      if (error) return console.error(error);
    }
  };

  return (
    <Button onClick={onDownloadClick} type="Button" size="sm">
      <Download />
    </Button>
  );
}
