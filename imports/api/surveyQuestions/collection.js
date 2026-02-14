import {Collection} from "../collection/collection";
import {surveyQuestionSchema} from "./schema";

export const SurveyQuestions = new Collection("surveyQuestions", surveyQuestionSchema);
