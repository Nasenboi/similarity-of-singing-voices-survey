import {INDEX_MAP, ITEMS_PER_PAGE} from "@/imports/common/config";
import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Pagination} from "../collection/pagination";
import {SurveyAnswers} from "./collection";

export const useSurveyAnswersParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {surveyAnswers: null, isLoading: false};

    const subscriptionHandle = Meteor.subscribe("surveyAnswers.participant", participantID);
    const surveyAnswers = SurveyAnswers.find({participantID}).fetch();

    return {
      surveyAnswers,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);

export const useSurveyAnswersSingle = (surveyAnswerID) =>
  useTracker(() => {
    if (!surveyAnswerID) return {surveyAnswer: null, isLoading: false};
    const subscriptionHandle = Meteor.subscribe("surveyAnswers.single", surveyAnswerID);
    const surveyAnswer = SurveyAnswers.findOne(surveyAnswerID);

    return {
      surveyAnswer,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [surveyAnswerID]);

export const useSurveyAnswersPaginated = ({query, next, previous, reloadKey}) =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("surveyAnswers.paginated", {query, next, previous});
    const sortField = INDEX_MAP.SONGS;
    const surveyAnswers = SurveyAnswers.find({}, {sort: {[sortField]: 1}, limit: ITEMS_PER_PAGE}).fetch();
    const pageInfo = Pagination.findOne("surveyAnswers");

    return {
      surveyAnswers,
      pageInfo,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId(), next, previous, JSON.stringify(query), reloadKey]);
