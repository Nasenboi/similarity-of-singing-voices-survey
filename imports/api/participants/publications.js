import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {Particitpants} from "./collection";

Meteor.publish("participants.single", function (participantID) {
  check(participantID, String);

  return Particitpants.find(participantID);
});
