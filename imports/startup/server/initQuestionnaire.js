import {QuestionnaireStats, SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {NUM_QUESTIONNAIRES, NUM_QUESTIONS_PER_SURVEY} from "@/imports/common/config";
import {TRIPLETS_FILE_PATH} from "@/imports/common/globals";
import {Log} from "meteor/logging";
import ndarray from "ndarray";
import {fromArrayBuffer} from "numpy-parser";

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

  let questionnaireIDs = new Set();
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
    questionnaireIDs.add(i);
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

    questionnaireIDs.add(i);
  }
  return {all_questions, questionnaireIDs: Array.from(questionnaireIDs)};
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

    const {all_questions: questionnaires, questionnaireIDs} = generateQuestionnaires({num_questionnaires, tripletArray});

    await Promise.all(
      questionnaireIDs.map(async (ID) => {
        await QuestionnaireStats.insertAsync({
          questionnaireID: ID,
          participantCount: 0,
          skip: false,
        });
      }),
    );

    await Promise.all(
      questionnaires.map(async (q) => {
        await SurveyQuestions.insertAsync(q);
      }),
    );
  } catch (error) {
    Log.error(error);
    Log.info(tripletURL);
  }
}
