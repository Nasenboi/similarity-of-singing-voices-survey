import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {ArrowRightLeft} from "lucide-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {AUDIO_FILE_SERVER_URL} from "../../../common/globals";
import {useAudioContext} from "../../contextProvider/AudioContext";

function AudioButton({url, voice, onVoiceClick}) {
  const {t} = useTranslation();

  return (
    <Button className="w-60 p-2" onClick={() => onVoiceClick(url, voice)}>
      <p className="text-bold text-4xl text-center">
        {t("SurveyPage.voice")} {voice}
      </p>
    </Button>
  );
}

export function SurveyCard({voiceTriplet, setSubmissionAnswer, isSubmitted = false}) {
  const {currentAudio, setCurrentAudio, isPlaying, setIsPlaying} = useAudioContext();
  const [similarToX, setSimilarToX] = useState(["A", "B"]);
  const {t} = useTranslation();

  const onVoiceClick = (audio, voice) => {
    const oldUrl = currentAudio?.url;
    const url = `${AUDIO_FILE_SERVER_URL}${audio}`;
    setCurrentAudio({url: url, voice: voice});
    if (url === oldUrl) {
      setIsPlaying(!isPlaying);
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
      className={`w-220 h-min rounded-md border-2 flex flex-col justifiy-center ${isSubmitted && "bg-accent border-accent-foreground"}`}
    >
      <div className={`border-b-2 rounded-t-md ${isSubmitted && "bg-accent border-accent-foreground"}`}>
        <h1 className="m-4 w-full text-4xl font-bold text-center">
          {t("SurveyPage.cardTitle")} {voiceTriplet.ID}
        </h1>
      </div>
      <div className="flex justify-center">
        <div className="p-4 w-full h-full flex flex-col items-center">
          <h1 className="mb-8 w-full text-4xl font-bold underline text-center">{t("SurveyPage.targetVoice")}</h1>
          <Button onClick={() => onVoiceClick(voiceTriplet.URLS["X"], "X")}>
            <p className="text-bold text-4xl text-center">{t("SurveyPage.voice")} X</p>
          </Button>
        </div>

        <div className={`w-full p-4 flex flex-col space-y-4 border-l-2 ${isSubmitted && "border-accent-foreground"}`}>
          <h1 className="mb-8 w-full text-4xl font-bold underline text-center">{t("SurveyPage.referenceVoices")}</h1>
          <ButtonGroup>
            <AudioButton url={voiceTriplet.URLS[similarToX[0]]} voice={similarToX[0]} onVoiceClick={onVoiceClick} />
            <ButtonGroupSeparator />
            <Button size="icon" onClick={() => toggleVoices(similarToX[1])}>
              <ArrowRightLeft className="size-6!" />
            </Button>
            <ButtonGroupSeparator />
            <AudioButton url={voiceTriplet.URLS[similarToX[1]]} voice={similarToX[1]} onVoiceClick={onVoiceClick} />
          </ButtonGroup>
          <div className="p-4 space-y-4 w-full">
            <RadioGroup value={similarToX[0]} onValueChange={(value) => toggleVoices(value)}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="A" id="r1" />
                <Label htmlFor="r1" className="-mt-1 text-2xl font-bold hover:underline">
                  A {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="B" id="r2" />
                <Label htmlFor="r2" className="-mt-1 text-2xl font-bold hover:underline">
                  B {t("SurveyPage.and")} X {t("SurveyPage.areMoreSimilar")}
                </Label>
              </div>
            </RadioGroup>
            <div className="-mb-4 w-full flex justify-center">
              <Button
                className="px-8 text-lg font-bold"
                onClick={() => setSubmissionAnswer({ID: voiceTriplet.ID, response: similarToX})}
              >
                {t("SurveyPage.submit")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
