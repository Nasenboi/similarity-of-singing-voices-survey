import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {TEST_QUESTIONNAIRE} from "@/imports/common/globals";

export async function initQuestionnaire() {
  await SurveyQuestions.removeAsync({});
  await Promise.all(TEST_QUESTIONNAIRE.map((q) => SurveyQuestions.insertAsync(q)));
}
