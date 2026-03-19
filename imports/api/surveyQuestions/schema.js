import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const surveyQuestionSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.oneOf(String, SimpleSchema.Integer)},
  questionNumber: {type: Number},
  X: {type: String},
  A: {type: String},
  B: {type: String},
}).extend(dbMetadataSchema);
