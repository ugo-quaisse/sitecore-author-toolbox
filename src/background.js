/* eslint-disable require-jsdoc */
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

/**
 * Get current tab information
 */
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

/**
 * Action on right-clic
 */
function onRightClickHandler(info, tab) {
  if (info.menuItemId == "SitecoreAuthorToolbox") {
    //Check if window.location.href = CD/Live server
    chrome.storage.sync.get(["domain_manager"], (result) => {
      console.log(result.domain_manager);
      var domains = result.domain_manager;
      var cmUrl = new URL(tab.url);
      var cd = false;

      for (var domain in domains) {
        if (cmUrl.origin == domains[domain]) {
          cmUrl = domain + cmUrl.pathname;
          cd = true;
          break;
        }
      }

      //If no CD/Live
      cmUrl = cd ? `${cmUrl.origin}${cmUrl.pathname}` : `${cmUrl.origin}/sitecore/${cmUrl.pathname}`;

      function openEE(cmUrl) {
        window.open(`${cmUrl}?sc_mode=edit`);
      }

      //Open the Experience editor - DEPRECATED V3
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: openEE,
        args: [cmUrl],
      });
    });
  }
}

/**
 * Get SXA cookie value
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
 * Get Sitecore cookies
 */
function getSitecoreCookie(tab) {
  chrome.cookies.get({ url: tab.url, name: "sitecore_userticket" }, function (cookie) {
    if (cookie.value) {
      return cookie.value;
    }
  });
}

/**
 * Show context menu on right click
 */
function showContextMenu(tab) {
  if (tab.url != undefined) {
    var url = tab.url.split("?");
    url = url[0];

    var isSitecore = url.includes("/sitecore/");
    var isUrl = url.includes("http");
    var isEditMode = tab.url.includes("sc_mode=edit");
    var isViewSource = url.includes("view-source:");

    //Tab URL
    chrome.contextMenus.removeAll(function () {
      if (isUrl && !isViewSource && !isSitecore && !isEditMode) {
        chrome.contextMenus.create(
          {
            title: "Edit in Experience Editor",
            contexts: ["page"],
            id: "SitecoreAuthorToolbox",
          },
          () => chrome.runtime.lastError
        );
      }
    });
  }
}

/**
 * Listener for extension contextmenu event
 */
chrome.contextMenus.onClicked.addListener(onRightClickHandler);

/**
 * Set extension icon and label
 */
function setExtensionIcon(tab) {
  var tabUrl = false;
  tab.url ? (tabUrl = new URL(tab.url)) : false;
  var url = tab.url.split("?");
  url = url[0];
  var isSitecore = url.includes("/sitecore/");
  var isUrl = url.includes("http");
  var isLocalhost = url.includes("localhost");
  var isViewSource = url.includes("view-source:");
  var cookie = false;

  if (isUrl && !isViewSource && tabUrl) {
    chrome.cookies.getAll({ url: tabUrl.origin }, function (cookies) {
      chrome.action.setBadgeBackgroundColor({ color: "#52cc7f" });

      for (var i in cookies) {
        if (cookies[i].name == "sitecore_userticket" || cookies[i].name == "sc_horizon" || cookies[i].name.includes("#lang") || cookies[i].name.includes("#sc_mode")) {
          cookie = true;
          break;
        }
      }

      //If sitecore cookie is there
      if (cookie) {
        chrome.action.setBadgeBackgroundColor({ color: "#52cc7f" });
        chrome.action.setBadgeText({ text: "ON" });

        //Context menu
        chrome.storage.sync.get(["feature_contextmenu"], (result) => {
          result.feature_contextmenu == undefined ? (result.feature_contextmenu = false) : false;
          result.feature_contextmenu ? showContextMenu(tab) : false;
        });
      } else {
        chrome.action.setBadgeBackgroundColor({ color: "#777777" });
        chrome.action.setBadgeText({ text: "OFF" });
      }
    });
  } else if (isSitecore) {
    chrome.action.setBadgeBackgroundColor({ color: "#52cc7f" });
    chrome.action.setBadgeText({ text: "ON" });
  }
}

/**
 * Listener for messages received from content script
 */
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

  request.greeting == "sxa_site" ? checkSiteSxa(sender, sendResponse) : false;

  return true;
});

/**
 * Listener for tab change
 */
chrome.tabs.onActivated.addListener(async () => {
  let tab = await getCurrentTab();
  setExtensionIcon(tab);
});

/**
 * Listener for extension uninstall event
 */
chrome.runtime.setUninstallURL("https://uquaisse.io/sitecore-cms/uninstallation-successful/?utm_source=uninstall&utm_medium=chrome");

/**
 * Listener for extension install event
 */
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
  //   console.table(e.site_manager);
  // });
  // chrome.storage.sync.clear();

  if (details.reason == "install") {
    //chrome.scripting.create({ url: "https://uquaisse.io/extension-update/?utm_source=install&utm_medium=chrome&utm_campaign=" + thisVersion });
  } else if (details.reason == "update") {
    if (thisVersion != details.previousVersion) {
      console.log(`Updated from ${details.previousVersion} to ${thisVersion}`);
      // V3 DEPRECATED
      // new Notification("Extension updated!", {
      //   body: "Version " + thisVersion,
      //   icon: chrome.runtime.getURL("images/icon.png"),
      // });
    } else {
      console.log(`Extension reloaded`);
    }
  }
});
