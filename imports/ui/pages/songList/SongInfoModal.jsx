import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Field, FieldLabel} from "@/components/ui/field";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Spinner} from "@/components/ui/spinner";
import {Textarea} from "@/components/ui/textarea";
import {useSongsSingle} from "@/imports/api/songs/hooks";
import {SONGS} from "@/imports/api/songs/methods";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

function SongComplaint({complaint}) {
  const {t} = useTranslation();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{`${t("Collections.Participants.participant")} ${complaint.participantID}`}</CardTitle>
      </CardHeader>
      <CardContent className="w-full grid grid-cols-3 gap-4">
        <Field className="col-span-1 flex flex-row justify-center items-center">
          <FieldLabel>{t("SurveyPage.ComplaintForm.notVoiced")}</FieldLabel>
          <div>
            <Checkbox checked={complaint.notVoiced} disabled />
          </div>
        </Field>
        <Field className="col-span-1 flex flex-row justify-center items-center">
          <FieldLabel>{t("SurveyPage.ComplaintForm.multipleVoices")}</FieldLabel>
          <div>
            <Checkbox checked={complaint.multipleVoices} disabled />
          </div>
        </Field>
        <Field className="col-span-1 flex flex-row justify-center items-center">
          <FieldLabel>{t("SurveyPage.ComplaintForm.badVoiceQuality")}</FieldLabel>
          <div>
            <Checkbox checked={complaint.badVoiceQuality} disabled />
          </div>
        </Field>
        <Field className="col-span-3 flex flex-row justify-center items-center">
          <FieldLabel>{t("SurveyPage.ComplaintForm.badVoiceQuality")}</FieldLabel>
          <Textarea value={complaint.message} disabled />
        </Field>
      </CardContent>
    </Card>
  );
}

export function SongInfoModal({trackID}) {
  const {song, isLoading: isSongLoading} = useSongsSingle(trackID);
  const {t} = useTranslation();

  if (isSongLoading || !trackID || !song) {
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

  const onSkipButtonClick = async () => {
    try {
      await SONGS.toggleSkip.callAsync({
        trackID,
        skipInSurvey: !song.skipInSurvey,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">
          {t("Collections.Songs.song")} {song.trackID}
        </DialogTitle>
      </DialogHeader>
      <div className="max-h-full">
        <InfoTable className="w-full h-full" fields={songInfoFields} />
        {song.complaints && (
          <>
            <h1>{t("Collections.Songs.complaints")}</h1>
            <ScrollArea className="w-full h-full max-h-[40vh] -pb-4">
              {song.complaints?.map((complaint, idx) => (
                <SongComplaint key={`sc_${idx}`} complaint={complaint} />
              ))}
            </ScrollArea>
          </>
        )}
      </div>
      <DialogFooter>
        <Button variant={song.skipInSurvey ? "secondary" : "destructive"} onClick={onSkipButtonClick} type="button">
          {song.skipInSurvey ? t("SongInfoModal.skipInSurveyFalse") : t("SongInfoModal.skipInSurveyTrue")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
