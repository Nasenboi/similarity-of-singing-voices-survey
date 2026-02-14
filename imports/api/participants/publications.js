import {Meteor} from "meteor/meteor";
import {Particitpants} from "./collection";

Meteor.publish("participants.single", async function (participantID) {
  check(participantID, string);

  return await Particitpants.findOneAsync(participantID);
});
