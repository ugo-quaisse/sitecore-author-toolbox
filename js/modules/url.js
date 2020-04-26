/**
 * Sitecore Author Toolbox
 * A Google Chrome Extension
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';
import {fetchTimeout} from './helpers.js';

export {checkUrlStatus};


/**
 * Check HTTP status of a page
 */
const checkUrlStatus = (source = null) => {

  //Variables
  var itemUrl = false;
  var liveUrlStatus, html;

  if(source == null) {
    if(document.querySelector(".sitecoreItemPath")) {
        itemUrl = document.querySelector(".sitecoreItemPath").href;
        liveUrlStatus = document.querySelector(".liveUrlStatus");
    }
  } else {
    if(source.querySelector(".sitecoreItemPath")) {
        itemUrl = source.querySelector(".sitecoreItemPath").href;
        liveUrlStatus = source.querySelector(".liveUrlStatus");
    }
  }

  //Preloader
  liveUrlStatus ? liveUrlStatus.innerHTML = '<img src="' + global.urlLoader + '" style="width: 10px; float: initial; margin: unset;"/>' : false;

  //Request
  setTimeout(function() {

    if(itemUrl) {

        const controller = new AbortController();
        const signal = controller.signal;

        var url = new Request(itemUrl);
        var request = fetchTimeout(8000, fetch(url))
        .then(function(response) {
          
          //Variables
          if(source == null) {
            liveUrlStatus = document.querySelector(".liveUrlStatus");
          } else {
            liveUrlStatus = source.querySelector(".liveUrlStatus");
          }

          //Check response
          if(response.status == "404" || response.status == "500" ) {
              html = "<span class='liveStatusRed'><img src=' " + global.dotRed + "'/> Not available (" + response.status + ")</span>";
          } else {
              html = "<span class='liveStatusGreen'><img src=' " + global.dotGreen + "'/> Published</span>";
          }

          //Update Dom
          if(liveUrlStatus != null) {
            liveUrlStatus.innerHTML = html;
          } else {
            liveUrlStatus.innerHTML = "";
          }

        })
        .catch(function(error) {
            console.info("Sitecore Author Toolbox: Error in fetching your CD URL ("+itemUrl+"), it might be a timeout or a settings issue, please check.");
            html = "<span class='liveStatusGray'>...timeout</span>";
            if(liveUrlStatus != null) { liveUrlStatus.innerHTML = ""; }
        });

    }
}, 200)
}