"use strict";let sxa_site,sc_site,isContextMenu=!1;function onClickHandler(e,t){var o=e.pageUrl.substring(0,e.pageUrl.indexOf("?"));sc_site=null!=sxa_site?"&sc_site="+sxa_site:"","SitecoreAuthorToolbox"==e.menuItemId?chrome.tabs.executeScript(t.id,{code:'window.location.href = "'+o+"?sc_mode=edit"+sc_site+'";'}):"SitecoreAuthorToolboxDebug"==e.menuItemId&&chrome.tabs.executeScript(t.id,{code:'window.location.href = "'+o+"?sc_debug=1&sc_trace=1&sc_prof=1&sc_ri=1"+sc_site+'";'})}function showContextMenu(e){if(null!=e.url){var t=e.url.includes("/sitecore/");if(!e.url.includes("chrome://")){var o=new URL(e.url);chrome.cookies.getAll({},(function(e){for(var n in e){if(o.hostname==e[n].domain&&"shell#lang"==e[n].name&&!t){isContextMenu||(chrome.contextMenus.create({title:"Edit in Experience Editor (beta)",contexts:["page"],id:"SitecoreAuthorToolbox"}),isContextMenu=!0);break}isContextMenu&&(chrome.contextMenus.remove("SitecoreAuthorToolbox"),isContextMenu=!1)}for(n in e)o.hostname==e[n].domain&&"sxa_site"==e[n].name&&(sxa_site=e[n].value)}))}}}chrome.tabs.onUpdated.addListener((function(e,t,o){chrome.tabs.getSelected(null,(function(e){showContextMenu(e)}))})),chrome.tabs.onActivated.addListener((function(e,t,o){chrome.tabs.getSelected(null,(function(e){}))})),chrome.runtime.onInstalled.addListener((function(){chrome.contextMenus.onClicked.addListener(onClickHandler),chrome.declarativeContent.onPageChanged.removeRules(void 0,(function(){chrome.declarativeContent.onPageChanged.addRules([{conditions:[new chrome.declarativeContent.PageStateMatcher({pageUrl:{urlContains:"/sitecore/"}})],actions:[new chrome.declarativeContent.ShowPageAction]}])}))}));