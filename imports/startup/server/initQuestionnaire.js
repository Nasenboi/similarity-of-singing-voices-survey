import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {TEST_QUESTIONNAIRE} from "@/imports/common/globals";

export async function initQuestionnaire() {
  await Promise.all(
    TEST_QUESTIONNAIRE.map(async (q) => {
      await SurveyQuestions.insertAsync(q);
      return;
    }),
  );
}
