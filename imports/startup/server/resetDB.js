import {Counters} from "@/imports/api/collection/counters";
import {Participants} from "@/imports/api/participants/collection";
import {Songs} from "@/imports/api/songs/collection";
import {SurveyAnswers} from "@/imports/api/surveyAnswers/collection";
import {QuestionnaireStats, SurveyQuestions} from "@/imports/api/surveyQuestions/collection";

export async function resetDB() {
  const collections = [Counters, Participants, SurveyAnswers, SurveyQuestions, Songs, QuestionnaireStats];

  await Meteor.users.removeAsync({});
  collections.map(async (c) => await c.rawCollection().drop());
}
