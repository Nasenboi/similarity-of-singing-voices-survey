import {MIN_NUM_QUESTIONS_PER_SURVEY} from "@/imports/common/config";
import {Meteor} from "meteor/meteor";
import {Questionnaires, SurveyQuestions} from "./collection";

export async function getQuestionnaireIDAtomic() {
  const result = await Questionnaires.rawCollection().findOneAndUpdate(
    {skip: {$ne: true}},
    {$inc: {participantCount: 1}},
    {
      sort: {participantCount: 1, questionnaireID: 1},
      returnDocument: "after",
    },
  );

  if (!result && result !== 0) {
    Meteor.Error("No valid questionnaire found!");
  }

  return result.questionnaireID;
}

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
    const skip = counter + 1 < MIN_NUM_QUESTIONS_PER_SURVEY;
    const questionsSkipped = await SurveyQuestions.countAsync({questionnaireID, skip: true});

    await Questionnaires.updateAsync({questionnaireID}, {$set: {skip, questionsSkipped}});
  }
}
