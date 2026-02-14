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

      const participant = await Particitpants.findOneAsync(answer.participantID);
      if (!participant) throw new Meteor.Error("participant-not-found");

      const question = await SurveyQuestions.findOneAsync(answer.tripletID);
      if (!question) throw new Meteor.Error("question-not-found");

      const existing = await SurveyAnswers.findOneAsync({
        participantID: answer.participantID,
        tripletID: answer.tripletID,
      });

      if (existing) {
        return await SurveyAnswers.updateAsync(existing._id, {
          $set: {answer: answer.answer, editDate: new Date()},
        });
      } else {
        return await SurveyAnswers.insertAsync(answer);
      }
    },
  }),
};
