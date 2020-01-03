/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

"use strict";

/*
 * Helpers and variables
 */
let isContextMenu = false;

function onClickHandler(info, tab) {
    //console.info("info: " + JSON.stringify(info));
    //console.info("tab: " + JSON.stringify(tab));
    var url = info.pageUrl.substring(0, info.pageUrl.indexOf('?'));
    chrome.tabs.executeScript(tab.id, {code: 'window.location.href = "' + url + '?sc_mode=edit";'});
}

function showContextMenu(tab) {
  //Tab URL
  var url = new URL(tab.url)
  var isSitecore = tab.url.includes("/sitecore/");

  //Get and loop throught all cookies
  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {

      if(url.hostname == cookies[i].domain && cookies[i].name == "shell#lang" && !isSitecore) {
        //console.info("isSitecore: "+isSitecore+ " --> isMenu: "+isContextMenu+" --> Cookie: "+cookies[i].name+" --> Value: "+cookies[i].value);      
        if(!isContextMenu) {
          chrome.contextMenus.create({"title": "Edit in Experience Editor (beta)", "contexts":["page"], "id": "SitecoreAuthorToolbox"});
          isContextMenu = true;
        }
        break;   
      } else {      
        if(isContextMenu) {
          chrome.contextMenus.remove("SitecoreAuthorToolbox");
          isContextMenu = false;
        }
      }
    }
  });
}

//When a tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) { 
    showContextMenu(tab);
  });
});

//When a tab is activated
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) { 
    showContextMenu(tab) ;
  });
});


// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {

  //Context menu
  chrome.contextMenus.onClicked.addListener(onClickHandler);

  //Page action
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '/sitecore/' }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });


});