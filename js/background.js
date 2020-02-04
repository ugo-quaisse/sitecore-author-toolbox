/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

"use strict";

/*
 * Helpers and variables
 */
let sxa_site;
let sc_site;
let contextMenuEE = false;
let contextMenuCE = false;

function checkSiteSxa(request, sender, sendResponse){

    var url = new URL(sender.tab.url);
    chrome.cookies.getAll({}, function(cookies) {

      for (var i in cookies) {
        if(cookies[i].domain == url.hostname && cookies[i].name == "sxa_site" && cookies[i].value != "login") {
          sendResponse({farewell: cookies[i].value});
          break;
        } 
      }
      sendResponse({farewell: null});

    });
}

function onClickHandler(info, tab) {
    //console.info("info: " + JSON.stringify(info));
    //console.info("tab: " + JSON.stringify(tab));
    var url = info.pageUrl.substring(0, info.pageUrl.indexOf('?'));   
    if(sxa_site != undefined) { sc_site = "&sc_site="+sxa_site } else { sc_site = ""; }
    
    //If Experience Editor ON -> add Edit in Content Editor

    if(info.menuItemId == "SitecoreAuthorToolbox") {
      //Experience Editor
      chrome.tabs.executeScript(tab.id, {code: 'window.location.href = "' + url + '?sc_mode=edit' + sc_site + '";'});
    } else if(info.menuItemId == "SitecoreAuthorToolboxEditor") {
      //Debug mode
      chrome.tabs.executeScript(tab.id, {code: 'window.location.href = "' + url + '?sc_debug=1&sc_trace=1&sc_prof=1&sc_ri=1' + sc_site + '";'});
    }

}

function showContextMenu(tab) {

  if(tab.url != undefined) {

    var url = tab.url.split("?");
    url = url[0];

    var isSitecore = url.includes("/sitecore/");
    var isUrl = url.includes("http");
    var isEditMode = tab.url.includes("sc_mode=edit");
    var isViewSource = url.includes("view-source:");
    var isItemId = tab.url.includes("sc_itemid=");

    if(isUrl && !isViewSource) {

      chrome.cookies.get({"url": tab.url, "name": "sxa_site"}, function(cookie) {
        
        //Tab URL
        url = new URL(tab.url);
          
        if(cookie && !isSitecore) {

          sxa_site = cookie.value;

          if(!isEditMode) {
            if(!contextMenuEE) {
              chrome.contextMenus.create({"title": "Edit in Experience Editor (beta)", "contexts":["page"], "id": "SitecoreAuthorToolbox"});
              contextMenuEE = true;
              if(contextMenuCE) {
                chrome.contextMenus.remove("SitecoreAuthorToolboxEditor");
                contextMenuCE = false;
              }
            }
          } else {
            if(!contextMenuCE) {
              chrome.contextMenus.create({"title": "Debug this page (beta)", "contexts":["page"], "id": "SitecoreAuthorToolboxEditor"});
              contextMenuCE = true;
              if(contextMenuEE) {
                chrome.contextMenus.remove("SitecoreAuthorToolbox");
                contextMenuEE = false;
              }
            }
          }

        }  
      });
    }
  }
}

function setIcon(tab) {

  //Variables
  var url = tab.url.split("?");
  url = url[0];
  var isSitecore = url.includes("/sitecore/");
  var isUrl = url.includes("http");
  var isViewSource = url.includes("view-source:");

  if(isUrl && !isViewSource) {

    chrome.cookies.get({"url": tab.url, "name": "sitecore_userticket"}, function(cookie) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
      //If sitecore cookie detected
      if(cookie) {
        //chrome.browserAction.setIcon({path: 'images/icon.png'});
        chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
        chrome.browserAction.setBadgeText({text: 'ON'});
      } else {
        //chrome.browserAction.setIcon({path: 'images/icon_gray.png'});
        chrome.browserAction.setBadgeBackgroundColor({ color: "#777777" });
        chrome.browserAction.setBadgeText({text: 'OFF'});
      }
    });

  } else if(isSitecore) {
    //chrome.browserAction.setIcon({path: 'images/icon.png'});
    chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
    chrome.browserAction.setBadgeText({text: 'ON'});
  }

}

//When message is requested from toolbox.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == "sxa_site"){
        checkSiteSxa(request, sender, sendResponse);
    }
    return true;
});

//When a tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) {
    showContextMenu(tab);
    setIcon(tab);
  });
});

//When a tab is activated (does not fired is default_popup exists)
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) {
    showContextMenu(tab);
    setIcon(tab);
  });
});

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function(tabId) {

  //Context menu
  chrome.contextMenus.onClicked.addListener(onClickHandler);

  //Page action only
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '/sitecore/' }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'sc_mode=' }
          })   
        ],
        actions: [
          new chrome.declarativeContent.ShowPageAction()
        ]
      }
    ]);
  });

});


