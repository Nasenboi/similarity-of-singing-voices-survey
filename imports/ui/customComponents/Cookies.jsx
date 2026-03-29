import {Cookies} from "meteor/ostrio:cookies";

export const cookies = new Cookies();

/**
 * Get a cookie if it exists, otherwise uses a fallback
 * DOES NOT WORK ON BOOLEAN VALUES
 * @param {String} key the cookie name
 * @param {*} fallback the fallback falue
 * @returns {*} the cookies value or the fallback
 */
export const getCookieSave = (key, fallback = {}) => {
  return cookies.get(key) || fallback;
};
