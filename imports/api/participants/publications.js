import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/globals";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery} from "../utils";
import {Participants} from "./collection";

Meteor.publish("participants.single", async function (participantID) {
  check(participantID, String);

  return Participants.find(participantID);
});

Meteor.publish("participants.paginated", async function ({query, next, previous}) {
  if (!(await isAdminUser(this.userId))) return this.ready();

  const numericFields = [];
  const booleanFields = ["surveyCompleted"];
  const newQuery = buildPaginationQuery({query, numericFields, booleanFields});

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
  });

  this.ready();
});
