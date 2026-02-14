import {Mongo} from "meteor/mongo";
import SimpleSchema from "simpl-schema";

/**
 * Defines the Metadata in the collection.
 */
export const dbMetadataSchema = new SimpleSchema({
  _id: {
    type: String,
    denyUpdate: true,
    optional: true,
  },
  createDate: {
    type: Date,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        return new Date();
      }
    },
    denyUpdate: true,
    optional: true,
  },
  editDate: {
    type: Date,
    autoValue() {
      return new Date();
    },
    optional: true,
  },
  number: {type: Number, optional: true},
});
