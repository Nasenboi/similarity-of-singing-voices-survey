import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {cn} from "@/lib/utils";
import {ChevronDown} from "lucide-react";
import React from "react";
import {useTranslation} from "react-i18next";

export function SearchForm({children, className, title, form, onFilterChange}) {
  const {t} = useTranslation();

  return (
    <Card className={cn("sticky top-0 z-30 rounded-b-none", className)}>
      <Collapsible className="data-[state=open]:bg-muted" defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <CardHeader className="group">
            <CardTitle className="w-full flex items-center justify-between">
              {title}
              <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <form onSubmit={form.handleSubmit(onFilterChange)}>
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">{children}</div>
              <div className="w-full flex justify-end pt-2">
                <Button type="submit">{t("Common.submit")}</Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
