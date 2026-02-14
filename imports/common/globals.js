export const APP_NAME = "Similarity of Singing Voices Survey";
export const APP_VERSION = "0.0.0";

export const AUDIO_FILE_SERVER_URL = "http://localhost:3003/files/";

export const TEST_QUESTIONNAIRE_ID = "test_questionnaire";
export const TEST_QUESTIONNAIRE_LENGTH = 15;
export const TEST_QUESTIONNAIRE = [...Array(TEST_QUESTIONNAIRE_LENGTH).keys()].map((i) => {
  return {
    questionnaireID: TEST_QUESTIONNAIRE_ID,
    number: i,
    X: {folder: "000", filename: "000002.mp3"},
    A: {folder: "000", filename: "000003.mp3"},
    B: {folder: "000", filename: "000010.mp3"},
  };
});
