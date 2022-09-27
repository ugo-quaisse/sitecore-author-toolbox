/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { loadCssFile, initStorageFeature } from "./helpers.js";
import { currentColorScheme } from "./dark.js";
import { getAccentColor } from "./experimentalui.js";

export { initPages, initPagesRTL };

/**
 * Init Style
 */
const initPages = (storage) => {
  storage.feature_experienceeditor = initStorageFeature(storage.feature_experienceeditor, false);
  storage.feature_experienceeditor ? loadCssFile("css/pages.css") : false;
  //Remove satExtension satDark satExperimetalUI from main frame
  document.body ? document.body.classList.add("satHZ") : false;
  document.body ? document.body.classList.remove("satExtension") : false;
  document.body ? document.body.classList.remove("satDark") : false;
  document.body ? document.body.classList.remove("satExperimentalUi") : false;
  document.body && storage.feature_experimentalui ? document.body.classList.add("satHZExperimentalUi") : false;
  if ((document.body && storage.feature_darkmode && !storage.feature_darkmode_auto) || (document.body && storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "dark")) {
    document.body ? document.body.classList.add("satHZDark") : false;
  }
  getAccentColor();
};

/**
 * Enable RTL
 */
const initPagesRTL = (storage) => {
  storage.feature_rtl = initStorageFeature(storage.feature_rtl, true);
  if (storage.feature_rtl) {
    console.log(global.rteLanguages);
    if (global.urlParams.get("sc_lang") == "ar-ae") {
      loadCssFile("css/rtl.min.css");
    }
  }
};
