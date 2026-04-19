import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/config";
import {SurveyAnswers} from "../surveyAnswers/collection";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery, getPaginationCounts} from "../utils";
import {Participants} from "./collection";

Meteor.publish("participants.single", async function (participantID) {
  check(participantID, String);

  return Participants.find(participantID);
});

Meteor.publish("participants.paginated", async function ({query, next, previous, reloadKey}) {
  if (!(await isAdminUser(this.userId))) return this.ready();

  const numericFields = ["questionnaireID"];
  const booleanFields = [];
  const {surveyCompleted, noQuestionsAnswered, ...q} = query;

  let newQuery = buildPaginationQuery({query: q, numericFields, booleanFields});
  if (surveyCompleted) newQuery["surveyCompleted"] = true;
  if (noQuestionsAnswered) {
    const participantsWithAnswers = await SurveyAnswers.rawCollection().distinct("participantID", {
      questionnaireID: newQuery.questionnaireID,
    });
    newQuery["_id"] = {$nin: participantsWithAnswers};
  }
  const result = await findPagination(Participants.rawCollection(), {
    query: newQuery,
    limit: ITEMS_PER_PAGE,
    paginatedField: INDEX_MAP.PARTICIPANTS,
    next,
    previous,
  });

  const {results, hasNext, hasPrevious} = result;

  results.forEach((doc) => {
    this.added("participants", doc._id, doc);
  });

  this.added("pagination", "participants", {
    hasNext,
    hasPrevious,
    nextCursor: result.next,
    prevCursor: result.previous,
    ...(await getPaginationCounts({collection: Participants, query: newQuery})),
  });

  this.ready();
});
