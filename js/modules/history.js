/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { log, exeJsCode } from "./helpers.js";
import { sitecoreAuthorToolbox } from "./contenteditor.js";

export { resumeFromWhereYouLeftOff, historyNavigation };

/**
 * Resume from where you left off
 */
const resumeFromWhereYouLeftOff = (storage) => {
  if (!global.hasRedirectionOther && !global.isLaunchpad) {
    //fo parameters is the default Sitecore behaviour to open a specific item
    storage.feature_reloadnode == undefined ? (storage.feature_reloadnode = true) : false;
    if (storage.scData != undefined && !global.urlParams.get("fo") && !global.urlParams.get("ro")) {
      //If Hash detected in the URL
      if (global.scUrlHash != "") {
        var temp = global.scUrlHash.split("_");
        storage.scItemID = temp[0];
        storage.scLanguage = temp[1];
        storage.scVersion = temp[2];
        storage.scSource = "Hash";
      } else {
        //Get scData from storage
        var scData = storage.scData;
        for (var domain in scData) {
          // eslint-disable-next-line no-prototype-builtins
          if (
            // eslint-disable-next-line no-prototype-builtins
            scData.hasOwnProperty(domain) &&
            domain == window.location.origin
          ) {
            storage.scItemID = scData[domain].scItemID;
            storage.scLanguage = scData[domain].scLanguage;
            storage.scVersion = scData[domain].scVersion;
            storage.scSource = "Storage";
          }
        }
      }

      //Security check
      storage.scLanguage == undefined ? (storage.scLanguage = "en") : false;

      //Reload from where you left off
      if (storage.scItemID && storage.feature_reloadnode === true) {
        log("[Read " + storage.scSource + "] Item : " + storage.scItemID, "beige");
        log("[Read " + storage.scSource + "] Language : " + storage.scLanguage, "beige");
        log("[Read " + storage.scSource + "] Version : " + storage.scVersion, "beige");
        log("*** Redirection ***", "yellow");
        exeJsCode(`scForm.invoke("item:load(id=` + storage.scItemID + `,language=` + storage.scLanguage + `,version=` + storage.scVersion + `)");`);
      } else {
        //There is no redirection, so we force a UI refresh
        sitecoreAuthorToolbox(storage);
      }
    } else {
      //There is no redirection, so we force a UI refresh
      sitecoreAuthorToolbox(storage);
    }
  }
};

/**
 * Navigate in history
 */
const historyNavigation = () => {
  window.onpopstate = function (event) {
    if (event.state && event.state.id != "") {
      //Store a local value to tell toolboxscript we are changing item from back/previous button, so no need to add #hash as it's already performed by the browser
      localStorage.setItem("scBackPrevious", true);
      exeJsCode(`scForm.invoke("item:load(id=` + event.state.id + `,language=` + event.state.language + `,version=` + event.state.version + `)");`);
    }
  };
};
