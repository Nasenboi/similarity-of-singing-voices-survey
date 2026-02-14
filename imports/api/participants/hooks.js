import {Meteor} from "meteor/meteor";
import React, {useTracker} from "react";
import {Particitpants} from "./collection";

export const useSingleParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {participant: null, isLoading: false};

    const subscriptionHandle = Meteor.subscribe("participants.single", participantID);
    const participant = Particitpants.findOne(participantID);

    return {
      participant,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);
