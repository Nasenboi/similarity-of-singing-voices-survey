import {Cookies} from "meteor/ostrio:cookies";

export const cookies = new Cookies();

export const getCookieSave = (key, fallback = {}) => {
  return cookies.get(key) || fallback;
};
