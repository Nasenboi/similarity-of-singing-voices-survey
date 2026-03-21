import {INDEX_MAP, ITEMS_PER_PAGE} from "@/imports/common/globals";
import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";
import {Pagination} from "../collection/pagination";
import {Participants} from "./collection";

export const useSingleParticipant = (participantID) =>
  useTracker(() => {
    if (!participantID) return {participant: null, isLoading: false};

    const subscriptionHandle = Meteor.subscribe("participants.single", participantID);
    const participant = Participants.findOne(participantID);

    return {
      participant,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [participantID]);

export const useParticipantsPaginated = ({query, next, previous}) =>
  useTracker(() => {
    const subscriptionHandle = Meteor.subscribe("participants.paginated", {query, next, previous});
    const sortField = INDEX_MAP.PARTICIPANTS;
    const participants = Participants.find({}, {sort: {[sortField]: 1}, limit: ITEMS_PER_PAGE}).fetch();
    const pageInfo = Pagination.findOne("participants");

    return {
      participants,
      pageInfo,
      isLoading: !subscriptionHandle.ready(),
    };
  }, [Meteor.userId(), next, previous, JSON.stringify(query)]);
