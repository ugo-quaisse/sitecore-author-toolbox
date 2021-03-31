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
  const homePath = getHomePath(path);
  let liveUrl;
  let liveUrlLanguageSpecific = false;
  let siteLanguage, siteLanguageEmbedding, siteDisplayName;
  let scSite = {};

  //Site Manager - Test 1: attempt with language specific site
  for (var [domain, values] of Object.entries(storage.site_manager)) {
    if (domain == global.urlOrigin) {
      // eslint-disable-next-line no-unused-vars
      for (var [id, site] of Object.entries(values)) {
        for (var [key, value] of Object.entries(site)) {
          key == "language" ? (siteLanguage = value) : false;
          key == "languageEmbedding" ? (siteLanguageEmbedding = value) : false;
          key == "displayName" ? (siteDisplayName = value) : false;
        }
        let siteStorage = Object.entries(site)[0][0].slice(-1) != "/" ? Object.entries(site)[0][0] + "/" : Object.entries(site)[0][0];
        if (siteLanguage == language && siteStorage.toLowerCase() == homePath.toLowerCase()) {
          liveUrl = Object.entries(site)[0][1].slice(-1) == "/" ? decodeURI(Object.entries(site)[0][1].slice(0, -1)) : decodeURI(Object.entries(site)[0][1]);
          liveUrlLanguageSpecific = true;
          //Fill scSite object
          scSite.path = siteStorage.toLowerCase();
          scSite.url = liveUrl.toLowerCase();
          scSite.language = siteLanguage.toLowerCase();
          scSite.languageEmbedding = siteLanguageEmbedding;
          scSite.displayName = siteDisplayName;
          break;
        }
      }
    }
  }

  //Site Manager - Test 2: attempt without language specific site
  if (!liveUrlLanguageSpecific) {
    for ([domain, values] of Object.entries(storage.site_manager)) {
      if (domain == global.urlOrigin) {
        // eslint-disable-next-line no-unused-vars
        for ([id, site] of Object.entries(values)) {
          for ([key, value] of Object.entries(site)) {
            key == "language" ? (siteLanguage = value) : false;
            key == "languageEmbedding" ? (siteLanguageEmbedding = value) : false;
            key == "displayName" ? (siteDisplayName = value) : false;
          }
          let siteStorage = Object.entries(site)[0][0].slice(-1) != "/" ? Object.entries(site)[0][0] + "/" : Object.entries(site)[0][0];
          if (siteLanguage == "" && siteStorage.toLowerCase() == homePath.toLowerCase()) {
            liveUrl = Object.entries(site)[0][1].slice(-1) == "/" ? decodeURI(Object.entries(site)[0][1].slice(0, -1)) : decodeURI(Object.entries(site)[0][1]);
            //Fill scSite object
            scSite.path = siteStorage.toLowerCase();
            scSite.url = liveUrl.toLowerCase();
            scSite.language = siteLanguage.toLowerCase();
            scSite.languageEmbedding = siteLanguageEmbedding;
            scSite.displayName = siteDisplayName;
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
 * Get the path to compare with values from site configuration
 *
 * Sensible Sitecore set ups will have all their pages under a home node
 * When not using the home node return the parent to allow custom configuration for specific children
 */
const getHomePath = (itemPath) => {
  const homeFolder = "/home/";

  if (itemPath.includes(homeFolder)) {
    return itemPath.split(homeFolder)[0] + homeFolder;
  }
  const itemPathTrailingSlashesTrimmed = itemPath.replace(/\/$/, "");

  if (!itemPathTrailingSlashesTrimmed.includes("/")) {
    return itemPath;
  }

  const lastOccurrenceOfSlash = itemPathTrailingSlashesTrimmed.lastIndexOf("/");
  return itemPathTrailingSlashesTrimmed.substring(0, lastOccurrenceOfSlash) + "/";
};

/**
 * Show live URL of a page
 */
const initLiveUrl = (storage) => {
  //Get user preference
  storage.feature_urls == undefined ? (storage.feature_urls = true) : false;
  storage.feature_urlstatus == undefined ? (storage.feature_urlstatus = true) : false;
  //Variables
  let ScItem = getScItemData();
  let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
  let scEditorTabs = document.querySelector("div#scEditorTabs");
  let scEditorHeaderVersionsLanguage = document.querySelector(".scEditorHeaderVersionsLanguage");
  let scLanguageTxtLong = scEditorHeaderVersionsLanguage ? scEditorHeaderVersionsLanguage.getAttribute("title") : false;
  let badge;
  let barStyle = !storage.feature_experimentalui ? "scWarning" : "scSuccess";
  //Live URL
  let ScSite = getSiteUrl(storage, ScItem.pathFull, ScItem.language);
  let alternativeUrl = window.location.origin + "/?sc_itemid=" + ScItem.id + "&sc_mode=normal&sc_lang=" + ScItem.language + "&sc_version=" + ScItem.version;
  //Path
  let sitecorePath = pathFromHome(ScItem.pathFull);
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
    //If not added yet
    if (!document.querySelector("#scMessageBarUrl") && storage.feature_urls) {
      //Get cookie sxa_site
      chrome.runtime.sendMessage({ greeting: "sxa_site" }, function (response) {
        //Update live Url
        if (ScSite.url == undefined) {
          badge = "CM server";
          ScSite.url = window.location.origin + "/" + ScItem.language + "/" + sitecorePath;
          //Update alternative Url
          alternativeUrl = `or try <a href="${alternativeUrl}" target="_blank" class="scMessageBarOption">this alternative link</a>`;
          alternativeUrl = response.farewell ? alternativeUrl.replace("xxxsxa_sitexxx", response.farewell) : (alternativeUrl = alternativeUrl.replace("&sc_site=xxxsxa_sitexxx", ""));
        } else {
          badge = "CD server";
          //Language embedding position
          ScSite.url = ScSite.url.includes("{lang}") ? ScSite.url.replace("{lang}", ScItem.language) + "/" + sitecorePath : ScSite.url + "/" + ScItem.language + "/" + sitecorePath;
          //Language embedding disabled
          ScSite.languageEmbedding == false ? (ScSite.url = ScSite.url.replace("/" + ScItem.language + "/", "/")) : false;
          //Display name enabled
          let split = ScSite.url.split("/");
          let requiredPath = split.slice(0, ScSite.url.split("/").length - 2).join("/") + "/";
          ScSite.displayName == true && ScItem.displayName != undefined ? (ScSite.url = requiredPath + ScItem.displayName) : false;
          //Alternative URL
          alternativeUrl = ``;
        }

        //Experimentation
        document.querySelector(".scPreviewButton") ? document.querySelector(".scPreviewButton").setAttribute("style", "display: block") : false;

        let statusDiv = storage.feature_urlstatus ? `<span class="liveUrlLoader">Checking...</span>` : ``;

        //Prepare HTML (scInformation scWarning scError)
        //prettier-ignore
        let scMessage = `<div id="scMessageBarLiveUrl" class="scMessageBar ${barStyle}">
            <div class="scMessageBarIcon" style="background-image:url(${global.icon})"></div>
            <div class="scMessageBarTextContainer">
              <div class="scMessageBarTitle">Sitecore Live URL
              ${statusDiv}
              <span class="liveUrlBadge t-sm t-top hide" onclick="window.open('${global.launchpadPage}?configure_domains=true&launchpad=true&url=${
          global.windowLocationHref
        }')" data-tooltip="Click to configure your sites" title="Click to configure your sites">${badge}</span>
              <span class="liveUrlStatus"></span>
              </div>
              <div class="scMessageBarText">To view this page in <b>"${scLanguageTxtLong}"</b></div>
              <ul class="scMessageBarOptions" style="margin:0px">
              <li class="scMessageBarOptionBullet"><a href="${decodeURI(ScSite.url)}" target="_blank" class="scMessageBarOption sitecoreItemPath">Open this page</a> ${alternativeUrl}</li>
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

const pathFromHome = (itemPath) => {
  const homeFolder = "/home/";

  if (itemPath.includes(homeFolder)) {
    const pathParts = itemPath.toLowerCase().split(homeFolder);
    const sitecorePath = pathParts[1] == undefined ? "" : pathParts[1];
    return sitecorePath;
  }

  const itemPathTrailingSlashesTrimmed = itemPath.replace(/\/$/, "");

  if (!itemPathTrailingSlashesTrimmed.includes("/")) {
    return itemPath;
  }

  const lastOccurrenceOfSlash = itemPathTrailingSlashesTrimmed.lastIndexOf("/") + 1;
  return itemPathTrailingSlashesTrimmed.substring(lastOccurrenceOfSlash);
};

/**
 * Insert link into Quickinfo table
 */
const liveUrlQuickInfo = (sitecoreItemPath) => {
  var table = document.querySelector(".scEditorQuickInfo");
  var row, cell1, cell2, url;
  if (table) {
    //Url
    url = new URL(sitecoreItemPath);
    //Text
    row = table.insertRow(-1);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell1.innerHTML = "Live URL:";
    cell2.innerHTML = `<a href="${sitecoreItemPath}" target="_blank">${decodeURI(url.origin + url.pathname)} <img src="${global.iconExternalLink}" style="width: 14px; vertical-align: text-top;" class="scIconCopy" /></a>`;
    //Screenshot
    // row = table.insertRow(-1);
    // cell1 = row.insertCell(0);
    // cell2 = row.insertCell(1);
    // cell1.innerHTML = "Screenshot:";
    // cell2.innerHTML = `<img src="https://api.apiflash.com/v1/urltoimage?access_key=${api}&format=jpeg&url=${url}&width=800" width="400"/>`;
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
