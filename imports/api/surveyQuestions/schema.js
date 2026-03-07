import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const audioSchema = new SimpleSchema({
  trackID: {type: SimpleSchema.oneOf(String, SimpleSchema.Integer)},
  filename: {type: String},
  genre: {type: String, optional: true},

  artist: {type: String, optional: true},

  album: {type: String, optional: true},
  albumDateCreated: {type: Date, optional: true},
  albumDateReleased: {type: Date, optional: true},

  songSubPath: {type: String, optional: true},
  vocalSubPath: {type: String, optional: true},
}).extend(dbMetadataSchema);

export const surveyQuestionSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.oneOf(String, SimpleSchema.Integer)},
  questionNumber: {type: Number},
  X: audioSchema,
  A: audioSchema,
  B: audioSchema,
}).extend(dbMetadataSchema);
