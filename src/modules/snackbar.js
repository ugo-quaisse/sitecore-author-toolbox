/* eslint-disable no-unused-vars */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { getSiteUrl } from "./url.js";
import { initStorageFeature } from "./helpers.js";

export { showSnackbar, showSnackbarSite, showSnackbarBattery };

/**
 * Show Welcome Snackbar
 */
const showSnackbar = (storage) => {
  //Snackbar settings
  let versionIncrement = Number(global.extensionVersion.split(".").pop());
  let hiddenIntroScreen = localStorage.getItem("scIntroScreen");
  let show = true;
  if (hiddenIntroScreen && show && versionIncrement == 0) {
    //prettier-ignore
    let snackbarHtml = `
    <b>Welcome to Sitecore Author Toolbox ${global.extensionVersion}!</b><br />
    Live URL is now compatible with multi-sites!<br />Click "INFO" to find out more!`;
    let html = `<div class="snackbar">${snackbarHtml}<button id="sbAction" onclick='javascript:window.open("https://uquaisse.io/sitecore/")'>INFO</button><button id="sbDismiss">DISMISS</button></div>`;

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
 * Show Nez Site Detection Snackbar
 */
const showSnackbarSite = (storage, ScItem) => {
  storage.feature_urls == initStorageFeature(storage.feature_urls, true);
  if (storage.feature_urls && ScItem.id) {
    //Get SiteName
    let siteName = ScItem.pathFull.split("/home/")[0].split("/").reverse();
    let pathToHome = ScItem.pathFull.split("/home/")[0] + "/home/";
    //Get site in userstorage (settings)
    let ScSite = getSiteUrl(storage, pathToHome, ScItem.language);
    let siteUrl = ScSite.url;
    //Get Site in locastorage
    let existing = localStorage.getItem("sbDismissSites");
    existing = existing ? JSON.parse(existing) : {};
    let length = Object.values(existing).length;

    //Snackbar settings
    //prettier0ignore
    let snackbarHtml = `"<b>${siteName[0].toUpperCase()}" site detected (lang: ${ScItem.language.toUpperCase()})</b><br /> Are you using a publishing target server?<br />Click "Add site" to configure it now.`;
    //prettier-ignore
    let html = `<div class="snackbarSite">${snackbarHtml}<button id="sbActionSite" onclick="addSite('${global.launchpadPage}','${global.urlOrigin}','${pathToHome}', '${siteName[0].toUpperCase()}')">ADD&nbsp;SITE</button><button id="sbDismissSite">DISMISS</button></div>`;

    //Hide previous snackbar
    document.querySelectorAll(".snackbarSite").forEach((div) => {
      div.remove();
    });

    //Show Snackbar

    if (!ScItem.pathFull.includes(`/sitecore/templates/`) && ScItem.pathFull.includes(`/home/`) && Object.values(existing).indexOf(siteName[0].toUpperCase()) === -1 && siteUrl == undefined) {
      document.querySelector("body").insertAdjacentHTML("beforeend", html);
      //Add listener on click #sbDismiss
      document.querySelectorAll("#sbDismissSite").forEach(function (elem) {
        elem.addEventListener("click", function () {
          //Create item
          existing[length++] = siteName[0].toUpperCase();
          localStorage.setItem("sbDismissSites", JSON.stringify(existing));
          document.querySelector(".snackbarSite").setAttribute("style", "display: none");
        });
      });
    }
  }
};

/**
 * Show Battery Snackbar
 */
const showSnackbarBattery = (percentage, time) => {
  //Snackbar settings
  let hiddenBatteryScreen = localStorage.getItem("scSaveBatteryPrompt");
  if (hiddenBatteryScreen != "true") {
    //prettier-ignore
    let snackbarHtml = `
    <b>Your battery is getting low</b><br />
    You only have ${percentage}% of battery left.<br />Switch to Dark Mode to save battery?`;
    let html = `<div class="snackbar snackbarBattery">${snackbarHtml}<button id="sbAction" onclick='switchToDarkMode()'>SWITCH</button><button id="sbDismiss">DISMISS</button></div>`;

    //Is Snackbar is already visible in a parent frame?
    let parentSnackbar = parent.document.querySelector(".snackbarBattery");
    console.log("test1", hiddenBatteryScreen, parentSnackbar);

    //Show Snackbar
    if (!parentSnackbar) {
      console.log("test2", parentSnackbar);

      document.querySelector("body").insertAdjacentHTML("beforeend", html);

      //Add listener on click #sbDismiss
      document.querySelectorAll("#sbAction, #sbDismiss").forEach(function (elem) {
        elem.addEventListener("click", function () {
          localStorage.setItem("scSaveBatteryPrompt", true);
          document.querySelector(".snackbar").remove();
        });
      });
    }
  }
};
