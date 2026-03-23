import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {toCSV} from "../utils";
import {SurveyQuestions} from "./collection";

export const SURVEY_QUESTIONS = {
  downloadCSV: new ValidatedMethod({
    name: "surveyQuestions.downloadCSV",
    validate: new SimpleSchema({}).validator(),
    async run() {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;
      const surveyQuestions = await SurveyQuestions.find({}).fetch();
      const csv = toCSV(surveyQuestions);
      return csv;
    },
  }),
};
