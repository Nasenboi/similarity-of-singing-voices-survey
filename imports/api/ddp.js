import {DDPRateLimiter} from "meteor/ddp-rate-limiter";

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
  5000,
);
