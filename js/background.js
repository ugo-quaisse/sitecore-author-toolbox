/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

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
    
    console.table(tab);
    
    if(info.menuItemId == "SitecoreAuthorToolbox") {

      //Check if window.location.href = CD/Live server
      chrome.storage.sync.get(['domain_manager'], function(result) {
        var domains = result.domain_manager;
        var cmUrl = new URL(tab.url);
        var cd = false;

        for (var domain in domains) {
          if(cmUrl.origin == domains[domain]) {
            cmUrl = domain+cmUrl.pathname;
            cd = true;
            break;
          }
        }

        //If no CD/Live
        if(!cd) {
          cmUrl = cmUrl.origin+cmUrl.pathname;
        }

        //Open the Experience editor
        chrome.tabs.executeScript(tab.id, {code: 'window.open("' + cmUrl + '?sc_mode=edit")'});

      });

    }

}

function getSitecoreCookie(tab) {

  chrome.cookies.get({"url": tab.url, "name": "sitecore_userticket"}, function(cookie) {

    if(cookie.value) {

      return cookie.value;

    }

  })

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
          
        if(cookie && !isSitecore && !isEditMode) {

          //Store cookie value
          sxa_site = cookie.value     
          chrome.contextMenus.removeAll(function() {
              chrome.contextMenus.create({"title": "Edit in Experience Editor", "contexts":["page"], "id": "SitecoreAuthorToolbox"}, () => chrome.runtime.lastError);
          });
      
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

  //TODO: check if URL is stored in Domain Manager list

  if(isUrl && !isViewSource) {

    chrome.cookies.get({"url": tab.url, "name": "sitecore_userticket"}, function(cookie) {

      chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
      //If sitecore cookie detected
      if(cookie) {
        //chrome.browserAction.setIcon({path: 'images/icon.png'});
        chrome.browserAction.setBadgeBackgroundColor({ color: "#52cc7f" });
        chrome.browserAction.setBadgeText({text: 'ON'});
        //Context menu
        chrome.storage.sync.get(['feature_contextmenu'], function(result) {
          
          result.feature_contextmenu == undefined ? result.feature_contextmenu = false : false;   
          result.feature_contextmenu ? showContextMenu(tab) : false;

        }); 
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
    if (request.greeting == "hide_tab"){
        sendResponse({farewell: "Ok roger that!"});
    }
    if (request.greeting == "hide_snackbar"){
      chrome.storage.sync.set({"hideSnackbar": request.version}, function() {
        sendResponse({farewell: "Ok roger that! I hide version "+request.version});
      });    
    }
    return true;
});

//When user righ clic

//When a tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) {
    setIcon(tab);
  });
});

//When a tab is activated (does not fired is default_popup exists)
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) {
    setIcon(tab);
  });
});

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function(details) {

  var thisVersion = chrome.runtime.getManifest().version;
  var versionInfo = thisVersion.split(".");

  var versionNumber = versionInfo[0];
  var versionRelease = versionInfo[1];
  var versionIncrement = versionInfo[2];

  var extinformation = [
    ["Extension",thisVersion],
    ["Major",versionNumber],
    ["Minor",versionRelease],
    ["Increment",versionIncrement]
  ]

  console.table(extinformation);

  chrome.storage.sync.get(function(e){
    console.table(e);
    console.table(e.scData);
    console.table(e.domain_manager);
  });

  if(details.reason == "install"){

        console.log("Installation");
        chrome.tabs.create({url:"https://uquaisse.io/extension-update/?utm_source=install&utm_medium=chrome&utm_campaign="+thisVersion});

  } else if(details.reason == "update"){

        if(thisVersion != details.previousVersion && versionIncrement == "0") {

          //if !x from previous version to last version

          console.log("Updated from " + details.previousVersion + " to " + thisVersion);
          chrome.tabs.create({url:"https://uquaisse.io/extension-update/?utm_source=upgrade&utm_medium=chrome&utm_campaign="+thisVersion});

        } else {

          console.log("Reload");

        }

  }

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


