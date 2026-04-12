import {PARTICIPANTS} from "@/imports/api/participants/methods";
import {assert} from "chai";

describe("PARTICIPANTS", function () {
  /**
   * Preset Variables
   */

  /**
   * Server Side Tests

  if (Meteor.isServer) {
  }
   */

  /**
   * Client Side Tests
   */
  if (Meteor.isClient) {
    it("check if all questionnaires are going to be used", async function () {
      this.timeout(10000);
      const MAX_LOOP_TRIES = 100;
      const testQuestionnaireID = 1;

      let newID = null;
      const questionnaireIDs = [];
      for (let i = 0; i < MAX_LOOP_TRIES; ++i) {
        newID = await PARTICIPANTS.newParticipant.callAsync({});
        questionnaireIDs.push((await PARTICIPANTS.getParticipant.callAsync({participantID: newID})).questionnaireID);
      }

      const count = questionnaireIDs.filter((qID) => qID === testQuestionnaireID).length;
      assert.isAbove(
        count,
        1,
        `Expected more than 1 occurrence of questionnaire ID ${testQuestionnaireID}, but found ${count}`,
      );
    });
  }
});
