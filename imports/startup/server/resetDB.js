import {Counters} from "@/imports/api/collection/counters";
import {Particitpants} from "@/imports/api/participants/collection";
import {SurveyAnswers} from "@/imports/api/surveyAnswers/collection";
import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";

export async function resetDB() {
  const collections = [Counters, Particitpants, SurveyAnswers, SurveyQuestions];

  collections.map((c) => c.rawCollection().drop());
}
