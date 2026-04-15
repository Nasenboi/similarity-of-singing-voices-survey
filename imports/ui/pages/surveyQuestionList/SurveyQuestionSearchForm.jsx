import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";
import {SearchForm} from "../../customComponents/SearchForm";

const searchFormSchema = z.object({
  _id: z.string().optional(),
  questionnaireID: z.string().optional(),
  _id: z.string().optional(),
  questionNumber: z.string().optional(),
  skip: z.boolean().optional(),
});

export function SurveyQuestionSearchForm({onFilterChange, query}) {
  const {t} = useTranslation();
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      _id: query?._id || "",
      questionnaireID: query?.questionnaireID || "",
      _id: query?._id || "",
      questionNumber: query?.questionNumber || "",
      skip: query?.skip || false,
    },
  });

  useEffect(() => {
    if (query) {
      form.reset(query);
    }
  }, [query, form]);

  return (
    <SearchForm title={t("Collections.surveyQuestions")} form={form} onFilterChange={onFilterChange}>
      <AutoField className="col-span-1" form={form} name="_id" label={t("Collections.DBMetaData._id")} type="input" />
      <AutoField
        className="col-span-1"
        form={form}
        name="questionnaireID"
        label={t("Collections.SurveyQuestions.questionnaireID")}
        type="input"
      />
      <AutoField
        className="col-span-1"
        form={form}
        name="questionNumber"
        label={t("Collections.SurveyQuestions.questionNumber")}
        type="input"
      />
      <AutoField className="col-span-1" form={form} name="skip" label={t("Collections.SurveyQuestions.skip")} type="bool" />
    </SearchForm>
  );
}
