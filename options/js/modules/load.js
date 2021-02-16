/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import { addSite, addDomain } from "./dom.js";

export { parseJsonSites, onReaderLoad, uploadJson };

/**
 * Parse a json and create html
 */
const parseJsonSites = (json) => {
  //   console.log(json);
  for (var [domain, values] of Object.entries(json)) {
    let domainId = addDomain("", domain, true);
    for (var [id, site] of Object.entries(values)) {
      addSite(domainId, Object.entries(site)[0][0], Object.entries(site)[0][1], false, "", true);
    }
  }
};

/**
 * Read uploaded json and populate Dom
 */
const onReaderLoad = (event) => {
  console.log(event.target.result);
  var json = JSON.parse(event.target.result);
  console.log(json);
  parseJsonSites(json);
};

/**
 * Upload a json file
 */
const uploadJson = (event) => {
  if (document.querySelector(".importSites").files[0].type != "application/json") {
    alert("Your file is not a valid Json format");
  } else {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
    setTimeout(() => {
      document.querySelector(".save_sites").click();
    }, 200);
  }
};
