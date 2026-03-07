import {ValidatedMethod} from "meteor/mdg:validated-method";
import {getCounterValue} from "../collection/counters";
import {SurveyQuestions} from "../surveyQuestions/collection";
import {Participants} from "./collection";

export const PARTICIPANTS = {
  newParticipant: new ValidatedMethod({
    name: "participants.newParticipant",
    validate: null,
    async run() {
      if (this.isSimulation) return;

      const questionnaireCount = await SurveyQuestions.countAsync();
      const estimatedParticipantCounter = (await getCounterValue("participants")) + 1;

      const itemID = await Participants.insertAsync({
        questionnaireID: (estimatedParticipantCounter % questionnaireCount) - 1,
      });

      return itemID;
    },
  }),
};
