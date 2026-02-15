import {Collection} from "../collection/collection";
import {participantSchema} from "./schema";

export const Participants = new Collection("participants", participantSchema);
