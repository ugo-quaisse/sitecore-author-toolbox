/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";
import { initStorageFeature } from "./helpers.js";

export { checkReminder };

/**
 * Check if a reminder has been set
 */
// eslint-disable-next-line max-params
const checkReminder = (item, language, version, storage) => {
  storage.feature_reminder = initStorageFeature(storage.feature_reminder, false);
  if (storage.feature_reminder) {
    global.debug ? console.log("Check reminder") : false;
    if (item) {
      let itemUrl = `sitecore/shell/default.aspx?xmlcontrol=Gallery.Reminder&id=${item}&la=${language}&vs=${version}`;
      var ajax = new XMLHttpRequest();
      ajax.timeout = global.timeoutAsync;
      ajax.open("GET", itemUrl, true);
      // eslint-disable-next-line consistent-return
      ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status == "200") {
          let dom = new DOMParser().parseFromString(ajax.responseText, "text/html");
          let reminder = dom.querySelector("#Panel").innerHTML;

          if (reminder.toLowerCase() != "no reminder has been set.") {
            let scEditorID = document.querySelector(".scEditorHeader");
            let scMessageBarReminder = document.querySelector(".scMessageBarReminder");

            //prettier-ignore
            let scMessage = `<div id="scMessageBarUrl" class="scMessageBar scInformation scMessageBarReminder">
            <div class="scMessageBarIcon" style="background-image:url(${global.iconReminder})"></div>
              <div class="scMessageBarTextContainer">
                <div class="scMessageBarTitle">Reminder set</div>
                <div class="scMessageBarText">${reminder}</div>
                <ul class="scMessageBarOptions" style="margin:0px">
                    <li class="scMessageBarOptionBullet"><a href="#" onclick="javascript:return scForm.postEvent(this,event,'item:reminderclear(id=${item})')" target="_blank" class="scMessageBarOption">Clear this reminder</a></li>
                </ul>
              </div>
            </div>`;
            !scMessageBarReminder ? scEditorID.insertAdjacentHTML("afterend", scMessage) : false;
          }
        }
      };

      setTimeout(function () {
        ajax.send(null);
      }, 800);
    }
  }
};
