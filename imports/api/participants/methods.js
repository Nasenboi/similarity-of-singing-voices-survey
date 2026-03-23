import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {getNextQuestionnaireID} from "../surveyQuestions/helpers";
import {toCSV} from "../utils";
import {Participants} from "./collection";

export const PARTICIPANTS = {
  newParticipant: new ValidatedMethod({
    name: "participants.newParticipant",
    validate: null,
    async run() {
      if (this.isSimulation) return;

      const itemID = await Participants.insertAsync({
        questionnaireID: await getNextQuestionnaireID(),
      });

      return itemID;
    },
  }),
  downloadCSV: new ValidatedMethod({
    name: "participants.downloadCSV",
    validate: new SimpleSchema({}).validator(),
    async run() {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;
      const participants = await Participants.find({}).fetch();
      const csv = toCSV(participants);
      return csv;
    },
  }),
};
