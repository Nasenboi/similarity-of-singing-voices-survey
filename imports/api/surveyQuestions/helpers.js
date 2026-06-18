import {MIN_NUM_QUESTIONS_PER_SURVEY, NUM_QUESTIONS_PER_SURVEY} from "@/imports/common/config";
import {Log} from "meteor/logging";
import {Meteor} from "meteor/meteor";
import {Participants} from "../participants/collection";
import {Songs} from "../songs/collection";
import {Questionnaires, SurveyQuestions} from "./collection";

export async function getQuestionnaireIDAtomic() {
  const result = await Questionnaires.rawCollection().findOneAndUpdate(
    {skip: {$ne: true}},
    {$inc: {participantCount: 1}},
    {
      sort: {participantCount: 1, questionnaireID: 1},
      returnDocument: "after",
    },
  );

  if (result?.questionnaireID == null || result?.questionnaireID == undefined) {
    throw Meteor.Error("No valid questionnaire found!");
  }

  return result.questionnaireID;
}

async function updateQuestionnaireAtomic(questionnaireID) {
  const [participantCount, questionsSkipped, activeQuestions] = await Promise.all([
    Participants.countAsync({questionnaireID}),
    SurveyQuestions.countAsync({questionnaireID, skip: true}),
    SurveyQuestions.countAsync({questionnaireID, skip: false}),
  ]);

  await Questionnaires.rawCollection().findOneAndUpdate(
    {questionnaireID},
    {
      $set: {
        participantCount,
        questionsSkipped,
        skip: activeQuestions < MIN_NUM_QUESTIONS_PER_SURVEY,
      },
    },
    {upsert: true},
  );
}

export async function refreshQuestionnaires() {
  const questionnaireIDs = await SurveyQuestions.rawCollection().distinct("questionnaireID");
  await Promise.all(questionnaireIDs.map(updateQuestionnaireAtomic));
}

export async function resetQuestionnaires() {
  const questionnaireIDs = await SurveyQuestions.rawCollection().distinct("questionnaireID");
  await Questionnaires.removeAsync({});

  const processQuestionnaire = async (questionnaireID) => {
    const questionnaire = {questionnaireID};
    questionnaire.participantCount = await Participants.countAsync({questionnaireID});
    questionnaire.questionsSkipped = await SurveyQuestions.countAsync({questionnaireID, skip: true});
    questionnaire.skip = (await SurveyQuestions.countAsync({questionnaireID, skip: false})) < MIN_NUM_QUESTIONS_PER_SURVEY;
    await Questionnaires.insertAsync(questionnaire);
  };

  await Promise.all(questionnaireIDs.map(processQuestionnaire));
}

export async function toggleQuestionSkip({trackID, skipInSurvey}) {
  const query = {$or: [{X: trackID}, {A: trackID}, {B: trackID}]};

  await SurveyQuestions.updateAsync(query, {$set: {skip: skipInSurvey}}, {multi: true});

  const affectedQuestions = await SurveyQuestions.find(query).fetchAsync();
  const affectedQuestionnaires = [...new Set(affectedQuestions.map((q) => q.questionnaireID))];

  for (const questionnaireID of affectedQuestionnaires) {
    const questions = await SurveyQuestions.find({questionnaireID}, {sort: {questionNumber: 1}}).fetchAsync();

    let counter = 0;

    for (const q of questions) {
      if (!q.skip) {
        await SurveyQuestions.updateAsync(q._id, {
          $set: {questionNumber: counter},
        });
        counter++;
      }
    }
    const skip = counter + 1 < MIN_NUM_QUESTIONS_PER_SURVEY;
    const questionsSkipped = await SurveyQuestions.countAsync({questionnaireID, skip: true});

    await Questionnaires.updateAsync({questionnaireID}, {$set: {skip, questionsSkipped}});
  }
}

function generateRandomTriplet({currentTriplets, trackIDs, maxTries = 1000}) {
  let randomTriplet;

  for (let i = 0; i < maxTries; ++i) {
    randomTriplet = new Set();
    while (randomTriplet.size < 3) {
      randomTriplet.add(trackIDs[Math.floor(Math.random() * trackIDs.length)]);
    }
    randomTriplet = [...randomTriplet];
    const key = JSON.stringify(randomTriplet);
    if (!currentTriplets.includes(key)) return randomTriplet;
  }

  Log.error("Could not generate a unique random triplet, using last tried version!");
  return randomTriplet;
}

export async function generateRandomQuestionnaire({questionnaireID}) {
  Log.debug(`Generating random questionnaire with ID ${questionnaireID}`);

  // get available and usable trackIDs
  const trackIDs = [
    ...new Set((await Songs.find({skipInSurvey: false}, {fields: {trackID: 1}}).fetchAsync()).map((s) => s.trackID)),
  ];

  // get current questions as triplets
  const currentTriplets = (await SurveyQuestions.find({skip: false}, {fields: {X: 1, A: 1, B: 1}}).fetchAsync()).map((q) =>
    JSON.stringify([q.X, q.A, q.B]),
  );

  await Questionnaires.insertAsync({
    questionnaireID,
    participantCount: 0,
    questionsSkipped: 0,
    skip: false,
    isRandomized: true,
  });

  for (let questionNumber = 0; questionNumber < NUM_QUESTIONS_PER_SURVEY; ++questionNumber) {
    const randomTriplet = generateRandomTriplet({currentTriplets, trackIDs});
    const [X, A, B] = randomTriplet;

    await SurveyQuestions.insertAsync({
      questionnaireID,
      questionNumber,
      X,
      A,
      B,
      skip: false,
    });

    currentTriplets.push(JSON.stringify(randomTriplet));
  }
}
