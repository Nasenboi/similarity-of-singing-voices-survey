import {Button} from "@/components/ui/button";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {zodResolver} from "@hookform/resolvers/zod";
import React from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import * as z from "zod";
import {SONGS} from "../../../api/songs/methods";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AutoField} from "../../customComponents/AutoField";

const audioOptions = ["A", "B", "X"];

const complaintForm = z.object({
  notVoiced: z.boolean().optional(),
  multipleVoices: z.boolean().optional(),
  badVoiceQuality: z.boolean().optional(),
  message: z.string().min(5).optional(),
  song: z.enum(audioOptions),
});

export function ComplaintForm({surveyQuestion}) {
  const {participant, isLoading: isParticipantLoading} = useParticipantContext();
  const {t} = useTranslation();
  const form = useForm({
    resolver: zodResolver(complaintForm),
    defaultValues: {
      song: audioOptions[0],
      message: "",
      notVoiced: false,
      multipleVoices: false,
      badVoiceQuality: false,
    },
  });

  const onSubmit = async (values) => {
    await SONGS.addComplaint.callAsync({
      trackID: surveyQuestion[values.song],
      participantID: participant.participantID,
      complaint: {...values, song: null},
    });
  };

  if (isParticipantLoading || !surveyQuestion) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-start">{t("Common.loading")}</DialogTitle>
        </DialogHeader>
        <Spinner />
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">{t("SurveyPage.ComplaintForm.title")}</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full grid grid-cols-3 gap-4">
          <AutoField
            className="col-span-1"
            form={form}
            name="song"
            label={t("Collections.Songs.song")}
            type="select"
            fieldProps={{allowedValues: audioOptions}}
          />
          <div className="col-span-2" />
          <AutoField
            className="col-span-1"
            form={form}
            name="notVoiced"
            label={t("SurveyPage.ComplaintForm.notVoiced")}
            type="bool"
          />
          <AutoField
            className="col-span-1"
            form={form}
            name="multipleVoices"
            label={t("SurveyPage.ComplaintForm.multipleVoices")}
            type="bool"
          />
          <AutoField
            className="col-span-1"
            form={form}
            name="badVoiceQuality"
            label={t("SurveyPage.ComplaintForm.badVoiceQuality")}
            type="bool"
          />
          <AutoField
            className="col-span-3"
            form={form}
            name="message"
            label={t("SurveyPage.ComplaintForm.message")}
            type="text"
          />
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
