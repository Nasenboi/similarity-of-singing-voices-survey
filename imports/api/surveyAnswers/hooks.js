import {Meteor} from "meteor/meteor";
import React, {useTracker} from "react";
import {SurveyAnswers} from "./collection";

export const useSurveyAnswersParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {surveyAnswers: null, isLoading: false};

    const subscriptionHandle = Meteor.subscribe("surveyAnswers.participant", participantID);
    const surveyAnswers = SurveyAnswers.find(participantID);

    return {
      surveyAnswers,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);
