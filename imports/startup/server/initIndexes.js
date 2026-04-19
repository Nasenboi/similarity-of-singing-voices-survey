import {Participants} from "@/imports/api/participants/collection";
import {Songs} from "@/imports/api/songs/collection";
import {SurveyAnswers} from "@/imports/api/surveyAnswers/collection";
import {Questionnaires, SurveyQuestions} from "@/imports/api/surveyQuestions/collection";
import {INDEX_MAP} from "@/imports/common/config";

async function indexCollection({collection, indexField}) {
  try {
    const rawCollection = collection.rawCollection();
    dropCollectionIndices(rawCollection);

    await rawCollection.createIndex({[indexField]: 1}, {unique: true});
  } catch (e) {
    console.error(e);
  }
}

async function dropCollectionIndices(rawCollection) {
  await rawCollection.dropIndexes().catch((e) => console.error("could not drop collection indices. Codename", e.codeName));
}

const indexMap = [
  {collection: Participants, indexField: INDEX_MAP.PARTICIPANTS},
  {collection: Songs, indexField: INDEX_MAP.SONGS},
  {collection: SurveyAnswers, indexField: INDEX_MAP.SURVEY_ANSWERS},
  {collection: SurveyQuestions, indexField: INDEX_MAP.SURVEY_QUESTIONS},
  {collection: Questionnaires, indexField: INDEX_MAP.QUESTIONNAIRES},
];

export async function initIndexes() {
  await Promise.all(indexMap.map((i) => indexCollection(i)));
}
