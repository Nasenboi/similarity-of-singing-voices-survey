import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {SurveyAnswers} from "./collection";

Meteor.publish("surveyAnswers.participant", function (participantID) {
  check(participantID, String);

  return SurveyAnswers.find({participantID});
});
