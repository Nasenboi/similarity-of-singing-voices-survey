import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {NUM_QUESTIONNAIRES, NUM_QUESTIONS_PER_SURVEY} from "@/imports/common/config";
import {TRIPLETS_FILE_PATH} from "@/imports/common/globals";
import {Log} from "meteor/logging";
import ndarray from "ndarray";
import {fromArrayBuffer} from "numpy-parser";

/*
await Promise.all(
  TEST_QUESTIONNAIRE.map(async (q) => {
    await SurveyQuestions.insertAsync(q);
    return;
  }),
);


function getObjectFromID(args) {
  const oID = args.tripletArray.get(args.cluster, args.batchNo, args.pos);
  const obj = args.dataset.find((a) => a.track_id === oID);
  return convertToAudioSchema(obj);
}
*/

const shuffle = (arr) =>
  arr
    .map((v) => ({v, r: Math.random()}))
    .sort((a, b) => a.r - b.r)
    .map(({v}) => v);

function getTrackID(args) {
  return Number(args.tripletArray.get(args.batchNo, args.pos));
}

function generateQuestion(args) {
  const X = getTrackID({...args, pos: 0});
  const A = getTrackID({...args, pos: 1});
  const B = getTrackID({...args, pos: 2});

  return {
    questionnaireID: args.questionnaireID,
    questionNumber: args.questionNumber,
    X,
    A,
    B,
    skip: false,
  };
}

function generateSingleQuestionnaire(args) {
  let questions = [];

  args.batchIndicies.map((batchNo) =>
    questions.push(generateQuestion({...args, questionNumber: questions.length, batchNo})),
  );

  return questions;
}

function generateQuestionnaires(args) {
  let all_questions = [];
  const numQuestions = args.tripletArray.shape[0];
  const minNumQuestionnairs = Math.floor(numQuestions / NUM_QUESTIONS_PER_SURVEY);
  const allBatchIndicies = Array.from({length: numQuestions}, (_, i) => i);

  let batchIndicies = [];

  // evenly spaced indices
  for (let i = 0; i < minNumQuestionnairs; ++i) {
    batchIndicies = allBatchIndicies.filter((_, idx) => idx % minNumQuestionnairs === i).slice(0, NUM_QUESTIONS_PER_SURVEY);

    all_questions = all_questions.concat(
      generateSingleQuestionnaire({
        ...args,
        questionnaireID: i,
        batchIndicies,
      }),
    );
  }

  // random unique indices
  for (let i = minNumQuestionnairs; i < args.num_questionnaires; ++i) {
    batchIndicies = shuffle(allBatchIndicies).slice(0, NUM_QUESTIONS_PER_SURVEY);

    all_questions = all_questions.concat(
      generateSingleQuestionnaire({
        ...args,
        questionnaireID: i,
        batchIndicies,
      }),
    );
  }
  return all_questions;
}

export async function initQuestionnaire() {
  const tripletURL = `${Meteor.settings.private.FILE_SERVER_URL}${TRIPLETS_FILE_PATH}`;

  try {
    // Fetch triplets.npy
    const tripletResponse = await fetch(tripletURL);
    const tripletBuffer = await tripletResponse.arrayBuffer();
    const {data, shape} = fromArrayBuffer(tripletBuffer);
    const tripletArray = ndarray(data, shape);

    const num_questionnaires = Math.max(tripletArray.shape[0] / NUM_QUESTIONS_PER_SURVEY, NUM_QUESTIONNAIRES);

    const questionnaires = generateQuestionnaires({num_questionnaires, tripletArray});

    questionnaires.map(async (q) => {
      await SurveyQuestions.insertAsync(q);
    });
  } catch (error) {
    Log.error(error);
    Log.info(tripletURL);
  }
}
