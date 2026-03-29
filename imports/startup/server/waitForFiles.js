import {DATASET_FILE_PATH} from "@/imports/common/globals";
import {Log} from "meteor/logging";

export async function waitForFiles({retries = 30, delayMs = 1000} = {}) {
  const url = `${Meteor.settings.private.FILE_SERVER_URL}${DATASET_FILE_PATH}`;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);

      if (res.ok) {
        return;
      }
    } catch (err) {}

    await new Promise((r) => setTimeout(r, delayMs));
  }

  throw new Error("File server did not become ready in time");
}
