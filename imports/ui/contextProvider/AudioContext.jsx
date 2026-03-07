import React, {createContext, useContext, useState} from "react";

const AudioContext = createContext(undefined);

export const AudioProvider = ({children}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [useBackgroundMusic, setUseBackgroundMusic] = useState(true);

  const contextValue = {
    currentAudio,
    setCurrentAudio,
    isPlaying,
    setIsPlaying,
    useBackgroundMusic,
    setUseBackgroundMusic,
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
