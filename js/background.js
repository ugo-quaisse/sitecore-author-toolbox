/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

"use strict";

let isContextMenu = false;

// The onClicked callback function.
function onClickHandler(info, tab) {
    console.info("item " + info.menuItemId + " was clicked");
    console.info("info: " + JSON.stringify(info));
    console.info("tab: " + JSON.stringify(tab));
    var url = info.pageUrl.substring(0, info.pageUrl.indexOf('?'));
    chrome.tabs.executeScript(tab.id, {code: 'window.location.href = "' + url + '?sc_mode=edit";'});
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

//When a tab is activated
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab){
  chrome.tabs.getSelected(null, function(tab) { 

    //Tab URL
    var url = new URL(tab.url)
    var isSitecore = tab.url.includes("/sitecore/");

    //Get all cookies
    chrome.cookies.getAll({}, function(cookies) {
      for (var i in cookies) {
        if(url.hostname == cookies[i].domain && cookies[i].name == "sxa_site" && !isSitecore) {
          
          console.info("isSitecore: "+isSitecore+ " --> isMenu: "+isContextMenu+" --> Cookie: "+cookies[i].name+" --> Value: "+cookies[i].value);
          
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

  });

});



// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {

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