import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Songs} from "./collection";

export const useSongsParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {songs: null, isLoading: false};
    const subscriptionHandle = Meteor.subscribe("songs.participant", participantID);
    const songs = Songs.find().fetch();

    return {
      songs,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);

export const useSongsSurveyQuestion = (questionnaireID, questionNumber) =>
  useTracker(() => {
    if (questionnaireID == null || questionNumber == null) return {songs: null, isLoading: false};
    const subscriptionHandle = Meteor.subscribe("songs.surveyQuestion", questionnaireID, questionNumber);
    const songs = Songs.find().fetch();

    return {
      songs,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [questionnaireID, questionNumber]);
