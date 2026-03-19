import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {
  DATASET_FILE_PATH,
  FILE_SERVER_URL,
  NUM_QUESTIONS_PER_BATCH,
  NUM_Questionnaires,
  SONG_FILE_PATH,
  TRIPLETS_FILE_PATH,
  VOCAL_FILE_PATH,
} from "@/imports/common/globals";
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

function getTrackID(args) {
  return args.tripletArray.get(args.cluster, args.batchNo, args.pos);
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
  };
}

function generateSingleQuestionnaire(args) {
  let useRandom = false;
  let questions = [];

  // just move on in the array, not every question is present at least once
  // else use randomly picked batchNos (not happening yet buddy!)
  if (args.questionnaireID * NUM_QUESTIONS_PER_BATCH > args.tripletArray.shape[2]) {
    useRandom = true;
  }

  for (let cluster = 0; cluster < args.tripletArray.shape[0]; cluster++) {
    // default to useRandom == False:
    for (let i = 0; i < NUM_QUESTIONS_PER_BATCH; i++) {
      let batchNo = args.questionnaireID * NUM_QUESTIONS_PER_BATCH + i;
      questions.push(generateQuestion({...args, questionNumber: questions.length, cluster, batchNo}));
    }
  }
  return questions;
}

function generateQuestionnaires(args) {
  let all_questions = [];
  for (let i = 0; i < NUM_Questionnaires; i++) {
    all_questions = all_questions.concat(generateSingleQuestionnaire({...args, questionnaireID: i}));
  }
  return all_questions;
}

export async function initQuestionnaire() {
  const tripletURL = `${FILE_SERVER_URL}/${TRIPLETS_FILE_PATH}`;

  try {
    // Fetch triplets.npy
    const tripletResponse = await fetch(tripletURL);
    const tripletBuffer = await tripletResponse.arrayBuffer();
    const {data, shape} = fromArrayBuffer(tripletBuffer);
    const tripletArray = ndarray(data, shape);

    const questionnaires = generateQuestionnaires({tripletArray});

    questionnaires.map(async (q) => {
      await SurveyQuestions.insertAsync(q);
    });
  } catch (error) {
    console.error(error);
  }
}
