/* eslint-disable no-prototype-builtins */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { cleanCountryName, findCountryName };

/**
 * Clean a Sitecore-specific country name to make it regular name
 */
const cleanCountryName = (name) => {
  var temp = name;
  var language;

  if (temp != "" && temp.includes(" (region")) {
    temp = temp.split(" (region");
    temp = temp[0];
  }
  if (temp != "" && temp.includes(" :")) {
    temp = temp.split(" :");
    temp = temp[0];
  }
  temp = temp.split(" (");
  if (temp[1] == undefined) {
    temp = temp[0];
  } else {
    temp = temp[1];
  }
  temp = temp.split(")");
  if (temp[0].includes(", ")) {
    temp = temp[0].split(", ");
    temp[0] = temp[1];
    temp[0] = temp[0].replace(" ", "_");
  }
  temp = temp[0].replace(" ", "_");
  temp = temp.toUpperCase();
  language = temp.replace("TRADITIONAL,_", "");
  language = language.replace("SIMPLIFIED,_", "");
  language = language.replace("_S.A.R.", "");
  language = language.replace("_PRC", "");
  language = language.replace("SAR", "").trim();
  //Replace non-standard country name
  language = language.replace("U.A.E.", "UNITED_ARAB_EMIRATES");
  language = language.replace("KOREA", "SOUTH_KOREA");
  language = language.replace("KOREAN", "KOREA");
  language = language.replace("UNITED_STATES", "USA");
  language = language.replace("UNITED_KINGDOM", "GREAT_BRITAIN");
  language = language.replace("ENGLISH", "GREAT_BRITAIN");
  language = language.replace("PRC", "CHINA");
  language = language.replace("SIMPLIFIED", "CHINA");
  language = language.replace("TRADITIONAL", "CHINA");

  return language.toLowerCase();
};

/**
 * Find Sitecore Country name is Json Data list
 */
const findCountryName = (name) => {
  var country = cleanCountryName(name);

  for (var key in global.jsonData) {
    if (global.jsonData.hasOwnProperty(key) && country.toUpperCase() == global.jsonData[key].language.toUpperCase()) {
      country = global.jsonData[key].flag;
      break;
    }
  }

  return country.toLowerCase();
};
