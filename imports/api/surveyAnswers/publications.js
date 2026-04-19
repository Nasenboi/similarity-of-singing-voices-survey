import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/config";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery, getPaginationCounts} from "../utils";
import {SurveyAnswers} from "./collection";

Meteor.publish("surveyAnswers.participant", async function (participantID) {
  check(participantID, String);

  return SurveyAnswers.find({participantID});
});

Meteor.publish("surveyAnswers.single", async function (surveyAnswerID) {
  check(surveyAnswerID, String);

  return SurveyAnswers.find(surveyAnswerID);
});

Meteor.publish("surveyAnswers.paginated", async function ({query, next, previous}) {
  if (!(await isAdminUser(this.userId))) return this.ready();

  const numericFields = [];
  const booleanFields = [];
  const newQuery = buildPaginationQuery({query, numericFields, booleanFields});

  const result = await findPagination(SurveyAnswers.rawCollection(), {
    query: newQuery,
    limit: ITEMS_PER_PAGE,
    paginatedField: INDEX_MAP.SURVEY_ANSWERS,
    next,
    previous,
  });

  const {results, hasNext, hasPrevious} = result;

  results.forEach((doc) => {
    this.added("surveyAnswers", doc._id, doc);
  });

  this.added("pagination", "surveyAnswers", {
    hasNext,
    hasPrevious,
    nextCursor: result.next,
    prevCursor: result.previous,
    ...(await getPaginationCounts({collection: SurveyAnswers, query: newQuery})),
  });

  this.ready();
});
