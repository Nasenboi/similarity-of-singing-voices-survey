import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {useTranslation} from "react-i18next";
import {H3, H4, Muted, P} from "../../customComponents/Typography";

export default function CreditsPage() {
  const {t} = useTranslation();

  return (
    <div className="w-full flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("Legal.Credits.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <H3>FMA: A Dataset For Music Analysis</H3>

            <P>{t("Legal.Credits.Content.01fmaGitHub-1")}</P>

            <P>
              <a href={"https://github.com/mdeff/fma"} target="_blank" rel="noopener noreferrer" className="underline">
                Github Link
              </a>
            </P>

            <Muted>
              Defferrard, M., Benzi, K., Vandergheynst, P., & Bresson, X. (2017). FMA: A Dataset for Music Analysis. In 18th
              International Society for Music Information Retrieval Conference (ISMIR).
            </Muted>
            <Muted>
              Defferrard, M., Mohanty, S., Carroll, S., & Salathe, M. (2018). Learning to Recognize Musical Genre from Audio.
              In The 2018 Web Conference Companion. ACM Press.
            </Muted>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
