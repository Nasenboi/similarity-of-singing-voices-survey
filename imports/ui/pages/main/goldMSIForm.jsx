import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Spinner} from "@/components/ui/spinner";
import {GENRE_OPTIONS, PLAYBACK_OPTIONS, getGenreOptions, getPlaybackOptions} from "@/imports/api/participants/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";
import {z} from "zod";
import {PARTICIPANTS} from "../../../api/participants/methods";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AutoField} from "../../customComponents/AutoField";
import {Small} from "../../customComponents/Typography";

const goldMSIFormSchema = (t) => {
  return z.object({
    playback: z.enum(PLAYBACK_OPTIONS, {message: t("Components.Form.invalidOption")}),
    genre1: z.enum(GENRE_OPTIONS, {message: t("Components.Form.invalidOption")}),
    genre2: z.enum(GENRE_OPTIONS, {message: t("Components.Form.invalidOption")}),
    genre3: z.enum(GENRE_OPTIONS, {message: t("Components.Form.invalidOption")}),
    gmsi1: z.number().min(1).max(7),
    gmsi2: z.number().min(1).max(7),
    gmsi3: z.number().min(1).max(7),
    gmsi4: z.number().min(1).max(7),
    gmsi5: z.number().min(1).max(7),
    gmsi6: z.number().min(1).max(7),
    gmsi7: z.number().min(1).max(7),
  });
};

export function GoldMSIForm({onPrevClick, onNextClick}) {
  const {t} = useTranslation();
  const {participant, isLoading} = useParticipantContext();

  const form = useForm({
    resolver: zodResolver(goldMSIFormSchema(t)),
    defaultValues: {
      playback: participant?.playback || "",
      genre1: participant?.genre1 || "",
      genre2: participant?.genre2 || "",
      genre3: participant?.genre3 || "",
      gmsi1: participant?.gmsi1 || "",
      gmsi2: participant?.gmsi2 || "",
      gmsi3: participant?.gmsi3 || "",
      gmsi4: participant?.gmsi4 || "",
      gmsi5: participant?.gmsi5 || "",
      gmsi6: participant?.gmsi6 || "",
      gmsi7: participant?.gmsi7 || "",
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
    return await PARTICIPANTS.setGoldMSI.callAsync({participantID: participant?._id, goldMSI: data});
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
    <Card className="max-h-screen flex flex-col h-screen">
      <CardHeader className="flex-none">
        <CardTitle className="text-center">{t("MainPage.GoldMSI.title")}</CardTitle>
        <CardDescription>{t("MainPage.GoldMSI.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 my-2 overflow-y-auto">
        <form className="w-full h-full flex flex-col space-y-2" onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col space-y-4">
            <AutoField
              form={form}
              name="playback"
              label={t("Collections.Participants.GoldMSI.playback")}
              type="combobox"
              fieldProps={{
                allowedValues: getPlaybackOptions(t),
                placeholder: t("Components.Combobox.selectItem"),
                emptyMessage: t("Components.Combobox.noItemsFound"),
              }}
            />
            <AutoField
              form={form}
              name="genre1"
              label={t("Collections.Participants.GoldMSI.genre1")}
              type="combobox"
              fieldProps={{
                allowedValues: getGenreOptions(t),
                placeholder: t("Components.Combobox.selectItem"),
                emptyMessage: t("Components.Combobox.noItemsFound"),
              }}
            />
            <AutoField
              form={form}
              name="genre2"
              label={t("Collections.Participants.GoldMSI.genre2")}
              type="combobox"
              fieldProps={{
                allowedValues: getGenreOptions(t),
                placeholder: t("Components.Combobox.selectItem"),
                emptyMessage: t("Components.Combobox.noItemsFound"),
              }}
            />
            <AutoField
              form={form}
              name="genre3"
              label={t("Collections.Participants.GoldMSI.genre3")}
              type="combobox"
              fieldProps={{
                allowedValues: getGenreOptions(t),
                placeholder: t("Components.Combobox.selectItem"),
                emptyMessage: t("Components.Combobox.noItemsFound"),
              }}
            />
          </div>
          <div className="my-4 w-full h-0 border-b-2 border-accent" />
          <div className="flex flex-col space-y-6">
            {Array.from({length: 7}, (_, i) => i + 1).map((g) => (
              <div key={g} className="w-full flex flex-col space-y-2">
                <AutoField
                  form={form}
                  name={`gmsi${g}`}
                  label={t(`Collections.Participants.GoldMSI.Questions.${g}`)}
                  type="slider"
                  fieldProps={{min: 1, max: 7, step: 1, showTicks: true}}
                />
                <div className="flex flex-row justify-between">
                  <Small>{t("Collections.Participants.GoldMSI.Scales.completelyDisagree")}</Small>
                  <Small>{t("Collections.Participants.GoldMSI.Scales.completelyAgree")}</Small>
                </div>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-none">
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
