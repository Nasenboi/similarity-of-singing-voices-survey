import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";
import {SearchForm} from "../../customComponents/SearchForm";

const searchFormSchema = z.object({
  _id: z.string().optional(),
  questionID: z.string().optional(),
  _id: z.string().optional(),
  participantID: z.string().optional(),
});

export function SurveyAnswerSearchForm({onFilterChange, query}) {
  const {t} = useTranslation();
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      _id: query?._id || "",
      questionID: query?.questionID || "",
      _id: query?._id || "",
      participantID: query?.participantID || "",
    },
  });

  useEffect(() => {
    if (query) {
      form.reset(query);
    }
  }, [query, form]);

  return (
    <SearchForm title={t("Collections.surveyAnswers")} form={form} onFilterChange={onFilterChange}>
      <AutoField className="flex-1" form={form} name="_id" label={t("Collections.DBMetaData._id")} type="input" />
      <AutoField
        className="flex-1"
        form={form}
        name="questionID"
        label={t("Collections.SurveyAnswers.questionID")}
        type="input"
      />
      <AutoField
        className="flex-1"
        form={form}
        name="participantID"
        label={t("Collections.SurveyAnswers.participantID")}
        type="input"
      />
    </SearchForm>
  );
}
