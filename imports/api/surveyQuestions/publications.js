import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {Particitpants} from "../participants/collection";
import {SurveyQuestions} from "./collection";

Meteor.publish("surveyQuestions.participant", async function (participantID) {
  check(participantID, String);
  const participant = await Particitpants.findOneAsync(participantID);
  if (!participant) return;

  return SurveyQuestions.find({questionnaireID: participant.questionnaireID});
});
