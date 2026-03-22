import {Mongo} from "meteor/mongo";
import {getDocumentDiffArray} from "../utils";
import {incrementCounter} from "./counters";

/**
 * Extending Mongo.Collection to add custom functionality
 * for all collections in the application.
 * @template T The type of documents stored in the collection.
 * @extends Mongo.Collection<T>
 */
export class Collection extends Mongo.Collection {
  /**
   * Creates a new instance of CollectionX.
   * If the schema is given, it attaches the schema to the collection.
   * This will enforce the schema on all documents in the collection.
   * @param {String} name The name of the collection.
   * @param {SimpleSchema} schema Optional schema for the collection.
   */
  constructor(name, schema) {
    super(name);

    this.attachSchema(schema);

    this.schema = schema;
    this.name = name;
  }

  /**
   * Insert a document in the collection. Returns its unique _id.
   * @param {Object} doc The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.
   * @param {function} [callback] If present, called with an error object as the first argument and, if no error, the _id as the second.
   * @returns {Promise<String>} _id of the new document
   */
  async insertAsync(doc, callback) {
    const newCount = await incrementCounter(this.name);
    doc = {...doc, itemNumber: newCount};
    return await super.insertAsync(doc, callback);
  }

  /**
   * Modify one or more documents in the collection. Returns the number of matched documents.
   * @param {Selector<T> | ObjectID | String} selector Specifies which documents to modify
   * @param {Modifier<T>} modifier Specifies how to modify the documents
   * @param {Object} [options]
   * @param {Function} [callback] If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
   * @returns {Promise<{object[] | Number}>} Either the array of differences for a single object, or the number of affected records
   */
  async updateAsync(selector, modifier, options, callback) {
    const isSingleDoc = typeof selector === "string" || selector instanceof Mongo.ObjectID || (selector && selector._id);

    let oldDoc;

    if (isSingleDoc) {
      oldDoc = await this.findOneAsync(selector);
    }

    const result = await super.updateAsync(selector, modifier, options, callback);

    if (isSingleDoc && result > 0) {
      const newDoc = await this.getAsync(selector);
      return getDocumentDiffArray(newDoc, oldDoc);
    }

    return result;
  }

  /**
   * Searches for a document by its ID.
   * @param {String} id documentID (_id)
   * @returns {Promise<Object>} The document with the given ID.
   * @throws Meteor.Error if the document is not found.
   */
  async getAsync(id) {
    const doc = await this.findOneAsync({_id: id});
    if (!doc) throw new Meteor.Error("not-found", this.name + "Document with id " + id + "not found");
    return doc;
  }

  /**
   * Duplicates a document
   * @param {String} id
   * @param {String[]} [deleteFields=[]]
   * @returns {Promise<String>} _id of the new document
   */
  async duplicateAsync(id, deleteFields = []) {
    deleteFields = [...new Set(["_id", "count", ...deleteFields])];

    const oldDoc = await this.getAsync(id);

    // Create a copy without the deleteFields
    const newDoc = {...oldDoc};
    deleteFields.forEach((field) => delete newDoc[field]);

    return await this.insertAsync(newDoc);
  }

  /**
   * Returns the total count of documents in the collection.
   * @param {Object} query Optional query to filter by
   * @returns {Promise<Number>} The count of documents.
   */
  async countAsync(query) {
    return await this.find(query).countAsync();
  }
}
