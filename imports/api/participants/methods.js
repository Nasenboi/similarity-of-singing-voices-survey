import {ValidatedMethod} from "meteor/mdg:validated-method";
import {getNextQuestionnaireID} from "../surveyQuestions/helpers";
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
};
