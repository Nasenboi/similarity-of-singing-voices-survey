import {Songs} from "@/imports/api/songs/collection";
import {DATASET_FILE_PATH} from "@/imports/common/globals";
import {Log} from "meteor/logging";
import Papa from "papaparse";

function parseOnsets(onsets) {
  return onsets
    .replace(/[\[\]]/g, "")
    .trim()
    .split(/\s+/)
    .map(Number);
}

function convertToSongSchema(audio) {
  const track_id_zp = String(audio.track_id).padStart(6, "0");
  const main_folder = track_id_zp.slice(0, 3);

  return {
    trackID: audio.track_id,
    filename: audio.filename,
    genre: audio.genre_top,
    artist: audio.artist,
    album: audio.album,
    albumDateCreated: audio.creation_date,
    albumDateReleased: audio.release_date,
    songSubPath: `/${main_folder}/${audio.filename}`,
    vocalSubPath: `/${main_folder}/${track_id_zp}/vocals.mp3`,
    vocalContentLengthS: audio.vocal_content_length_s,
    onsets: audio.onsets && audio.onsets.length > 0 ? parseOnsets(audio.onsets) : [],
    cluster: audio.cluster,
    skipInSurvey: false,
    UMAP2D: {
      UMAP_1: audio.UMAP_2D_1,
      UMAP_2: audio.UMAP_2D_2,
    },
    UMAP3D: {
      UMAP_1: audio.UMAP_3D_1,
      UMAP_2: audio.UMAP_3D_2,
      UMAP_3: audio.UMAP_3D_3,
    },
  };
}

export async function initSongs() {
  const datasetURL = `${Meteor.settings.private.FILE_SERVER_URL}${DATASET_FILE_PATH}`;

  try {
    const datasetResponse = await fetch(datasetURL);
    const datasetText = await datasetResponse.text();
    const dataset = Papa.parse(datasetText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    }).data;

    dataset.map(async (s) => {
      await Songs.insertAsync(convertToSongSchema(s));
    });
  } catch (error) {
    Log.error(error);
    Log.info(datasetURL);
  }
}
