/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { log, loadCssFile, sitecoreItemJson, getScItemData, currentColorScheme } from "./helpers.js";
import { checkUrlStatus } from "./url.js";
import { addHelpIcons, checkHelpLink } from "./help.js";
import { findCountryName } from "./language.js";
import { initGroupedErrors } from "./errors.js";
import { insertSavebar, insertBreadcrumb, insertLanguageButton, insertVersionButton, insertMoreButton } from "./experimentalui.js";
import { initSyntaxHighlighterScriban } from "./rte.js";

export { sitecoreAuthorToolbox, initCharsCount, initCheckboxes, initPublishCheckboxes, refreshContentEditor };

/*
 * Main function executed when the Content Editor refreshes
 */
const sitecoreAuthorToolbox = () => {
  /**
   * Get all user's settings from storage
   */
  chrome.storage.sync.get((storage) => {
    //Function variables
    var count = 0;
    let scEditorID = document.querySelector(".scEditorPanel");
    let scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput");
    let scLanguageMenu = document.querySelector(".scEditorHeaderVersionsLanguage");
    let scVersion = document.querySelector(".scEditorHeaderVersionsVersion > span");
    scVersion ? (scVersion = scVersion.innerText) : false;
    let scActiveTab = document.querySelector(".scEditorTabHeaderActive");
    let isTranslateMode = false;
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
      if (!document.querySelector("#scMessageBarUrl") && scEditorID) {
        var scMessage =
          '<div id="scMessageBarUrl" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' +
          global.icon +
          ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Sitecore Author Toolbox help</div><div class="scMessageBarText">To fully enjoy Sitecore Author Toolbox, please enable <b>Title bar</b> and <b>Quick info section</b> under <b>Application Options</b>.<br />Alternatively, try to open the <b>Quick Info section</b> down below, if visible..</div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="" onclick="javascript:return scForm.postEvent(this,event,\'shell:useroptions\')" class="scMessageBarOption">Open Application Options</a>.</li></ul></div></div>';
        scEditorID.insertAdjacentHTML("beforebegin", scMessage);
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
       * Detect homepage
       */
      global.debug ? console.table(ScItem) : false;

      /**
       * Experimentations
       */
      storage.feature_experimentalui == undefined ? (storage.feature_experimentalui = false) : false;
      if (storage.feature_experimentalui) {
        insertSavebar();
        insertBreadcrumb(ScItem.path);
        insertMoreButton();
        insertVersionButton(ScItem.id, ScItem.language, ScItem.version);
        insertLanguageButton(ScItem.id, ScItem.language, ScItem.version);
        //insertNavigatorButton();
        //insertLockButton(false);
        //getRelatedMedia(sitecoreItemID, scLanguage, scVersion);
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
            !document.querySelector("#scMessageBarLiveUrl") ? scEditorID.insertAdjacentHTML("beforebegin", scMessage) : false;

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
          //scMessage = '<div id="scMessageBarInfo" class="scMessageBar scInformation"><div class="scMessageBarIcon" style="background-image:url(' + global.iconData + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">You are editing a datasource</div><div class="scMessageBarText">To see it, you have to attach it to a component via the Experience Editor.</b></div></div></div>'
          //scEditorID.insertAdjacentHTML('afterend', scMessage);

          //Experimental mode
          document.querySelector(".scPreviewButton") ? document.querySelector(".scPreviewButton").setAttribute("style", "display: none") : false;
        }
      }
    }

    /**
     * Help link banner
     */
    storage.feature_helplink == undefined ? (storage.feature_helplink = true) : false;
    if (storage.feature_helplink) {
      checkHelpLink(sitecoreItemID, scLanguage, scVersion, storage.feature_helplink);
      addHelpIcons();
    }

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
     * Right to left editor mode
     */
    storage.feature_rtl == undefined ? (storage.feature_rtl = true) : false;
    if (storage.feature_rtl && scLanguageTxtShort) {
      //Get active language
      temp = scLanguageTxtShort.split(" (");
      scFlag = temp[0].toUpperCase();

      if (global.rteLanguages.includes(scFlag)) {
        //RTL
        loadCssFile("css/rtl.min.css");
        for (let iframe of document.getElementsByClassName("scContentControlHtml")) {
          iframe.onload = function () {
            iframe.contentWindow.document.getElementById("ContentWrapper") ? (iframe.contentWindow.document.getElementById("ContentWrapper").style.direction = "RTL") : false;
          };
        }
      } else {
        //LTR
        loadCssFile("css/ltr.min.css");
        for (let iframe of document.getElementsByClassName("scContentControlHtml")) {
          iframe.onload = function () {
            iframe.contentWindow.document.getElementById("ContentWrapper") ? (iframe.contentWindow.document.getElementById("ContentWrapper").style.direction = "LTR") : false;
          };
        }
      }
    }

    /**
     * Grouped Errors
     */
    initGroupedErrors(storage);

    /**
     * Character counter and Copy to clipboard
     */
    initCharsCount(storage);

    /**
     * Translate Mode
     */
    storage.feature_translatemode == undefined ? (storage.feature_translatemode = false) : false;

    if (storage.feature_translatemode) {
      var scEditorPanel = document.querySelector(".scEditorPanel");
      var scEditorSectionPanel = document.querySelectorAll(".scEditorSectionPanel .scEditorSectionPanelCell")[1];
      var scTextFields = scEditorPanel.querySelectorAll("input, textarea, select");
      count = 0;

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
          scMessage =
            '<div id="scMessageBarTranslation" class="scMessageBar scInformation"><div class="scMessageBarIcon" style="background-image:url(' +
            global.iconTranslate +
            ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Translation Mode (' +
            fieldRightLang +
            " to " +
            fieldLeftLang +
            ')</div><div class="scMessageBarText">You are translating content. If you want, you can directly </b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><span class="scMessageBarOption" onclick="javascript:copyTranslateAll();" style="cursor:pointer">Copy existing content into ' +
            scLanguageTxtShort +
            ' version</span></li> or <li class="scMessageBarOptionBullet"><span class="scMessageBarOption" style="cursor:pointer !important;" onclick="window.open(\'https://translate.google.com/#view=home&op=translate&sl=' +
            fieldRightLang.toLowerCase() +
            "&tl=" +
            fieldLeftLang.toLowerCase() +
            "&text=Hello Sitecore');\">Use Google Translate</span></li></ul></div></div>";
          scEditorID.insertAdjacentHTML("beforebegin", scMessage);
        }
      }
    }

    /**
     *  Tabs section
     */
    storage.feature_cetabs == undefined ? (storage.feature_cetabs = false) : false;
    if (storage.feature_cetabs) {
      var scEditorTabs = document.querySelector("div#scEditorTabs");
      var scEditorHeader = document.querySelector(".scEditorHeader");
      var scMessageBar = document.querySelectorAll(".scMessageBar");
      var scEditorSectionCaption = document.querySelectorAll(".scEditorSectionCaptionCollapsed, .scEditorSectionCaptionExpanded");
      var sectionActiveCount = false;

      //Remove existing tabs
      scEditorTabs ? scEditorTabs.remove() : false;
      scEditorTabs = '<div id="scEditorTabs"><ul>';

      for (let section of scEditorSectionCaption) {
        let sectionTitle = section.innerText;
        let sectionId = section.getAttribute("id");
        //let sectionClass = section.getAttribute("class");
        let sectionSelected, sectionPanelDisplay, sectionErrorHtml, sectionErrorClass, sectionError;
        let lastClickedTab = localStorage.getItem("scTabSection");

        //Detect active panel and show it if there, othjerwise fallback to quick Info
        if (sectionActiveCount == false && lastClickedTab != null && sectionTitle == lastClickedTab) {
          sectionSelected = "scEditorTabSelected";
          sectionPanelDisplay = "table";
          sectionActiveCount = true;
          // } else if (sectionActiveCount == false && sectionClass == "scEditorSectionCaptionExpanded" && sectionTitle != "Quick Info") {
          //   sectionSelected = "scEditorTabSelected";
          //   sectionPanelDisplay = "table";
          //   sectionActiveCount = true;
        } else {
          sectionSelected = "";
          sectionPanelDisplay = "none";
        }

        //Hide the accordion section
        section.setAttribute("style", "display: none !important");

        //Detect next scEditorSectionPanel
        scEditorSectionPanel = section.nextSibling;
        if (scEditorSectionPanel && scEditorSectionPanel.tagName == "TABLE") {
          scEditorSectionPanel.setAttribute("style", "display: " + sectionPanelDisplay + " !important");
          scEditorSectionPanel.classList.add("scTabsRounded");
        }

        //How many errors in this section
        sectionError = scEditorSectionPanel ? scEditorSectionPanel.querySelectorAll(".scEditorFieldMarkerBarCellRed").length : 0;
        if (sectionError > 0) {
          sectionErrorHtml = "<span id='scCrossTabError'></span>";
          sectionErrorClass = "scTabsError t-sm t-top";
        } else {
          sectionErrorHtml = "";
          sectionErrorClass = "";
        }

        //Add tabs to document
        //prettier-ignore
        scEditorTabs += `
        <li class="scEditorTabEmpty"></li>
        <li data-id="` + sectionId + `" class="scEditorTab ` + sectionSelected + ` ` + sectionErrorClass + `"
        onclick="toggleSection(this,'` + sectionTitle + `', false, '` + storage.feature_experimentalui + `')">` + sectionErrorHtml + sectionTitle + `</li>`;
      }

      scEditorTabs += '<li class="scEditorTabEmpty"></li></ul></div>';

      //Add tabs to Content Editor
      if (scMessageBar.length - 1 > 0) {
        scMessageBar.insertAdjacentHTML("afterend", scEditorTabs);
      } else if (scEditorHeader) {
        scEditorHeader.insertAdjacentHTML("afterend", scEditorTabs);
      }

      //If there is no active tab
      var tab = document.querySelector(".scEditorTab");
      if (sectionActiveCount == 0 && tab != null) {
        var tabId = tab.dataset.id;
        var tabSection = document.querySelector("#" + tabId);
        tabSection.classList.remove("scEditorSectionCaptionCollapsed");
        tabSection.classList.add("scEditorSectionCaptionExpanded");
        var tabSectionPanel = tabSection.nextSibling;
        tab.classList.add("scEditorTabSelected");
        tabSectionPanel.setAttribute("style", "display: table !important");
      }
    }

    /**
     * Fancy message bars
     */

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
            temp = scWarningText.split("' ");
            var lockedBy = temp[0].replace("'", "");
            lockedBy += " has";
          } else {
            lockedBy = "You have";
          }

          document.querySelector("#scLockMenuText") ? (document.querySelector("#scLockMenuText").innerText = "Unlock item...") : false;

          //Prepare HTML (scInformation scWarning scError)
          scMessage =
            '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' +
            global.iconLock +
            ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">' +
            lockedBy +
            ' locked this item.</div><div class="scMessageBarText">Nobody can edit this page until you unlock it.</div><ul class="scMessageBarOptions"><li class="scMessageBarOptionBullet"><a href="#" onclick="javascript:return scForm.postEvent(this,event,\'item:checkin\')" class="scMessageBarOption">Unlock this item</a></li></ul></div></div>';
          scEditorID.insertAdjacentHTML("beforebegin", scMessage);
        }
      }
    }, 100);

    /**
     * Content Editor - UI enhancements
     */
    storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
    if (storage.feature_contenteditor == true) {
      initCheckboxes(storage);

      /**
       * Select Content tab for content
       */
      if (!isMedia) {
        var EditorTabs = document.querySelectorAll("#EditorTabs > a");
        var CloseEditorTab = document.querySelectorAll("#EditorTabs .scEditorTabCloseContainer");
        count = 0;
        for (tab of EditorTabs) {
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

      /*
       * Search enhancements
       */
      let target = document.querySelector("#SearchResult");
      let observer = new MutationObserver(function () {
        var SearchResultHolder = document.querySelector("#SearchResult");
        var scSearchLink = SearchResultHolder.querySelectorAll(".scSearchLink");
        var scSearchListExtra = document.querySelector(".scSearchListExtra");

        for (var line of scSearchLink) {
          var getFullpath = line.getAttribute("title").toLowerCase();
          if (getFullpath.includes("/home/")) {
            getFullpath = getFullpath.split("/home/");
            getFullpath = "/" + getFullpath[1];
          }

          //Inject HTML
          var html = ' <span class="scSearchListExtra">' + getFullpath + "</span>";
          if (getFullpath && scSearchListExtra == null) {
            line.innerHTML += html;
          }
        }
      });

      //Observer
      target
        ? observer.observe(target, {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: false,
          })
        : false;
    }

    /**
     * Scriban syntax highlighter
     */
    if (ScItem.template) {
      if (ScItem.template.includes("/experience accelerator/scriban") || ScItem.template.includes("/experience accelerator/generic meta rendering/html snippet")) {
        initSyntaxHighlighterScriban(storage);
      }
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
  }); //end of Chrome.Storage
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
const refreshContentEditor = () => {
  log("*** Update UI ***", "yellow");
  let target = document.querySelector("#scLanguage");
  let observer = new MutationObserver(function (mutations) {
    let scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput");

    /**
     * Update hash in URL, update pushsate history, update link if 2nd tab opened
     */
    if (scQuickInfo) {
      var sitecoreItemID = scQuickInfo.getAttribute("value");
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

    //Execute a bunch of actions everytime the UI is refreshed
    mutations.forEach(function (e) {
      "attributes" == e.type && sitecoreAuthorToolbox();
    });
  });
  //Observer UI
  target ? observer.observe(target, { attributes: true }) : false;
};
