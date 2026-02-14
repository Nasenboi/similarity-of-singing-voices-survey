import {DDPRateLimiter} from "meteor/ddp-rate-limiter";

DDPRateLimiter.addRule(
  {
    type: "method",
    name: "participants.new",
    clientAddress: (connection) => connection.clientAddress,
  },
  1,
  3600000,
);
