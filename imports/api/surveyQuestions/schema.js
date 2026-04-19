import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const surveyQuestionSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.Integer},
  questionNumber: {type: Number},
  X: {type: Number},
  A: {type: Number},
  B: {type: Number},
  skip: {type: Boolean, optional: true},
}).extend(dbMetadataSchema);

export const questionnairesSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.Integer},
  participantCount: {type: SimpleSchema.Integer, optional: true},
  questionsSkipped: {type: SimpleSchema.Integer, optional: true},
  skip: {type: Boolean, optional: true},
});
