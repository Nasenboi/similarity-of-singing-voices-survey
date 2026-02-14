import {DDPRateLimiter} from "meteor/ddp-rate-limiter";

DDPRateLimiter.addRule(
  {
    type: "method",
    name: "participants.new",
    clientAddress: (connection) => connection.clientAddress,
  },
  1,
  5000,
);
// 1h 3600000,
