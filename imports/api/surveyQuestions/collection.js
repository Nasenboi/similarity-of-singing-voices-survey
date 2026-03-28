import {Mongo} from "meteor/mongo";
import {Collection} from "../collection/collection";
import {surveyQuestionSchema} from "./schema";

export const SurveyQuestions = new Collection("surveyQuestions", surveyQuestionSchema);
export const QuestionnaireStats = new Mongo.Collection("questionnaireStats");
