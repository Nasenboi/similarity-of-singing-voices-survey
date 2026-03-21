import {INDEX_MAP, ITEMS_PER_PAGE} from "@/imports/common/globals";
import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Pagination} from "../collection/pagination";
import {Songs} from "./collection";

export const useSongsSingle = (trackID) =>
  useTracker(() => {
    const tID = Number(trackID);
    const subscriptionHandle = Meteor.subscribe("songs.single", tID);
    const song = Songs.findOne({trackID: tID});
    return {
      song,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [trackID]);

export const useSongsPaginated = ({query, next, previous}) =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("songs.paginated", {query, next, previous});
    const sortField = INDEX_MAP.SONGS;
    const songs = Songs.find({}, {sort: {[sortField]: 1}, limit: ITEMS_PER_PAGE}).fetch();
    const pageInfo = Pagination.findOne("songs");

    return {
      songs,
      pageInfo,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId(), next, previous, JSON.stringify(query)]);

/*
export const useSongsAll = () =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("songs.all");
    const songs = Songs.find().fetch();
    return {
      songs,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId()]);

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
*/
