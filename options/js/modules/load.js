/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import { addSite, toggleFeature, addDomain } from "./dom.js";

export { getFeatures, parseJsonSites, onReaderLoad, uploadJson };

/**
 * Get user's settings and features
 */
const getFeatures = () => {
  chrome.storage.sync.get((storage) => {
    toggleFeature(storage.feature_urls, "#feature_urls", true);
    toggleFeature(storage.feature_urlstatus, "#feature_urlstatus", false);
    toggleFeature(storage.feature_flags, "#feature_flags", true);
    toggleFeature(storage.feature_errors, "#feature_errors", true);
    toggleFeature(storage.feature_notification, "#feature_notification", true);
    toggleFeature(storage.feature_darkmode, "#feature_darkmode", false);
    toggleFeature(storage.feature_darkmode_auto, "#feature_darkmode_auto", false);
    toggleFeature(storage.feature_favorites, "#feature_favorites", false);
    toggleFeature(storage.feature_reloadnode, "#feature_reloadnode", true);
    toggleFeature(storage.feature_launchpad, "#feature_launchpad", true);
    toggleFeature(storage.feature_launchpad_tiles, "#feature_launchpad_tiles", false);
    toggleFeature(storage.feature_rtl, "#feature_rtl", true);
    toggleFeature(storage.feature_charscount, "#feature_charscount", true);
    toggleFeature(storage.feature_autoexpand, "#feature_autoexpand", true);
    toggleFeature(storage.feature_quickinfoenhancement, "#feature_quickinfoenhancement", true);
    toggleFeature(storage.feature_translatemode, "#feature_translatemode", false);
    toggleFeature(storage.feature_contenteditor, "#feature_contenteditor", true);
    toggleFeature(storage.feature_experienceeditor, "#feature_experienceeditor", true);
    toggleFeature(storage.feature_cetabs, "#feature_cetabs", false);
    toggleFeature(storage.feature_rtecolor, "#feature_rtecolor", true);
    toggleFeature(storage.feature_messagebar, "#feature_messagebar", false);
    toggleFeature(storage.feature_workbox, "#feature_workbox", false);
    toggleFeature(storage.feature_contextmenu, "#feature_contextmenu", true);
    toggleFeature(storage.feature_gravatarimage, "#feature_gravatarimage", true);
    toggleFeature(storage.feature_lockeditems, "#feature_lockeditems", false);
    toggleFeature(storage.feature_helplink, "#feature_helplink", false);
    toggleFeature(storage.feature_reminder, "#feature_reminder", false);
    toggleFeature(storage.feature_instantsearch, "#feature_instantsearch", true);
    toggleFeature(storage.feature_experimentalui, "#feature_experimentalui", false);
    toggleFeature(storage.feature_material_icons, "#feature_material_icons", false);
    toggleFeature(storage.feature_medialist, "#feature_medialist", true);
    toggleFeature(storage.feature_mediacard, "#feature_mediacard", true);
    toggleFeature(storage.feature_medialibrary, "#feature_medialibrary", true);
  });
};

/**
 * Parse a json and create html
 */
const parseJsonSites = (json) => {
  // console.log(json);
  for (var [domain, values] of Object.entries(json)) {
    let domainId = addDomain("", domain, true);
    let lang, embedding, display;
    for (var [id, site] of Object.entries(values)) {
      try {
        for (var [key, value] of Object.entries(site)) {
          key == "language" ? (lang = value) : false;
          key == "languageEmbedding" ? (embedding = value) : false;
          key == "useDisplayName" ? (display = value) : false;
        }
        console.log(site, display);
        //Default values
        lang = lang == undefined ? "" : lang;
        embedding = embedding == undefined ? true : embedding;
        display = display == undefined ? false : display;
        //Add site
        addSite(domainId, Object.entries(site)[0][0], Object.entries(site)[0][1], lang, embedding, display, false, "", true);
      } catch (e) {
        console.warn(e);
        addSite(domainId, Object.entries(site)[0][0], Object.entries(site)[0][1], "", true, false, false, "", true);
      }
    }
  }
};

/**
 * Read uploaded json and populate Dom
 */
const onReaderLoad = (event) => {
  try {
    var json = JSON.parse(event.target.result);
    parseJsonSites(json);
  } catch (error) {
    alert("Your Json file is not valid.\n Please check the console for more details");
    console.error("############ Sitecore Author Toolbox Error ############\n", error, "\n########################################################");
  }
};

/**
 * Upload a json file
 */
const uploadJson = (event) => {
  if (document.querySelector(".importSites").files[0].type != "application/json") {
    alert("Your file is not a valid Json format");
  } else if (document.querySelector(".importSites").files[0].size >= 5242880) {
    alert("Your file is too big");
  } else {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
    setTimeout(() => {
      document.querySelector(".save_sites").click();
    }, 200);
  }
};
