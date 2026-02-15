import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";
import {SurveyAnswers} from "./collection";
import {surveyAnswersSchema} from "./schema";

export const SURVEY_ANSWERS = {
  setAnswer: new ValidatedMethod({
    name: "surveyAnswers.setAnswer",
    validate: surveyAnswersSchema.validator(),
    async run(surveyAnswer) {
      if (this.isSimulation) return;

      // additional validation
      const participant = await Participants.findOneAsync(surveyAnswer.participantID);
      if (!participant) throw new Meteor.Error("participant-not-found");
      const question = await SurveyQuestions.findOneAsync(surveyAnswer.questionID);
      if (!question) throw new Meteor.Error("question-not-found");
      const existing = await SurveyAnswers.findOneAsync({
        participantID: surveyAnswer.participantID,
        questionID: surveyAnswer.questionID,
      });

      // upsert answer
      let result;
      if (existing) {
        result = await SurveyAnswers.updateAsync(existing._id, {
          $set: {surveyAnswer: surveyAnswer.answer, editDate: new Date()},
        });
      } else {
        result = await SurveyAnswers.insertAsync(surveyAnswer);
      }

      // set surveyCompleted
      const countSurveyAnswers = await SurveyAnswers.find({participantID: surveyAnswer.participantID}).countAsync();
      const countQuestions = await SurveyQuestions.find({questionnaireID: participant.questionnaireID}).countAsync();
      if (countQuestions === countSurveyAnswers && !participant.surveyCompleted) {
        await Participants.updateAsync(surveyAnswer.participantID, {
          $set: {
            surveyCompleted: true,
          },
        });
      }

      return result;
    },
  }),
};
