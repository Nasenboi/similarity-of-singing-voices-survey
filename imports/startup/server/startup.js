import {Log} from "meteor/logging";
import {Meteor} from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import {initQuestionnaire} from "./initQuestionnaire";

/**
 * Call the initServer function on startup
 */
Meteor.startup(async () => {
  await initServer();
  Log.debug("async initServer finished");
});

/**
 * Init the Server:
 * Print infos, check database for version and content
 */
async function initServer() {
  printInfoLog();

  initSimpleSchema();
  Log.debug("init simpleSchema finished");

  await initQuestionnaire();
  Log.debug("init questionnaire finished");
}

/**
 * Print server info
 */
function printInfoLog() {
  Log.debug(`Starting ${APP_NAME} server ${APP_VERSION}`);
  const meteorSettings = {
    isProduction: Meteor.isProduction,
    isDevelopment: Meteor.isDevelopment,
    isTest: Meteor.isTest,
    isAppTest: Meteor.isAppTest,
    time: new Date(),
    absoluteUrl: Meteor.absoluteUrl(),
  };
  Log.debug("Meteor server settings:", meteorSettings);
}

/**
 * Init simple schema with meteor warnings and their types
 */
function initSimpleSchema() {
  SimpleSchema.defineValidationErrorTransform((error) => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = "validation-error";
    ddpError.details = error.details;
    return ddpError;
  });
}
