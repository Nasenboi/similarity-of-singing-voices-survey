import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {Participants} from "./collection";

Meteor.publish("participants.single", async function (participantID) {
  check(participantID, String);

  return Participants.find(participantID);
});
