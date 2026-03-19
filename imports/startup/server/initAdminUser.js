import {Accounts} from "meteor/accounts-base";
import {Log} from "meteor/logging";
import {Meteor} from "meteor/meteor";

export async function initAdminUser() {
  const ADMIN_USER = Meteor.settings.private.ADMIN_USER;
  if (!(await Meteor.users.findOneAsync({username: ADMIN_USER.username}))) {
    Log.info(ADMIN_USER.username, "is not in db. Will insert it and add it to all roles:");
    const userID = await Accounts.createUserAsync(ADMIN_USER);
  }
}
