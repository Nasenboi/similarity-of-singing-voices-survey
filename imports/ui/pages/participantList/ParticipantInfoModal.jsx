import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useParticipantSingle} from "@/imports/api/participants/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

export function ParticipantInfoModal({participantID}) {
  const {participant, isLoading: isParticipantLoading} = useParticipantSingle(participantID);
  const {t} = useTranslation();

  if (isParticipantLoading || !participantID) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-start">{t("Common.loading")}</DialogTitle>
        </DialogHeader>
        <Spinner />
      </DialogContent>
    );
  }

  const participantInfoFields = [
    {field: t("Collections.DBMetaData.itemNumber"), value: participant.itemNumber},
    {field: t("Collections.DBMetaData.createDate"), value: participant.createDate},
    {field: t("Collections.DBMetaData.editDate"), value: participant.editDate},
    {field: t("Collections.Participants.participantID"), value: participant._id},
    {field: t("Collections.Participants.surveyCompleted"), value: participant.surveyCompleted},
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">
          {t("Collections.Participants.participant")} {participant.itemNumber}
        </DialogTitle>
      </DialogHeader>
      <InfoTable className="w-full" fields={participantInfoFields} />
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
