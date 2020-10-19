/* eslint-disable default-param-last */
/* eslint-disable max-params */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { checkUrlStatus };

/**
 * Check HTTP status of a page
 */
const checkUrlStatus = (status, source = null, dark, experimental = false) => {
  let liveUrlStatus, html, barStyle, urlLoader;

  //Dark loader
  urlLoader = dark ? global.urlLoaderDark : global.urlLoader;

  if (source == null) {
    if (document.querySelector(".sitecoreItemPath")) {
      liveUrlStatus = document.querySelector(".liveUrlStatus");
    }
  } else if (source.querySelector(".sitecoreItemPath")) {
    liveUrlStatus = source.querySelector(".liveUrlStatus");
  }

  //Preloader
  liveUrlStatus ? (liveUrlStatus.innerHTML = '<img loading="lazy" src="' + urlLoader + '" style="width: 10px; float: initial; margin: unset;"/>') : false;

  //Check response
  if (status == "404") {
    html = "<span class='liveStatusRed'><img loading='lazy' src=' " + global.dotRed + "'/> Not published (" + status + ")</span>";
    // preview = "Live URL (404) <img loading='lazy' src=' " + global.dotRed + "' class='liveUrlDot' />";
    // disable = true;
    barStyle = "scError";
  } else if (status == "500") {
    html = "<span class='liveStatusRed'><img loading='lazy' src=' " + global.dotRed + "'/> Server error (" + status + ")</span>";
    // preview = "Live URL (500) <img loading='lazy' src=' " + global.dotRed + "'class='liveUrlDot' />";
    // disable = true;
    barStyle = "scError";
  } else {
    html = "<span class='liveStatusGreen'><img loading='lazy' src=' " + global.dotGreen + "'/> Published</span>";
    // preview = "Live URL <img loading='lazy' src=' " + global.dotGreen + "'class='liveUrlDot' />";
    // disable = false;
    barStyle = "scSuccess";
  }

  //Update Dom
  liveUrlStatus != null ? (liveUrlStatus.innerHTML = html) : false;

  if (experimental) {
    //Update bar color
    var scMessageBarLiveUrl = document.querySelector("#scMessageBarLiveUrl");
    scMessageBarLiveUrl ? scMessageBarLiveUrl.setAttribute("class", "scMessageBar " + barStyle) : false;

    //Experimental mode ON
    let scPreviewButton = document.querySelector(".scPreviewButton");
    if (scPreviewButton) {
      //scPreviewButton.innerHTML = preview;
      //scPreviewButton.disabled = disable;
    }
  }
};
