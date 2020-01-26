/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

"use strict";

/*
 * Helpers and variables
 */
let isContextMenu = false;
let sxa_site;
let sc_site;

//Getcookie https://stackoverflow.com/questions/5892176/getting-cookies-in-a-google-chrome-extension
chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.greeting == "sxa_site"){
                    checkSiteSxa(request, sender, sendResponse);
                }
                return true;
            });

        function checkSiteSxa(request, sender, sendResponse){

            var url = new URL(sender.tab.url);
            chrome.cookies.getAll({}, function(cookies) {
        
              //Display context menu if Sitecore website and Sitecore Back-office opened
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

function setPageActionIcon(tab) {
    console.log("CLICKED");
    var canvas = document.createElement('canvas');
    var img = document.createElement('img');
    img.onload = function () {
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 2);
        context.fillStyle = "rgba(255,0,0,1)";
        context.fillRect(10, 0, 19, 19);
        context.fillStyle = "white";
        context.font = "11px Arial";
        context.fillText("3", 0, 19);

        chrome.pageAction.setIcon({
            imageData: context.getImageData(0, 0, 19, 19),
            tabId:     tab.id
        });
    };
    img.src = "images/icon_gray.png";
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

  //Chrome badge (not working)
  //chrome.pageAction.onClicked.addListener(setPageActionIcon);

  //Page action
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