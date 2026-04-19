import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSurveyQuestionsSingle} from "@/imports/api/surveyQuestions/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {InfoTable} from "../../customComponents/InfoTable";

export function SurveyQuestionInfoModal({surveyQuestionID}) {
  const {surveyQuestion, isLoading: isSurveyQuestionLoading} = useSurveyQuestionsSingle(surveyQuestionID);
  const {t} = useTranslation();

  if (isSurveyQuestionLoading || !surveyQuestionID || !surveyQuestion) {
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

  const surveyQuestionInfoFields = [
    {field: t("Collections.DBMetaData._id"), value: surveyQuestion._id},
    {field: t("Collections.SurveyQuestions.questionnaireID"), value: surveyQuestion.questionnaireID},
    {field: t("Collections.SurveyQuestions.questionNumber"), value: surveyQuestion.questionNumber},
    {field: t("Collections.SurveyQuestions.X"), value: surveyQuestion.X},
    {field: t("Collections.SurveyQuestions.A"), value: surveyQuestion.A},
    {field: t("Collections.SurveyQuestions.B"), value: surveyQuestion.B},
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="w-full flex items-center justify-start">
          {t("Collections.SurveyQuestions.question")} {surveyQuestion.itemNumber}
        </DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <InfoTable className="w-full" fields={surveyQuestionInfoFields} />
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
