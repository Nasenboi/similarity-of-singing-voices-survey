import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Slider} from "@/components/ui/slider";
import {ArrowLeft, ArrowRight} from "lucide-react";
import React, {useState} from "react";
import {AUDIO_FILE_SERVER_URL} from "../../../common/globals";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";

function AudioButtonGroup({url, voice, otherVoice, similarToX, setSimilarToX, onVoiceClick}) {
  const isSimilarToX = similarToX === voice;

  return (
    <div className="m-2 rounded-md bg-accent flex items-center justify-center">
      {!isSimilarToX && <div className="mx-20" />}
      <ButtonGroup className="-ml-1">
        {!isSimilarToX && (
          <>
            <Button onClick={() => setSimilarToX(voice)}>
              <ArrowLeft />
              More Similar
            </Button>
            <ButtonGroupSeparator />
          </>
        )}
        <Button onClick={() => onVoiceClick(url, voice)}>
          <p className="m-4 text-bold text-4xl text-center">{`Voice ${voice}`}</p>
        </Button>
        {isSimilarToX && (
          <>
            <ButtonGroupSeparator />
            <Button onClick={() => setSimilarToX(otherVoice)}>
              Less Similar
              <ArrowRight />
            </Button>
          </>
        )}
      </ButtonGroup>
      {isSimilarToX && <div className="mx-20" />}
    </div>
  );
}

export function SurveyPage() {
  const {currentAudio, setCurrentAudio, isPlaying, setIsPlaying} = useAudioContext();
  const [similarToX, setSimilarToX] = useState("A");

  const surveyProgress = 50;

  const onVoiceClick = (audio, voice) => {
    const oldUrl = currentAudio?.url;
    const url = `${AUDIO_FILE_SERVER_URL}${audio}`;
    setCurrentAudio({url: url, voice: voice});
    if (url === oldUrl) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Card className="fixed top-0 ms-50 max-w-500 w-full m-4">
        <CardHeader>
          <CardTitle className="text-center">Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Select the voice option which sounds most similar to the target voice</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center w-full">
            <p className="m-2">Progress: </p>
            <Slider className="w-full" value={[surveyProgress]} min={0} max={100} step={1} disabled />
          </div>
        </CardFooter>
      </Card>

      <h1 className="w-full text-center text-4xl font-bold ">{similarToX} is more similar to X</h1>

      <div className="flex justifiy-center items-center m-2">
        <div className="p-2 h-full">
          <Button className="h-full" onClick={() => onVoiceClick("000/000002.mp3", "X")}>
            <p className="text-bold text-4xl text-center">Voice X</p>
          </Button>
        </div>

        <div className="flex flex-col">
          <AudioButtonGroup
            url="000/000003.mp3"
            voice="A"
            otherVoice="B"
            similarToX={similarToX}
            setSimilarToX={setSimilarToX}
            onVoiceClick={onVoiceClick}
          />
          <AudioButtonGroup
            url="000/000010.mp3"
            voice="B"
            otherVoice="A"
            similarToX={similarToX}
            setSimilarToX={setSimilarToX}
            onVoiceClick={onVoiceClick}
          />
        </div>
      </div>

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
