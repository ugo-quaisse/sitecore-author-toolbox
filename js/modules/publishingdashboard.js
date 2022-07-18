/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";
export { initPublishingStatus };

/**
 *  Add query suggestions to tempalate source field
 */
const initPublishingStatus = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;

  //TODO: check dom change on document.querySelector(".sc-progressindicatorpanel")
  //Add listener on reEditorModes and enable it
  var target = document.querySelector(".sc-progressindicatorpanel");
  var observer = new MutationObserver(function () {
    let status = document.querySelectorAll(`span[title^="Status"]`)[1];
    if (storage.feature_contenteditor == true && status) {
      //Add spinner
      status.innerText === "In progress" ? (status.innerHTML = `In Progress <img src='${global.urlLoaderiFrame}' width='20px'/>`) : false;
    }
  });

  //Observer
  if (target) {
    let config = {
      attributes: true,
      childList: true,
      characterData: false,
      subtree: true,
    };
    observer.observe(target, config);
  }
};
