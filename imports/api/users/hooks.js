import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {useParticipantSingle} from "../participants/hooks";

export const useIsLoggedIn = () =>
  useTracker(() => {
    if (Meteor.isDevelopment) return true;
    return !!Meteor.userId() && !Meteor.loggingOut();
  }, [Meteor.userId()]);

export const useIsAdmin = () =>
  useTracker(() => {
    if (Meteor.isDevelopment) return true;

    const user = Meteor.user();
    return !!user?.isAdmin;
  }, [Meteor.userId()]);

export const useIsAdminOrCompleted = (participantID) => {
  const {participant, isLoading} = useParticipantSingle(participantID);
  return useTracker(() => {
    if (Meteor.isDevelopment) return {hasRights: true, isLoading: false};
    const user = Meteor.user();
    if (!!user?.isAdmin) return {hasRights: true, isLoading: false};

    return {hasRights: !!participant?.surveyCompleted, isLoading};
  }, [Meteor.userId(), participantID, participant?.surveyCompleted]);
};
