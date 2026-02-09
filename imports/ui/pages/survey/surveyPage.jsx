import React from "react";
import {AudioPlayer} from "../../customComponents/AudioPlayer";

export function SurveyPage() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="">
        <h1 className="text-4xl ">Survey!</h1>
      </div>
      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
