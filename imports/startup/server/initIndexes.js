import {Participants} from "@/imports/api/participants/collection";
import {Songs} from "@/imports/api/songs/collection";
import {SurveyAnswers} from "@/imports/api/surveyAnswers/collection";
import {SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {INDEX_MAP} from "@/imports/common/config";

async function indexCollection({collection, indexField}) {
  try {
    const rawCollection = collection.rawCollection();

    await rawCollection.createIndex({[indexField]: 1}, {unique: true});
  } catch (e) {
    console.error(e);
  }
}

const indexMap = [
  {collection: Participants, indexField: INDEX_MAP.PARTICIPANTS},
  {collection: Songs, indexField: INDEX_MAP.SONGS},
  {collection: SurveyAnswers, indexField: INDEX_MAP.SURVEY_ANSWERS},
  {collection: SurveyQuestions, indexField: INDEX_MAP.SURVEY_QUESTIONS},
];

export async function initIndexes() {
  await Promise.all(indexMap.map((i) => indexCollection(i)));
}
