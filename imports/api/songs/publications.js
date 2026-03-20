import {Meteor} from "meteor/meteor";
import {isAdminUser} from "../users/helpers";
import {Songs} from "./collection";

Meteor.publish("songs.single", function (trackID) {
  return Songs.find({trackID});
});

Meteor.publish("songs.all", async function () {
  if (!(await isAdminUser(this.userId))) return;
  return Songs.find();
});

/*
unused other ideas:
import {check} from "meteor/check";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";

Meteor.publish("songs.all", async function () {
  if (!(await isAdminUser(this.userId))) return;
  return Songs.find();
});


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
*/
