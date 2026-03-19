import {Songs} from "@/imports/api/songs/collection";
import {DATASET_FILE_PATH, FILE_SERVER_URL} from "@/imports/common/globals";
import Papa from "papaparse";

function convertToSongSchema(audio) {
  const track_id_zp = String(audio.trackID).padStart(6, "0");
  const main_folder = track_id_zp.slice(0, 3);

  return {
    trackID: audio.track_id,
    filename: audio.filename,
    genre: audio.genre_top,
    artist: audio.artist,
    album: audio.album,
    albumDateCreated: audio.creation_date,
    albumDateReleased: audio.release_date,
    songSubPath: `${main_folder}/${audio.filename}`,
    vocalSubPath: `${main_folder}/${track_id_zp}/vocals.mp3`,
    vocalContentLenghts: audio.vocal_content_length_s,
    onsets: audio.onset ? JSON.parse(onsets.replace(/\s+/g, ",")) : [],
    cluster: audio.cluster,
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
  const datasetURL = `${FILE_SERVER_URL}/${DATASET_FILE_PATH}`;

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
    console.error(error);
  }
}
