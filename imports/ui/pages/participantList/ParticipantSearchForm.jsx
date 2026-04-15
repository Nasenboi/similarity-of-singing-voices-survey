import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";
import {SearchForm} from "../../customComponents/SearchForm";

const searchFormSchema = z.object({
  _id: z.string().optional(),
  surveyCompleted: z.boolean().optional().default(false),
  noQuestionsAnswered: z.boolean().optional().default(false),
  questionnaireID: z.number().optional(),
});

export function ParticipantSearchForm({onFilterChange, query}) {
  const {t} = useTranslation();
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      _id: query?._id || "",
      surveyCompleted: query?.surveyCompleted || false,
      noQuestionsAnswered: query?.noQuestionsAnswered || false,
      questionnaireID: query?.questionnaireID || undefined,
    },
  });

  useEffect(() => {
    if (query) {
      form.reset(query);
    }
  }, [query, form]);

  return (
    <SearchForm title={t("Collections.participants")} form={form} onFilterChange={onFilterChange}>
      <AutoField className="col-span-1" form={form} name="_id" label={t("Collections.DBMetaData._id")} type="input" />
      <AutoField
        className="col-span-1"
        form={form}
        name="surveyCompleted"
        label={t("Collections.Participants.surveyCompleted")}
        type="bool"
      />
      <AutoField
        className="col-span-1"
        form={form}
        name="noQuestionsAnswered"
        label={t("Collections.Participants.noQuestionsAnswered")}
        type="bool"
      />
      <AutoField
        className="col-span-1"
        form={form}
        name="questionnaireID"
        label={t("Collections.SurveyQuestions.questionnaireID")}
        type="number"
      />
    </SearchForm>
  );
}
