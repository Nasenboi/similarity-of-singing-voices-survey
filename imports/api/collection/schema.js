import SimpleSchema from "simpl-schema";

/**
 * Defines the Metadata in the collection.
 */
export const dbMetadataSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  createDate: {
    type: Date,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        return new Date();
      }
    },
    optional: true,
  },
  editDate: {
    type: Date,
    autoValue() {
      return new Date();
    },
    optional: true,
  },
  itemNumber: {type: Number, optional: true},
});

dbMetadataSchema.addValidator(function () {
  if (this.isUpdate) {
    if (this.field("_id").isSet) {
      return {_id: "Cannot update _id field"};
    }
    if (this.field("createDate").isSet) {
      return {createDate: "Cannot update createDate field"};
    }
    if (this.field("itemNumber").isSet) {
      return {itemNumber: "Cannot update itemNumber field"};
    }
  }
});
