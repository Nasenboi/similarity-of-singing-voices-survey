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
import {Spinner} from "@/components/ui/spinner";
import {useSurveyAnswersParticipant} from "@/imports/api/surveyAnswers/hooks";
import {SURVEY_ANSWERS} from "@/imports/api/surveyAnswers/methods";
import {useSurveyQuestionsParticipant} from "@/imports/api/surveyQuestions/hooks";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {SurveyCard} from "./surveyCard";

export function SurveyPage() {
  const participant = useParticipantContext();
  const {surveyQuestions, isLoading: isSurveyQuestionsLoading} = useSurveyQuestionsParticipant(participant?._id);
  const {surveyAnswers, isLoading: isSurveyAnswersLoading} = useSurveyAnswersParticipant(participant?._id);
  const [currentPage, setCurrentPage] = useState(0);
  const [surveyProgress, setSurveyProgress] = useState(0);
  const {isPlaying, setIsPlaying} = useAudioContext();
  const {t} = useTranslation();

  useEffect(() => {
    if (!participant || !surveyQuestions || !surveyAnswers) {
      return;
    }

    const numQuestions = surveyQuestions.length;
    const numAnswers = surveyAnswers.length;

    const sp = Math.round((100 * (numAnswers + 1)) / numQuestions);
    setSurveyProgress(sp);
  }, [participant, surveyQuestions, surveyAnswers]);

  const numQuestions = surveyQuestions?.length;

  const handlePageChange = (newPage) => {
    if (isPlaying) {
      setIsPlaying(false);
    }

    if (newPage >= 0 && newPage < numQuestions) {
      setCurrentPage(newPage);
    }
  };

  const setSurveyAnswer = async ({questionID, answer}) => {
    if (!participant) {
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
    }

    try {
      await SURVEY_ANSWERS.setAnswer.callAsync({
        questionID,
        answer,
        participantID: participant._id,
      });
    } catch (err) {
      console.error(err);
    }

    if (currentPage + 1 < numQuestions) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentQuestion = surveyQuestions?.find((q) => q.number === currentPage);
  console.log(surveyQuestions);
  const currentAnswer = surveyAnswers?.find(
    (a) => a.participantID === participant._id && a.questionID === currentQuestion._id,
  );

  if (!participant || isSurveyAnswersLoading || isSurveyQuestionsLoading || !currentQuestion) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className="w-40 h-40" />
      </div>
    );
  }

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
                  text={t("SurveyPage.previous")}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />

                {surveyQuestions?.map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className={
                        !!surveyAnswers.find(
                          (a) => a.participantID === participant._id && a.questionID === surveyQuestions._id,
                        ) && "bg-accent border-accent-foreground"
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
                  className={currentPage + 1 === numQuestions && "text-background hover:text-background hover:bg-background"}
                  text={t("SurveyPage.next")}
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

        <SurveyCard question={currentQuestion} setSurveyAnswer={setSurveyAnswer} isSubmitted={!!currentAnswer} />

        <div className="w-full h-24" />
      </div>

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
