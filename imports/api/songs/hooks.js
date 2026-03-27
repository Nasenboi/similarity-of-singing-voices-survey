import {INDEX_MAP, ITEMS_PER_PAGE} from "@/imports/common/config";
import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Pagination} from "../collection/pagination";
import {Songs} from "./collection";

export const useSongsSingle = (trackID) =>
  useTracker(() => {
    if (!trackID && trackID !== 0) {
      return {song: null, isLoading: false};
    }

    const tID = Number(trackID);
    if (isNaN(tID)) {
      return {song: null, isLoading: false};
    }

    const subscriptionHandle = Meteor.subscribe("songs.single", {trackID: tID});
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

export const useSongsAll = ({participantID, fields}) =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("songs.all", {participantID, fields});
    const songs = Songs.find().fetch();
    return {
      songs,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId(), participantID]);
