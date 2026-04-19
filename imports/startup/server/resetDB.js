import {Counters} from "@/imports/api/collection/counters";
import {Participants} from "@/imports/api/participants/collection";
import {Songs} from "@/imports/api/songs/collection";
import {SurveyAnswers} from "@/imports/api/surveyAnswers/collection";
import {Questionnaires, SurveyQuestions} from "@/imports/api/surveyQuestions/collection";

export async function resetDB() {
  const collections = [Counters, Participants, SurveyAnswers, SurveyQuestions, Songs, Questionnaires];

  await Meteor.users.removeAsync({});
  collections.map(async (c) => await c.rawCollection().drop());
}
