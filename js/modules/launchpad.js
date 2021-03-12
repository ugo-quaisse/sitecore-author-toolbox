/* eslint-disable prefer-named-capture-group */
/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { loadCssFile } from "./helpers.js";

export { initLaunchpadIcon, initLaunchpadMenu };

/**
 * Insert Launchpad icons
 */
const initLaunchpadIcon = (storage) => {
  storage.feature_launchpad == undefined ? (storage.feature_launchpad = true) : false;
  storage.feature_launchpad_tiles == undefined ? (storage.feature_launchpad_tiles = false) : false;

  if (storage.feature_launchpad && global.isLaunchpad) {
    let launchpadCol = document.querySelectorAll(".last");
    let oldScDetect = document.querySelector(".sc-applicationHeader-row2");
    let groupClass = oldScDetect ? "sc-launchpad-group-row" : "";
    let icon = oldScDetect ? global.launchpadIcon : global.launchpadIconBlue;

    //prettier-ignore
    let html = `<div class="sc-launchpad-group">
      <header class="sc-launchpad-group-title">${global.launchpadGroupTitle}</header>
      <div class="${groupClass}">
        <a href="#" onclick="window.open('${global.launchpadPage}?launchpad=true&url=${global.windowLocationHref}')" class="sc-launchpad-item" title="${global.launchpadTitle}">
        <span class="icon"><img loading="lazy" src="${icon}" width="48" height="48" alt="${global.launchpadTitle}"></span>
        <span class="sc-launchpad-text">${global.launchpadTitle}</span>
        </a>
      </div>
    </div>`;
    launchpadCol[0].insertAdjacentHTML("afterend", html);
    //Change top left logo
    !oldScDetect && document.querySelector(".sc-global-logo") ? document.querySelector(".sc-global-logo").classList.add("sc10launchpad") : "";
    //Change icons
    if (!oldScDetect) {
      document.querySelectorAll(".icon").forEach(function (elem) {
        elem.classList.add("sc10launchpad");
      });
    }
  }
  if (storage.feature_launchpad_tiles) {
    loadCssFile("css/tilelaunchpad.min.css");
    loadCssFile("css/dark/tilelaunchpad.min.css");
  }
};

/**
 * Insert Launchpad Menu
 */
const initLaunchpadMenu = (storage) => {
  storage.feature_launchpad == undefined ? (storage.feature_launchpad = true) : false;

  if (storage.feature_launchpad) {
    var html = `<a href="#" class="scStartMenuLeftOption" title="" onclick="window.location.href='${global.launchpadPage}?launchpad=true&url=${global.windowLocationHref}'">
      <img loading="lazy" src="${global.launchpadIcon}" class="scStartMenuLeftOptionIcon" alt="" border="0">
      <div class="scStartMenuLeftOptionDescription">
        <div class="scStartMenuLeftOptionDisplayName">${global.launchpadGroupTitle}</div>
        <div class="scStartMenuLeftOptionTooltip">${global.launchpadTitle}</div>
      </div>
    </a>`;
    document.querySelectorAll(".scStartMenuLeftOption").forEach(function (item) {
      if (item.getAttribute("title").toLowerCase().includes("create new templates")) {
        item.insertAdjacentHTML("afterend", html);
      }
    });
  }
};
