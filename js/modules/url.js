/* eslint-disable array-element-newline */
/* eslint-disable default-param-last */
/* eslint-disable max-params */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { getScItemData, log } from "./helpers.js";

export { getSiteUrl, initLiveUrl, checkUrlStatus };

/**
 * Find and Match site URL with user settings in storage
 */
const getSiteUrl = (storage, path, language) => {
  storage.site_manager == undefined ? (storage.site_manager = true) : false;
  //Get SiteName
  let homePath = path.split("/home/")[0] + "/home/";
  let liveUrl;
  let liveUrlLanguageSpecific = false;
  let scSite = {};

  //Site Manager - Test 1: attemp with language specific site
  for (var [domain, values] of Object.entries(storage.site_manager)) {
    if (domain == global.urlOrigin) {
      // eslint-disable-next-line no-unused-vars
      for (var [id, site] of Object.entries(values)) {
        let siteLanguage = Object.entries(site)[1][1].toLowerCase();
        let siteLanguageEmbedding = Object.entries(site)[2][1];
        let siteStorage = Object.entries(site)[0][0].slice(-1) != "/" ? Object.entries(site)[0][0] + "/" : Object.entries(site)[0][0];
        if (siteLanguage == language && siteStorage.toLowerCase() == homePath.toLowerCase()) {
          liveUrl = Object.entries(site)[0][1].slice(-1) == "/" ? decodeURI(Object.entries(site)[0][1].slice(0, -1)) : decodeURI(Object.entries(site)[0][1]);
          liveUrlLanguageSpecific = true;
          //Fill scSite object
          scSite.path = siteStorage.toLowerCase();
          scSite.url = liveUrl.toLowerCase();
          scSite.language = siteLanguage.toLowerCase();
          scSite.languageEmbedding = siteLanguageEmbedding;
          break;
        }
      }
    }
  }

  //Site Manager - Test 2: attemp without language specific site
  if (!liveUrlLanguageSpecific) {
    for ([domain, values] of Object.entries(storage.site_manager)) {
      if (domain == global.urlOrigin) {
        // eslint-disable-next-line no-unused-vars
        for ([id, site] of Object.entries(values)) {
          let siteLanguage = Object.entries(site)[1][1].toLowerCase();
          let siteLanguageEmbedding = Object.entries(site)[2][1];
          let siteStorage = Object.entries(site)[0][0].slice(-1) != "/" ? Object.entries(site)[0][0] + "/" : Object.entries(site)[0][0];
          if (siteLanguage == "" && siteStorage.toLowerCase() == homePath.toLowerCase()) {
            liveUrl = Object.entries(site)[0][1].slice(-1) == "/" ? decodeURI(Object.entries(site)[0][1].slice(0, -1)) : decodeURI(Object.entries(site)[0][1]);
            //Fill scSite object
            scSite.path = siteStorage.toLowerCase();
            scSite.url = liveUrl.toLowerCase();
            scSite.language = siteLanguage.toLowerCase();
            scSite.languageEmbedding = siteLanguageEmbedding;
            break;
          }
        }
      }
    }
  }

  //Domain Manager (Deprecated)
  if (liveUrl == false) {
    for (domain in storage.domain_manager) {
      if (window.location.origin == domain) {
        liveUrl = decodeURI(storage.domain_manager[domain]);
        // console.log("**Domain Manager**", liveUrl);
        //Fill scSite object
        scSite.path = domain.toLowerCase();
        scSite.url = liveUrl.toLowerCase();
        scSite.language = "";
        scSite.languageEmbedding = true;
        break;
      }
    }
  }

  return scSite;
};

/**
 * Show live URL of a page
 */
const initLiveUrl = (storage) => {
  //Variables
  let ScItem = getScItemData();
  let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
  let scEditorTabs = document.querySelector("div#scEditorTabs");
  let scEditorHeaderVersionsLanguage = document.querySelector(".scEditorHeaderVersionsLanguage");
  let scLanguageTxtLong = scEditorHeaderVersionsLanguage ? scEditorHeaderVersionsLanguage.getAttribute("title") : false;
  let badge;
  let barStyle = storage.feature_experimentalui ? "scWarning" : "scWarning";
  //Live URL
  let ScSite = getSiteUrl(storage, ScItem.pathFull, ScItem.language);
  let alternativeUrl = window.location.origin + "/?sc_itemid=" + ScItem.id + "&sc_mode=normal&sc_lang=" + ScItem.language + "&sc_version=" + ScItem.version;
  //Path
  let temp = ScItem.pathFull.toLowerCase().split("/home/");
  let sitecorePath = temp[1] == undefined ? "" : temp[1];
  //Template type
  let isContent = ScItem.pathFull.includes("/sitecore/content/");
  let isMedia = ScItem.pathFull.includes("/sitecore/media library/");
  //let isSxaSite = ScItem.template.split("/").pop() == "site";
  let isData = ScItem.pathFull.includes("/data/");
  let isSettings = ScItem.pathFull.includes("/settings/");
  let isPresentation = ScItem.pathFull.includes("/presentation/");
  let isEmailTemplate = ScItem.pathFull.includes("/sitecore/content/email/");
  let isDictionnary = ScItem.template.includes("/sitecore/templates/system/dictionary/");

  //Excluding data, presentation, settings, email, dictionnary
  if (isContent && !isData && !isPresentation && !isSettings && !isEmailTemplate && !isDictionnary) {
    //Get user preference
    storage.feature_urls == undefined ? (storage.feature_urls = true) : false;
    storage.feature_urlstatus == undefined ? (storage.feature_urlstatus = true) : false;

    //If not added yet
    if (!document.querySelector("#scMessageBarUrl") && storage.feature_urls) {
      //Get cookie sxa_site
      chrome.runtime.sendMessage({ greeting: "sxa_site" }, function (response) {
        //Update live Url
        if (ScSite.url == undefined) {
          badge = "CM server";
          ScSite.url = window.location.origin + "/" + ScItem.language + "/" + sitecorePath;
        } else {
          badge = "CD server";
          //Language embedding position
          ScSite.url = ScSite.url.includes("{lang}") ? ScSite.url.replace("{lang}", ScItem.language) + "/" + sitecorePath : ScSite.url + "/" + ScItem.language + "/" + sitecorePath;
          //Language embedding disabled
          ScSite.languageEmbedding == false ? (ScSite.url = ScSite.url.replace("/" + ScItem.language + "/", "/")) : false;
        }

        //Update alternative Url
        alternativeUrl = response.farewell ? alternativeUrl.replace("xxxsxa_sitexxx", response.farewell) : (alternativeUrl = alternativeUrl.replace("&sc_site=xxxsxa_sitexxx", ""));

        //Experimentation
        document.querySelector(".scPreviewButton") ? document.querySelector(".scPreviewButton").setAttribute("style", "display: block") : false;

        //Prepare HTML (scInformation scWarning scError)
        //prettier-ignore
        let scMessage = `<div id="scMessageBarLiveUrl" class="scMessageBar ${barStyle}">
            <div class="scMessageBarIcon" style="background-image:url(${global.icon})"></div>
            <div class="scMessageBarTextContainer">
              <div class="scMessageBarTitle">Sitecore Live URL
              <span class="liveUrlLoader">Checking...</span>
              <span class="liveUrlBadge t-sm t-top hide" onclick="window.open('${global.launchpadPage}?configure_domains=true&launchpad=true&url=${global.windowLocationHref}')" data-tooltip="Click to configure your domains" title="Click to configure your domains">${badge}</span>
              <span class="liveUrlStatus"></span>
              </div>
              <div class="scMessageBarText">To preview this page in <b>"${scLanguageTxtLong}".</b></div>
              <ul class="scMessageBarOptions" style="margin:0px">
              <li class="scMessageBarOptionBullet"><a href="${decodeURI(ScSite.url)}" target="_blank" class="scMessageBarOption sitecoreItemPath">Open this link</a> or try <a href="${alternativeUrl}" target="_blank" class="scMessageBarOption">this alternative link</a></li>
              </ul>
              </div>
            </div>`;

        //Insert message bar into Sitecore Content Editor
        if (
          !document.querySelector("#scMessageBarLiveUrl") &&
          ScItem.template != "/sitecore/templates/project/sitecore/tenant" &&
          ScItem.template != "/sitecore/templates/project/sitecore/site" &&
          ScItem.template != "/sitecore/templates/foundation/experience accelerator/multisite/mediavirtualfolder" &&
          ScItem.template != "/sitecore/templates/system/dictionary/dictionary domain"
        ) {
          try {
            if (scEditorTabs) {
              scEditorTabs.insertAdjacentHTML("beforebegin", scMessage);
            } else if (scQuickInfo) {
              scQuickInfo.insertAdjacentHTML("beforebegin", scMessage);
            }
          } catch (e) {
            log(e);
          }
        }

        //Insert link into Quickinfo table
        liveUrlQuickInfo(ScSite.url);

        /**
         * Live status
         */
        if (storage.feature_urlstatus && !isMedia) {
          chrome.runtime.sendMessage(
            {
              greeting: "get_pagestatus",
              url: ScSite.url,
              source: null,
              experimental: true,
            },
            (response) => {
              checkUrlStatus(response.status, null, storage.feature_experimentalui);
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
    cell2.innerHTML = `<a href="${sitecoreItemPath}" target="_blank">${decodeURI(url.origin + url.pathname)} <img src="${global.iconExternalLink}" style="width: 14px; vertical-align: text-top;" class="scIconCopy" /></a>`;
  }
};

/**
 * Check HTTP status of a page
 */
const checkUrlStatus = (status, source = null, experimental = false) => {
  let liveUrlLoader, liveUrlStatus, html, barStyle;

  if (source == null) {
    if (document.querySelector(".sitecoreItemPath")) {
      liveUrlStatus = document.querySelector(".liveUrlStatus");
      liveUrlLoader = document.querySelector(".liveUrlLoader");
    }
  } else if (source.querySelector(".sitecoreItemPath")) {
    liveUrlStatus = source.querySelector(".liveUrlStatus");
    liveUrlLoader = source.querySelector(".liveUrlLoader");
  }

  //Show badge
  document.querySelector(".liveUrlBadge") ? document.querySelector(".liveUrlBadge").classList.remove("hide") : false;
  //Check response
  if (status == "404") {
    html = `<span class='liveStatusRed'><img loading='lazy' src='${global.dotRed}'/> Not published (${status})</span>`;
    barStyle = "scError";
  } else if (status == "500") {
    html = `<span class='liveStatusRed'><img loading='lazy' src='${global.dotRed}'/> Server error (code: ${status})</span>`;
    barStyle = "scError";
  } else if (status == undefined) {
    html = `<span class='liveStatusRed'><img loading='lazy' src='${global.dotRed}'/> The domain set doesn't exist, <span onclick="window.open('${global.launchpadPage}?configure_domains=true&launchpad=true&url=${global.windowLocationHref}')"><u>check your settings</u>.</span>`;
    barStyle = "scError";
  } else {
    html = `<span class='liveStatusGreen'><img loading='lazy' src='${global.dotGreen}'/> Published</span>`;
    barStyle = "scSuccess";
  }

  //Update Dom
  liveUrlStatus != null ? (liveUrlStatus.innerHTML = html) : false;
  liveUrlStatus != null && liveUrlLoader ? liveUrlLoader.remove() : false;

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
