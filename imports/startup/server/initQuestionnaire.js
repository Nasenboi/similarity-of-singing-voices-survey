import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {TEST_QUESTIONNAIRE} from "@/imports/common/globals";

export async function initQuestionnaire() {
  await SurveyQuestions.removeAsync({});

  await Promise.all(
    TEST_QUESTIONNAIRE.map(async (q) => {
      await SurveyQuestions.insertAsync(q);
      return;
    }),
  );

  console.log(
    "fetched data",
    (await SurveyQuestions.find({}).fetch()).map((q) => [q.number, q.itemNumber, q._id]),
  );
}
