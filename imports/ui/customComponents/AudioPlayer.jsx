import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Pause, Play} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {useAudioContext} from "../contextProvider/AudioContext";

export function AudioPlayer() {
  const {currentSong, isPlaying, setIsPlaying} = useAudioContext();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // If audio source changed, load the new song
      if (audioRef.current.src !== currentSong?.url) {
        audioRef.current.src = currentSong?.url;
      }
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100 || 0);
  };

  const handleSeek = (value) => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (value[0] / 100) * duration;
    setProgress(value[0]);
  };

  // Reset audio when song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.url) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong?.url]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      if (audioRef.current.currentTime > 0) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  return (
    <>
      {currentSong?.url && (
        <div className="w-full h-20 sticky bottom-0 left-0 right-0 border-t-2 bg-background border-sidebar-border flex justify-center items-center p-2">
          <audio ref={audioRef} src={currentSong?.url} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
          <Button className="rounded-full mr-2 w-10 h-10" onClick={togglePlay}>
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
      )}
    </>
  );
}
