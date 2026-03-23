import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {useTranslation} from "react-i18next";

export function DataTable({columns, data, onNext, onPrevious, hasNext, hasPrevious, onRowCLick, setRowColor, DownloadBtn}) {
  const {t} = useTranslation();

  return (
    <div>
      <div className="size-full p-4 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={`c_${c.accessorKey}`}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row) => {
                const rowColor = setRowColor?.(row);
                console.log(rowColor);
                return (
                  <TableRow key={row._id} onClick={() => onRowCLick(row)}>
                    {columns.map((c) => (
                      <TableCell key={`c_${c.accessorKey}_${row._id}`} className={rowColor && `border-y ${rowColor}`}>
                        {String(row[c.accessorKey])}
                      </TableCell>
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
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={!hasPrevious}>
          {t("Common.previous")}
        </Button>
        <DownloadBtn />
        <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
          {t("Common.next")}
        </Button>
      </div>
    </div>
  );
}
