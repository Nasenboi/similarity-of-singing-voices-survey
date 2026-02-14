import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";

const TEST_QUESTIONNAIRE_ID = "test_questionnaire";
const TEST_QUESTIONNAIRE_LENGTH = 15;
const TEST_QUESTIONNAIRE = [...Array(TEST_QUESTIONNAIRE_LENGTH).keys()].map((i) => {
  return {
    questionnareID: TEST_QUESTIONNAIRE_ID,
    number: i,
    X: {folder: "000", filename: "000002.mp3"},
    A: {folder: "000", filename: "000003.mp3"},
    B: {folder: "000", filename: "000010.mp3"},
  };
});

export async function initQuestionnaire() {
  await SurveyQuestions.remove({});
  await SurveyQuestions.insertAsync(TEST_QUESTIONNAIRE);
}
