import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {ArrowRightLeft, Flag, Pause, Play} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {useMobileContext} from "../../contextProvider/MobileContext";
import {cookies} from "../../customComponents/Cookies";
import {H2, H3, Large, P} from "../../customComponents/Typography";
import {ComplaintForm} from "./ComplaintForm";

function AudioButton({trackID, voice, onVoiceClick, isPlaying}) {
  const {t} = useTranslation();

  return (
    <Button onClick={() => onVoiceClick(trackID, voice)}>
      {t("SurveyPage.voice")} {voice} {isPlaying ? <Pause /> : <Play />}
    </Button>
  );
}

function TooltipWrapper({children}) {
  const {t} = useTranslation();
  const [tooltipOpen, setTooltipOpen] = useState(() => {
    return !cookies.get("complaintTooltipRead");
  });

  const dismissTooltip = () => {
    cookies.set("complaintTooltipRead", true);
    setTooltipOpen(false);
  };

  return (
    <Tooltip open={tooltipOpen}>
      <TooltipContent side="top" className="max-w-screen" sideOffset={0}>
        <div className="flex flex-col space-y-4 p-2 justify-center items-center">
          <P>{t("Components.Tooltips.complaints")}</P>
          <div className="w-full flex justify-end items-center">
            <Button size="sm" onClick={dismissTooltip}>
              {t("Common.ok")}
            </Button>
          </div>
        </div>
      </TooltipContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
    </Tooltip>
  );
}

function XSection({className, onVoiceClick, question, voicePlaying}) {
  const {t} = useTranslation();

  return (
    <div className={cn("md:p-4 p-2 size-full grid grid-cols-2 gap-2", className)}>
      <H3 className="col-span-1 text-foreground flex items-center justify-end">{t("SurveyPage.targetVoice")}</H3>
      <div className="col-span-1 flex justify-start">
        <Button onClick={() => onVoiceClick(question["X"], "X")}>
          {t("SurveyPage.voice")} X {voicePlaying === "X" ? <Pause /> : <Play />}
        </Button>
      </div>
    </div>
  );
}

function ReferenceSection({
  className,
  question,
  similarToX,
  onVoiceClick,
  voicePlaying,
  toggleVoices,
  setSurveyAnswer,
  isSubmitted,
}) {
  const {t} = useTranslation();
  const {isMobile} = useMobileContext();

  return (
    <div
      className={cn(
        "w-full max-w-screen space-y-4 pt-4 flex flex-col justify-center items-center",
        isSubmitted && "border-accent-foreground",
        className,
      )}
    >
      <div className="w-full grid grid-cols-2 gap-2">
        <H3 className="col-span-1 flex justify-end items-center">{t("SurveyPage.referenceVoices")}</H3>
        <ButtonGroup
          className="col-span-1 flex justify-start items-center"
          orientation={isMobile ? "vertical" : "horizontal"}
        >
          <AudioButton
            trackID={question[[similarToX[0]]]}
            voice={similarToX[0]}
            onVoiceClick={onVoiceClick}
            isPlaying={voicePlaying === similarToX[0]}
          />
          <ButtonGroupSeparator orientation={isMobile ? "horizontal" : "vertical"} />
          {!isMobile && (
            <>
              <Button size="icon" onClick={() => toggleVoices(similarToX[1])}>
                <ArrowRightLeft />
              </Button>
              <ButtonGroupSeparator />
            </>
          )}
          <AudioButton
            trackID={question[[similarToX[1]]]}
            voice={similarToX[1]}
            onVoiceClick={onVoiceClick}
            isPlaying={voicePlaying === similarToX[1]}
          />
        </ButtonGroup>
      </div>
      <div className="space-y-4">
        <RadioGroup className="" value={similarToX[0]} onValueChange={(value) => toggleVoices(value)}>
          <div className="flex items-center gap-3 max-md:justify-center">
            <RadioGroupItem value="A" id="r1" />
            <label htmlFor="r1">
              <Large htmlFor="r1" className="hover:underline">
                A {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
              </Large>
            </label>
          </div>
          <div className="flex items-center gap-3 max-md:justify-center">
            <RadioGroupItem value="B" id="r2" />
            <label htmlFor="r2">
              <Large className="hover:underline">
                B {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
              </Large>
            </label>
          </div>
        </RadioGroup>
        <div className="w-full flex justify-center">
          <Button onClick={() => setSurveyAnswer(question._id)}>{t("Common.submit")}</Button>
        </div>
      </div>
    </div>
  );
}

export function SurveyCard({question, similarToX, toggleVoices, setSurveyAnswer, initAnswer, isSubmitted = false}) {
  const {trackID, setTrackID, setIcon, isPlaying, setIsPlaying} = useAudioContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(null);
  const {t} = useTranslation();

  useEffect(() => {
    setTrackID(null);
    initAnswer();
  }, []);

  const onVoiceClick = (newTrackID, voice) => {
    if (newTrackID === trackID) {
      setIsPlaying((prev) => !prev);
    } else {
      setIcon(voice);
      setTrackID(newTrackID);
    }
    setVoicePlaying(!isPlaying || newTrackID != trackID ? voice : null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isEditable = e.target.isContentEditable;
      const inputLike = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];
      if (inputLike.includes(tag) || isEditable) return;

      if (e.code === "KeyX" || e.code === "Digit1" || e.code === "Numpad1") {
        onVoiceClick(question["X"], "X");
      } else if (e.code === "KeyA" || e.code === "Digit2" || e.code === "Numpad2") {
        onVoiceClick(question["A"], "A");
      } else if (e.code === "KeyB" || e.code === "Digit3" || e.code === "Numpad3") {
        onVoiceClick(question["B"], "B");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getColors = () => {
    return isSubmitted && "bg-accent border-accent-foreground";
  };

  return (
    <Card className={cn("w-220 max-w-screen h-min", getColors())}>
      <CardHeader className={cn("border-b-2 p-0", getColors())}>
        <CardTitle className={cn("w-full pb-2 relative flex justify-center items-center border-b-2", getColors())}>
          <H2>
            {t("SurveyPage.cardTitle")} {question.questionNumber + 1}
          </H2>
          <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
              <TooltipWrapper asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn("absolute right-1 top-1", isSubmitted && "border")}
                  onClick={() => setDialogOpen(true)}
                >
                  <Flag />
                </Button>
              </TooltipWrapper>
            </DialogTrigger>
            <ComplaintForm surveyQuestion={question} setDialogOpen={setDialogOpen} />
          </Dialog>
        </CardTitle>
        <CardDescription>
          <XSection onVoiceClick={onVoiceClick} question={question} voicePlaying={voicePlaying} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center flex-col md:flex-row">
        <ReferenceSection
          question={question}
          similarToX={similarToX}
          onVoiceClick={onVoiceClick}
          voicePlaying={voicePlaying}
          toggleVoices={toggleVoices}
          setSurveyAnswer={setSurveyAnswer}
          isSubmitted={isSubmitted}
        />
      </CardContent>
    </Card>
  );
}
