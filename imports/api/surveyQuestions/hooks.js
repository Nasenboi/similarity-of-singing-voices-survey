import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {SurveyQuestions} from "./collection";

export const useSurveyQuestionsParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {surveyQuestions: null, isLoading: false};
    const subscriptionHandle = Meteor.subscribe("surveyQuestions.participant", participantID);
    const surveyQuestions = SurveyQuestions.find().fetch();

    return {
      surveyQuestions,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);
