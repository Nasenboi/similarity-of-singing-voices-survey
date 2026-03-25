import {NUM_QUESTIONS_PER_SURVEY} from "@/imports/common/config";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "./collection";

export async function toggleQuestionSkip({trackID, skipInSurvey}) {
  const query = {$or: [{X: trackID}, {A: trackID}, {B: trackID}]};

  await SurveyQuestions.updateAsync(query, {$set: {skip: skipInSurvey}}, {multi: true});

  const affectedQuestions = await SurveyQuestions.find(query).fetchAsync();
  const affectedQuestionnaires = [...new Set(affectedQuestions.map((q) => q.questionnaireID))];

  for (const questionnaireID of affectedQuestionnaires) {
    const questions = await SurveyQuestions.find({questionnaireID}, {sort: {questionNumber: 1}}).fetchAsync();

    let counter = 0;

    for (const q of questions) {
      if (!q.skip) {
        await SurveyQuestions.updateAsync(q._id, {
          $set: {questionNumber: counter},
        });
        counter++;
      }
    }
  }
}

export async function getNextQuestionnaireID() {
  const NUM_QUESTIONS_PER_SURVEY_h = NUM_QUESTIONS_PER_SURVEY / 2;
  const questionnaireIDs = await SurveyQuestions.rawCollection().distinct("questionnaireID");
  const validQuestionnairesRaw = await Promise.all(
    questionnaireIDs.map(async (id) => {
      const count = await SurveyQuestions.countAsync({questionnaireID: id, skip: false});
      if (count >= NUM_QUESTIONS_PER_SURVEY_h) {
        return id;
      }
      return null;
    }),
  );
  const validQuestionnaires = validQuestionnairesRaw.filter(Boolean);

  const participantCount = await Promise.all(
    validQuestionnaires.map(async (id) => await Participants.countAsync({questionnaireID: id})),
  );

  let minIndex = 0;
  let minValue = participantCount[0] ?? Infinity;
  for (let i = 1; i < participantCount.length; i++) {
    if (participantCount[i] < minValue) {
      minValue = participantCount[i];
      minIndex = i;
    }
  }
  return validQuestionnaires[minIndex];
}
