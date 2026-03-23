import {DATASET_FILE_PATH} from "@/imports/common/globals";

export async function waitForFiles({retries = 30, delayMs = 1000} = {}) {
  const url = `${Meteor.settings.private.FILE_SERVER_URL}${DATASET_FILE_PATH}`;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);

      if (res.ok) {
        console.log("File server is ready");
        return;
      }
    } catch (err) {
      // ignore errors, server not ready yet
    }

    console.log(`Waiting for file server... (${i + 1}/${retries})`);
    await new Promise((r) => setTimeout(r, delayMs));
  }

  throw new Error("File server did not become ready in time");
}
