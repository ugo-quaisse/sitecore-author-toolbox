/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { log, loadCssFile, sitecoreItemJson, getScItemData } from "./helpers.js";
import { initLiveUrl } from "./url.js";
import { checkHelpLink } from "./help.js";
import { checkReminder } from "./reminder.js";
import { checkLockedItems, getItemProperties } from "./items.js";
import { findCountryName } from "./language.js";
import { initGroupedErrors } from "./errors.js";
import { insertSavebar, insertBreadcrumb, insertLanguageButton, insertProfilesButton, insertVersionButton, insertMoreButton } from "./experimentalui.js";
import { initSyntaxHighlighterScriban } from "./rte.js";
import { initTabSections } from "./tabs.js";
import { initRTL } from "./rtl.js";
import { checkWorkbox } from "./workbox.js";
import { enhancedTreeSearch } from "./search.js";
import { initTranslateMode } from "./translate.js";
import { showSnackbarSite } from "./snackbar.js";

export { sitecoreAuthorToolbox, initCharsCount, initCheckboxes, initDateTimeField, initPasswordField, refreshContentEditor, openFolderTab, contentTreeScrollTo, keyEventListeners, resetContentEditor };

/*
 * Main function executed when the Content Editor refreshes
 */
const sitecoreAuthorToolbox = (storage) => {
  let count = 0;
  let scEditorHeader = document.querySelector(".scEditorHeader");
  let scEditorPanel = document.querySelector(".scEditorPanel");
  let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
  let scLanguageMenu = document.querySelector(".scEditorHeaderVersionsLanguage");
  let scActiveTab = document.querySelector(".scEditorTabHeaderActive");
  let scEditorHeaderVersionsLanguage = document.querySelector(".scEditorHeaderVersionsLanguage");
  let scLanguageTxtShort = scEditorHeaderVersionsLanguage ? scEditorHeaderVersionsLanguage.innerText : false;
  let ScItem = getScItemData();
  let temp = document.getElementsByClassName("scEditorHeaderQuickInfoInput");
  let sitecoreItemPathOriginal = ScItem.path + "/";
  let isMedia = sitecoreItemPathOriginal.includes("/sitecore/media library/");
  let scFlag, tabbedFlag, scMessage;
  /*
   * If no Quick info displayed, fallback message
   */
  if (!scQuickInfo) {
    if (!document.querySelector("#scMessageBarUrl")) {
      scMessage =
        '<div id="scMessageBarUrl" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' +
        global.iconError +
        ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Oh no... Sitecore Author Toolbox</div><div class="scMessageBarText">To fully enjoy Sitecore Author Toolbox, please enable <b>Title bar</b> and <b>Quick info section</b> under <b>Application Options</b>.<br />Alternatively, try to open the <b>Quick Info section</b> down below, if visible..</div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="" onclick="javascript:return scForm.postEvent(this,event,\'shell:useroptions\')" class="scMessageBarOption">Change my settings</a></li></ul></div></div>';
      if (scEditorHeader) {
        scEditorHeader.insertAdjacentHTML("afterend", scMessage);
      } else if (scEditorPanel) {
        scEditorPanel.insertAdjacentHTML("afterbegin", scMessage);
      }
    }
  }

  /**
   * Experimetal UI
   */
  if (storage.feature_experimentalui) {
    insertSavebar();
    insertBreadcrumb(ScItem.path);
    insertMoreButton();
    insertVersionButton(ScItem.id, ScItem.language, ScItem.version);
    insertLanguageButton(ScItem.id, ScItem.language, ScItem.version);
    insertProfilesButton();
  }

  initTabSections(storage);
  openFolderTab(storage);
  initLiveUrl(storage);
  initGroupedErrors(storage);
  initRTL(storage);
  initCharsCount(storage);
  initCopyToClipboard(storage);
  initSyntaxHighlighterScriban(storage);
  checkWorkbox(storage);
  checkHelpLink(ScItem.id, ScItem.language, ScItem.version, storage);
  checkReminder(ScItem.id, ScItem.language, ScItem.version, storage);
  getItemProperties(ScItem.id, ScItem.language, ScItem.version, storage);
  checkLockedItems(ScItem.id, storage);
  initFancyMessageBars(storage);
  initCheckboxes(storage);
  initDateTimeField(storage);
  initPasswordField(storage);
  initTranslateMode(storage);
  enhancedTreeSearch(storage);
  changeTitleWindow(storage);
  showSnackbarSite(storage, ScItem);

  /**
   * Insert Flag (In Active Tab) + Version Number
   */
  storage.feature_flags == undefined ? (storage.feature_flags = true) : false;
  storage.feature_experimentalui == undefined ? (storage.feature_experimentalui = false) : false;

  //Version number
  var scEditorHeaderVersionsVersion = document.querySelector(".scEditorHeaderVersionsVersion");
  if (scEditorHeaderVersionsVersion) {
    var scVersionTitle = scEditorHeaderVersionsVersion.getAttribute("title");
    temp = scVersionTitle.split("of");
    var versionTotal = temp[1] ? temp[1].replace(".", "").trim() : temp[0].replace(".", "").trim();
    var versionNumber = temp[0].replace("Version", "").trim();
    versionNumber < versionTotal
      ? (scEditorHeaderVersionsVersion.querySelector("span").innerText = scVersionTitle.replace("Version", "⚠️ Version").replace(".", " ▾"))
      : (scEditorHeaderVersionsVersion.querySelector("span").innerText = scVersionTitle.replace(".", " ▾"));

    //Experimental
    storage.feature_experimentalui
      ? (scEditorHeaderVersionsVersion.querySelector("span").innerHTML = scEditorHeaderVersionsVersion.querySelector("span").innerHTML.replace("Version", "<img src='" + global.iconVersion + "' class='scVersionIcon' />"))
      : false;
    //storage.feature_experimentalui ? document.querySelector(".scEditorHeaderNavigator").setAttribute("style","display:none") : false;
  }

  //Flag in tab and menu
  if (storage.feature_flags) {
    //Flag image
    scFlag = chrome.runtime.getURL("images/Flags/32x32/flag_" + findCountryName(scLanguageTxtShort) + ".png");

    //Insert Flag into Active Tab
    tabbedFlag = scFlag;
    setTimeout(function () {
      if (!document.querySelector("#scFlag")) {
        scActiveTab = document.querySelector(".scEditorTabHeaderActive");
        scActiveTab
          ? scActiveTab.insertAdjacentHTML(
              "afterbegin",
              '<img loading="lazy" id="scFlag" src="' + tabbedFlag + '" style="width: 21px; vertical-align: middle; padding: 0px 4px 0px 0px;" onerror="this.onerror=null;this.src=\'' + global.iconFlagGeneric + "';\"/>"
            )
          : false;
      }
    }, 100);

    //Insert Flag into Sitecore Language selector
    if (!document.querySelector("#scFlagMenu")) {
      scLanguageMenu
        ? scLanguageMenu.insertAdjacentHTML(
            "afterbegin",
            '<img loading="lazy" id="scFlagMenu" src="' + scFlag + '" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + global.iconFlagGeneric + "';\"/>"
          )
        : false;
    }

    //Experimental
    if (!document.querySelector(".scLanguageIcon") && scLanguageMenu) {
      storage.feature_experimentalui ? scLanguageMenu.insertAdjacentHTML("afterbegin", "<img src='" + global.iconLanguage + "' class='scLanguageIcon' /> ") : false;
    }
  }

  /**
   * Content Editor - UI enhancements
   */
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true) {
    /**
     * Select Content tab for content
     */
    if (!isMedia) {
      var EditorTabs = document.querySelectorAll("#EditorTabs > a");
      var CloseEditorTab = document.querySelectorAll("#EditorTabs .scEditorTabCloseContainer");
      for (var tab of EditorTabs) {
        count++;
        if (tab.innerText.toLowerCase() == "content" && count > 1 && CloseEditorTab.length == 0) {
          !tab.classList.contains("scRibbonEditorTabActive") ? tab.click() : false;
        }
      }
    }

    /*
     * Tree list shortcut to item when select option
     */
    document.querySelectorAll(".scContentControlSelectedList").forEach(function (item) {
      item.addEventListener("change", function (elem) {
        //Get selected option
        let itemId = elem.target.options[elem.target.selectedIndex].value;
        let itemName = elem.target.options[elem.target.selectedIndex].text;
        itemId = itemId.includes("|") ? itemId.split("|")[1] : itemId;
        //Get closest scContentControlMultilistCaption
        let parent = elem.target.options[elem.target.selectedIndex].closest(".scContentControlSelectedList");
        document.querySelector(".scOpenParent") ? document.querySelector(".scOpenParent").remove() : false;
        //prettier-ignore
        parent.insertAdjacentHTML("beforebegin", "<span class='scOpenParent'><a class='scOpenItem' href='#' onclick='scForm.invoke(\"item:load(id=" + itemId + ")\")'>Open \"" + itemName + "\" ↗</a><span>"
          );
      });
    });
  }

  /**
   * Update Favorite Item ID
   */
  let satFavorites = document.querySelector("#satFavorites");
  let scFavoritesUrl = "../default.aspx?xmlcontrol=Gallery.Favorites&id=" + ScItem.id + "&la=en&vs=1";
  satFavorites ? (satFavorites.src = scFavoritesUrl) : false;

  /**
   * Save data in storage
   */
  sitecoreItemJson(ScItem.id, ScItem.language, ScItem.version);

  /**
   * Change UI opacity back to normal
   */
  clearTimeout(global.timeout);
  setTimeout(function () {
    document.querySelector("#svgAnimation") ? document.querySelector("#svgAnimation").setAttribute("style", "opacity:0") : false;
    document.querySelector("#EditorFrames") ? document.querySelector("#EditorFrames").setAttribute("style", "opacity:1") : false;
    document.querySelector(".scContentTreeContainer") ? document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:1") : false;
  }, 100);
};

/**
 * Automatically switch to Folder tab
 */
const openFolderTab = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true && document.querySelector("#EditorTabs > .scRibbonEditorTabActive")) {
    if (document.querySelector("#EditorTabs > .scRibbonEditorTabActive").innerText.toLowerCase() == "search") {
      document.querySelectorAll("#EditorTabs > a").forEach(function (e) {
        e.innerText.toLowerCase() == "folder" ? e.click() : false;
      });
    }
  }
};

/**
 * Fancy message bars
 */
const initFancyMessageBars = (storage) => {
  setTimeout(function () {
    for (let scWarning of document.querySelectorAll(".scWarning")) {
      var scWarningText = scWarning.querySelector(".scMessageBarTitle").innerText;
      var scWarningTextBar = scWarning.querySelector(".scMessageBarText");
      var scWarningIcon = scWarning.querySelector(".scMessageBarIcon");
      var isLockMessage = scWarningText.includes(" lock");
      var isElevateUnlock = scWarningText.includes("Elevated Unlock");
      var isNotFinalWorkflowStep = scWarningText.includes("is not in the final workflow step.");
      var isUnicorned = scWarningText.includes("This item is controlled by Unicorn");
      var isNoVersion = scWarningText.includes("The current item does not have a version");
      var isProtected = scWarningText.includes("You cannot edit this item because it is protected.");
      var isPermission = scWarningText.includes("you do not have write access to it.");
      var isNoFields = scWarningText.includes("The current item does not contain any fields.");

      //Update UI if experimental UI
      if (storage.feature_experimentalui) {
        isNoVersion && document.querySelector(".scSaveBar > .scActions")
          ? (document.querySelector(".scSaveBar > .scActions").innerHTML = `<button class="primary" onclick="javascript:return scForm.postEvent(this,event,'item:addversion')">Add new version</button>`)
          : false;

        if (isProtected) {
          document.querySelector(".scEditorPanel").innerHTML = `<div class="scNoVersion">
            <img src='${global.iconLocked}' width="128" /><br />
            <p>${scWarningText}</p><br />
            <button onclick="javascript:return scForm.postEvent(this,event,'item:togglereadonly')" type="button">Unprotect this item</button>
          </div>`;
        }

        if (isNoFields) {
          document.querySelector(".scEditorPanel").innerHTML = `<div class="scNoVersion">
            <img src='${global.iconFields}' width="128" /><br />
            <p>${scWarningText}</p><br />
            <button id="scInfoButton" type="button">Show Item details</button>
          </div>`;
        }

        if (isNoVersion) {
          //prettier-ignore
          document.querySelector(".scEditorPanel").innerHTML = `<div class="scNoVersion">
            <img src='${global.iconLanguage}' width="128" /><br />
            <p>${scWarningText}</p><br />
            <button onclick="javascript:return scForm.postEvent(this,event,'item:addversion')" type="button">Add new version</button>
          </div>`;
        }
      }

      //If fancy message bar is enabled
      storage.feature_messagebar == undefined ? (storage.feature_messagebar = false) : false;
      if (storage.feature_messagebar) {
        isNoVersion ? scWarningIcon.setAttribute("style", `background-image: url(${global.iconTranslate});`) : false;
        isNotFinalWorkflowStep ? scWarningIcon.setAttribute("style", `background-image: url(${global.iconWorkflow});`) : false;
        isElevateUnlock || isProtected || isPermission ? scWarningIcon.setAttribute("style", `background-image: url(${global.iconLock});`) : false;
        isLockMessage ? scWarningIcon.setAttribute("style", `background-image: url(${global.iconLock});`) : false;
        isUnicorned ? scWarningIcon.setAttribute("style", `background-image: url(${global.iconUnicorn});`) : false;
        isUnicorned
          ? (scWarningTextBar.innerHTML = scWarningTextBar.innerHTML
              .replace("<br><br>", "<br>")
              .replace("<br><b>Predicate", " <b>Predicate")
              .replace("Changes to this item will be written to disk so they can be shared with others.<br>", ""))
          : false;
      }
    }
    //Check if item is locked
    // setTimeout(function () {
    //   var isItemLocked = document.querySelector(".scRibbon").innerHTML.includes("Check this item in.");

    //   if (isItemLocked && !isElevateUnlock && !isLockMessage) {
    //     if (isLockMessage) {
    //       var temp = scWarningText.split("' ");
    //       var lockedBy = temp[0].replace("'", "");
    //       lockedBy += " has";
    //     } else {
    //       lockedBy = "You have";
    //     }

    //     document.querySelector("#scLockMenuText") ? (document.querySelector("#scLockMenuText").innerText = "Unlock item...") : false;

    //     //Prepare HTML
    //     let scMessage = `<div id="scMessageBarUrl" class="scMessageBar scWarning">
    //         <div class="scMessageBarIcon" style="background-image:url(${global.iconLock})"></div>
    //         <div class="scMessageBarTextContainer">
    //           <div class="scMessageBarTitle">${lockedBy} locked this item.</div>
    //           <div class="scMessageBarText">Nobody can edit this page until you unlock it.</div>
    //           <ul class="scMessageBarOptions">
    //             <li class="scMessageBarOptionBullet">
    //               <a href="#" onclick="javascript:return scForm.postEvent(this,event,'item:checkin')" class="scMessageBarOption">Unlock this item</a>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>`;
    //     scEditorHeader.insertAdjacentHTML("afterend", scMessage);
    //   }
    // }, 1000);
  }, 100);
};

/*
 * Add characters counter and checkbox
 */
const initCharsCount = (storage) => {
  storage.feature_charscount == undefined ? (storage.feature_charscount = true) : false;
  if (storage.feature_charscount) {
    /*
     * Add a characters count next to each input and textarea field
     */
    var scTextFields = document.querySelectorAll("input, textarea");
    var countHtml;
    var charsText;

    //TODO, add scAdditionalParameters input

    //On load
    for (var field of scTextFields) {
      if (field.className == "scContentControl" || field.className == "scContentControlMemo") {
        field.setAttribute("style", "padding-right: 80px !important");
        field.parentElement.setAttribute("style", "position:relative !important");
        charsText = field.value.length > 1 ? field.value.length + " chars" : field.value.length + " char";
        countHtml = `<div id="chars_${field.id}" class="satCharsCount" style="position: absolute; bottom: 1px; right: 10px; padding: 6px 10px; border-radius: 4px; line-height: 20px; opacity:0.5;">${charsText}</div>`;
        field.insertAdjacentHTML("afterend", countHtml);
        //On keyup
        field.addEventListener(
          "keydown",
          function (event) {
            let charsTextEvent = event.target.value.length > 1 ? event.target.value.length + " chars" : event.target.value.length + " char";
            document.querySelector("#chars_" + event.target.id).innerText = charsTextEvent;
          },
          {
            once: false,
            passive: true,
            capture: false,
          }
        );
      }
    }
  }
};

/*
 * Add icons to quick info section to copy to clipboard
 */
const initCopyToClipboard = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true) {
    var scTextFields = document.querySelectorAll("input, textarea, checkbox");
    var copyHtml;
    var copyCount = 0;
    for (var field of scTextFields) {
      //Copy to clipboard
      if (field.className == "scEditorHeaderQuickInfoInput" || field.className == "scEditorHeaderQuickInfoInputID") {
        field.setAttribute("style", "width: calc(100%-16px); margin-left:2px; display: none");
        field.classList.add("copyCount_" + copyCount);
        //prettier-ignore
        copyHtml = `<span onclick="copyContent('` + field.value + `', '` + copyCount + `')" class="copyCountSpan_` + copyCount + `">` + field.value + `</span> <a class="t-top t-sm" data-tooltip="Copy" onclick="copyContent('` + field.value + `', '` + copyCount + `')"><img src="` + global.iconCopy + `" class="scIconCopy" /></a> <span class="copyCountMessage_` + copyCount + `"></span>`;
        field.value != "[unknown]" ? field.insertAdjacentHTML("beforebegin", copyHtml) : field.insertAdjacentHTML("beforebegin", `<span>` + field.value + `</span>`);
        copyCount++;
      }
    }
  }
};

/*
 * Change title of browser tab / window
 */
const changeTitleWindow = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true) {
    let ScItem = getScItemData();
    ScItem.name ? (window.document.title = "" + ScItem.name.capitalize() + " (" + ScItem.language.toUpperCase() + ")") : false;
    ScItem.name && document.querySelector(".titleBarText") ? (document.querySelector(".titleBarText").innerText = "" + ScItem.name.capitalize() + " (" + ScItem.language.toUpperCase() + ")") : false;
  }
};
/*
 * Change style of checkboxes to ios-like switch in editor
 */
const initCheckboxes = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor) {
    loadCssFile("css/checkbox.min.css");
    for (var field of document.querySelectorAll("*:not(#Languages) > input[type=checkbox]")) {
      if (field.parentElement.nodeName != "LABEL") {
        field.classList.add("scContentControlCheckbox");
        field.insertAdjacentHTML("afterend", `<label for="${field.id}" class="scContentControlCheckboxLabel"></label>`);
      }
    }
  }
};

/*
 * Change style of date/time picker
 */
const initDateTimeField = (storage) => {
  if (storage.feature_experimentalui) {
    document.querySelectorAll("table.scTimePickerComboBox > tbody > tr > td > img.scComboboxDropDown, table.scDatePickerComboBox > tbody > tr > td > img.scComboboxDropDown").forEach((img) => {
      img.src = global.iconCalendar;
      img.removeAttribute("onmouseover");
      img.removeAttribute("onmouseout");
      img.classList.add("scCalendarUI");
    });
    document.querySelectorAll("table.scDatePickerComboBox > tbody > tr > td > input.scComboboxEdit").forEach((field) => {
      field.setAttribute("placeholder", "Date");
    });
    document.querySelectorAll("table.scTimePickerComboBox > tbody > tr > td > input.scComboboxEdit").forEach((field) => {
      field.setAttribute("placeholder", "Time");
    });
  }
};

/*
 * Change style of password field
 */
const initPasswordField = (storage) => {
  if (storage.feature_experimentalui) {
    let html = `<div class="scPasswordUI"><img src="` + global.iconPassword + `" /></div>`;
    document.querySelectorAll("input[type=password]").forEach((input) => {
      input.classList.add("scPasswordUI");
      input.insertAdjacentHTML("beforebegin", html);
    });
  }
};

/*
 * Triggers functions when refreshing Content Editor
 */
const refreshContentEditor = (storage) => {
  log("*** Update UI ***", "yellow");
  let target = document.querySelector("#scLanguage");
  let observer = new MutationObserver(function (mutations) {
    /**
     * Update hash in URL, update pushsate history, update link if 2nd tab opened
     */
    let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
    if (scQuickInfo) {
      var sitecoreItemID = document.querySelector(".scEditorHeaderQuickInfoInput").getAttribute("value");
      // eslint-disable-next-line newline-per-chained-call
      var scLanguage = document.querySelector("#scLanguage").getAttribute("value").toLowerCase();
      let scVersion = document.querySelector(".scEditorHeaderVersionsVersion > span");
      scVersion != null ? (scVersion = scVersion.innerText) : (scVersion = 1);
      var locaStorage = localStorage.getItem("scBackPrevious");

      //Add hash to URL
      if (!global.hasRedirection && !global.hasRedirectionOther && !global.hasModePreview) {
        if (locaStorage != "true") {
          var state = {
            sitecore: true,
            id: sitecoreItemID,
            language: scLanguage,
            version: scVersion,
          };
          history.pushState(state, undefined, "#" + sitecoreItemID + "_" + scLanguage + "_" + scVersion);
        } else {
          localStorage.removeItem("scBackPrevious");
        }
      }
    }

    /**
     * Hide preview mode
     */
    setTimeout(() => {
      document.querySelectorAll("#EditorTabControls_Preview").forEach((elem) => {
        elem.remove();
      });
    }, 500);

    //Executed everytime the editor is refreshed
    mutations.forEach(function (e) {
      "attributes" == e.type && sitecoreAuthorToolbox(storage);
    });
  });
  //Observer UI
  target ? observer.observe(target, { attributes: true }) : false;
};

/*
 * Once loaded, scroll to position
 */
const contentTreeScrollTo = () => {
  setTimeout(() => {
    if (document.querySelector(".scContentTreeNodeActive")) {
      let activeItemPosition = document.querySelector(".scContentTreeNodeActive").getBoundingClientRect().top;
      let windowHeight = window.innerHeight;
      if (activeItemPosition > windowHeight) {
        //prettier-ignore
        document.querySelector("#ContentTreeInnerPanel").scrollTop = (activeItemPosition - windowHeight) + (windowHeight / 2);
      }
    }
  }, 2000);
};

/*
 * On press escape, close any popup openned
 */
const keyEventListeners = () => {
  document.addEventListener(
    "keyup",
    function (event) {
      if (event.key == "Escape") {
        document.querySelector(".ui-icon-closethick") ? document.querySelector(".ui-icon-closethick").click() : false;
        parent.document.querySelector(".ui-icon-closethick") ? parent.document.querySelector(".ui-icon-closethick").click() : false;
      }
    },
    false
  );
};

/*
 * Reset Content Editor Opacity
 */
const resetContentEditor = () => {
  let sitecoreForm = document.querySelector("form[action*='/sitecore/']:not(#LoginForm)");
  sitecoreForm ? sitecoreForm.setAttribute("style", "filter:opacity(1)") : false;
};
