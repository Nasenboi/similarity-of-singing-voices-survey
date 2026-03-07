import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const Counters = new Mongo.Collection("counters");

const callCounter = function (method, ...args) {
  const countersCollection = Counters.rawCollection();
  return Meteor.wrapAsync(countersCollection[method].bind(countersCollection))(...Array.from(args || []));
};

export const getCounterValue = async function (counterName) {
  const doc = await callCounter("findOne", {_id: counterName});

  return doc?.next_val ? doc?.next_val : null;
};

export const incrementCounter = async function (counterName, amount = 1) {
  const newDoc = await callCounter(
    "findOneAndUpdate",
    {_id: counterName},
    {$inc: {next_val: amount}},
    {returnDocument: "after", upsert: true},
  );

  return newDoc?.next_val ? newDoc?.next_val : null;
};
