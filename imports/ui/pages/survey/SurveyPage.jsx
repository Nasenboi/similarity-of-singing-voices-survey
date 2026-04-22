import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {Progress} from "@/components/ui/progress";
import {useSurveyAnswersParticipant} from "@/imports/api/surveyAnswers/hooks";
import {SURVEY_ANSWERS} from "@/imports/api/surveyAnswers/methods";
import {useSurveyQuestionsParticipant} from "@/imports/api/surveyQuestions/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/imports/ui/customComponents/pagination";
import {cn} from "@/lib/utils";
import {Meteor} from "meteor/meteor";
import {AnimatePresence, motion} from "motion/react";
import React, {useEffect, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {useMobileContext} from "../../contextProvider/MobileContext";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {cookies} from "../../customComponents/Cookies";
import {PageLoading} from "../../customComponents/PageLoading";
import {P} from "../../customComponents/Typography";
import {SurveyCard} from "./SurveyCard";

function ProgressHeader({className, surveyQuestions, currentPage, questionsAnswered, surveyProgress, handlePageChange}) {
  const {t} = useTranslation();
  const {isMobile} = useMobileContext();

  return (
    <Card className={cn("w-full m-0 mb-4 bg-background sticky top-0 z-30 rounded-t-none", className)}>
      <CardHeader className="py-4 px-10">
        <CardTitle className="text-center max-md:text-lg max-md:w-full">{t("SurveyPage.title")}</CardTitle>
      </CardHeader>
      {!isMobile && (
        <CardContent className="border-b max-md:w-full max-md:px-0">
          <p className="text-center max-md:text-xs">{t("SurveyPage.description")}</p>
        </CardContent>
      )}
      <CardFooter className="pb-2 bg-background border-t">
        <div className="mt-2 md:space-y-4 space-y-1 w-full flex flex-col">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                className={currentPage === 0 && "text-background hover:text-background hover:bg-background"}
                text={isMobile ? "" : t("Common.previous")}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              />
              {surveyQuestions?.map((_, index) => {
                if (isMobile && (index > currentPage + 2 || index < currentPage - 2)) {
                  return null;
                } else if (currentPage <= 4 && index >= 9) {
                  return null;
                } else if (currentPage >= surveyQuestions.length - 4 && index <= surveyQuestions.length - 10) {
                  return null;
                } else if (
                  currentPage > 4 &&
                  currentPage < surveyQuestions.length - 4 &&
                  (index > currentPage + 4 || index < currentPage - 4)
                ) {
                  return null;
                }
                return (
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
                );
              })}
              <PaginationNext
                className={
                  currentPage + 1 === (surveyQuestions?.length || 1) &&
                  "text-background hover:text-background hover:bg-background"
                }
                text={isMobile ? "" : t("Common.next")}
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
  );
}

function SurveyFinishedDrawer({participant}) {
  const [drawerDismissed, setDrawerDismissed] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const swapURL = Meteor.settings.public.SURVEY_SWAP?.URL;
  const swapCode = Meteor.settings.public.SURVEY_SWAP?.CODE;
  return (
    <Drawer open={participant?.surveyCompleted && !drawerDismissed} dismissable>
      <DrawerContent>
        <DrawerHeader className="flex flex-col justify-center items-center">
          <DrawerTitle>{t("SurveyPage.Completed.title")}</DrawerTitle>
          <DrawerDescription asChild>
            <P>
              {t("SurveyPage.Completed.description", {questionnaireID: participant?.questionnaireID || "N/A"})}
              {swapURL && swapCode && (
                <>
                  {"\n\n"}
                  <Trans
                    i18nKey="SurveyPage.Completed.surveySwap"
                    values={{code: swapCode, url: swapURL}}
                    components={{
                      1: <a href={swapURL} target="_blank" rel="noopener noreferrer" className="underline" />,
                    }}
                  />
                </>
              )}
            </P>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex justify-center items-center space-y-4">
          <ButtonGroup>
            <Button onClick={() => navigate("/")}>{t("Sidebar.Navigation.home")}</Button>
            <ButtonGroupSeparator />
            <Button onClick={() => navigate("/plot")}>{t("Sidebar.Navigation.similarityPlot")}</Button>
          </ButtonGroup>
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => setDrawerDismissed(true)}>
              {t("Common.close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CardCarousel({
  className,
  surveyQuestions,
  currentPage,
  setSurveyAnswer,
  questionsAnswered,
  similarToX,
  toggleVoices,
  initAnswer,
  direction,
  animationKey,
}) {
  return (
    <div className={cn("size-full relative", className)}>
      <AnimatePresence mode="wait">
        {surveyQuestions?.find((q) => q.questionNumber === currentPage) ? (
          <motion.div
            key={currentPage}
            initial={{x: direction * 300, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            transition={{duration: 0.3}}
            className="w-full"
          >
            <div className="size-full flex justify-center items-center">
              <SurveyCard
                question={surveyQuestions?.find((q) => q.questionNumber === currentPage)}
                setSurveyAnswer={setSurveyAnswer}
                isSubmitted={questionsAnswered.includes(currentPage)}
                similarToX={similarToX}
                toggleVoices={toggleVoices}
                initAnswer={initAnswer}
                animationKey={animationKey}
              />
            </div>
          </motion.div>
        ) : (
          <PageLoading />
        )}
      </AnimatePresence>
    </div>
  );
}
export default function SurveyPage() {
  const {isPlaying, setIsPlaying, useBackgroundMusic} = useAudioContext();
  const {participant, isLoading: isParticipantLoading} = useParticipantContext();
  const [participantID, setParticipantID] = useState(participant?._id);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [surveyProgress, setSurveyProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const navigate = useNavigate();
  const [similarToX, setSimilarToX] = useState(["A", "B"]);
  const [animationKey, setAnimationKey] = useState(0);
  const {t} = useTranslation();

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
    setSurveyProgress(sp ? sp : 0);

    const qA = surveyAnswers.map((a) => surveyQuestions.find((q) => q._id === a.questionID)?.questionNumber);
    setQuestionsAnswered(qA);
  }, [surveyQuestions, surveyAnswers]);

  const handlePageChange = (newPage) => {
    if (!surveyQuestions) {
      return;
    }

    // dismiss toolips on question navigation
    cookies.set("complaintTooltipRead", true);
    cookies.set("flagsTooltipRead", true);

    if (isPlaying) {
      setIsPlaying(false);
    }

    const numQuestions = surveyQuestions.length;

    if (newPage >= 0 && newPage < numQuestions) {
      setDirection(newPage > currentPage ? 1 : -1);
      setCurrentPage(newPage);
    }
    setAnimationKey(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isEditable = e.target.isContentEditable;
      const inputLike = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];
      if (inputLike.includes(tag) || isEditable) return;

      const currentQuestion = surveyQuestions?.find((q) => q.questionNumber === currentPage);

      switch (e.code) {
        case "Enter":
          if (currentQuestion) setSurveyAnswer(currentQuestion._id);
          break;
        case "ArrowLeft":
          handlePageChange(currentPage - 1);
          break;
        case "ArrowRight":
          handlePageChange(currentPage + 1);
          break;
        case "KeyT":
          toggleVoices({value: "toggle"});
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, surveyQuestions, similarToX]);

  const initAnswer = () => {
    const currentQuestionID = surveyQuestions.find((q) => q.questionNumber === currentPage)?._id;
    const currentAnswer = surveyAnswers.find((a) => a.questionID === currentQuestionID)?.answer;
    setSimilarToX(currentAnswer || ["A", "B"]);
  };

  const toggleVoices = ({value}) => {
    let updated = true;
    if (value === "A") {
      updated = value !== similarToX[0];
      setSimilarToX(["A", "B"]);
      updated = value !== similarToX[0];
    } else if (value === "B") {
      setSimilarToX(["B", "A"]);
    } else {
      setSimilarToX([similarToX[1], similarToX[0]]);
    }
    if (updated) {
      setAnimationKey((prev) => prev + 1);
    }
  };

  const setSurveyAnswer = async (questionID) => {
    if (isPlaying) {
      setIsPlaying(false);
    }

    try {
      await SURVEY_ANSWERS.setAnswer.callAsync({
        questionID,
        answer: similarToX,
        participantID: participant._id,
        backgroundMusic: useBackgroundMusic,
      });
      const numQuestions = surveyQuestions.length;
      if (currentPage + 1 < numQuestions) {
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      if (error.error === "too-many-requests") {
        toast.error(t("Toasts.slowDown"));
      } else {
        toast.error(t("Toasts.errorSubmittingAnswer"));
      }
    }
  };

  useEffect(() => {
    if (!isParticipantLoading && !participant) {
      navigate("/");
    }
  }, [isParticipantLoading, participant, navigate]);

  if (isParticipantLoading || isSurveyAnswersLoading || isSurveyQuestionsLoading) {
    return <PageLoading />;
  }

  if (!participant) {
    return null;
  }

  return (
    <div className="w-full h-screen max-h-screen flex flex-col overflow-hidden">
      <ProgressHeader
        surveyQuestions={surveyQuestions}
        currentPage={currentPage}
        questionsAnswered={questionsAnswered}
        surveyProgress={surveyProgress}
        handlePageChange={handlePageChange}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <CardCarousel
          surveyQuestions={surveyQuestions}
          currentPage={currentPage}
          setSurveyAnswer={setSurveyAnswer}
          questionsAnswered={questionsAnswered}
          similarToX={similarToX}
          toggleVoices={toggleVoices}
          initAnswer={initAnswer}
          direction={direction}
          animationKey={animationKey}
        />
      </div>
      <AudioPlayer />
      <SurveyFinishedDrawer participant={participant} />
    </div>
  );
}
