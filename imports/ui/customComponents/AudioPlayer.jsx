import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useSongsSingle} from "@/imports/api/songs/hooks";
import {FILE_SERVER_URL, SONG_FILE_PATH, VOCAL_FILE_PATH} from "@/imports/common/globals";
import {Slider} from "@/imports/ui/customComponents/slider";
import {Pause, Play, Volume, Volume1, Volume2, VolumeOff} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {useAudioContext} from "../contextProvider/AudioContext";
import {MarkerSlider} from "./MarkerSlider";

export function AudioPlayer() {
  const {trackID, icon, isPlaying, setIsPlaying, useBackgroundMusic, jumpToFirstOnset} = useAudioContext();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const {song, isLoading: isSongLoading} = useSongsSingle(trackID);

  useEffect(() => {
    const getURL = () => {
      if (!song || isSongLoading) {
        return;
      }
      if (useBackgroundMusic) {
        return `${FILE_SERVER_URL}${SONG_FILE_PATH}${song.songSubPath}`;
      } else {
        return `${FILE_SERVER_URL}${VOCAL_FILE_PATH}${song.vocalSubPath}`;
      }
    };
    const url = getURL();

    if (audioRef.current?.src !== url) {
      stopAudio();
      audioRef.current.src = url;
      setIsPlaying(true);
      audioRef.current?.play();
    }
  }, [song]);

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
    const seek = jumpToFirstOnset && song.onsets?.length > 0 ? song.onsets[0] : 0;

    audioRef.current.pause();
    audioRef.current.currentTime = seek;
    setProgress(seek);
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

  const setAudioVolume = (value) => {
    setVolume(value);

    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const getVolumeIcon = (v) => {
    switch (true) {
      case v <= 0.01:
        return <VolumeOff />;
      case v <= 0.3:
        return <Volume />;
      case v <= 0.6:
        return <Volume1 />;
      default:
        return <Volume2 />;
    }
  };

  return (
    <>
      {!isSongLoading && song && (
        <div className="w-full md:max-h-22 md:h-22 sticky bottom-0 left-0 right-0 border-t-2 bg-background border-sidebar-border flex items-center md:p-2 px-2">
          <div className="w-full md:h-20 h-18 space-x-2 flex justify-center items-center">
            {icon && (
              <div className="size-16 bg-accent rounded-md border-2 flex items-center justify-center">
                <h1 className="text-center text-2xl font-bold">{icon}</h1>
              </div>
            )}
            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
            <Button
              className="rounded-full md:size-10 size-8"
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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" className="rounded-full md:size-10 size-8">
                  {getVolumeIcon(volume)}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-10 h-30 p-2 flex justify-center items-center">
                <Slider
                  className="h-full w-full"
                  orientation="vertical"
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={setAudioVolume}
                />
              </PopoverContent>
            </Popover>

            <div className="w-full h-full flex justify-center items-center">
              <MarkerSlider
                value={[progress]}
                duration={audioRef.current?.duration}
                markerPoints={song.onsets}
                min={0}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
