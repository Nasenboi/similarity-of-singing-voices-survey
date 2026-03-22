import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/globals";
import {Participants} from "../participants/collection";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery} from "../utils";
import {SurveyQuestions} from "./collection";

Meteor.publish("surveyQuestions.participant", async function (participantID) {
  check(participantID, String);
  const participant = await Participants.findOneAsync(participantID);
  if (!participant) return this.ready();

  return SurveyQuestions.find({questionnaireID: Number(participant.questionnaireID)}, {sort: {questionNumber: 1}});
});

Meteor.publish("surveyQuestions.single", async function (surveyQuestionID) {
  check(surveyQuestionID, String);

  return SurveyQuestions.find(surveyQuestionID);
});

Meteor.publish("surveyQuestions.paginated", async function ({query, next, previous}) {
  if (!(await isAdminUser(this.userId))) return this.ready();

  const numericFields = ["questionnaireID", "questionNumber"];
  const booleanFields = [];
  const newQuery = buildPaginationQuery({query, numericFields, booleanFields});

  const result = await findPagination(SurveyQuestions.rawCollection(), {
    query: newQuery,
    limit: ITEMS_PER_PAGE,
    paginatedField: INDEX_MAP.SURVEY_QUESTIONS,
    next,
    previous,
  });

  const {results, hasNext, hasPrevious} = result;

  results.forEach((doc) => {
    this.added("surveyQuestions", doc._id, doc);
  });

  this.added("pagination", "surveyQuestions", {
    hasNext,
    hasPrevious,
    nextCursor: result.next,
    prevCursor: result.previous,
  });

  this.ready();
});
