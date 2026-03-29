import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {find as findPagination} from "mongo-cursor-pagination";
import {INDEX_MAP, ITEMS_PER_PAGE} from "../../common/config";
import {Participants} from "../participants/collection";
import {Songs} from "../songs/collection";
import {isAdminUser} from "../users/helpers";
import {buildPaginationQuery} from "../utils";
import {SurveyQuestions} from "./collection";

Meteor.publish("surveyQuestions.participant", async function (participantID) {
  check(participantID, String);
  const participant = await Participants.findOneAsync(participantID);
  if (!participant) return this.ready();

  return SurveyQuestions.find(
    {questionnaireID: Number(participant.questionnaireID), skip: false},
    {sort: {questionNumber: 1}},
  );
});

Meteor.publish("surveyQuestions.single", async function (surveyQuestionID) {
  check(surveyQuestionID, String);

  return SurveyQuestions.find(surveyQuestionID);
});

Meteor.publish("surveyQuestions.lines", async function ({participantID, dimensions, query}) {
  const isAdmin = await isAdminUser(this.userId);
  if (!participantID && !isAdmin) return this.ready();
  if (!isAdmin) {
    const participant = await Participants.findOneAsync(participantID);
    if (!participant || !participant.surveyCompleted) return this.ready();
  }
  if (dimensions !== "2D" && dimensions !== "3D") return this.ready();

  const questions = await SurveyQuestions.find({...query}).fetchAsync();
  const songs = await Songs.find().fetchAsync();

  const getCoords = (trackID) => {
    const song = songs.find((s) => s.trackID === trackID);
    if (dimensions === "2D") return [song.UMAP2D.UMAP_1, song.UMAP2D.UMAP_2];
    return [song.UMAP3D.UMAP_1, song.UMAP3D.UMAP_2, song.UMAP3D.UMAP_3];
  };

  const lineIDs = questions.map((q) => {
    const X = getCoords(q.X);
    const A = getCoords(q.A);
    const B = getCoords(q.B);

    return dimensions === "2D"
      ? {x: [A[0], X[0], B[0]], y: [A[1], X[1], B[1]]}
      : {x: [A[0], X[0], B[0]], y: [A[1], X[1], B[1]], z: [A[2], X[2], B[2]]};
  });

  lineIDs.forEach((line, index) => {
    this.added("linesCollection", index.toString(), line);
  });

  this.ready();
});

Meteor.publish("surveyQuestions.paginated", async function ({query, next, previous}) {
  if (!(await isAdminUser(this.userId))) return this.ready();

  const numericFields = ["questionnaireID", "questionNumber"];
  const booleanFields = [];
  const {skip, ...q} = query || {};
  let newQuery = buildPaginationQuery({query: q, numericFields, booleanFields});

  if (skip) newQuery["skip"] = true;

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
