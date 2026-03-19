import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";
import {Songs} from "./collection";

Meteor.publish("songs.participant", async function (participantID) {
  check(participantID, String);
  const participant = await Participants.findOneAsync(participantID);
  if (!participant) return;

  const surveyQuestions = await SurveyQuestions.find(
    {questionnaireID: Number(participant.questionnaireID)},
    {sort: {questionNumber: 1}},
  ).fetchAsync();

  const trackIDs = surveyQuestions.flatMap((q) => [q.X, q.A, q.B]);
  const uniqueTrackIDs = [...new Set(trackIDs)];
  return Songs.find({trackID: {$in: uniqueTrackIDs}});
});

Meteor.publish("songs.surveyQuestion", async function (questionnaireID, questionNumber) {
  const surveyQuestion = await SurveyQuestions.findOneAsync({questionnaireID, questionNumber});
  if (!surveyQuestion) return;

  const trackIDs = [surveyQuestion.X, surveyQuestion.A, surveyQuestion.B].map(Number);
  return Songs.find({trackID: {$in: trackIDs}});
});
