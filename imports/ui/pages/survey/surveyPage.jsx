import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Slider} from "@/components/ui/slider";
import React from "react";
import {AUDIO_FILE_SERVER_URL} from "../../../common/globals";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";

export function SurveyPage() {
  const {currentSong, setCurrentSong, setIsPlaying, isPlaying} = useAudioContext();
  const surveyProgress = 50;

  const onVoiceClick = (song) => {
    const url = `${AUDIO_FILE_SERVER_URL}${song}`;
    if (currentSong != url) {
      setCurrentSong({url: url});
    }
    setIsPlaying(!isPlaying);
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

      <div className="flex justifiy-center items-center m-2" onClick={() => onVoiceClick("000/000002.mp3")}>
        <Button className="m-2">
          <p className="m-4 text-bold text-4xl text-center">Voice X</p>
        </Button>

        <div className="flex flex-col">
          <ButtonGroup className="m-2">
            <Button>
              <p className="m-4 text-bold text-4xl text-center">Voice A</p>
            </Button>
            <ButtonGroupSeparator />
            <Button>
              <p className="m-4 text-l text-center">More Similar to X</p>
            </Button>
          </ButtonGroup>
          <ButtonGroup className="m-2">
            <Button>
              <p className="m-4 text-bold text-4xl text-center">Voice B</p>
            </Button>
            <ButtonGroupSeparator />
            <Button>
              <p className="m-4 text-l text-center">More Similar to X</p>
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
