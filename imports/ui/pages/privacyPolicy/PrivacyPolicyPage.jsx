import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {useTranslation} from "react-i18next";
import {H3, H4, P} from "../../customComponents/Typography";

export default function PrivacyPolicyPage() {
  const {t} = useTranslation();

  return (
    <div className="w-full flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("Legal.PrivacyPolicy.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 1 Controller */}
          <div className="space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.01responsible1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.01responsible2")}</P>

            <P>Christian Böndgen</P>
            <P>Morper Allee 2</P>
            <P>40699 Erkrath</P>
            <P>Email: christian.boendgen@study.hs-duesseldorf.de</P>
          </div>

          {/* 2 Purpose */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.02purpose1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.02purpose2")}</P>
          </div>

          {/* 3 Data Collected */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.03dataCollected1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.03dataCollected2")}</P>
          </div>

          {/* 4 Legal Basis */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.04legalBasis1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.04legalBasis2")}</P>
          </div>

          {/* 5 Cookies */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.05cookies1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.05cookies2")}</P>
          </div>

          {/* 6 Storage Duration */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.06storageDuration1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.06storageDuration2")}</P>
          </div>

          {/* 7 Data Sharing */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.07dataSharing1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.07dataSharing2")}</P>
          </div>

          {/* 8 Hosting */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.08hosting1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.08hosting2")}</P>

            <H4>{t("Legal.PrivacyPolicy.Content.08hosting3")}</H4>
            <P>IONOS SE</P>
            <P>Elgendorfer Str. 57</P>
            <P>56410 Montabaur</P>
          </div>

          {/* 9 User Rights */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.09userRights1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.09userRights2")}</P>
          </div>

          {/* 10 Voluntary Participation */}
          <div className="mt-8 space-y-2">
            <H3>{t("Legal.PrivacyPolicy.Content.10voluntary1")}</H3>

            <P>{t("Legal.PrivacyPolicy.Content.10voluntary2")}</P>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
