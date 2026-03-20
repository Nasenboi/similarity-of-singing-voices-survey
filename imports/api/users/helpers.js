import {Meteor} from "meteor/meteor";

export async function isAdminUser(userId) {
  const user = await Meteor.users.findOneAsync(userId);
  return user?.isAdmin;
}
