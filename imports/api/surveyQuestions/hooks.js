import {INDEX_MAP, ITEMS_PER_PAGE} from "@/imports/common/globals";
import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Pagination} from "../collection/pagination";
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

export const useSurveyQuestionsPaginated = ({query, next, previous}) =>
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
  }, [Meteor.userId(), next, previous, JSON.stringify(query)]);
