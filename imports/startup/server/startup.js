import {APP_NAME, APP_VERSION} from "@/imports/common/globals";
import {Log} from "meteor/logging";
import {Meteor} from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import {initAdminUser} from "./initAdminUser";
import {initIndexes} from "./initIndexes";
import {initQuestionnaire} from "./initQuestionnaire";
import {initSongs} from "./initSongs";
import {resetDB} from "./resetDB";
import {waitForFiles} from "./waitForFiles";

/**
 * Call the initServer function on startup
 */
Meteor.startup(async () => {
  await initServer();
  Log.info("async initServer finished");
});

/**
 * Init the Server:
 * Print infos, check database for version and content
 */
async function initServer() {
  printInfoLog();

  initSimpleSchema();
  Log.info("init simpleSchema finished");

  await waitForFiles();
  Log.info("file server ready");

  if (Meteor.settings.private.reset) {
    await resetDB();
    Log.info("DB reset finished");

    await initAdminUser();
    Log.info("init admin user finished");

    await initSongs();
    Log.info("init songs finished");

    await initQuestionnaire();
    Log.info("init questionnaire finished");

    await initIndexes();
    Log.info("init idndexes finished");
  }
}

/**
 * Print server info
 */
function printInfoLog() {
  Log.info(`Starting ${APP_NAME} server ${APP_VERSION}`);
  const meteorSettings = {
    isProduction: Meteor.isProduction,
    isDevelopment: Meteor.isDevelopment,
    isTest: Meteor.isTest,
    isAppTest: Meteor.isAppTest,
    time: new Date(),
    absoluteUrl: Meteor.absoluteUrl(),
  };
  Log.info("Meteor server settings:", meteorSettings);
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
