import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Field, FieldLabel} from "@/components/ui/field";
import {SONGS} from "@/imports/api/songs/methods";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronDown} from "lucide-react";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";
import {DownloadButton} from "../../customComponents/DownLoadButton";

const searchFormSchema = z.object({
  trackID: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  hasComplaints: z.boolean().optional(),
  skipInSurvey: z.boolean().optional(),
});

export function SongSearchForm({onFilterChange, query}) {
  const {t} = useTranslation();
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      trackID: query?.trackID || "",
      artist: query?.artist || "",
      album: query?.album || "",
      hasComplaints: query?.hasComplaints || false,
      skipInSurvey: query?.skipInSurvey || false,
    },
  });

  useEffect(() => {
    if (query) {
      form.reset(query);
    }
  }, [query, form]);

  return (
    <Card>
      <Collapsible className="data-[state=open]:bg-muted" defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <CardHeader className="group">
            <CardTitle className="w-full flex items-center justify-between">
              {t("Collections.songs")}
              <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <form onSubmit={form.handleSubmit(onFilterChange)} className="grid grid-cols-3 gap-4">
              <AutoField
                className="col-span-1"
                form={form}
                name="trackID"
                label={t("Collections.Songs.trackID")}
                type="input"
              />
              <AutoField
                className="col-span-1"
                form={form}
                name="artist"
                label={t("Collections.Songs.artist")}
                type="input"
              />
              <AutoField className="col-span-1" form={form} name="album" label={t("Collections.Songs.album")} type="input" />
              <AutoField
                className="col-span-1"
                form={form}
                name="hasComplaints"
                label={t("Collections.Songs.hasComplaints")}
                type="bool"
              />
              <AutoField
                className="col-span-1"
                form={form}
                name="skipInSurvey"
                label={t("Collections.Songs.skipInSurvey")}
                type="bool"
              />

              <Field className="col-span-1">
                <FieldLabel>{t("Components.SongSearchForm.downloadComplaints")}</FieldLabel>
                <div>
                  <DownloadButton downloadMethod={SONGS.downloadComplaintsCSV} downloadFilename="complaints.csv" />
                </div>
              </Field>
              <div className="col-span-3 flex justify-end">
                <Button type="submit">{t("Common.submit")}</Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
