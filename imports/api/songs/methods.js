import {ValidatedMethod} from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Participants} from "../participants/collection";
import {SurveyQuestions} from "../surveyQuestions/collection";
import {isAdminUser} from "../users/helpers";
import {Songs} from "./collection";
import {compaintSchema} from "./schema";

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
      if (!isAdminUser()) return;
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
};
