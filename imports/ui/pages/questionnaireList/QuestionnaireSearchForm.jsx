import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";
import {SearchForm} from "../../customComponents/SearchForm";

const searchFormSchema = z.object({
  _id: z.string().optional(),
  questionnaireID: z.number().optional(),
  participantCount: z.number().optional(),
  skip: z.boolean().optional(),
});

export function QuestionnaireSearchForm({onFilterChange, query, count, total}) {
  const {t} = useTranslation();
  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      _id: query?._id || "",
      questionnaireID: query?.questionnaireID || undefined,
      participantCount: query?.participantCount || undefined,
      skip: query?.skip || false,
    },
  });

  useEffect(() => {
    if (query) {
      form.reset(query);
    }
  }, [query, form]);

  return (
    <SearchForm
      title={t("Collections.questionnaires")}
      form={form}
      onFilterChange={onFilterChange}
      count={count}
      total={total}
    >
      <AutoField className="flex-1" form={form} name="_id" label={t("Collections.DBMetaData._id")} type="input" />
      <AutoField
        className="flex-1"
        form={form}
        name="participantCount"
        label={t("Collections.SurveyQuestions.Questionnaires.participantCount")}
        type="number"
      />
      <AutoField
        className="flex-1"
        form={form}
        name="questionnaireID"
        label={t("Collections.SurveyQuestions.questionnaireID")}
        type="number"
      />
      <AutoField className="flex-1" form={form} name="skip" label={t("Collections.SurveyQuestions.skip")} type="bool" />
    </SearchForm>
  );
}
