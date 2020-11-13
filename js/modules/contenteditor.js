/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { log, loadCssFile, sitecoreItemJson, getScItemData, currentColorScheme } from "./helpers.js";
import { checkUrlStatus } from "./url.js";
import { checkHelpLink } from "./help.js";
import { findCountryName } from "./language.js";
import { initGroupedErrors } from "./errors.js";
import { insertSavebar, insertBreadcrumb, insertLanguageButton, insertVersionButton, insertMoreButton } from "./experimentalui.js";
import { initSyntaxHighlighterScriban } from "./rte.js";
import { initTabSections } from "./tabs.js";
import { initRTL } from "./rtl.js";
import { enhancedTreeSearch } from "./search.js";
import { initTranslateMode } from "./translate.js";

export { sitecoreAuthorToolbox, initCharsCount, initCheckboxes, initPublishCheckboxes, refreshContentEditor };

/*
 * Main function executed when the Content Editor refreshes
 */
const sitecoreAuthorToolbox = (storage) => {
  var count = 0;
  let scEditorPanel = document.querySelector(".scEditorPanel");
  let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
  let scLanguageMenu = document.querySelector(".scEditorHeaderVersionsLanguage");
  let scVersion = document.querySelector(".scEditorHeaderVersionsVersion > span");
  scVersion ? (scVersion = scVersion.innerText) : false;
  let scActiveTab = document.querySelector(".scEditorTabHeaderActive");
  var scEditorHeaderVersionsLanguage = document.querySelector(".scEditorHeaderVersionsLanguage");
  let currentScheme = currentColorScheme();
  let darkMode = false;

  if (scEditorHeaderVersionsLanguage) {
    var scLanguageTxtLong = scEditorHeaderVersionsLanguage.getAttribute("title"); //French : framçais
    var scLanguageTxtShort = scEditorHeaderVersionsLanguage.innerText; //French
  }

  /*
   * If no Quick info displayed, fallback message
   */
  if (!scQuickInfo) {
    if (!document.querySelector("#scMessageBarUrl") && scEditorPanel) {
      var scMessage =
        '<div id="scMessageBarUrl" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' +
        global.icon +
        ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Sitecore Author Toolbox help</div><div class="scMessageBarText">To fully enjoy Sitecore Author Toolbox, please enable <b>Title bar</b> and <b>Quick info section</b> under <b>Application Options</b>.<br />Alternatively, try to open the <b>Quick Info section</b> down below, if visible..</div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="" onclick="javascript:return scForm.postEvent(this,event,\'shell:useroptions\')" class="scMessageBarOption">Open Application Options</a>.</li></ul></div></div>';
      scEditorPanel.insertAdjacentHTML("afterend", scMessage);
    }
  } else {
    //Variables
    let ScItem = getScItemData();
    var temp = document.getElementsByClassName("scEditorHeaderQuickInfoInput");
    var sitecoreItemID = ScItem.id;
    var sitecoreItemPath = ScItem.path + "/";
    var sitecoreItemPathOriginal = ScItem.path + "/";
    sitecoreItemPath = sitecoreItemPath.split("/home/");
    var sitecoreSite = sitecoreItemPath[0].toLowerCase();
    sitecoreSite = sitecoreSite.split("/");
    sitecoreSite = sitecoreSite.slice(-1)[0];

    var isContent = sitecoreItemPathOriginal.includes("/sitecore/content/");
    var isMedia = sitecoreItemPathOriginal.includes("/sitecore/media library/");
    var isData = sitecoreItemPathOriginal.includes("/data/");
    var isSettings = sitecoreItemPathOriginal.includes("/settings/");
    var isPresentation = sitecoreItemPathOriginal.includes("/presentation/");
    var isEmailTemplate = sitecoreItemPathOriginal.includes("/sitecore/content/email/");

    var scLanguage = document.querySelector("#scLanguage").value.toLowerCase();
    var scUrl = window.location.origin + "/?sc_itemid=" + sitecoreItemID + "&sc_mode=normal&sc_lang=" + scLanguage + "&sc_version=" + scVersion;
    var scFlag, tabbedFlag;

    /**
     * Experimetal UI
     */
    if (storage.feature_experimentalui) {
      insertSavebar();
      insertBreadcrumb(ScItem.path);
      insertMoreButton();
      insertVersionButton(ScItem.id, ScItem.language, ScItem.version);
      insertLanguageButton(ScItem.id, ScItem.language, ScItem.version);
    }

    /**
     * > 1. Live URLs
     */
    //Generating Live URLs (xxxsxa_sitexxx will be replace later by active site)
    if (sitecoreItemPath[1] != undefined) {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/" + sitecoreItemPath[1] + "?sc_site=xxxsxa_sitexxx&sc_mode=normal").toLowerCase();
    } else {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/?sc_site=xxxsxa_sitexxx&sc_mode=normal").toLowerCase();
    }

    //Excluding data, why not having it for media? (replace Media Library by -/media)
    //or link to media /sitecore/-/media/552be56d277c49a5b57846859150d531.ashx
    if (isContent && !isData && !isPresentation && !isSettings && !isEmailTemplate) {
      //Get user preference
      storage.feature_urls == undefined ? (storage.feature_urls = true) : false;
      storage.feature_urlstatus == undefined ? (storage.feature_urlstatus = true) : false;

      //Stored data (Json)
      var liveUrl;
      var domains = storage.domain_manager;
      var envBadge = "CM server";
      var barStyle = "scWarning";

      //Loop through domains, if current domain = key, then create new link for live
      for (var domain in domains) {
        if (window.location.origin == domain) {
          liveUrl = domains[domain];
          break;
        }
      }

      //If not added yet
      if (!document.querySelector("#scMessageBarUrl") && storage.feature_urls) {
        //Get cookie sxa_site
        chrome.runtime.sendMessage({ greeting: "sxa_site" }, function (response) {
          //Is website in cookie different than quick info
          if (response.farewell != null) {
            var site_quickinfo = sitecoreSite.toLowerCase();
            var site_cookie = response.farewell.toLowerCase();
            var isSameSite = site_cookie.includes(site_quickinfo);
          }

          // if(ScItem.baseUrl != undefined) {

          //     console.log(sitecoreItemPath);

          //     sitecoreItemPath = sitecoreItemPath.replace("sc_site=xxxsxa_sitexxx&", "");
          //     sitecoreItemPath = sitecoreItemPath.replace("?sc_mode=normal", "");
          //     sitecoreItemPath = sitecoreItemPath.replace("&sc_mode=normal", "");
          //     sitecoreItemPath = sitecoreItemPath.replace(window.location.origin, ScItem.baseUrl);
          //     scUrl = scUrl.replace(window.location.origin, ScItem.baseUrl);
          //     console.log(ScItem.baseUrl);

          // }

          if (response.farewell != null && isSameSite && liveUrl == undefined) {
            sitecoreItemPath = sitecoreItemPath.replace("xxxsxa_sitexxx", response.farewell);
          } else if (liveUrl == undefined) {
            sitecoreItemPath = sitecoreItemPath.replace("sc_site=xxxsxa_sitexxx&", "");
          } else if (liveUrl != undefined) {
            //Generating CD/Live URLs
            sitecoreItemPath = sitecoreItemPath.replace("sc_site=xxxsxa_sitexxx&", "");
            sitecoreItemPath = sitecoreItemPath.replace("?sc_mode=normal", "");
            sitecoreItemPath = sitecoreItemPath.replace(window.location.origin, liveUrl);
            //Generating CD?Live URLS with SitecoreID
            scUrl = scUrl.replace(window.location.origin, liveUrl);
            scUrl = scUrl.replace("&sc_mode=normal", "");
            //Badge with server name
            envBadge = "CD/Live server";
          }

          //Experimentation
          storage.feature_experimentalui == undefined ? (storage.feature_experimentalui = false) : false;
          storage.feature_experimentalui ? (barStyle = "scSuccess") : false;
          document.querySelector(".scPreviewButton") ? document.querySelector(".scPreviewButton").setAttribute("style", "display: block") : false;

          //Prepare HTML (scInformation scWarning scError)
          //prettier-ignore
          scMessage = `<div id="scMessageBarLiveUrl" class="scMessageBar ` + barStyle + `">
            <div class="scMessageBarIcon" style="background-image:url(` + global.icon + `)"></div>
            <div class="scMessageBarTextContainer">
              <div class="scMessageBarTitle">Sitecore Live URL
              <span class="liveUrlBadge" onclick="location.href = '` + global.launchpadPage + `?configure_domains=true&launchpad=true&url=` + global.windowLocationHref + `'" title="Click to configure your domains">` + envBadge + `</span>
              <span class="liveUrlStatus"></span>
              </div>
              <div class="scMessageBarText">To preview this page in <b>"` + scLanguageTxtLong + `".</b></div>
              <ul class="scMessageBarOptions" style="margin:0px">
              <li class="scMessageBarOptionBullet"><a href="` + sitecoreItemPath + `" target="_blank" class="scMessageBarOption sitecoreItemPath">Open this link</a> or try <a href="` + scUrl + `" target="_blank" class="scMessageBarOption">this alternative link</a></li>
              </ul>
              </div>
            </div>`;

          //Insert message bar into Sitecore Content Editor
          !document.querySelector("#scMessageBarLiveUrl") ? scEditorPanel.insertAdjacentHTML("beforebegin", scMessage) : false;

          //Insert link into Quickinfo table
          var table = document.querySelector(".scEditorQuickInfo");
          if (table) {
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var url = new URL(sitecoreItemPath);
            cell1.innerHTML = "Live URL:";
            //prettier-ignore
            cell2.innerHTML = `<a href="` + sitecoreItemPath + `" target="_blank">` + url.origin + url.pathname + ` <img src="` + global.iconExternalLink + `" style="width: 14px; vertical-align: text-top;" class="scIconCopy" /></a>`;
          }

          //Is dark mode on?
          (storage.feature_darkmode && !storage.feature_darkmode_auto) || (storage.feature_darkmode && storage.feature_darkmode_auto && currentScheme == "dark") ? (darkMode = true) : false;

          /**
           * Live status
           */
          if (storage.feature_urlstatus && !isMedia) {
            chrome.runtime.sendMessage(
              {
                greeting: "get_pagestatus",
                url: sitecoreItemPath,
                source: null,
                dark: darkMode,
                experimental: true,
              },
              (response) => {
                checkUrlStatus(response.status, null, darkMode, storage.feature_experimentalui);
              }
            );
          } else {
            //Automatically switch to Folder tab
            let activeTab = document.querySelector("#EditorTabs > .scRibbonEditorTabActive").innerText.toLowerCase();
            if (activeTab == "search") {
              document.querySelectorAll("#EditorTabs > a").forEach(function (e) {
                e.innerText.toLowerCase() == "folder" ? e.click() : false;
              });
            }
            //Update preview button
            storage.feature_experimentalui ? (document.querySelector(".scPreviewButton").innerText = "No preview available") : false;
          }
        }); // End cookie
      }
    } else if (isData) {
      storage.feature_urls == undefined ? (storage.feature_urls = true) : false;
      storage.feature_messagebar == undefined ? (storage.feature_messagebar = true) : false;

      //If not added yet
      if (!document.getElementById("scMessageBarInfo") && storage.feature_urls && storage.feature_messagebar) {
        //Experimental mode
        document.querySelector(".scPreviewButton") ? document.querySelector(".scPreviewButton").setAttribute("style", "display: none") : false;
      }
    }
  }

  initRTL(storage);
  initTabSections(storage);
  initGroupedErrors(storage);
  initCharsCount(storage);
  initSyntaxHighlighterScriban(storage);
  checkHelpLink(sitecoreItemID, scLanguage, scVersion, storage);
  initFancyMessageBars(storage);
  initCheckboxes(storage);
  initTranslateMode(storage);
  enhancedTreeSearch(storage);

  /**
   * Change Title window
   */
  let ScItem = getScItemData();
  ScItem.name ? (window.document.title = "" + ScItem.name.capitalize() + " (" + scLanguage.toUpperCase() + ")") : false;

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
    var versionTotal = temp[1].replace(".", "").trim();
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
      count = 0;
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
  let sitecorAuthorToolboxFav = document.querySelector("#sitecorAuthorToolboxFav");
  let scFavoritesUrl = "../default.aspx?xmlcontrol=Gallery.Favorites&id=" + sitecoreItemID + "&la=en&vs=1";
  sitecorAuthorToolboxFav ? (sitecorAuthorToolboxFav.src = scFavoritesUrl) : false;

  /**
   * Save data in storage
   */
  sitecoreItemJson(sitecoreItemID, scLanguage, scVersion);

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
 * Fancy message bars
 */
const initFancyMessageBars = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true) {
    let scEditorHeader = document.querySelector(".scEditorHeader");
    setTimeout(function () {
      //Check who locked the item
      var scWarnings = document.querySelectorAll(".scWarning");
      for (var scWarning of scWarnings) {
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
        // eslint-disable-next-line no-unused-vars
        var isWrongVersion = scWarningText.includes("it has been replaced by a newer version.");
        var isNoFields = scWarningText.includes("The current item does not contain any fields.");

        //No version exist
        isNoVersion ? scWarningIcon.setAttribute("style", "background-image: url(" + global.iconTranslate + ");") : false;

        if (storage.feature_experimentalui) {
          isNoVersion && document.querySelector(".scSaveBar > .scActions")
            ? (document.querySelector(".scSaveBar > .scActions").innerHTML = `<button class="primary" onclick="javascript:return scForm.postEvent(this,event,'item:addversion')">Add new version</button>`)
            : false;

          if (isProtected) {
            //prettier-ignore
            document.querySelector(".scEditorPanel").innerHTML =
              `<div class="scNoVersion">
              <img src='` + global.iconLocked + `' width="128" /><br />
              <p>` + scWarningText + `</p><br />
              <button onclick="javascript:return scForm.postEvent(this,event,'item:togglereadonly')" type="button">Unprotect this item</button>
            </div>`;
          }

          // if (isPermission) {
          //   //prettier-ignore
          //   document.querySelector(".scEditorPanel").innerHTML =
          //   `<div class="scNoVersion">
          //     <img src='` + global.iconLocked + `' width="128" /><br />
          //     <p>` + scWarningText + `</p><br />
          //     <button onclick="javascript:history.go(-1)" type="button">Go back</button>
          //   </div>`;
          // }

          if (isNoFields) {
            //prettier-ignore
            document.querySelector(".scEditorPanel").innerHTML =
              `<div class="scNoVersion">
                <img src='` + global.iconFields + `' width="128" /><br />
                <p>` + scWarningText + `</p><br />
                <button id="scInfoButton" type="button">Show Item details</button>
              </div>`;
          }

          if (isNoVersion) {
            //prettier-ignore
            document.querySelector(".scEditorPanel").innerHTML =
              `<div class="scNoVersion">
                <img src='` + global.iconLanguage + `' width="128" /><br />
              <p>` + scWarningText + `</p><br />
              <button onclick="javascript:return scForm.postEvent(this,event,'item:addversion')" type="button">Add new version</button>
              </div>`;
          }

          //Experimental
          document.querySelector("#scLockButton") ? document.querySelector("#scLockButton > img").setAttribute("src", global.iconLocked) : false;
          document.querySelector("#scLockButton") ? document.querySelector("#scLockButton").setAttribute("title", `Unlock this item`) : false;
          document.querySelector("#scLockButton") ? document.querySelector("#scLockButton").setAttribute("onclick", `javascript:return scForm.postEvent(this,event,'item:checkin')`) : false;
        }

        storage.feature_messagebar == undefined ? (storage.feature_messagebar = false) : false;
        if (storage.feature_messagebar) {
          //No version exist
          //isWrongVersion ? scWarningIcon.setAttribute("style","background-image: url(" + global.iconVersion + ");") : false;

          //Not in final workflow step
          isNotFinalWorkflowStep ? scWarningIcon.setAttribute("style", "background-image: url(" + global.iconWorkflow + ");") : false;

          //Admin, elevate unlock
          isElevateUnlock || isProtected || isPermission ? scWarningIcon.setAttribute("style", "background-image: url(" + global.iconLock + ");") : false;

          //Is locked
          isLockMessage ? scWarningIcon.setAttribute("style", `background-image: url(${global.iconLock});`) : false;

          //Unicorded
          if (isUnicorned) {
            scWarning.classList.add("scInformation");
            // eslint-disable-next-line newline-per-chained-call
            scWarningTextBar.innerHTML = scWarningTextBar.innerHTML.replace("<br><br>", "<br>").replace("<br><b>Predicate", " <b>Predicate").replace("Changes to this item will be written to disk so they can be shared with others.<br>", "");
            scWarningIcon.setAttribute("style", "background-image: url(" + global.iconUnicorn + ");");
          }
        }

        //Check if item is locked
        var isItemLocked = document.querySelector(".scRibbon").innerHTML.includes("Check this item in.");

        if (isItemLocked && !isElevateUnlock && !isLockMessage) {
          if (isLockMessage) {
            var temp = scWarningText.split("' ");
            var lockedBy = temp[0].replace("'", "");
            lockedBy += " has";
          } else {
            lockedBy = "You have";
          }

          document.querySelector("#scLockMenuText") ? (document.querySelector("#scLockMenuText").innerText = "Unlock item...") : false;

          //Prepare HTML (scInformation scWarning scError)
          let scMessage =
            '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' +
            global.iconLock +
            ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">' +
            lockedBy +
            ' locked this item.</div><div class="scMessageBarText">Nobody can edit this page until you unlock it.</div><ul class="scMessageBarOptions"><li class="scMessageBarOptionBullet"><a href="#" onclick="javascript:return scForm.postEvent(this,event,\'item:checkin\')" class="scMessageBarOption">Unlock this item</a></li></ul></div></div>';
          scEditorHeader.insertAdjacentHTML("afterend", scMessage);
        }
      }
    }, 100);
  }
};

/*
 * Add characters counter
 */
const initCharsCount = (storage) => {
  storage.feature_charscount == undefined ? (storage.feature_charscount = true) : false;
  if (storage.feature_charscount) {
    /*
     * Add a characters count next to each input and textarea field
     */
    var scTextFields = document.querySelectorAll("input, textarea, checkbox");
    var countHtml, labelHtml;
    var chars = 0;
    var charsText;

    //On load
    for (var field of scTextFields) {
      if (field.className == "scContentControl" || field.className == "scContentControlMemo") {
        field.setAttribute("style", "padding-right: 70px !important");
        field.parentElement.setAttribute("style", "position:relative !important");
        chars = field.value.length;
        if (chars > 1) {
          charsText = chars + " chars";
        } else {
          charsText = chars + " char";
        }
        countHtml = '<div id="chars_' + field.id + '" style="position: absolute; bottom: 1px; right: 1px; padding: 6px 10px; border-radius: 4px; line-height: 20px; opacity:0.5;">' + charsText + "</div>";
        field.insertAdjacentHTML("afterend", countHtml);
      } else if (field.className == "scContentControlCheckbox") {
        //Add label
        labelHtml = '<label for="' + field.id + '" class="scContentControlCheckboxLabel"></label>';
        field.insertAdjacentHTML("afterend", labelHtml);
      }
    }

    //On keyup
    document.addEventListener(
      "keyup",
      function (event) {
        if (event.target.localName == "input" || event.target.localName == "textarea") {
          chars = event.target.value.length;
          if (chars > 1) {
            charsText = chars + " chars";
          } else {
            charsText = chars + " char";
          }

          if (document.querySelector("#chars_" + event.target.id)) {
            document.querySelector("#chars_" + event.target.id).innerText = charsText;
          }
        }
      },
      false
    );
  }
};

/*
 * Change style of checkboxes to ios-like switch in editor
 */
const initCheckboxes = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  storage.feature_contenteditor ? loadCssFile("css/checkbox.min.css") : false;
};

/*
 * Change style of checkboxes to ios-like switch in publish window
 */
const initPublishCheckboxes = (storage) => {
  if (storage.feature_contenteditor === true) {
    //Add #PublishingTargets input[type=checkbox] if needed
    document.querySelectorAll("#PublishChildrenPane input[type=checkbox]").forEach(function (checkbox) {
      checkbox.classList.add("scContentControlCheckbox");
      let labelHtml = '<label for="' + checkbox.id + '" class="scContentControlCheckboxLabel"></label>';
      checkbox.insertAdjacentHTML("afterend", labelHtml);
    });
    initCheckboxes(storage);
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
