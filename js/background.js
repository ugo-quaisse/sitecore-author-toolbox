/**
 * Sitecore Author Toolbox
 * A Google Chrome Extension
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable func-style */
/* eslint-disable object-property-newline */
/* eslint-disable array-element-newline */

import { showContextMenu, contextMenuClickHandler, launchEditUrl } from "./modules/quickedit.js";

/**
 * Check existing cookie of SXA site
 */
function checkSiteSxa(sender, sendResponse) {
  var url = new URL(sender.tab.url);
  chrome.cookies.getAll({}, function (cookies) {
    for (var i in cookies) {
      if (cookies[i].domain == url.hostname && cookies[i].name == "sxa_site" && cookies[i].value != "login") {
        sendResponse({ farewell: cookies[i].value.toLowerCase() });
        break;
      }
    }
    sendResponse({ farewell: null });
  });
}

/**
 * Get Sitecore userticket cookie
 */
function getSitecoreCookie(tab) {
  chrome.cookies.get({ url: tab.url, name: "sitecore_userticket" }, function (cookie) {
    if (cookie.value) {
      return cookie.value;
    }
  });
}

/**
 * Set exgtension icon and label
 */
function setIcon(tab) {
  if(!tab)
    return;
  
  //Variables
  var tabUrl = false;
  tab.url ? (tabUrl = new URL(tab.url)) : false;
  var url = tab.url.split("?");
  url = url[0];
  var isSitecore = url.includes("/sitecore/");
  var isUrl = url.includes("http");
  var isLocalhost = url.includes("localhost:");
  var isViewSource = url.includes("view-source:");
  var cookie = false;
  
  chrome.contextMenus.removeAll();
  chrome.commands.onCommand.removeListener(launchEditUrl);
  
  if (isUrl && !isViewSource && tabUrl && !isLocalhost) {
    chrome.cookies.getAll({ url: tabUrl.origin }, function (cookies) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });

      for (var i in cookies) {
        if (cookies[i].name == "sitecore_userticket" || cookies[i].name.includes("#lang") || cookies[i].name.toLowerCase().includes("sc_")) {
          cookie = true;
          break;
        }
      }

      //If sitecore cookie is there
      if (cookie) {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
        chrome.browserAction.setBadgeText({ text: "ON" });

        //Context menu
        chrome.storage.sync.get(["feature_contextmenu"], (result) => {
          if(result.feature_contextmenu == undefined) result.feature_contextmenu = true;
          if(result.feature_contextmenu) showContextMenu(tab);
        });
        
        //Keyboard Shortcuts
        chrome.storage.sync.get(["feature_editcommands"], (result) => {
          if(result.feature_editcommands == undefined) result.feature_editcommands = true;
          if(result.feature_editcommands) chrome.commands.onCommand.addListener(launchEditUrl);
        });
      } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: "#777777" });
        chrome.browserAction.setBadgeText({ text: "OFF" });
      }
    });
  } else if (isSitecore) {
    chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
    chrome.browserAction.setBadgeText({ text: "ON" });
  }
}

//When message is requested from toolbox.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting == "get_pagestatus") {
    //const timeout = 8000;
    fetch(request.url, { redirect: "follow" })
      .then(function (response) {
        sendResponse({
          status: response.status,
          redirected: response.redirected,
        });
      })
      .catch(function (error) {
        sendResponse({ error });
      });
  }

  if (request.greeting == "get_pagespeed") {
    // console.log(request);
    // async function runPagespeed(url, apiKey) {
    //     url = new URL(url);
    //     url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" + url.href + "&screenshot=true&key=" + apiKey
    //     let request = await fetch(url)
    //     let data = await request.json();
    //     console.log(data);
    //     await sendResponse({ farewell: "screenshot", screenshot: data.lighthouseResult });
    // }
    // //Execute
    // runPagespeed(request.url, request.apiKey);
  }
  if (request.greeting == "sxa_site") {
    checkSiteSxa(sender, sendResponse);
  }

  return true;
});

//When a tab is updated
chrome.tabs.onUpdated.addListener(function (tab) {
  chrome.tabs.getSelected(null, function (tab) {
    setIcon(tab);
  });
});

//When a tab is activated (does not fired is default_popup exists)
chrome.tabs.onActivated.addListener(function (tab) {
  setTimeout(() => {
    chrome.tabs.getSelected(null, function (tab) {
        setIcon(tab);
    });
  }, 100);
});

chrome.runtime.setUninstallURL("https://uquaisse.io/sitecore-cms/uninstallation-successful/?utm_source=uninstall&utm_medium=chrome");

//Context menu
chrome.contextMenus.onClicked.addListener(contextMenuClickHandler);
  
// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function (details) {
  let thisVersion = chrome.runtime.getManifest().version;
  // let versionInfo = thisVersion.split(".");

  // let versionNumber = versionInfo[0];
  // let versionRelease = versionInfo[1];
  // let versionIncrement = versionInfo[2];

  // let extinformation = [
  //   ["Extension", thisVersion],
  //   ["Major", versionNumber],
  //   ["Minor", versionRelease],
  //   ["Increment", versionIncrement],
  // ];

  // chrome.storage.sync.get((e) => {
  //   console.table(e);
  //   console.table(e.scData);
  //   console.table(e.domain_manager);
  // });
  // chrome.storage.sync.clear();

  if (details.reason == "install") {
    //chrome.tabs.create({ url: "https://uquaisse.io/extension-update/?utm_source=install&utm_medium=chrome&utm_campaign=" + thisVersion });
  } else if (details.reason == "update") {
    if (thisVersion != details.previousVersion) {
      console.log("Updated from " + details.previousVersion + " to " + thisVersion);
      new Notification("Extension updated!", {
        body: "Version " + thisVersion,
        icon: chrome.runtime.getURL("images/icon.png"),
      });
    } else {
      console.log("Reload");
    }
  }

  //Page action only
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "/sitecore/" },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "sc_mode=" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
