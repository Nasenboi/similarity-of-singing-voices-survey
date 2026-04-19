import {Collection} from "../collection/collection";
import {questionnairesSchema, surveyQuestionSchema} from "./schema";

export const SurveyQuestions = new Collection("surveyQuestions", surveyQuestionSchema);
export const Questionnaires = new Collection("questionnaires", questionnairesSchema);
