/* eslint-disable default-param-last */
/* eslint-disable max-params */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { getScItemData, currentColorScheme } from "./helpers.js";

export { initLiveUrl, checkUrlStatus };

/**
 * Show live URL of a page
 */
const initLiveUrl = (storage) => {
  //Variables
  let ScItem = getScItemData();
  var sitecoreItemID = ScItem.id;
  var sitecoreItemPath = ScItem.path + "/";
  var sitecoreItemPathOriginal = ScItem.path + "/";
  sitecoreItemPath = sitecoreItemPath.split("/home/");
  var sitecoreSite = sitecoreItemPath[0].toLowerCase();
  sitecoreSite = sitecoreSite.split("/");
  sitecoreSite = sitecoreSite.slice(-1)[0];
  let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
  let scEditorTabs = document.querySelector("div#scEditorTabs");
  var isContent = sitecoreItemPathOriginal.includes("/sitecore/content/");
  var isMedia = sitecoreItemPathOriginal.includes("/sitecore/media library/");
  var isData = sitecoreItemPathOriginal.includes("/data/");
  var isSettings = sitecoreItemPathOriginal.includes("/settings/");
  var isPresentation = sitecoreItemPathOriginal.includes("/presentation/");
  var isEmailTemplate = sitecoreItemPathOriginal.includes("/sitecore/content/email/");
  var scUrl = window.location.origin + "/?sc_itemid=" + sitecoreItemID + "&sc_mode=normal&sc_lang=" + ScItem.language + "&sc_version=" + ScItem.version;
  var scEditorHeaderVersionsLanguage = document.querySelector(".scEditorHeaderVersionsLanguage");
  let currentScheme = currentColorScheme();
  let darkMode = false;
  var scLanguageTxtLong = scEditorHeaderVersionsLanguage ? scEditorHeaderVersionsLanguage.getAttribute("title") : false;

  //Generating Live URLs (xxxsxa_sitexxx will be replace later by active site)
  if (sitecoreItemPath[1] != undefined) {
    sitecoreItemPath = encodeURI(window.location.origin + "/" + ScItem.language + "/" + sitecoreItemPath[1] + "?sc_site=xxxsxa_sitexxx&sc_mode=normal").toLowerCase();
  } else {
    sitecoreItemPath = encodeURI(window.location.origin + "/" + ScItem.language + "/?sc_site=xxxsxa_sitexxx&sc_mode=normal").toLowerCase();
  }

  //Excluding data, presentation, settings, email
  if (isContent && !isData && !isPresentation && !isSettings && !isEmailTemplate) {
    //Get user preference
    storage.feature_urls == undefined ? (storage.feature_urls = true) : false;
    storage.feature_urlstatus == undefined ? (storage.feature_urlstatus = true) : false;

    //Stored data (Json)
    var liveUrl;
    var domains = storage.domain_manager;
    var envBadge = "CM server";
    var barStyle = storage.feature_experimentalui ? "scSuccess" : "scWarning";

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
        document.querySelector(".scPreviewButton") ? document.querySelector(".scPreviewButton").setAttribute("style", "display: block") : false;

        //Prepare HTML (scInformation scWarning scError)
        //prettier-ignore
        let scMessage = `<div id="scMessageBarLiveUrl" class="scMessageBar ` + barStyle + `">
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
        if (!document.querySelector("#scMessageBarLiveUrl")) {
          if (scEditorTabs) {
            scEditorTabs.insertAdjacentHTML("beforebegin", scMessage);
          } else if (scQuickInfo) {
            scQuickInfo.insertAdjacentHTML("beforebegin", scMessage);
          }
        }

        //Insert link into Quickinfo table
        liveUrlQuickInfo(sitecoreItemPath);

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
        }
      }); // End cookie
    }
  }
};

/**
 * Insert link into Quickinfo table
 */
const liveUrlQuickInfo = (sitecoreItemPath) => {
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
};

/**
 * Check HTTP status of a page
 */
const checkUrlStatus = (status, source = null, dark, experimental = false) => {
  let liveUrlStatus, html, barStyle, urlLoader;

  //Dark loader
  urlLoader = dark ? global.urlLoaderDark : global.urlLoader;

  if (source == null) {
    if (document.querySelector(".sitecoreItemPath")) {
      liveUrlStatus = document.querySelector(".liveUrlStatus");
    }
  } else if (source.querySelector(".sitecoreItemPath")) {
    liveUrlStatus = source.querySelector(".liveUrlStatus");
  }

  //Preloader
  liveUrlStatus ? (liveUrlStatus.innerHTML = '<img loading="lazy" src="' + urlLoader + '" style="width: 10px; float: initial; margin: unset;"/>') : false;

  //Check response
  if (status == "404") {
    html = "<span class='liveStatusRed'><img loading='lazy' src=' " + global.dotRed + "'/> Not published (" + status + ")</span>";
    // preview = "Live URL (404) <img loading='lazy' src=' " + global.dotRed + "' class='liveUrlDot' />";
    // disable = true;
    barStyle = "scError";
  } else if (status == "500") {
    html = "<span class='liveStatusRed'><img loading='lazy' src=' " + global.dotRed + "'/> Server error (" + status + ")</span>";
    // preview = "Live URL (500) <img loading='lazy' src=' " + global.dotRed + "'class='liveUrlDot' />";
    // disable = true;
    barStyle = "scError";
  } else {
    html = "<span class='liveStatusGreen'><img loading='lazy' src=' " + global.dotGreen + "'/> Published</span>";
    // preview = "Live URL <img loading='lazy' src=' " + global.dotGreen + "'class='liveUrlDot' />";
    // disable = false;
    barStyle = "scSuccess";
  }

  //Update Dom
  liveUrlStatus != null ? (liveUrlStatus.innerHTML = html) : false;

  if (experimental) {
    //Update bar color
    var scMessageBarLiveUrl = document.querySelector("#scMessageBarLiveUrl");
    scMessageBarLiveUrl ? scMessageBarLiveUrl.setAttribute("class", "scMessageBar " + barStyle) : false;

    //Experimental mode ON
    let scPreviewButton = document.querySelector(".scPreviewButton");
    if (scPreviewButton) {
      //scPreviewButton.innerHTML = preview;
      //scPreviewButton.disabled = disable;
    }
  }
};
