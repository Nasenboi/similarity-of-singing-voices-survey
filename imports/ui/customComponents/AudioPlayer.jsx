import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Pause, Play} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {useAudioContext} from "../contextProvider/AudioContext";

export function AudioPlayer() {
  const {currentAudio, isPlaying, setIsPlaying} = useAudioContext();
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current?.src !== currentAudio?.url) {
      stopAudio();
      audioRef.current.src = currentAudio?.url;
      setIsPlaying(true);
      audioRef.current?.play();
    }
  }, [currentAudio]);

  useEffect(() => {
    togglePlay();
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current?.play();
    } else {
      stopAudio();
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current?.currentTime;
    const duration = audioRef.current?.duration;
    setProgress((current / duration) * 100 || 0);
  };

  const handleSeek = (value) => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (value[0] / 100) * duration;
    setProgress(value[0]);
  };

  return (
    <>
      {currentAudio?.url && (
        <div className="w-full sticky bottom-0 left-0 right-0 border-t-2 bg-background border-sidebar-border flex items-center p-2">
          {currentAudio?.voice && (
            <div className="mr-4  w-16 h-16 bg-accent rounded-md border-2 flex items-center justify-center">
              <h1 className="text-center text-2xl font-bold">{currentAudio.voice}</h1>
            </div>
          )}
          <div className="w-full h-20 flex justify-center items-center">
            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => stopAudio()} />
            <Button
              className="rounded-full mr-2 w-10 h-10"
              onClick={() => {
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying ? (
                <Pause className="text-white dark:text-zinc-600" />
              ) : (
                <Play className="text-white dark:text-zinc-600" />
              )}
            </Button>

            <div className="w-full h-full flex justify-center items-center">
              <Slider value={[progress]} min={0} max={100} step={0.1} onValueChange={handleSeek} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
