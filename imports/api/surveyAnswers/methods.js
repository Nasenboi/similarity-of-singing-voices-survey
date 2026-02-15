import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Particitpants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";
import {SurveyAnswers} from "./collection";
import {surveyAnswersSchema} from "./schema";

export const SURVEY_ANSWERS = {
  setAnswer: new ValidatedMethod({
    name: "surveyAnswers.setAnswer",
    validate: new SimpleSchema({
      answer: {type: surveyAnswersSchema, blackbox: true},
    }).validator(),
    async run({answer}) {
      if (this.isSimulation) return;

      // additional validation
      const participant = await Particitpants.findOneAsync(answer.participantID);
      if (!participant) throw new Meteor.Error("participant-not-found");
      const question = await SurveyQuestions.findOneAsync(answer.questionID);
      if (!question) throw new Meteor.Error("question-not-found");
      const existing = await SurveyAnswers.findOneAsync({
        participantID: answer.participantID,
        questionID: answer.questionID,
      });

      // upsert answer
      let result;
      if (existing) {
        result = await SurveyAnswers.updateAsync(existing._id, {
          $set: {answer: answer.answer, editDate: new Date()},
        });
      } else {
        result = await SurveyAnswers.insertAsync(answer);
      }

      // set surveyCompleted
      const countSurveyAnswers = await SurveyAnswers.find({participantID: answer.participantID}).countAsync();
      const countQuestions = await SurveyQuestions.find({questionnaireID: participant.questionnaireID}).countAsync();
      if (countQuestions === countSurveyAnswers && !participant.surveyCompleted) {
        await Particitpants.updateAsync(answer.participantID, {
          $set: {
            surveyCompleted: true,
          },
        });
      }

      return result;
    },
  }),
};
