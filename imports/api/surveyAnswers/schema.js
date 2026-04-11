import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const surveyAnswersSchema = new SimpleSchema({
  participantID: {type: String},
  questionID: {type: String},
  backgroundMusic: {type: Boolean, optional: true},
  answer: {
    type: Array,
    custom() {
      const answers = this.value;
      if (answers.length !== 2) return "mustBeExactlyTwo";
      if (!answers.includes("A") || !answers.includes("B")) return "mustContainAB";
      return true;
    },
  },
  "answer.$": {type: String, allowedValues: ["A", "B"]},
}).extend(dbMetadataSchema);
