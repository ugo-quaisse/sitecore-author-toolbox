/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

// import * as global from "./global.js";
import { loadCssFile } from "./helpers.js";
import { currentColorScheme } from "./dark.js";

export { initHorizon };

/**
 * Reset Experience Editor CSS
 */
const initHorizon = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  storage.feature_experienceeditor ? loadCssFile("css/horizon.min.css") : false;
  //Remove satExtension satDark satExperimetalUI from main frame
  document.body ? document.body.classList.add("satHZ") : false;
  document.body ? document.body.classList.remove("satExtension") : false;
  document.body ? document.body.classList.remove("satDark") : false;
  document.body ? document.body.classList.remove("satExperimentalUi") : false;
  document.body && storage.feature_experimentalui ? document.body.classList.add("satHZExperimentalUi") : false;
  if ((document.body && storage.feature_darkmode && !storage.feature_darkmode_auto) || (document.body && storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "dark")) {
    document.body ? document.body.classList.add("satHZDark") : false;
  }
};
