import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {ArrowRightLeft} from "lucide-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useAudioContext} from "../../contextProvider/AudioContext";

function AudioButton({trackID, voice, onVoiceClick}) {
  const {t} = useTranslation();

  return (
    <Button className="md:w-60 p-2" onClick={() => onVoiceClick(trackID, voice)}>
      <p className="text-bold md:text-4xl text-center">
        {t("SurveyPage.voice")} {voice}
      </p>
    </Button>
  );
}

export function SurveyCard({question, setSurveyAnswer, isSubmitted = false}) {
  const {trackID, setTrackID, setIcon, isPlaying, setIsPlaying} = useAudioContext();
  const [similarToX, setSimilarToX] = useState(["A", "B"]);
  const {t} = useTranslation();

  const onVoiceClick = (newTrackID, voice) => {
    if (newTrackID === trackID) {
      setIsPlaying(!isPlaying);
    } else {
      setIcon(voice);
      setTrackID(newTrackID);
    }
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
      <div
        className={`w-full flex justify-center border-b-2 rounded-t-md ${isSubmitted && "bg-accent border-accent-foreground"}`}
      >
        <h1 className="m-4 w-full max-w-screen md:text-4xl text-xl font-bold text-center">
          {t("SurveyPage.cardTitle")} {question.questionNumber + 1}
        </h1>
      </div>
      <div className="flex justify-center flex-col md:flex-row">
        <div className="p-4 w-full h-full flex flex-row md:flex-col justify-center items-center">
          <h1 className="md:mb-8 w-full h-full md:text-4xl text-xl font-bold underline text-center">
            {t("SurveyPage.targetVoice")}
          </h1>
          <div className="w-full h-full flex justify-center">
            <Button onClick={() => onVoiceClick(question["X"], "X")}>
              <p className="text-bold md:text-4xl text-center">{t("SurveyPage.voice")} X</p>
            </Button>
          </div>
        </div>

        <div
          className={`w-full max-w-screen p-4 flex flex-col justify-center items-center space-y-4 md:border-l-2 max-md:border-t-2 ${isSubmitted && "border-accent-foreground"}`}
        >
          <h1 className="md:mb-8 w-full md:text-4xl text-xl font-bold underline text-center">
            {t("SurveyPage.referenceVoices")}
          </h1>
          <ButtonGroup className="max-w-sreen">
            <AudioButton trackID={question[[similarToX[0]]]} voice={similarToX[0]} onVoiceClick={onVoiceClick} />
            <ButtonGroupSeparator />
            <Button size="icon" onClick={() => toggleVoices(similarToX[1])}>
              <ArrowRightLeft className="md:size-6!" />
            </Button>
            <ButtonGroupSeparator />
            <AudioButton trackID={question[[similarToX[1]]]} voice={similarToX[1]} onVoiceClick={onVoiceClick} />
          </ButtonGroup>
          <div className="p-4 space-y-4 w-full">
            <RadioGroup
              className="max-md:flex max-md:flex-col max-md:w-full max-md:justify-center "
              value={similarToX[0]}
              onValueChange={(value) => toggleVoices(value)}
            >
              <div className="flex items-center gap-3 max-md:justify-center">
                <RadioGroupItem value="A" id="r1" />
                <Label htmlFor="r1" className="-mt-1 md:text-2xl text-lg font-bold hover:underline">
                  A {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
                </Label>
              </div>
              <div className="flex items-center gap-3 max-md:justify-center">
                <RadioGroupItem value="B" id="r2" />
                <Label htmlFor="r2" className="-mt-1 md:text-2xl text-lg font-bold hover:underline">
                  B {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
                </Label>
              </div>
            </RadioGroup>
            <div className="-mb-4 w-full flex justify-center">
              <Button className="px-8 md:text-lg font-bold" onClick={() => setSurveyAnswer(question._id, similarToX)}>
                {t("Common.submit")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
