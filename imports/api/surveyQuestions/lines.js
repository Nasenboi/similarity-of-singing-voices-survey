import {Mongo} from "meteor/mongo";

// only used on client sites mini mongo instance!
export const LinesCollection = new Mongo.Collection("linesCollection");
