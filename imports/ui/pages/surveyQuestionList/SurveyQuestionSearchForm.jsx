import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronDown} from "lucide-react";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {AutoField} from "../../customComponents/AutoField";

const searchFormSchema = z.object({
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
    <Card>
      <Collapsible className="data-[state=open]:bg-muted" defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <CardHeader className="group">
            <CardTitle className="w-full flex items-center justify-between">
              {t("Collections.surveyQuestions")}
              <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <form onSubmit={form.handleSubmit(onFilterChange)} className="grid grid-cols-3 gap-4">
              <AutoField
                className="col-span-1"
                form={form}
                name="_id"
                label={t("Collections.DBMetaData._id")}
                type="input"
              />
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
              <AutoField
                className="col-span-1"
                form={form}
                name="skip"
                label={t("Collections.SurveyQuestions.skip")}
                type="bool"
              />
              <div className="col-span-3 flex justify-end">
                <Button type="submit">{t("Common.submit")}</Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
