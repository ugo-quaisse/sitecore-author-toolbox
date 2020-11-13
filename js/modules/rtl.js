/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";
import { loadCssFile } from "./helpers.js";

export { initRTL };

/**
 *  Change to Right-to-left for Arabic
 */
const initRTL = (storage) => {
  let scLanguageTxtShort = document.querySelector(".scEditorHeaderVersionsLanguage") ? document.querySelector(".scEditorHeaderVersionsLanguage").innerText : false;
  storage.feature_rtl == undefined ? (storage.feature_rtl = true) : false;
  if (storage.feature_rtl && scLanguageTxtShort) {
    //Get active language
    let temp = scLanguageTxtShort.split(" (");
    let scFlag = temp[0].toUpperCase();
    console.log(scFlag);

    if (global.rteLanguages.includes(scFlag)) {
      //RTL
      loadCssFile("css/rtl.min.css");
      for (let iframe of document.getElementsByClassName("scContentControlHtml")) {
        iframe.onload = function () {
          iframe.contentWindow.document.getElementById("ContentWrapper") ? (iframe.contentWindow.document.getElementById("ContentWrapper").style.direction = "RTL") : false;
        };
      }
    } else {
      //LTR
      loadCssFile("css/ltr.min.css");
      for (let iframe of document.getElementsByClassName("scContentControlHtml")) {
        iframe.onload = function () {
          iframe.contentWindow.document.getElementById("ContentWrapper") ? (iframe.contentWindow.document.getElementById("ContentWrapper").style.direction = "LTR") : false;
        };
      }
    }
  }
};
