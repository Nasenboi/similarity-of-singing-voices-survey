import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {useTranslation} from "react-i18next";

export function InfoTable({className, fields}) {
  const {t} = useTranslation();

  if (!fields) {
    return;
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Components.InfoTable.field")}</TableHead>
          <TableHead>{t("Components.InfoTable.value")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((row) => (
          <TableRow key={`info_${row.field}`}>
            <TableCell>{row.field}</TableCell>
            <TableCell>{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
