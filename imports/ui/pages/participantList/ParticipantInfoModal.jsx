import {Button} from "@/components/ui/button";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useParticipantSingle} from "@/imports/api/participants/hooks";
import {PARTICIPANTS} from "@/imports/api/participants/methods";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

export function ParticipantInfoModal({participantID, setDialogOpen}) {
  const {participant, isLoading: isParticipantLoading} = useParticipantSingle(participantID);
  const {t} = useTranslation();

  const onRemoveClick = async () => {
    try {
      await PARTICIPANTS.removeParticipant.callAsync({participantID});
      setDialogOpen(false);
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  };

  if (isParticipantLoading || !participantID) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-start">{t("Common.loading")}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Spinner />
      </DialogContent>
    );
  }

  const participantInfoFields = [
    {field: t("Collections.DBMetaData._id"), value: participant._id},
    {field: t("Collections.DBMetaData.createDate"), value: participant.createDate},
    {field: t("Collections.DBMetaData.editDate"), value: participant.editDate},
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
      <DialogFooter>
        <div className="w-full grid grid-cols-3">
          <div className="col-span-2" />
          <div className="col-span-1">
            <Button variant={"destructive"} onClick={onRemoveClick} type="button">
              {t("Common.remove")}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
