import {useSidebar} from "@/components/ui/sidebar";
import React, {useEffect} from "react";
import {useAudioContext} from "../contextProvider/AudioContext";

export function GlobalKeyEvents({children}) {
  const {setIsPlaying, trackID} = useAudioContext();
  const {toggleSidebar} = useSidebar();

  const handleSpace = () => {
    if (!trackID) return;
    setIsPlaying((prev) => !prev);
  };

  const handleESC = () => {
    toggleSidebar();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isEditable = e.target.isContentEditable;
      const inputLike = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];
      const isInputLike = inputLike.includes(tag) || isEditable;

      if (e.code === "Space" && !isInputLike) {
        e.preventDefault();
        handleSpace();
      }

      if (e.code === "Escape") {
        handleESC();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trackID, toggleSidebar]);

  return children;
}
