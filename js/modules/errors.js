/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { initGroupedErrors };

const initGroupedErrors = () => {
  //Variables
  var count = 0;
  var scErrors = document.getElementsByClassName("scValidationMarkerIcon");
  var scEditorID = document.querySelector("#MainPanel");

  //Prepare HTML
  var scMessageErrors =
    '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' +
    global.iconError +
    ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">';

  for (let item of scErrors) {
    if (item.getAttribute("src") != "/sitecore/shell/themes/standard/images/bullet_square_yellow.png") {
      scMessageErrors +=
        '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + "</li>";
      count++;
    }
  }
  scMessageErrors += "</ul></div></div>";

  //Insert message bar into Sitecore Content Editor
  if (count > 0) {
    scEditorID.insertAdjacentHTML("beforebegin", scMessageErrors);
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

      count = 0;
      //Current errors
      scErrors = document.querySelectorAll(" .scValidationMarkerIcon ");

      //Prepare HTML
      var scMessageErrors =
        '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' +
        global.iconError +
        ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">';

      for (let item of scErrors) {
        if (item.getAttribute("src") != "/sitecore/shell/themes/standard/images/bullet_square_yellow.png") {
          //prettier-ignore
          scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + "</li>";
          count++;
        }
      }
      scMessageErrors += "</ul></div></div>";

      //Add errors
      count > 0 ? scEditorID.insertAdjacentHTML("beforebegin", scMessageErrors) : false;
    }, 1500);
  });

  //Observer
  target
    ? observer.observe(target, {
        attributes: true,
        childList: true,
        characterData: true,
      })
    : false;
};
