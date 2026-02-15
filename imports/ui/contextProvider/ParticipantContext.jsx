import {useSingleParticipant} from "@/imports/api/participants/hooks";
import {PARTICIPANTS} from "@/imports/api/participants/methods";
import React, {createContext, useContext, useEffect} from "react";
import {cookies} from "../customComponents/Cookies";

const ParticipantContext = createContext(undefined);

export const ParticipantProvider = ({children}) => {
  const {participant, isLoading} = useSingleParticipant(cookies.get("participantID"));

  useEffect(() => {
    async function checkParticipantID() {
      if (!cookies.get("participantID") || !participant) {
        try {
          const newId = await PARTICIPANTS.newParticipant.callAsync();
          cookies.set("participantID", newId);
        } catch (err) {
          console.error(err);
        }
      }
    }
    checkParticipantID();
  }, []);

  const contextValue = isLoading ? {} : participant;

  return <ParticipantContext.Provider value={contextValue}>{children}</ParticipantContext.Provider>;
};

export const useParticipantContext = () => {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error("useParticipantContext must be used within an ParticipantProvider");
  }
  return context;
};
