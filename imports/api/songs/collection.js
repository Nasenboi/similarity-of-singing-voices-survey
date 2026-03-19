import {Collection} from "../collection/collection";
import {songSchema} from "./schema";

export const Songs = new Collection("songs", songSchema);
