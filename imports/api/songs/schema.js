import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const UMAP2DSchema = new SimpleSchema({
  UMAP_1: {type: Number},
  UMAP_2: {type: Number},
});

export const UMAP3DSchema = new SimpleSchema({
  UMAP_1: {type: Number},
  UMAP_2: {type: Number},
  UMAP_3: {type: Number},
});

export const compaintSchema = new SimpleSchema({
  notVoiced: {type: Boolean, optional: true},
  multipleVoices: {type: Boolean, optional: true},
  badVoiceQuality: {type: Boolean, optional: true},
  message: {type: String, optional: true},
  participantID: {type: String},
});

export const songSchema = new SimpleSchema({
  trackID: {type: SimpleSchema.Integer},
  filename: {type: String},
  genre: {type: String, optional: true},

  artist: {type: String, optional: true},

  album: {type: String, optional: true},
  albumDateCreated: {type: Date, optional: true},
  albumDateReleased: {type: Date, optional: true},

  songSubPath: {type: String, optional: true},
  vocalSubPath: {type: String, optional: true},

  vocalContentLengthS: {type: String, optional: true},
  onsets: {type: Array, optional: true},
  "onsets.$": {type: Number},

  UMAP2D: {type: UMAP2DSchema},
  UMAP3D: {type: UMAP3DSchema},
  cluster: {type: Number, optional: true},

  skipInSurvey: {type: Boolean, optional: true},
  complaints: {type: Array, optional: true},
  "complaints.$": {type: compaintSchema},
}).extend(dbMetadataSchema);
