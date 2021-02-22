/* eslint-disable no-prototype-builtins */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { log } from "./helpers.js";

export { cleanCountryName, findCountryName, initFlagRibbonEE, initLanguageMenuEE, initLanguageMenuCE, initFlagsPublishingWindow, initFlagsPublish };

/**
 * Clean a Sitecore-specific country name to make it regular name
 */
const cleanCountryName = (name) => {
  var temp = name;
  var language = "ENGLISH";
  if (temp != null && temp != undefined && temp != "") {
    if (temp.includes(" (region")) {
      temp = temp.split(" (region");
      temp = temp[0];
    }
    if (temp.includes(" :")) {
      temp = temp.split(" :");
      temp = temp[0];
    }
    temp = temp.split(" (");
    if (temp[1] == undefined) {
      temp = temp[0];
    } else {
      temp = temp[1];
    }
    temp = temp.split(")");
    if (temp[0].includes(", ")) {
      temp = temp[0].split(", ");
      temp[0] = temp[1];
      temp[0] = temp[0].replace(" ", "_");
    }
    temp = temp[0].replace(" ", "_");
    temp = temp.toUpperCase();
    language = temp.replace("TRADITIONAL,_", "");
    language = language.replace("SIMPLIFIED,_", "");
    language = language.replace("_S.A.R.", "");
    language = language.replace("_PRC", "");
    language = language.replace("SAR", "").trim();
    //Replace non-standard country name
    language = language.replace("U.A.E.", "UNITED_ARAB_EMIRATES");
    language = language.replace("KOREA", "SOUTH_KOREA");
    language = language.replace("KOREAN", "KOREA");
    language = language.replace("UNITED_STATES", "USA");
    language = language.replace("UNITED_KINGDOM", "GREAT_BRITAIN");
    language = language.replace("ENGLISH", "USA");
    language = language.replace("PRC", "CHINA");
    language = language.replace("SIMPLIFIED", "CHINA");
    language = language.replace("TRADITIONAL", "CHINA");
  }

  return language.toLowerCase();
};

/**
 * Find Sitecore Country name is Json Data list
 */
const findCountryName = (name) => {
  var country = cleanCountryName(name);

  for (var key in global.jsonData) {
    if (global.jsonData.hasOwnProperty(key) && country.toUpperCase() == global.jsonData[key].language.toUpperCase()) {
      country = global.jsonData[key].flag;
      break;
    }
  }

  return country.toLowerCase();
};

/**
 * Update current flag language in ribbon button
 */
const initFlagRibbonEE = (storage) => {
  let scRibbonFlagIcons = document.querySelector(".flag_generic_24");
  let tdlanguage;
  scRibbonFlagIcons ? (tdlanguage = scRibbonFlagIcons.nextSibling.innerText) : false;
  //Clean country name
  if (tdlanguage) {
    tdlanguage = findCountryName(tdlanguage);
    let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/24x24/flag_" + tdlanguage + ".png");
    scRibbonFlagIcons.setAttribute("style", "background-image: url(" + flag + "); background-repeat: no-repeat; background-position: top left;");
  }
};

/**
 * Add flags and sort language menu from Experience Editor
 */
const initLanguageMenuEE = (storage) => {
  log("**** Languages menu EE ****", "yellow");
  storage.feature_flags == undefined ? (storage.feature_flags = true) : false;

  if (storage.feature_flags) {
    let tdDiv, tdlanguage, tdversion, temp;
    let dom = document.querySelector(".sc-gallery-content");
    let div = dom.querySelectorAll("a[data-sc-argument]");

    //Sort alphabetically or by version
    div = [].slice.call(div).sort(function (a, b) {
      return a.querySelector("a > div > div:last-child > span").textContent > b.querySelector("a > div > div:last-child > span").textContent ? -1 : 1;
      //return a.textContent > b.textContent ? 1 : -1;
    });
    //Append dom
    div.forEach(function (language) {
      dom.appendChild(language);
    });

    for (let item of div) {
      tdDiv = item.querySelector(".sc-gallery-option-content,.sc-gallery-option-content-active");
      tdlanguage = item.querySelector(".sc-gallery-option-content-header > span").innerText;
      tdversion = item.querySelector(".sc-gallery-option-content-description > span");

      //Check fallback version
      temp = tdversion.innerHTML.split(" ");
      if (temp[0].toLocaleLowerCase() == "fallback") {
        tdversion.setAttribute("style", "background-color: lime; display: initial; padding: 0px 3px; color: #000000 !important");
      } else if (temp[0] != "0") {
        tdversion.setAttribute("style", "background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important");
      }

      tdlanguage = findCountryName(tdlanguage);
      let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");
      tdDiv.setAttribute("style", "padding-left:48px; background-image: url(" + flag + "); background-repeat: no-repeat; background-position: 5px; background-size: 32px");
    }
  }
};

/**
 * Add flags and sort language menu from Experience Editor
 */
const initLanguageMenuCE = (storage) => {
  log("**** Languages menu CE ****", "yellow");
  storage.feature_flags == undefined ? (storage.feature_flags = true) : false;

  if (storage.feature_flags) {
    let td, tdlanguage, tdversion, tdimage, temp;
    let dom = document.querySelector("#Languages");
    let div = dom.querySelectorAll(".scMenuPanelItem,.scMenuPanelItemSelected");
    var tdcount = 0;

    //Sort alphabetically or by version
    div = [].slice.call(div).sort(function (a, b) {
      return a.querySelector("table > tbody > tr > td > div > div:last-child").textContent > b.querySelector("table > tbody > tr > td > div > div:last-child").textContent ? -1 : 1;
      //return a.textContent > b.textContent ? 1 : -1;
    });
    //Append dom
    div.forEach(function (language) {
      dom.appendChild(language);
    });

    for (let item of div) {
      tdcount = 0;
      td = item.getElementsByTagName("td");

      for (let item2 of td) {
        if (tdcount == 0) {
          tdimage = item2.getElementsByTagName("img");
        } else {
          tdlanguage = item2.getElementsByTagName("b");
          tdlanguage = tdlanguage[0].innerHTML;

          tdversion = item2.getElementsByTagName("div");
          tdversion = tdversion[2].innerHTML;
          tdversion = tdversion.split(" ");

          let rawVersion = item2.getElementsByTagName("div")[2].innerHTML.toLowerCase();

          //Check fallback and version
          if (rawVersion == "fallback version") {
            temp = item2.getElementsByTagName("div");
            temp[2].setAttribute("style", "background-color: lime; display: initial; padding: 0px 3px; color: #000000 !important");
          } else if (tdversion[0] != "0") {
            temp = item2.getElementsByTagName("div");
            temp[2].setAttribute("style", "background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important");
          }

          tdlanguage = findCountryName(tdlanguage);
          tdimage[0].onerror = function () {
            this.src = global.iconFlagGeneric;
          };
          tdimage[0].src = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");
        }

        tdcount++;
      }
    }
  }
};

/**
 * Add flags to publishing window
 */
const initFlagsPublishingWindow = (storage) => {
  storage.feature_flags == undefined ? (storage.feature_flags = true) : false;

  if (storage.feature_flags) {
    //Listener ScrollablePanelLanguages
    let target = document.querySelector("body");
    let observer = new MutationObserver(function () {
      var tdlanguage;
      var label = document.querySelectorAll("div[data-sc-id=CheckBoxListLanguages] > table:last-child")[0];

      if (label != undefined && label.children[0].children.length > 1) {
        //Loop
        for (var tr of label.children[0].children) {
          for (var td of tr.children) {
            tdlanguage = findCountryName(td.innerText.trim());
            if (td.querySelector("#scFlag") == null) {
              let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/16x16/flag_" + tdlanguage + ".png");
              td.querySelector("label > span").insertAdjacentHTML(
                "beforebegin",
                ' <img loading="lazy" id="scFlag" src="' + flag + '" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px;" onerror="this.onerror=null;this.src=\'' + global.iconFlagGeneric + "';\"/>"
              );
            }
          }
        }
      }
    });

    //Observer publish
    target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: false,
          subtree: true,
        })
      : false;
  }
};

/**
 * Add flags to regular publish window
 */
const initFlagsPublish = (storage) => {
  storage.feature_flags == undefined ? (storage.feature_flags = true) : false;

  if (storage.feature_flags) {
    var label = document.querySelectorAll("#Languages > label:not(.scContentControlCheckboxLabel)");

    for (let item of label) {
      let tdlanguage = findCountryName(item.innerText.trim());
      let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/16x16/flag_" + tdlanguage + ".png");
      item.insertAdjacentHTML(
        "beforebegin",
        ' <img loading="lazy" id="scFlag" src="' + flag + '" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px" onerror="this.onerror=null;this.src=\'' + global.iconFlagGeneric + "';\"/>"
      );
    }
  }
};
