import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const surveyQuestionSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.Integer},
  questionNumber: {type: Number},
  X: {type: Number},
  A: {type: Number},
  B: {type: Number},
  skip: {type: Boolean, optional: true, defaultValue: false},
}).extend(dbMetadataSchema);
