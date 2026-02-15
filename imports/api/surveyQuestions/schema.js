import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const audioSchema = new SimpleSchema({
  folder: {type: String},
  filename: {type: String},
  genre: {type: String, optional: true},

  artist: {type: String, optional: true},
  artistLocation: {type: String, optional: true},

  album: {type: String, optional: true},
  albumDateCreated: {type: Date, optional: true},
  albumDateReleased: {type: Date, optional: true},
}).extend(dbMetadataSchema);

export const surveyQuestionSchema = new SimpleSchema({
  questionnaireID: {type: String},
  questionNumber: {type: Number},
  X: audioSchema,
  A: audioSchema,
  B: audioSchema,
}).extend(dbMetadataSchema);
