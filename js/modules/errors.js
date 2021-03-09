/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { initGroupedErrors };

const getErrors = (storage) => {
  storage.feature_cetabs == undefined ? (storage.feature_cetabs = false) : false;

  let scErrors = document.getElementsByClassName("scValidationMarkerIcon");
  let scMessageErrors = false;
  let count = 0;
  let found, section, click;

  for (let item of scErrors) {
    item.getAttribute("src") != "/sitecore/shell/themes/standard/images/bullet_square_yellow.png" ? count++ : false;
  }

  if (count > 0) {
    //Prepare HTML
    scMessageErrors = `<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(${global.iconError})"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">`;

    for (let item of scErrors) {
      if (storage.feature_cetabs) {
        // eslint-disable-next-line prefer-named-capture-group
        found = item.getAttribute("onclick") ? item.getAttribute("onclick").match(/(?<=\(')(.*?)(?='\))/u) : false;
        section = document.querySelector(`[id^='${found[0]}']`) ? document.querySelector(`[id^='${found[0]}']`).closest(".scEditorSectionPanel").previousSibling.id : false;
        click = `document.querySelector('li[data-id=${section}]').click()`;
      } else {
        click = item.getAttribute("onclick");
      }
      if (item.getAttribute("src") != "/sitecore/shell/themes/standard/images/bullet_square_yellow.png") {
        scMessageErrors += `<li class="scMessageBarOptionBullet" onclick="${click}" style="cursor:pointer;">${item.getAttribute("title")}</li>`;
      }
    }

    scMessageErrors += `</ul></div></div>`;
  }

  return scMessageErrors;
};

const initGroupedErrors = (storage) => {
  //Variables
  storage.feature_errors == undefined ? (storage.feature_errors = true) : false;
  if (storage.feature_errors) {
    let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
    let scEditorTabs = document.querySelector("div#scEditorTabs");
    let scMessageErrors = getErrors(storage);

    //Insert message bar into Sitecore Content Editor
    if (scMessageErrors != false && !document.querySelector("#scMessageBarError")) {
      if (scEditorTabs) {
        scEditorTabs.insertAdjacentHTML("beforebegin", scMessageErrors);
      } else if (scQuickInfo) {
        scQuickInfo.insertAdjacentHTML("beforebegin", scMessageErrors);
      }
    }

    //Update on change/unblur
    let timer, element, target, observer;
    target = document.querySelector(".scValidatorPanel");
    observer = new MutationObserver(function () {
      timer ? clearTimeout(timer) : false;
      timer = setTimeout(function () {
        //Delete all errors
        element = document.querySelector("#scMessageBarError");
        element ? element.parentNode.removeChild(element) : false;

        let scMessageErrors = getErrors(storage);

        //Add errors
        if (scMessageErrors != false) {
          if (scEditorTabs) {
            scEditorTabs.insertAdjacentHTML("beforebegin", scMessageErrors);
          } else if (scQuickInfo) {
            scQuickInfo.insertAdjacentHTML("beforebegin", scMessageErrors);
          }
        }
      }, 1000);
    });

    //Observer
    target
      ? observer.observe(target, {
          attributes: true,
          childList: true,
          characterData: true,
        })
      : false;
  }
};
