import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const participantSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.Integer},
  surveyCompleted: {type: Boolean, optional: true, defaultValue: false},
}).extend(dbMetadataSchema);
