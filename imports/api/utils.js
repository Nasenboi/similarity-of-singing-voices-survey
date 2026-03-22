import * as _ from "lodash";

function isFlatArray(obj) {
  if (!Array.isArray(obj)) return false;
  for (const e of obj) {
    if (_.isObject(e)) return false;
  }
  return true;
}

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

export function buildPaginationQuery({query, numericFields, booleanFields}) {
  if (!query) return {};
  const nonEmptyQuery = Object.fromEntries(Object.entries(query).filter(([_, value]) => value !== ""));
  const regexFields = Object.entries(nonEmptyQuery).filter(
    ([key]) => !booleanFields.includes(key) && !numericFields.includes(key),
  );
  const exactFields = Object.entries(nonEmptyQuery).filter(([key]) => booleanFields.includes(key));
  const numericRegexFields = Object.entries(nonEmptyQuery).filter(([key]) => numericFields.includes(key));
  let newQuery = {
    ...Object.fromEntries(exactFields),
  };

  if (regexFields.length > 0) {
    newQuery["$and"] = regexFields.map(([key, value]) => ({
      [key]: {$regex: String(value), $options: "i"},
    }));
  }
  if (numericRegexFields.length > 0) {
    const numericConditions = numericRegexFields.map(([key, value]) => ({
      $expr: {
        $regexMatch: {
          input: {$toString: `$${key}`},
          regex: String(value),
          options: "i",
        },
      },
    }));

    if (newQuery["$and"]) {
      newQuery["$and"].push(...numericConditions);
    } else {
      newQuery["$and"] = numericConditions;
    }
  }

  return newQuery;
}
