import {INDEX_MAP, ITEMS_PER_PAGE} from "@/imports/common/config";
import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Pagination} from "../collection/pagination";
import {Questionnaires, SurveyQuestions} from "./collection";
import {LinesCollection} from "./lines";

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

export const useSurveyQuestionsSingle = (surveyQuestionID) =>
  useTracker(() => {
    if (!surveyQuestionID) return {surveyQuestion: null, isLoading: false};
    const subscriptionHandle = Meteor.subscribe("surveyQuestions.single", surveyQuestionID);
    const surveyQuestion = SurveyQuestions.findOne(surveyQuestionID);

    return {
      surveyQuestion,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [surveyQuestionID]);

export const useSurveyQuestionsLines = ({participantID, dimensions, query}) =>
  useTracker(() => {
    if (!participantID || !dimensions) return {lines: null, isLoading: false};
    const subscriptionHandle = Meteor.subscribe("surveyQuestions.lines", {participantID, dimensions, query});
    const lines = LinesCollection.find().fetch();

    return {
      lines,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID, dimensions, query]);

export const useSurveyQuestionsPaginated = ({query, next, previous, reloadKey}) =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("surveyQuestions.paginated", {query, next, previous});
    const sortField = INDEX_MAP.SONGS;
    const surveyQuestions = SurveyQuestions.find({}, {sort: {[sortField]: 1}, limit: ITEMS_PER_PAGE}).fetch();
    const pageInfo = Pagination.findOne("surveyQuestions");

    return {
      surveyQuestions,
      pageInfo,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId(), next, previous, JSON.stringify(query), reloadKey]);

export const useQuestionnairesPaginated = ({query, next, previous, reloadKey}) =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("questionnaires.paginated", {query, next, previous});

    const questionnaires = Questionnaires.find({}, {limit: ITEMS_PER_PAGE}).fetch();
    const pageInfo = Pagination.findOne("questionnaires");

    return {
      questionnaires,
      pageInfo,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId(), next, previous, JSON.stringify(query), reloadKey]);
