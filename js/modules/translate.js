/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { initTranslateMode };

/**
 * Add button to copy when translate mode is ON
 */
const initTranslateMode = (storage) => {
  storage.feature_translatemode == undefined ? (storage.feature_translatemode = false) : false;

  if (storage.feature_translatemode) {
    let isTranslateMode = false;
    let scEditorPanel = document.querySelector(".scEditorPanel");
    let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
    let scEditorTabs = document.querySelector("div#scEditorTabs");
    let scEditorSectionPanel = document.querySelectorAll(".scEditorSectionPanel .scEditorSectionPanelCell")[1];
    let scTextFields = scEditorPanel.querySelectorAll("input, textarea, select");
    let scEditorHeaderVersionsLanguage = document.querySelector(".scEditorHeaderVersionsLanguage");
    let count = 0;
    if (scEditorHeaderVersionsLanguage) {
      var scLanguageTxtShort = scEditorHeaderVersionsLanguage.innerText;
    }

    //Detect if Translate Mode is on
    if (scEditorSectionPanel) {
      if (scEditorSectionPanel.querySelector(".scEditorFieldMarkerInputCell > table > tbody") != null) {
        isTranslateMode = true;
      }
    }

    if (isTranslateMode) {
      for (var field of scTextFields) {
        if (field.className == "scContentControl" || field.className == "scContentControlMemo" || field.className == "scContentControlImage" || (field.className.includes("scCombobox") && !field.className.includes("scComboboxEdit"))) {
          tdMiddle = null;

          if (count % 2 == 0) {
            //Left
            var fieldLeft = field;
            var fieldLeftLang = field.getAttribute("onfocus");
            fieldLeftLang = fieldLeftLang.split("lang=");
            fieldLeftLang = fieldLeftLang[1].split("&");
            fieldLeftLang = fieldLeftLang[0].toUpperCase();
          } else {
            //Right
            var fieldRight = field;
            var fieldRightLang = field.getAttribute("onfocus");
            fieldRightLang = fieldRightLang.split("lang=");
            fieldRightLang = fieldRightLang[1].split("&");
            fieldRightLang = fieldRightLang[0].toUpperCase();

            //Find closest TD
            var tr = field.closest("td").parentNode;
            var td = tr.querySelectorAll("td");
            var tdMiddle = td[1];

            //Add images
            if (tdMiddle != null) {
              tdMiddle.innerHTML =
                '<a class="scTranslateRTL" href="javascript:copyTranslate(\'' +
                fieldLeft.id +
                "','" +
                fieldRight.id +
                "','RTL');\" title=\"Copy " +
                fieldRightLang +
                " to " +
                fieldLeftLang +
                '"><img loading="lazy" src="' +
                chrome.runtime.getURL("images/navigate_left.png") +
                '" style="padding: 0px 2px 0px 0px; vertical-align: bottom; width: 20px;" alt="Copy"></a>';
            }
          }

          count++;
        }
      }

      //Add message bar
      if (!document.querySelector("#scMessageBarTranslation")) {
        let scMessage = `<div id="scMessageBarTranslation" class="scMessageBar scInformation">
          <div class="scMessageBarIcon" style="background-image:url(${global.iconTranslate})"></div>
          <div class="scMessageBarTextContainer">
            <div class="scMessageBarTitle">Translation Mode (${fieldRightLang} to ${fieldLeftLang})</div>
            <div class="scMessageBarText">You are translating content. If you want, you can directly </b></div>
            <ul class="scMessageBarOptions" style="margin:0px">
              <li class="scMessageBarOptionBullet">
                <a class="scMessageBarOption" onclick="javascript:copyTranslateAll();" style="cursor:pointer">Copy existing content into ${scLanguageTxtShort} version</a>
              </li>
            </ul>
            </div>
          </div>`;
        if (scEditorTabs) {
          scEditorTabs.insertAdjacentHTML("beforebegin", scMessage);
        } else if (scQuickInfo) {
          scQuickInfo.insertAdjacentHTML("beforebegin", scMessage);
        }
      }
    }
  }
};
