import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSurveyQuestionsSingle} from "@/imports/api/surveyQuestions/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

export function SurveyQuestionInfoModal({surveyQuestionID}) {
  const {surveyQuestion, isLoading: isSurveyQuestionLoading} = useSurveyQuestionsSingle(surveyQuestionID);
  const {t} = useTranslation();

  if (isSurveyQuestionLoading || !surveyQuestionID) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="w-full flex items-center justify-start">{t("Common.loading")}</DialogTitle>
        </DialogHeader>
        <Spinner />
      </DialogContent>
    );
  }

  const surveyQuestionInfoFields = [
    {field: t("Collections.DBMetaData.itemNumber"), value: surveyQuestion.itemNumber},
    {field: t("Collections.SurveyQuestions.questionnaireID"), value: surveyQuestion.questionnaireID},
    {field: t("Collections.SurveyQuestions.questionNumber"), value: surveyQuestion.questionNumber},
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">
          {t("Collections.SurveyQuestions.question")} {surveyQuestion.itemNumber}
        </DialogTitle>
      </DialogHeader>
      <InfoTable className="w-full" fields={surveyQuestionInfoFields} />
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
