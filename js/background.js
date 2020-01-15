/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

"use strict";

/*
 * Helpers and variables
 */
let isContextMenu = false;
let sxa_site;
let sc_site;

//Getcookie https://stackoverflow.com/questions/5892176/getting-cookies-in-a-google-chrome-extension

function onClickHandler(info, tab) {
    //console.info("info: " + JSON.stringify(info));
    //console.info("tab: " + JSON.stringify(tab));
    var url = info.pageUrl.substring(0, info.pageUrl.indexOf('?'));   
    if(sxa_site != undefined) { sc_site = "&sc_site="+sxa_site } else { sc_site = ""; }
    
    //Get in an array the website configuration from local storage


    if(info.menuItemId == "SitecoreAuthorToolbox") {

      //If domain of url includes in array[key], return the new url + query + sc_mode=edit

      //Experience Editor
      chrome.tabs.executeScript(tab.id, {code: 'window.location.href = "' + url + '?sc_mode=edit' + sc_site + '";'});
    } else if(info.menuItemId == "SitecoreAuthorToolboxDebug") {
      //Debug mode
      chrome.tabs.executeScript(tab.id, {code: 'window.location.href = "' + url + '?sc_debug=1&sc_trace=1&sc_prof=1&sc_ri=1' + sc_site + '";'});
    }

}

function showContextMenu(tab) {
  if(tab.url != undefined) {

    var isSitecore = tab.url.includes("/sitecore/");
    var isChromeTab = tab.url.includes("chrome://");

    if(!isChromeTab) {
      //Tab URL
      var url = new URL(tab.url);

      chrome.cookies.getAll({}, function(cookies) {
        
        //Discpay context menu if Sitecore website and Sitecore Back-office opened
        for (var i in cookies) {
          
          //console.info("Cookie: "+cookies[i].name+" - "+url.hostname);    
          if(url.hostname == cookies[i].domain && cookies[i].name == "shell#lang" && !isSitecore) {
              
            if(!isContextMenu) {
              chrome.contextMenus.create({"title": "Edit in Experience Editor (beta)", "contexts":["page"], "id": "SitecoreAuthorToolbox"});
              //chrome.contextMenus.create({"title": "Debug in Sitecore (beta)", "contexts":["page"], "id": "SitecoreAuthorToolboxDebug"});
              isContextMenu = true;
            }
            break;

          } else {

            if(isContextMenu) {
              chrome.contextMenus.remove("SitecoreAuthorToolbox");
              //chrome.contextMenus.remove("SitecoreAuthorToolboxDebug");
              isContextMenu = false;
            }

          }
        }

        //Retrieve SXA site
        for (i in cookies) {
          if(url.hostname == cookies[i].domain && cookies[i].name == "sxa_site") {

            sxa_site = cookies[i].value;

          }
        }
      });
    }
  }
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