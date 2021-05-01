/* eslint-disable max-params */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";

export { checkLockedItems, getRelatedItems, getItemProperties };

/**
 * Check all locked items
 */
const checkLockedItems = (item, storage) => {
  storage.feature_lockeditems == undefined ? (storage.feature_lockeditems = true) : false;
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
  ajax.open("GET", "/sitecore/shell/default.aspx?xmlcontrol=Gallery.Links&id=" + sitecoreItemID + "&la=" + scLanguage + "&vs=" + scVersion + "&db=master", true);
  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status == "200") {
      let html = new DOMParser().parseFromString(ajax.responseText, "text/html");
      let relatedItems = [];
      html.querySelectorAll("#Links > .scRef > .scLink").forEach((el) => {
        !relatedItems.includes(el.innerText) ? relatedItems.push(el.innerText) : false;
      });
      console.table(relatedItems);
    }
  };
  sitecoreItemID ? ajax.send(null) : false;
};

/**
 * Get all items properties
 */
const getItemProperties = (itemId, language, version, storage) => {
  storage.feature_quickinfoenhancement == undefined ? (storage.feature_quickinfoenhancement = true) : false;
  if (storage.feature_quickinfoenhancement) {
    global.debug ? console.log("Check item properties") : false;
    let itemUrl = `sitecore/shell/default.aspx?xmlcontrol=ContentEditor.Properties&id=${itemId}&la=${language}&vs=${version}`;
    var ajax = new XMLHttpRequest();
    ajax.timeout = global.timeoutAsync;
    ajax.open("GET", itemUrl, true);
    // eslint-disable-next-line consistent-return
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status == "200") {
        //If success
        let html = new DOMParser().parseFromString(ajax.responseText, "text/html");

        html.querySelectorAll(".scListControl tr").forEach(function (line) {
          let table = document.querySelector(".scEditorQuickInfo");
          if (line.querySelector(".scValue") !== null && table) {
            if (
              line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "modified" ||
              // line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "reminder date" ||
              // line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "workflow" ||
              line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "state" ||
              // line.querySelector(".scKey").innerText.replace(":", "").toLowerCase() == "lock" ||
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
      }
    };

    setTimeout(function () {
      ajax.send(null);
    }, 500);

    //getRelatedItems(itemId, language, version);
  }
};
