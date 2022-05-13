/* eslint-disable max-params */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";
import { initStorageFeature, setPlural } from "./helpers.js";
import { buildLiveUrl, getSiteUrl } from "./url.js";
import { findCountryName } from "./language.js";

export { checkLockedItems, getRelatedItems, getItemProperties };

/**
 * Check all locked items
 */
const checkLockedItems = (item, storage) => {
  storage.feature_lockeditems = initStorageFeature(storage.feature_lockeditems, false);
  if (storage.feature_lockeditems) {
    global.debug ? console.log("Check locked items") : false;
    let itemUrl = `sitecore/shell/-/xaml/Sitecore.Shell.Applications.WebEdit.Dialogs.LockedItems.aspx?Cart_ctl00_ctl00_ctl00_ctl00_ctl05_Items_Callback=yes`;
    var ajax = new XMLHttpRequest();
    ajax.timeout = global.timeoutAsync;
    ajax.open("GET", itemUrl, true);
    // eslint-disable-next-line consistent-return
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status == "200") {
        let dom = new DOMParser().parseFromString(ajax.responseText, "application/xml");
        let data = dom.querySelector("Data").innerHTML.toLowerCase();

        if (data.includes(item)) {
          let scEditorID = document.querySelector(".scEditorHeader");
          let scMessageBarLocked = document.querySelector(".scLockItemBar");
          let lockedMessage = "You have locked this item";

          //prettier-ignore
          let scMessage = `<div id="scMessageBarUrl" class="scMessageBar scWarning scLockItemBar">
            <div class="scMessageBarIcon" style="background-image:url(${global.iconLock})"></div>
              <div class="scMessageBarTextContainer">
                <div class="scMessageBarTitle">${lockedMessage}</div>
                <div class="scMessageBarText">Nobody can edit this page until it is unlocked.</div>
                <ul class="scMessageBarOptions" style="margin:0px">
                    <li class="scMessageBarOptionBullet">
                        <a href="#" onclick="javascript:return scForm.postEvent(this,event,'item:checkin')" class="scMessageBarOption">Unlock this now</a>
                    </li>
                </ul>
              </div>
            </div>`;
          !scMessageBarLocked ? scEditorID.insertAdjacentHTML("afterend", scMessage) : false;

          document.querySelector("#scLockMenuText") ? (document.querySelector("#scLockMenuText").innerHTML = "Unlock this item") : false;
        }
      }
    };

    setTimeout(function () {
      ajax.send(null);
    }, 500);
  }
};

/**
 * Get related medias
 */
const getRelatedItems = (sitecoreItemID, scLanguage, scVersion) => {
  var ajax = new XMLHttpRequest();
  ajax.timeout = global.timeoutAsync;
  ajax.open("GET", `/sitecore/shell/default.aspx?xmlcontrol=Gallery.Links&id=${sitecoreItemID}&la=${scLanguage}&vs=${scVersion}&db=master`, true);
  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status == "200") {
      let html = new DOMParser().parseFromString(ajax.responseText, "text/html");
      let relatedItems = [];
      html.querySelectorAll("#Links > .scRef > .scLink").forEach((el) => {
        !relatedItems.includes(el.innerText) ? relatedItems.push(el.innerText) : false;
      });
      let usageText = relatedItems.length > 0 ? `✅ ${relatedItems.length} time${setPlural(relatedItems.length)}` : `⚠️ Not used`;
      let table = document.querySelector(".scEditorQuickInfo");
      if (table) {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = `Usage`;
        cell2.innerHTML = `<a href="#" onclick="javascript:return scContent.showGallery(this,event,'UsageFrame','Gallery.Links','id=${sitecoreItemID}&la=${scLanguage}&vs=${scVersion}&db=master&sc_content=master&ShowEditor=1&Ribbon.RenderTabs=true','600px','300px')">${usageText}</a>`;
      }
    }
  };
  sitecoreItemID ? ajax.send(null) : false;
};

/**
 * Get all items properties
 */
const getItemProperties = (itemId, language, version, storage, format = "html") => {
  storage.feature_quickinfoenhancement = initStorageFeature(storage.feature_quickinfoenhancement, true);
  if (storage.feature_quickinfoenhancement) {
    global.debug ? console.log("Check item properties") : false;
    let itemUrl = `sitecore/shell/default.aspx?xmlcontrol=ContentEditor.Properties&id=${itemId}&la=${language}&vs=${version}`;
    var ajax = new XMLHttpRequest();
    ajax.timeout = global.timeoutAsync;
    ajax.open("GET", itemUrl, true);
    // eslint-disable-next-line consistent-return
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status == "200") {
        //If success, parse the response and get the needed information
        let html = new DOMParser().parseFromString(ajax.responseText, "text/html");
        //Display the information as html in the Quickinfo section
        if (format == "html") {
          html.querySelectorAll(".scListControl tr").forEach(function (line) {
            let table = document.querySelector(".scEditorQuickInfo");

            if (line.querySelector(".scValue") !== null && table) {
              //Add the information into the Quickinfo section
              if (
                line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "modified" ||
                line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "state" ||
                line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "archive" ||
                (line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "created" && !line.querySelector(".scValue").innerText.includes(" by "))
              ) {
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = line.querySelector(".scKey").innerText;
                cell2.innerHTML = line.querySelector(".scValue").innerText.includes("(final state)") ? `<span class="scWorkflowChipFinal">${line.querySelector(".scValue").innerText}</span>` : line.querySelector(".scValue").innerText;
                cell2.innerHTML = line.querySelector(".scValue").innerText.toLowerCase().includes("no workflow state assigned")
                  ? `<span class="scWorkflowChipNone">${line.querySelector(".scValue").innerText}</span>`
                  : line.querySelector(".scValue").innerText;
              }
            }
          });
          // Or get liveUrl from path to display it in the publish confirmation window
        } else if (format == "liveUrl") {
          let itemName = ``;
          html.querySelectorAll(".scListControl tr").forEach(function (line) {
            if (line.querySelector(".scValue .scItemID") !== null && line.querySelector(".scKey").innerText.toLowerCase().includes("item key")) {
              itemName = line.querySelector(".scValue").innerText ? line.querySelector(".scValue").innerText : false;
            }
            if (line.querySelector(".scValue .scItemID") !== null && line.querySelector(".scKey").innerText.toLowerCase().includes("item path")) {
              let itemPath = line.querySelector(".scValue .scItemID").value ? line.querySelector(".scValue .scItemID").value.toLowerCase() + "/" : false;
              //Update live URLs TODO
              //Display URLs for all lang published
              let liveUrlsHtml = `<div style="background-color: var(--messageSuccessBar); padding: 15px; border-radius: 5px; color: var(--grey7); font-weight: 600; font-weight: 14px;"><div class="scFieldLabel" style="font-size: 13px;">🎉 Sitecore Live URL</div>`;
              var i = 0;
              let ScItem = {};
              document.querySelectorAll("#Languages > input").forEach(() => {
                let langCheched = document.querySelectorAll("#Languages > input")[i].checked;
                let langValue = document.querySelectorAll("#Languages > input")[i].value.toLowerCase();
                let langLabel = document.querySelectorAll("#Languages > label")[i].innerText;
                if (langCheched) {
                  let ScSite = getSiteUrl(storage, itemPath, langValue);
                  //Build current item object
                  ScItem.id = itemId;
                  ScItem.language = langValue;
                  ScItem.version = "";
                  ScItem.name = itemName;
                  ScItem.pathFull = itemPath;
                  //Build item Live URL
                  let ScUrl = buildLiveUrl(ScItem, ScSite);
                  //Display the live URL
                  let flag = findCountryName(langLabel);
                  flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + flag + ".svg") : chrome.runtime.getURL("images/Flags/16x16/flag_" + flag + ".png");
                  flag = `<img loading="lazy" id="scFlag" src="${flag}" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px !important" onerror="this.onerror=null;this.src='${global.iconFlagGeneric}';">`;
                  liveUrlsHtml += `<a href="${ScUrl.liveUrl.toLowerCase()}" target="_blank" style="
    color: var(--messageSuccessLink);">${flag} ${langLabel} - Open this page <img src="${global.iconExternalLink}" style="padding-left: 2px; width:11px"/></a><br />`;
                }
                i++;
              });

              let textArea = document.querySelector("#Status");
              //Template type
              let isContent = ScItem.pathFull.includes("/sitecore/content/");
              let isMedia = ScItem.pathFull.includes("/sitecore/media library/");
              let isData = ScItem.pathFull.includes("/data/");
              let isSettings = ScItem.pathFull.includes("/settings/");
              let isPresentation = ScItem.pathFull.includes("/presentation/");
              let isEmailTemplate = ScItem.pathFull.includes("/sitecore/content/email/");
              //Excluding data, presentation, settings, email, dictionnary
              if (isContent && !isData && !isPresentation && !isSettings && !isEmailTemplate && !isMedia) {
                textArea ? textArea.insertAdjacentHTML("afterend", liveUrlsHtml + "</div>") : false;
              }
            }
          });
        }
      }
    };

    setTimeout(function () {
      ajax.send(null);
    }, 500);

    getRelatedItems(itemId, language, version);
  }
};
