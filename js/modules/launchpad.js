/* eslint-disable prefer-named-capture-group */
/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { loadCssFile } from "./helpers.js";

export { insertLaunchpadIcon, insertLaunchpadMenu };

/**
 * Insert Launchpad icons
 */
const insertLaunchpadIcon = (storage, currentScheme) => {
  storage.feature_launchpad == undefined ? (storage.feature_launchpad = true) : false;
  storage.feature_launchpad_tiles == undefined ? (storage.feature_launchpad_tiles = false) : false;

  if (storage.feature_launchpad) {
    let launchpadCol = document.querySelectorAll(".last");
    //prettier-ignore
    let html = `<div class="sc-launchpad-group"><header class="sc-launchpad-group-title">` + global.launchpadGroupTitle + `</header><div class="sc-launchpad-group-row"><a href="#" onclick="window.location.href='` + global.launchpadPage + `?launchpad=true&url=` + global.windowLocationHref + `'" class="sc-launchpad-item" title="` + global.launchpadTitle + `"><span class="icon"><img loading="lazy" src="` + global.launchpadIcon + `" width="48" height="48" alt="` + global.launchpadTitle + `"></span><span class="sc-launchpad-text">` + global.launchpadTitle + `</span></a></div></div>`;
    launchpadCol[0].insertAdjacentHTML("afterend", html);
  }
  if (storage.feature_launchpad_tiles) {
    //Inject CSS
    loadCssFile("css/tilelaunchpad.min.css");
    if (
      (storage.feature_darkmode && !storage.feature_darkmode_auto) ||
      (storage.feature_darkmode && storage.feature_darkmode_auto && currentScheme == "dark")
    ) {
      loadCssFile("css/dark/tilelaunchpad.min.css");
    }
  }
};

/**
 * Insert Launchpad Menu
 */
const insertLaunchpadMenu = (storage) => {
  storage.feature_launchpad == undefined ? (storage.feature_launchpad = true) : false;

  if (storage.feature_launchpad) {
    //prettier-ignore
    var html = `<a href="#" class="scStartMenuLeftOption" title="" onclick="window.location.href='` + global.launchpadPage + `?launchpad=true&url=` + global.windowLocationHref + `'"><img loading="lazy" src="` + global.launchpadIcon + `" class="scStartMenuLeftOptionIcon" alt="" border="0"><div class="scStartMenuLeftOptionDescription"><div class="scStartMenuLeftOptionDisplayName">` + global.launchpadGroupTitle + `</div><div class="scStartMenuLeftOptionTooltip">` + global.launchpadTitle + `</div></div></a>`;
    document.querySelectorAll(".scStartMenuLeftOption").forEach(function (item) {
      item.getAttribute("title") == "Install and maintain apps." ? item.insertAdjacentHTML("afterend", html) : false;
    });
  }
};
