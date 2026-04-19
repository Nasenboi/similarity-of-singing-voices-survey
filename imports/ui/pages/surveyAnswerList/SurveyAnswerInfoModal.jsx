import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSurveyAnswersSingle} from "@/imports/api/surveyAnswers/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

export function SurveyAnswerInfoModal({surveyAnswerID}) {
  const {surveyAnswer, isLoading: isSurveyAnswerLoading} = useSurveyAnswersSingle(surveyAnswerID);
  const {t} = useTranslation();

  if (isSurveyAnswerLoading || !surveyAnswerID || !surveyAnswer) {
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

  const surveyAnswerInfoFields = [
    {field: t("Collections.DBMetaData.itemNumber"), value: surveyAnswer.itemNumber},
    {field: t("Collections.SurveyAnswers.participantID"), value: surveyAnswer.participantID},
    {field: t("Collections.SurveyAnswers.questionID"), value: surveyAnswer.questionID},
    {field: t("Collections.SurveyAnswers.answer"), value: surveyAnswer.answer},
    {field: t("Collections.DBMetaData.createDate"), value: surveyAnswer.createDate},
    {field: t("Collections.DBMetaData.editDate"), value: surveyAnswer.editDate},
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">
          {t("Collections.SurveyAnswers.answer")} {surveyAnswer._id}
        </DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <InfoTable className="w-full" fields={surveyAnswerInfoFields} />
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
