import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";
import {isAdminUser} from "../users/helpers";
import {toCSV} from "../utils";
import {Songs} from "./collection";
import {compaintSchema} from "./schema";
import {transformSongToCSVRow} from "./utils";

export const SONGS = {
  addComplaint: new ValidatedMethod({
    name: "songs.addComplaint",
    validate: new SimpleSchema({
      trackID: {type: Number},
      complaint: {type: compaintSchema},
    }).validator(),
    async run({trackID, complaint}) {
      if (this.isSimulation) return;
      if (!(await Participants.findOneAsync(complaint.participantID))) return;

      const result = await Songs.updateAsync(
        {trackID},
        {
          $push: {
            complaints: complaint,
          },
        },
      );

      return result;
    },
  }),
  toggleSkip: new ValidatedMethod({
    name: "songs.toggleSkip",
    validate: new SimpleSchema({
      trackID: {type: Number},
      skipInSurvey: {type: Boolean},
    }).validator(),
    async run({trackID, skipInSurvey}) {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;
      const result = await Songs.updateAsync({trackID}, {$set: {skipInSurvey}});

      await SurveyQuestions.updateAsync(
        {
          $or: [{X: trackID}, {A: trackID}, {B: trackID}],
        },
        {$set: {skip: skipInSurvey}},
        {multi: true},
      );

      return result;
    },
  }),
  downloadCSV: new ValidatedMethod({
    name: "songs.downloadCSV",
    validate: null,
    async run() {
      if (this.isSimulation) return;
      if (!(await isAdminUser(this.userId))) return;
      const songs = await Songs.find({}).fetch();
      const transformed = songs.map(transformSongToCSVRow);
      const csv = toCSV(transformed);
      return csv;
    },
  }),
};
