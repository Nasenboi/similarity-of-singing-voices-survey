import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {ArrowRightLeft, Flag, Pause, Play} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {H1, H2, Large} from "../../customComponents/Typography";
import {ComplaintForm} from "./ComplaintForm";

function AudioButton({trackID, voice, onVoiceClick, isPlaying}) {
  const {t} = useTranslation();

  return (
    <Button onClick={() => onVoiceClick(trackID, voice)}>
      {t("SurveyPage.voice")} {voice} {isPlaying ? <Pause /> : <Play />}
    </Button>
  );
}

export function SurveyCard({question, setSurveyAnswer, isMobile = false, isSubmitted = false}) {
  const {trackID, setTrackID, setIcon, isPlaying, setIsPlaying} = useAudioContext();
  const [similarToX, setSimilarToX] = useState(["A", "B"]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(null);
  const {t} = useTranslation();

  useEffect(() => {
    setTrackID(null);
  }, []);

  const onVoiceClick = (newTrackID, voice) => {
    if (newTrackID === trackID) {
      setIsPlaying(!isPlaying);
    } else {
      setIcon(voice);
      setTrackID(newTrackID);
    }
    setVoicePlaying(!isPlaying || newTrackID != trackID ? voice : null);
  };

  const toggleVoices = ({value}) => {
    if (value === "A") {
      setSimilarToX(["A", "B"]);
    } else if (value === "B") {
      setSimilarToX(["B", "A"]);
    } else {
      setSimilarToX([similarToX[1], similarToX[0]]);
    }
  };

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
              <Button variant="secondary" size="icon" className={isSubmitted && "border"}>
                <Flag />
              </Button>
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
                <Large htmlFor="r1" className="hover:underline">
                  A {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
                </Large>
              </div>
              <div className="flex items-center gap-3 max-md:justify-center">
                <RadioGroupItem value="B" id="r2" />
                <Large htmlFor="r2" className="hover:underline">
                  B {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
                </Large>
              </div>
            </RadioGroup>
            <div className="-mb-4 w-full flex justify-center">
              <Button onClick={() => setSurveyAnswer(question._id, similarToX)}>{t("Common.submit")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
