import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/config";
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

Meteor.publish("songs.paginated", function ({query, next, previous}) {
  const self = this;
  let stopped = false;
  let sentIds = new Set();
  let paginationAdded = false;
  let rerunTimer = null;

  const scheduleRefresh = () => {
    if (rerunTimer) return;
    rerunTimer = Meteor.setTimeout(async () => {
      rerunTimer = null;
      await refreshPage();
    }, 50);
  };

  const refreshPage = async () => {
    if (stopped) return;
    if (!(await isAdminUser(self.userId))) {
      self.ready();
      return;
    }

    const numericFields = ["trackID"];
    const booleanFields = [];
    const {hasComplaints, skipInSurvey, ...q} = query || {};

    // note: buildPaginationQuery expects { query: ... }, not { q: ... }
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

    const currentDocs = result.results || [];
    const currentIds = new Set(currentDocs.map((d) => d._id));

    for (const oldId of sentIds) {
      if (!currentIds.has(oldId)) self.removed("songs", oldId);
    }

    for (const doc of currentDocs) {
      if (!sentIds.has(doc._id)) self.added("songs", doc._id, doc);
      else self.changed("songs", doc._id, doc);
    }

    const pagePayload = {
      hasNext: result.hasNext,
      hasPrevious: result.hasPrevious,
      nextCursor: result.next,
      prevCursor: result.previous,
      ...(await getPaginationCounts({collection: Songs, query: newQuery})),
    };

    if (!paginationAdded) {
      self.added("pagination", "songs", pagePayload);
      paginationAdded = true;
    } else {
      self.changed("pagination", "songs", pagePayload);
    }

    sentIds = currentIds;
  };

  let observerHandleOrPromise = null;

  (async () => {
    await refreshPage();
    if (stopped) return;

    const {hasComplaints, skipInSurvey, ...q} = query || {};
    let reactiveQuery = buildPaginationQuery({query: q, numericFields: ["trackID"], booleanFields: []});
    if (hasComplaints) reactiveQuery["complaints.0"] = {$exists: true};
    if (skipInSurvey) reactiveQuery.skipInSurvey = true;

    observerHandleOrPromise = Songs.find(reactiveQuery, {
      fields: {skipInSurvey: 1, complaints: 1, [INDEX_MAP.SONGS]: 1, trackID: 1, artist: 1, album: 1},
    }).observeChanges({
      added: scheduleRefresh,
      changed: scheduleRefresh,
      removed: scheduleRefresh,
    });

    self.ready();
  })();

  self.onStop(() => {
    stopped = true;
    if (rerunTimer) Meteor.clearTimeout(rerunTimer);

    Promise.resolve(observerHandleOrPromise)
      .then((handle) => {
        if (handle && typeof handle.stop === "function") handle.stop();
      })
      .catch(() => {
        // optional: log once
      });
  });
});
