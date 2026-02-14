import {Meteor} from "meteor/meteor";
import {SurveyAnswers} from "./collection";

Meteor.publish("surveyAnswers.participant", function (participantID) {
  check(participantID, string);

  return SurveyAnswers.find({participantID});
});
