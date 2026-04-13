import assert from "assert";
import {Meteor} from "meteor/meteor";
import "./imports.js";

before((done) => {
  // wait until all server modules are loaded (in Meteor.startup)
  Meteor.startup(done);
});

describe("similarity-of-singing-voices-survey", function () {
  it("package.json has correct name", async function () {
    const {name} = await import("../package.json");
    assert.strictEqual(name, "similarity-of-singing-voices-survey");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
