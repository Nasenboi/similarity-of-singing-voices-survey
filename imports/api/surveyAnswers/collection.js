import {Collection} from "../collection/collection";
import {surveyAnswersSchema} from "./schema";

export const SurveyAnswers = new Collection("surveyAnswers", surveyAnswersSchema);
