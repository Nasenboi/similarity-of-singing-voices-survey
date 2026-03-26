import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

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
          <p className="max-md:text-sm">{t("MainPage.content")}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/survey")}>{t("MainPage.startSurvey")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
