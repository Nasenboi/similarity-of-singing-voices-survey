import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Spinner} from "@/components/ui/spinner";
import {
  AGE_MAX,
  AGE_MIN,
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  getEducationOptions,
  getGenderOptions,
  getLanguageOptions,
  getOccupationOptions,
  OCCUPATION_OPTIONS,
} from "@/imports/api/participants/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import ISO6391 from "iso-639-1";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {z} from "zod";
import {PARTICIPANTS} from "../../../api/participants/methods";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AutoField} from "../../customComponents/AutoField";

const demographicFormSchema = (t) => {
  return z.object({
    gender: z.enum(GENDER_OPTIONS, {message: t("Components.Form.invalidOption")}),
    education: z.enum(EDUCATION_OPTIONS, {message: t("Components.Form.invalidOption")}),
    age: z.number().min(AGE_MIN).max(AGE_MAX),
    occupation: z.enum(OCCUPATION_OPTIONS, {message: t("Components.Form.invalidOption")}),
    nativeLanguage: z.enum(ISO6391.getAllCodes(), {message: t("Components.Form.invalidOption")}),
  });
};

export function DemographicForm({onPrevClick, onNextClick}) {
  const {t} = useTranslation();
  const {participant, isLoading} = useParticipantContext();

  const form = useForm({
    resolver: zodResolver(demographicFormSchema(t)),
    defaultValues: {
      gender: participant?.gender || "",
      age: participant?.age || "",
      nativeLanguage: participant?.nativeLanguage || "",
      education: participant?.education || "",
      occupation: participant?.occupation || "",
    },
  });

  useEffect(() => {
    if (!participant && !isLoading) {
      onPrevClick();
    } else {
      form.reset(participant);
    }
  }, [participant, isLoading, form]);

  const submitForm = async (data) => {
    if (!participant) return;
    return await PARTICIPANTS.setDemographics.callAsync({participantID: participant?._id, demographics: data});
  };

  const changePage = (dir) => {
    form.handleSubmit((data) => {
      submitForm(data)
        .then(() => {
          if (dir == "prev") onPrevClick();
          else onNextClick();
        })
        .catch((error) => {
          toast.error(error);
        });
    })();
  };

  if (isLoading) {
    <Spinner className="w-40 h-40" />;
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-center">{t("MainPage.Demographics.title")}</CardTitle>
        <CardDescription>{t("MainPage.Demographics.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="w-full h-full flex flex-col space-y-4" onSubmit={form.handleSubmit(submitForm)}>
          <AutoField
            form={form}
            name="gender"
            label={t("Collections.Participants.Demographics.gender")}
            type="combobox"
            fieldProps={{
              allowedValues: getGenderOptions(t),
              placeholder: t("Components.Combobox.selectItem"),
              emptyMessage: t("Components.Combobox.noItemsFound"),
            }}
          />
          <AutoField form={form} name="age" label={t("Collections.Participants.Demographics.age")} type="number" />
          <AutoField
            form={form}
            name="nativeLanguage"
            label={t("Collections.Participants.Demographics.nativeLanguage")}
            type="combobox"
            fieldProps={{
              allowedValues: getLanguageOptions(t),
              placeholder: t("Components.Combobox.selectItem"),
              emptyMessage: t("Components.Combobox.noItemsFound"),
            }}
          />
          <AutoField
            form={form}
            name="education"
            label={t("Collections.Participants.Demographics.education")}
            type="combobox"
            fieldProps={{
              allowedValues: getEducationOptions(t),
              placeholder: t("Components.Combobox.selectItem"),
              emptyMessage: t("Components.Combobox.noItemsFound"),
            }}
          />
          <AutoField
            form={form}
            name="occupation"
            label={t("Collections.Participants.Demographics.occupation")}
            type="combobox"
            fieldProps={{
              allowedValues: getOccupationOptions(t),
              placeholder: t("Components.Combobox.selectItem"),
              emptyMessage: t("Components.Combobox.noItemsFound"),
            }}
          />
        </form>
      </CardContent>
      <CardFooter>
        <ButtonGroup className="w-full flex">
          <Button className="flex-1" type="button" onClick={() => changePage("prev")}>
            {t("Common.previous")}
          </Button>
          <ButtonGroupSeparator />
          <Button className="flex-1" type="button" onClick={() => changePage("next")}>
            {t("Common.next")}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
