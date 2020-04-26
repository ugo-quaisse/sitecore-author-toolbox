/**
 * Sitecore Author Toolbox
 * A Google Chrome Extension
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {preferesColorScheme, sitecoreItemJson, fetchTimeout, getScItemData, repositionElement, startDrag};


/**
 * Get active OS color Scheme
 */
const preferesColorScheme = () => {
    let color = "light";
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        color = "dark";
    } else {
        color = "light";
    }
    return color;
}

/**
 * Get active Siteore item from Chrome Storage
 */
const sitecoreItemJson = (itemID, languageID, versionID) => {
    //Read data
    chrome.storage.sync.get(["scData"], function(result) {
        let scData = new Object();
        if(result.scData != undefined) {
            scData = result.scData;
            scData[window.document.location.origin] = { scItemID: itemID, scLanguage: languageID, scVersion:versionID};
        } else {
            scData[window.document.location.origin] = { scItemID: itemID, scLanguage: languageID, scVersion:versionID};
        }

        //Save data
        chrome.storage.sync.set({"scData": scData}, function() {
            if(global.debug) { console.info("%c [Write] Item : " + itemID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
            if(global.debug) { console.info("%c [Write] Language : " + languageID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
            if(global.debug) { console.info("%c [Write] Version : " + versionID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
            return scData;
        });
    });
  
}

/**
 *  Create a new object with Sitecore Actime item (From Quickinfo)
 */
const getScItemData = () => {

    var scItem = new Object();
    var dom = document.querySelectorAll(".scEditorQuickInfo  > tbody > tr");

    for(var tr of dom) {
        tr.cells[0].innerText == "Item ID:" ? scItem.id = tr.cells[1].querySelector("input").value.toLowerCase() : false;
        tr.cells[0].innerText == "Item name:" ? scItem.name = tr.cells[1].innerText.toLowerCase() : false;
        tr.cells[0].innerText == "Item path:" ? scItem.path = tr.cells[1].querySelector("input").value.toLowerCase() : false;
        tr.cells[0].innerText == "Template:" ? scItem.template = tr.cells[1].querySelector("a").innerText.toLowerCase() : false;
        // tr.cells[0].innerText == "Template:" ? scItem.templateId = tr.cells[1].querySelector("input").innerText.toLowerCase() : false;
        tr.cells[0].innerText == "Created from:" ? scItem.from = tr.cells[1].innerText.toLowerCase() : false;
        tr.cells[0].innerText == "Item owner:" ? scItem.owner = tr.cells[1].querySelector("input").value.toLowerCase() : false;
    }

    return scItem;
}

/**
 * Used with Fetch as a timout event
 */
const fetchTimeout = (time, promise) => {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, time);
    promise.then(resolve, reject); 
  });
}

/**
 * Reposition element when dragged
 */
function repositionElement(event) {
    var initX, mousePressX;
    this.style.left = initX + event.clientX - mousePressX + 'px';
}

/**
 * Make an element draggable
 */
function startDrag() {
    var initX, mousePressX;
    var contextmenu = document.querySelector('.scExpTab');
    if(contextmenu) {
    contextmenu.addEventListener('mousedown', function(event) {

      initX = this.offsetLeft;
      mousePressX = event.clientX;

      this.addEventListener('mousemove', repositionElement, false);

      window.addEventListener('mouseup', function() {
        contextmenu.removeEventListener('mousemove', repositionElement, false);
      }, false);

    }, false);
    }
}
