import React, {createContext, useContext, useState} from "react";

const AudioContext = createContext(undefined);

export const AudioProvider = ({children}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackID, setTrackID] = useState(null);
  const [icon, setIcon] = useState(null);
  const [useBackgroundMusic, setUseBackgroundMusic] = useState(true);
  const [jumpToFirstOnset, setJumpToFirstOnset] = useState(true);

  const contextValue = {
    trackID,
    setTrackID,
    icon,
    setIcon,
    isPlaying,
    setIsPlaying,
    useBackgroundMusic,
    setUseBackgroundMusic,
    jumpToFirstOnset,
    setJumpToFirstOnset,
  };

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
