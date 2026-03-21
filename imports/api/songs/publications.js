import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/globals";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery} from "../utils";
import {Songs} from "./collection";

Meteor.publish("songs.single", function (trackID) {
  return Songs.find({trackID});
});

Meteor.publish("songs.paginated", async function ({query, next, previous}) {
  if (!(await isAdminUser(this.userId))) return this.ready();

  const numericFields = ["trackID"];
  const booleanFields = [];
  const newQuery = buildPaginationQuery({query, numericFields, booleanFields});

  const result = await findPagination(Songs.rawCollection(), {
    query: newQuery,
    limit: ITEMS_PER_PAGE,
    paginatedField: INDEX_MAP.SONGS,
    next,
    previous,
  });

  const {results, hasNext, hasPrevious} = result;

  results.forEach((doc) => {
    this.added("songs", doc._id, doc);
  });

  this.added("pagination", "songs", {
    hasNext,
    hasPrevious,
    nextCursor: result.next,
    prevCursor: result.previous,
  });

  this.ready();
});

/*
unused other ideas:
import {check} from "meteor/check";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";

Meteor.publish("songs.all", async function () {
  if (!(await isAdminUser(this.userId))) return;
  return Songs.find();
});


Meteor.publish("songs.participant", async function (participantID) {
  check(participantID, String);
  const participant = await Participants.findOneAsync(participantID);
  if (!participant) return;

  const surveyQuestions = await SurveyQuestions.find(
    {questionnaireID: Number(participant.questionnaireID)},
    {sort: {questionNumber: 1}},
  ).fetchAsync();

  const trackIDs = surveyQuestions.flatMap((q) => [q.X, q.A, q.B]);
  const uniqueTrackIDs = [...new Set(trackIDs)];
  return Songs.find({trackID: {$in: uniqueTrackIDs}});
});

Meteor.publish("songs.surveyQuestion", async function (questionnaireID, questionNumber) {
  const surveyQuestion = await SurveyQuestions.findOneAsync({questionnaireID, questionNumber});
  if (!surveyQuestion) return;

  const trackIDs = [surveyQuestion.X, surveyQuestion.A, surveyQuestion.B].map(Number);
  return Songs.find({trackID: {$in: trackIDs}});
});
*/
