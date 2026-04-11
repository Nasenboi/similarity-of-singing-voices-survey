import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {useTranslation} from "react-i18next";
import {H3, H4, P} from "../../customComponents/Typography";

export default function ImprintPage() {
  const {t} = useTranslation();

  return (
    <div className="w-full flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("Legal.Imprint.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* §5 DDG */}
          <div className="space-y-2">
            <H3>{t("Legal.Imprint.Content.01origin")}</H3>

            <H4>{t("Legal.Imprint.Content.01origin-1")}</H4>
            <P>Christian Böndgen</P>
            <P>Morper Allee 2</P>
            <P>40699 Erkrath</P>

            <H4>{t("Legal.Imprint.Content.02contact-1")}</H4>
            <P>Email: christian.boendgen@study.hs-duesseldorf.de</P>
          </div>

          {/* Institution (optional) */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.Imprint.Content.03Institution")}</H3>

            <P>Hochschule Düsseldorf (HSD)</P>
            <P>{t("Legal.Imprint.Content.03Institution-2")}</P>
          </div>

          {/* Content Responsibility */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.Imprint.Content.04contentResponsibility")}</H3>

            <P>Christian Böndgen</P>
            <P>Morper Allee 2</P>
            <P>40699 Erkrath</P>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
