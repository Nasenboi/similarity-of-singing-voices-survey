import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {Progress} from "@/components/ui/progress";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {cookies, getCookieSave} from "../../customComponents/Cookies";
import {SurveyCard} from "./surveyCard";

export function SurveyPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [surveyProgress, setSurveyProgress] = useState(0);
  const {isPlaying, setIsPlaying} = useAudioContext();
  const {t} = useTranslation();

  const handlePageChange = (newPage) => {
    if (isPlaying) {
      setIsPlaying(false);
    }

    if (newPage >= 0 && newPage < voiceTriplets.length) {
      setCurrentPage(newPage);
    }
  };

  const voiceTriplets = [
    {ID: "001", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "002", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "003", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "004", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "005", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "006", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
  ];

  const setSubmissionAnswer = ({ID, response}) => {
    if (isPlaying) {
      setIsPlaying(false);
    }

    const submissionAnswers = {...getCookieSave("submissionAnswers"), [ID]: response};
    cookies.set("submissionAnswers", submissionAnswers);

    const sp = Math.round((100 * (Object.keys(submissionAnswers).length + 1)) / voiceTriplets.length);
    setSurveyProgress(sp);

    if (currentPage + 1 < voiceTriplets.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Card className="fixed top-0 ms-50 max-w-500 w-full m-4 bg-background z-10">
        <CardHeader>
          <CardTitle className="text-center">{t("SurveyPage.title")}</CardTitle>
        </CardHeader>
        <CardContent className="border-b-2">
          <p className="text-center">{t("SurveyPage.description")}</p>
        </CardContent>
        <CardFooter>
          <div className="mt-2 space-y-4 w-full flex flex-col">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  className={currentPage === 0 && "text-background hover:text-background hover:bg-background"}
                  displayName={t("SurveyPage.previous")}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />

                {voiceTriplets.map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className={
                        getCookieSave("submissionAnswers").hasOwnProperty(voiceTriplets[index].ID) &&
                        "bg-accent border-accent-foreground"
                      }
                      href="#"
                      isActive={index === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(index);
                      }}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  className={
                    currentPage + 1 === voiceTriplets.length && "text-background hover:text-background hover:bg-background"
                  }
                  displayName={t("SurveyPage.next")}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationContent>
            </Pagination>
            <div className="flex items-center justify-center w-full">
              <Progress className="w-full" value={[surveyProgress]} min={0} max={100} step={1} disabled />
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="w-full flex flex-col justify-between items-center overflow-hidden">
        <div className="w-full h-60" />

        <SurveyCard
          voiceTriplet={voiceTriplets[currentPage]}
          setSubmissionAnswer={setSubmissionAnswer}
          isSubmitted={getCookieSave("submissionAnswers").hasOwnProperty(voiceTriplets[currentPage].ID)}
        />

        <div className="w-full h-24" />
      </div>

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
