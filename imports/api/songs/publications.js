import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/config";
import {publishPagination} from "../collection/pagination";
import {Participants} from "../participants/collection";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery, getPaginationCounts} from "../utils";
import {Songs} from "./collection";

Meteor.publish("songs.single", async function ({trackID}) {
  if (!trackID) return this.ready();
  return Songs.find({trackID});
});

Meteor.publish("songs.all", async function ({participantID, fields}) {
  const isAdmin = await isAdminUser(this.userId);
  if (!participantID && !isAdmin) return this.ready();
  if (!isAdmin) {
    const participant = await Participants.findOneAsync(participantID);
    if (!participant || !participant.surveyCompleted) return this.ready();
  }
  return Songs.find({}, {fields});
});

Meteor.publish("songs.paginated", async function ({query, next, previous}) {
  const numericFields = ["trackID"];
  const booleanFields = [];
  const {hasComplaints, skipInSurvey, ...q} = query || {};

  let newQuery = buildPaginationQuery({query: q, numericFields, booleanFields});
  if (hasComplaints) newQuery["complaints.0"] = {$exists: true};
  if (skipInSurvey) newQuery.skipInSurvey = true;

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

  await publishPagination(this, "songs", {
    hasNext,
    hasPrevious,
    nextCursor: result.next,
    prevCursor: result.previous,
    ...(await getPaginationCounts({collection: Songs, query: newQuery})),
  });

  this.ready();
});
