import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Particitpants} from "./collection";
import {participantSchema} from "./schema";

export const PARTICIPANTS = {
  new: new ValidatedMethod({
    name: "participants.new",
    validate: new SimpleSchema({
      participant: {type: participantSchema, blackbox: true},
    }).validator(),
    async run({participant}) {
      if (this.isSimulation) return;

      const itemID = await Particitpants.insertAsync(participant);

      return itemID;
    },
  }),
};
