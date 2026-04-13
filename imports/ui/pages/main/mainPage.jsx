import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Muted, P} from "../../customComponents/Typography";

export default function MainPage() {
  const navigate = useNavigate();
  const {t} = useTranslation();

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="max-w-150">
        <CardHeader>
          <CardTitle className="text-center">{t("MainPage.title")}</CardTitle>
          <CardDescription>{t("MainPage.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <P>{t("MainPage.content")}</P>
          <Muted className="mt-4">
            <Trans
              i18nKey="MainPage.contentSmall"
              components={{
                1: <a href="/privacyPolicy" target="_blank" rel="noopener noreferrer" className="underline" />,
              }}
            />
          </Muted>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/survey")}>{t("MainPage.startSurvey")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
