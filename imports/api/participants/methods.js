import {TEST_QUESTIONNAIRE_ID} from "@/imports/common/globals";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {Participants} from "./collection";

export const PARTICIPANTS = {
  newParticipant: new ValidatedMethod({
    name: "participants.newParticipant",
    validate: null,
    async run() {
      if (this.isSimulation) return;

      const itemID = await Participants.insertAsync({
        questionnaireID: TEST_QUESTIONNAIRE_ID,
      });

      return itemID;
    },
  }),
};
