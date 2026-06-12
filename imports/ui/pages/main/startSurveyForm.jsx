import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Meteor} from "meteor/meteor";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {Muted, P} from "../../customComponents/Typography";

export function StartSurveyForm({onStartClick}) {
  const {t} = useTranslation();

  const containsSurveySwapCode = Meteor.settings.public.SURVEY_SWAP?.CODE && Meteor.settings.public.SURVEY_SWAP?.URL;
  const containsSurveyCircleCode = Meteor.settings.public.SURVEY_CIRCLE?.CODE && Meteor.settings.public.SURVEY_CIRCLE?.URL;

  return (
    <Card className="max-w-150">
      <CardHeader>
        <CardTitle className="text-center">{t("MainPage.Start.title")}</CardTitle>
        <CardDescription>{t("MainPage.Start.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <P>{t("MainPage.Start.content")}</P>
        {containsSurveySwapCode && (
          <P>
            {"\n"}
            {t("MainPage.Start.surveySwap")}
          </P>
        )}
        {containsSurveyCircleCode && (
          <P>
            {"\n"}
            {t("MainPage.Start.surveyCircle")}
          </P>
        )}
        <Muted className="mt-4">
          <Trans
            i18nKey="MainPage.Start.contentSmall"
            components={{
              1: <a href="/privacyPolicy" target="_blank" rel="noopener noreferrer" className="underline" />,
            }}
          />
        </Muted>
      </CardContent>
      <CardFooter>
        <Button onClick={onStartClick}>{t("MainPage.Start.startSurvey")}</Button>
      </CardFooter>
    </Card>
  );
}
