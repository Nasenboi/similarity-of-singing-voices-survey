import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const surveyQuestionSchema = new SimpleSchema({}).extend(dbMetadataSchema);
