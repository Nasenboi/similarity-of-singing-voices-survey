import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {useTranslation} from "react-i18next";
import {DownloadButton} from "./DownloadButton";

export const getRowColorString = (color) => {
  return `bg-${color}-100 dark:bg-${color}-900 hover:bg-${color}-200 dark:hover:bg-${color}-800`;
};

export function DataTable({
  columns,
  data,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  onRowClick,
  setRowColor,
  downloadMethod,
  downloadFilename,
}) {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Table className="flex-1 min-h-0 overflow-auto">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            {columns.map((c) => (
              <TableHead key={`c_${c.accessorKey}`}>{c.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="flex-1 min-h-0 overflow-auto">
          {data.length ? (
            data.map((row) => {
              const rowColor = setRowColor?.(row);
              return (
                <TableRow key={row._id} onClick={() => onRowClick(row)} className={rowColor}>
                  {columns.map((c) => (
                    <TableCell key={`c_${c.accessorKey}_${row._id}`}>{String(row[c.accessorKey])}</TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("Common.noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end py-4 shrink-0">
        <ButtonGroup>
          <Button variant="outline" size="sm" onClick={onPrevious} disabled={!hasPrevious}>
            {t("Common.previous")}
          </Button>
          <ButtonGroupSeparator />
          {downloadFilename && (
            <>
              <DownloadButton
                variant="outline"
                size="sm"
                downloadFilename={downloadFilename}
                downloadMethod={downloadMethod}
              />
              <ButtonGroupSeparator />
            </>
          )}
          <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
            {t("Common.next")}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
