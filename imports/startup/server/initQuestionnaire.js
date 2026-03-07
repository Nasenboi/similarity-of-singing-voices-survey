import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {
  DATASET_FILE_PATH,
  FILE_SERVER_URL,
  NUM_QUESTIONS_PER_BATCH,
  NUM_Questionnaires,
  SONG_FILE_PATH,
  TRIPLETS_FILE_PATH,
  VOCALS_FILE_PATH,
} from "@/imports/common/globals";
import ndarray from "ndarray";
import {fromArrayBuffer} from "numpy-parser";
import Papa from "papaparse";

/*
await Promise.all(
  TEST_QUESTIONNAIRE.map(async (q) => {
    await SurveyQuestions.insertAsync(q);
    return;
  }),
);
*/

function convertToAudioSchema(audio) {
  return {
    trackID: audio.track_id,
    filename: audio.filename,
    genre: audio.genre_top,
    artist: audio.artist,
    album: audio.album,
    albumDateCreated: audio.creation_date,
    albumDateReleased: audio.release_date,
    songSubPath: audio.song_path,
    vocalSubPath: audio.vocal_path,
  };
}

function getObjectFromID(args) {
  const oID = args.tripletArray.get(args.cluster, args.batchNo, args.pos);
  const obj = args.dataset.find((a) => a.track_id === oID);
  return convertToAudioSchema(obj);
}

function generateQuestion(args) {
  const X = getObjectFromID({...args, pos: 0});
  const A = getObjectFromID({...args, pos: 1});
  const B = getObjectFromID({...args, pos: 2});

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
  const datasetURL = `${FILE_SERVER_URL}/${DATASET_FILE_PATH}`;
  const tripletURL = `${FILE_SERVER_URL}/${TRIPLETS_FILE_PATH}`;

  try {
    const datasetResponse = await fetch(datasetURL);
    const datasetText = await datasetResponse.text();
    const dataset = Papa.parse(datasetText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    }).data;

    // Fetch triplets.npy
    const tripletResponse = await fetch(tripletURL);
    const tripletBuffer = await tripletResponse.arrayBuffer();
    const {data, shape} = fromArrayBuffer(tripletBuffer);
    const tripletArray = ndarray(data, shape);

    let questionnaires = generateQuestionnaires({dataset, tripletArray});

    questionnaires.map(async (q) => {
      await SurveyQuestions.insertAsync(q);
    });
  } catch (error) {
    console.error(error);
  }
}
