import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";
import {SearchForm} from "../../customComponents/SearchForm";

const searchFormSchema = z.object({
  trackID: z.string().optional(),
  artist: z.string().optional(),
  genre: z.string().optional(),
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
      genre: query?.genre || "",
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
    <SearchForm title={t("Collections.songs")} form={form} onFilterChange={onFilterChange}>
      <AutoField className="col-span-1" form={form} name="trackID" label={t("Collections.Songs.trackID")} type="input" />
      <AutoField className="col-span-1" form={form} name="artist" label={t("Collections.Songs.artist")} type="input" />
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
        label={t("Collections.Songs.skippedInSurvey")}
        type="bool"
      />
    </SearchForm>
  );
}
