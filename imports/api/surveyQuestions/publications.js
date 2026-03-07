import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "./collection";

Meteor.publish("surveyQuestions.participant", async function (participantID) {
  check(participantID, String);
  const participant = await Participants.findOneAsync(participantID);
  if (!participant) return;

  return SurveyQuestions.find({questionnaireID: Number(participant.questionnaireID)}, {sort: {questionNumber: 1}});
});
