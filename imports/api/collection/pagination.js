import {Mongo} from "meteor/mongo";

// only used on client sites mini mongo instance!
export const Pagination = new Mongo.Collection("pagination");
