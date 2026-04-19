import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {SurveyAnswers} from "../surveyAnswers/collection";
import {getQuestionnaireIDAtomic} from "../surveyQuestions/helpers";
import {isAdminUser} from "../users/helpers";
import {getYesterday, toCSV} from "../utils";
import {Participants} from "./collection";

export const PARTICIPANTS = {
  newParticipant: new ValidatedMethod({
    name: "participants.newParticipant",
    validate: null,
    async run() {
      if (this.isSimulation) return;

      const questionnaireID = await getQuestionnaireIDAtomic();
      const itemID = await Participants.insertAsync({
        questionnaireID,
      });

      console.log(`Created new participant with questionnaire ID ${questionnaireID}`);

      return itemID;
    },
  }),
  getParticipant: new ValidatedMethod({
    name: "participants.getParticipant",
    validate: new SimpleSchema({
      participantID: {type: String},
    }).validator(),
    async run({participantID}) {
      if (this.isSimulation) return;

      const participant = await Participants.findOneAsync(participantID);

      return participant;
    },
  }),
  removeParticipant: new ValidatedMethod({
    name: "participants.removeParticipant",
    validate: new SimpleSchema({
      participantID: {type: String},
    }).validator(),
    async run({participantID}) {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;

      await Participants.removeAsync(participantID);
      await SurveyAnswers.removeAsync({participantID});
    },
  }),
  removeInactiveParticipants: new ValidatedMethod({
    name: "participants.removeInactiveParticipant",
    validate: null,
    async run() {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;

      const toDate = getYesterday();

      const query = {};
      if (toDate) query.createDate = {$lte: toDate};
      const participantsWithAnswers = await SurveyAnswers.rawCollection().distinct("participantID");
      query["_id"] = {$nin: participantsWithAnswers};

      return await Participants.removeAsync(query);
    },
  }),
  downloadCSV: new ValidatedMethod({
    name: "participants.downloadCSV",
    validate: null,
    async run() {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;
      const participants = await Participants.find({}).fetch();
      const csv = toCSV(participants);
      return csv;
    },
  }),
};
