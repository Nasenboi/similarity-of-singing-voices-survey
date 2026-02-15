import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {SurveyAnswers} from "./collection";

export const useSurveyAnswersParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {surveyAnswers: null, isLoading: false};

    const subscriptionHandle = Meteor.subscribe("surveyAnswers.participant", participantID);
    const surveyAnswers = SurveyAnswers.find(participantID).fetch();

    return {
      surveyAnswers,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);
