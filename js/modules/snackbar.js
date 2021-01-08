/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { showSnackbar, showSnackbarSite };

/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = (storage) => {
  let versionIncrement = Number(global.extensionVersion.split(".").pop());
  if (!storage.feature_experimentalui && versionIncrement == 0) {
    //Snackbar settings
    let snackbarHtml = `
    <b>Sitecore Author Toolbox 5.0</b><br />
    Experimental UI theme is available for Desktop mode!<br />Click "TRY IT" to activate it now!`;
    let html = `<div class="snackbar">` + snackbarHtml + `<button id="sbAction" onclick='javascript:document.querySelectorAll(".interfaceRadio")[1].click()'>TRY IT</button><button id="sbDismiss">DISMISS</button></div>`;

    //Is Snackbar is already visible in a parent frame?
    let parentSnackbar = parent.document.querySelector(".snackbar");

    //Show Snackbar
    if (!parentSnackbar && global.showSnackbar && localStorage.getItem("sbDismiss") != global.extensionVersion) {
      document.querySelector("body").insertAdjacentHTML("beforeend", html);

      //Add listener on click #sbDismiss
      document.querySelectorAll("#sbAction, #sbDismiss").forEach(function (elem) {
        elem.addEventListener("click", function () {
          localStorage.setItem("sbDismiss", global.extensionVersion);
          document.querySelector(".snackbar").setAttribute("style", "display: none");
        });
      });
    }
  }
};

/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbarSite = (storage, ScItem) => {
  //Get SiteName
  let siteName = ScItem.pathFull.split("/home/")[0].split("/").reverse();

  //Get Site in locastorage
  let existing = localStorage.getItem("sbDismissSites");
  existing = existing ? JSON.parse(existing) : {};
  let length = Object.values(existing).length;

  //Snackbar settings
  let snackbarHtml =
    `<b>"` +
    siteName[0].toUpperCase() +
    `" site detected</b><br />
    Are you using any live/CD server?<br />Click "Add site" to configure it now.`;
  let html =
    `<div class="snackbarSite">` +
    snackbarHtml +
    `<button id="sbActionSite" onclick="window.open('` +
    global.launchpadPage +
    `?configure_domains=true&launchpad=true&url=` +
    global.windowLocationHref +
    `')">ADD&nbsp;SITE</button><button id="sbDismissSite">DISMISS</button></div>`;

  //Show Snackbar

  if (ScItem.pathFull.includes(`/home/`) && Object.values(existing).indexOf(ScItem.pathFull) === -1) {
    //Show snackbar
    document.querySelector(".snackbarSite") ? document.querySelector(".snackbarSite").remove() : false;
    document.querySelector("body").insertAdjacentHTML("beforeend", html);

    //Add listener on click #sbDismiss
    document.querySelectorAll("#sbDismissSite").forEach(function (elem) {
      elem.addEventListener("click", function () {
        //Create item
        existing[length++] = ScItem.pathFull;
        localStorage.setItem("sbDismissSites", JSON.stringify(existing));
        document.querySelector(".snackbarSite").setAttribute("style", "display: none");
      });
    });
  }
};
