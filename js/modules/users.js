/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import { calcMD5 } from "./helpers.js";

export { getGravatar };

/**
 * Load CSS file
 */
const getGravatar = (email, size = "170", type = "robohash") => {
  //Type = [ 404 | mp | identicon | monsterid | wavatar | retro | robohash | blank ]
  var md5 = calcMD5(email);
  var link = "https://www.gravatar.com/avatar/" + md5 + "?s=" + size + "&d=" + type;

  return link;
};
