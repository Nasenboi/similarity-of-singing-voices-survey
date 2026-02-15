import {useSingleParticipant} from "@/imports/api/participants/hooks";
import {PARTICIPANTS} from "@/imports/api/participants/methods";
import React, {createContext, useContext, useEffect, useState} from "react";
import {cookies} from "../customComponents/Cookies";

const ParticipantContext = createContext(undefined);

export const ParticipantProvider = ({children}) => {
  const [participantID, setParticipantID] = useState(cookies.get("participantID"));
  const {participant, isLoading} = useSingleParticipant(participantID);

  useEffect(() => {
    async function checkParticipantID() {
      if (!cookies.get("participantID")) {
        try {
          const newID = await PARTICIPANTS.newParticipant.callAsync();
          cookies.set("participantID", newID);
          setParticipantID(newID);
        } catch (err) {
          console.error(err);
        }
      }
    }
    checkParticipantID();
  }, []);

  useEffect(() => {
    async function checkParticipantExisting() {
      if (cookies.get("participantID") && !isLoading && !participant) {
        try {
          const newID = await PARTICIPANTS.newParticipant.callAsync();
          cookies.set("participantID", newID);
          setParticipantID(newID);
        } catch (err) {
          console.error(err);
        }
      }
    }
    checkParticipantExisting();
  }, [isLoading]);

  const contextValue = isLoading || !participant ? {isLoading, participant: null} : {isLoading, participant};

  return <ParticipantContext.Provider value={contextValue}>{children}</ParticipantContext.Provider>;
};

export const useParticipantContext = () => {
  const context = useContext(ParticipantContext);
  if (context === undefined) {
    throw new Error("useParticipantContext must be used within an ParticipantProvider");
  }
  return context;
};
