import * as _ from "lodash";

/**
 * Get the differences of two objects
 * @returns {object[]} [] if newDoc and oldDoc are equal. If not, returns array of {new: ..., old: ..., key: ...}
 */
export function getDocumentDiffArray(newDoc, oldDoc, key) {
  if (_.isEqual(newDoc, oldDoc)) return [];

  // handle recursive calls when newDoc and oldDoc are "final" objects, i.e. dates
  if (newDoc instanceof Date) return [{new: newDoc, old: oldDoc, key: key}];
  // ... ToDo more final objects?

  let DiffArray = [];
  // do not use the built-in result array! subsequent calls are not pushed correctly
  _.transform(newDoc, function (result, value, key) {
    if (!_.isEqual(value, oldDoc[key])) {
      //objects not equal! need to search for differences
      if (_.isObject(value) && _.isObject(oldDoc[key])) {
        //it's an object, probably need to dig deeper for diffs ...
        if (isFlatArray(value) && isFlatArray(oldDoc[key])) {
          // it's a flat array (like assignedUserIDs) -> push it directly
          DiffArray.push({new: value, old: oldDoc[key], key: key});
        } else {
          // it's an object or an array of objects. Need to dig deeper...
          const changesSubArray = getDocumentDiffArray(value, oldDoc[key], key);

          DiffArray = DiffArray.concat(changesSubArray);
        }
      } else {
        // it's a primitive value -> push changes directly
        DiffArray.push({new: value, old: oldDoc[key], key: key});
      }
    }
  });

  return DiffArray;
}
