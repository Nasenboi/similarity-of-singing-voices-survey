import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Slider} from "@/components/ui/slider";
import React, {useState} from "react";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {SurveyCard} from "./surveyCard";

export function SurveyPage() {
  const [submissionAnswers, setSubmissionAnswers] = useState({});

  const surveyProgress = 50;

  const voiceTriplets = [{ID: "001", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}}];

  const setSubmissionAnswer = ({ID, response}) => {
    setSubmissionAnswers((prev) => ({
      ...prev,
      [ID]: response,
    }));
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

      <SurveyCard
        voiceTriplet={voiceTriplets[0]}
        setSubmissionAnswer={setSubmissionAnswer}
        isSubmitted={submissionAnswers.hasOwnProperty(voiceTriplets[0].ID)}
      />

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
