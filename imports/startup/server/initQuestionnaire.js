import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {TEST_QUESTIONNAIRE} from "@/imports/common/globals";

export async function initQuestionnaire() {
  await SurveyQuestions.remove({});
  await SurveyQuestions.insertAsync(TEST_QUESTIONNAIRE);
}
