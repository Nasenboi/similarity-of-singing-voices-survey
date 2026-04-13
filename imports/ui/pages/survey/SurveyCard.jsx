import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ArrowRightLeft, Flag, Pause, Play} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {cookies} from "../../customComponents/Cookies";
import {H1, H2, Large, P} from "../../customComponents/Typography";
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

  return (
    <div
      className={`w-220 max-w-screen h-min rounded-md border-2 flex flex-col justifiy-center ${isSubmitted && "bg-accent border-accent-foreground"}`}
    >
      <CardHeader
        className={`w-full flex items-center px-4 justify-center border-b-2 rounded-t-md ${isSubmitted && "bg-accent border-accent-foreground"}`}
      >
        <CardTitle className="w-full flex justify-between items-center">
          <div />
          <H1>
            {t("SurveyPage.cardTitle")} {question.questionNumber + 1}
          </H1>
          <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <DialogTrigger asChild>
              <TooltipWrapper asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={isSubmitted && "border"}
                  onClick={() => setDialogOpen(true)}
                >
                  <Flag />
                </Button>
              </TooltipWrapper>
            </DialogTrigger>
            <ComplaintForm surveyQuestion={question} setDialogOpen={setDialogOpen} />
          </Dialog>
        </CardTitle>
      </CardHeader>
      <div className="flex justify-center flex-col md:flex-row">
        <div className="md:p-4 p-2 size-full flex flex-row md:flex-col justify-center items-center">
          <H2>{t("SurveyPage.targetVoice")}</H2>
          <div className="size-full flex justify-center">
            <Button onClick={() => onVoiceClick(question["X"], "X")}>
              {t("SurveyPage.voice")} X {voicePlaying === "X" ? <Pause /> : <Play />}
            </Button>
          </div>
        </div>

        <div
          className={`w-full max-w-screen p-4 flex flex-col justify-center items-center md:border-l-2 max-md:border-t-2 ${isSubmitted && "border-accent-foreground"}`}
        >
          <H2>{t("SurveyPage.referenceVoices")}</H2>
          <ButtonGroup className="max-w-sreen">
            <AudioButton
              trackID={question[[similarToX[0]]]}
              voice={similarToX[0]}
              onVoiceClick={onVoiceClick}
              isPlaying={voicePlaying === similarToX[0]}
            />
            <ButtonGroupSeparator />
            <Button size="icon" onClick={() => toggleVoices(similarToX[1])}>
              <ArrowRightLeft />
            </Button>
            <ButtonGroupSeparator />
            <AudioButton
              trackID={question[[similarToX[1]]]}
              voice={similarToX[1]}
              onVoiceClick={onVoiceClick}
              isPlaying={voicePlaying === similarToX[1]}
            />
          </ButtonGroup>
          <div className="p-4 space-y-4 w-full">
            <RadioGroup
              className="max-md:flex max-md:flex-col max-md:w-full max-md:justify-center "
              value={similarToX[0]}
              onValueChange={(value) => toggleVoices(value)}
            >
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
            <div className="-mb-4 w-full flex justify-center">
              <Button onClick={() => setSurveyAnswer(question._id)}>{t("Common.submit")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
