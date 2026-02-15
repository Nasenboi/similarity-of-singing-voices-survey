import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Participants} from "./collection";

export const useSingleParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {participant: null, isLoading: false};

    const subscriptionHandle = Meteor.subscribe("participants.single", participantID);
    const participant = Participants.findOne(participantID);

    return {
      participant,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);
