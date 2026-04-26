import {DDPRateLimiter} from "meteor/ddp-rate-limiter";
import {Meteor} from "meteor/meteor";

DDPRateLimiter.addRule(
  {
    type: "method",
    name: "participants.new",
  },
  1,
  5000,
);

DDPRateLimiter.addRule(
  {
    type: "method",
    name: "surveyAnswers.setAnswer",
  },
  1,
  Meteor.isDevelopment ? 500 : 10000,
);
