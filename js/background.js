// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

"use strict";

// chrome.runtime.onInstalled.addListener(function(details) {
// 	console.log("previousVersion",details.previousVersion)
// }),
// chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
// 	//chrome.browserAction.setBadgeText({tabId:sender.tab.id,text:'1'}),
// 	chrome.browserAction.setBadgeBackgroundColor({color:"#DC291E"}),
// 	chrome.browserAction.setIcon({path:'images/icon.png',tabId:sender.tab.id}),
// 	chrome.browserAction.setPopup({tabId:sender.tab.id,popup:"options.html"})
// });

var lastTabId = 0;

chrome.tabs.onSelectionChanged.addListener(function(tabId) {
	lastTabId = tabId;
});

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '/sitecore/' }
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});