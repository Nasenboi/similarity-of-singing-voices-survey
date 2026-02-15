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
import {AnimatePresence, motion} from "motion/react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {SurveyCard} from "./surveyCard";

export function SurveyPage() {
  const {t} = useTranslation();
  const {isPlaying, setIsPlaying} = useAudioContext();
  const {participant, isLoading: isParticipantLoading} = useParticipantContext();
  const [participantID, setParticipantID] = useState(participant?._id);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [surveyProgress, setSurveyProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  useEffect(() => {
    if (participant?._id && participant._id !== participantID) {
      setParticipantID(participant._id);
    }
  }, [participant]);

  const {surveyQuestions, isLoading: isSurveyQuestionsLoading} = useSurveyQuestionsParticipant(participantID);
  const {surveyAnswers, isLoading: isSurveyAnswersLoading} = useSurveyAnswersParticipant(participantID);

  useEffect(() => {
    if (!surveyQuestions || !surveyAnswers) {
      return;
    }

    const numQuestions = surveyQuestions.length;
    const numAnswers = surveyAnswers.length;

    const sp = Math.round((100 * numAnswers) / numQuestions);
    setSurveyProgress(sp);

    const questionsAnswered = surveyAnswers.map((a) => surveyQuestions.find((q) => q._id === a.questionID)?.questionNumber);
    setQuestionsAnswered(questionsAnswered);
  }, [surveyQuestions, surveyAnswers, isSurveyAnswersLoading, isSurveyQuestionsLoading]);

  const handlePageChange = (newPage) => {
    if (!surveyQuestions) {
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
    }

    const numQuestions = surveyQuestions.length;

    if (newPage >= 0 && newPage < numQuestions) {
      setDirection(newPage > currentPage ? 1 : -1);
      setCurrentPage(newPage);
    }
  };

  const setSurveyAnswer = async (questionID, answer) => {
    if (isPlaying) {
      setIsPlaying(false);
    }

    try {
      await SURVEY_ANSWERS.setAnswer.callAsync({
        questionID,
        answer,
        participantID: participant._id,
      });
      const numQuestions = surveyQuestions.length;
      if (currentPage + 1 < numQuestions) {
        setCurrentPage(currentPage + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isParticipantLoading || isSurveyAnswersLoading || isSurveyQuestionsLoading) {
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
                      className={questionsAnswered.includes(index) && "bg-accent border-accent-foreground"}
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
                    currentPage + 1 === (surveyQuestions?.length || 1) &&
                    "text-background hover:text-background hover:bg-background"
                  }
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

        <div className="w-full flex flex-col justify-between items-center overflow-hidden relative">
          <div className="w-full h-60" />

          <AnimatePresence mode="wait">
            {surveyQuestions?.find((q) => q.questionNumber === currentPage) ? (
              <motion.div
                key={currentPage}
                initial={{x: direction * 300, opacity: 0}}
                animate={{x: 0, opacity: 1}}
                transition={{duration: 0.3}}
                className="w-full"
              >
                <div className="w-full h-full flex justify-center items-center">
                  <SurveyCard
                    question={surveyQuestions?.find((q) => q.questionNumber === currentPage)}
                    setSurveyAnswer={setSurveyAnswer}
                    isSubmitted={questionsAnswered.includes(currentPage)}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <Spinner className="w-40 h-40" />
              </div>
            )}
          </AnimatePresence>

          <div className="w-full h-24" />
        </div>

        <div className="w-full h-24" />
      </div>

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
