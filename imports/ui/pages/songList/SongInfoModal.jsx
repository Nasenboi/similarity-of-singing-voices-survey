import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSongsSingle} from "@/imports/api/songs/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

export function SongInfoModal({trackID}) {
  const {song, isLoading: isSongLoading} = useSongsSingle(trackID);
  const {t} = useTranslation();

  if (isSongLoading || !trackID) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-start">{t("Common.loading")}</DialogTitle>
        </DialogHeader>
        <Spinner />
      </DialogContent>
    );
  }

  const songInfoFields = [
    {field: t("Collections.DBMetaData.itemNumber"), value: song.itemNumber},
    {field: t("Collections.Songs.trackID"), value: song.trackID},
    {field: t("Collections.Songs.album"), value: song.album},
    {field: t("Collections.Songs.artist"), value: song.artist},
    {field: t("Collections.Songs.cluster"), value: song.cluster},
    {field: t("Collections.Songs.genre"), value: song.genre},
    {field: t("Collections.Songs.vocalContentLengthS"), value: song.vocalContentLengthS},
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">
          {t("Collections.Songs.song")} {song.trackID}
        </DialogTitle>
      </DialogHeader>
      <InfoTable className="w-full" fields={songInfoFields} />
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
