import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const surveyAnswersSchema = new SimpleSchema({
  participantID: {type: String},
  questionID: {type: String},
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

SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      mustBeExactlyTwo: "Answer array must contain exactly 2 items",
      mustContainAB: "Answer array must contain each 'A' and 'B' once",
    },
  },
});
