/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';
import {fetchTimeout} from './helpers.js';

export {checkUrlStatus};

/**
 * Check HTTP status of a page
 */
const checkUrlStatus = (source = null, dark, experimental = false) => {

  //Variables
  var itemUrl = false;
  var liveUrlStatus, html, preview, disable, barStyle, urlLoader;

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


  dark ? urlLoader = global.urlLoaderDark : urlLoader = global.urlLoader;

  //Preloader
  liveUrlStatus ? liveUrlStatus.innerHTML = '<img loading="lazy" src="' + urlLoader + '" style="width: 10px; float: initial; margin: unset;"/>' : false;

  //Request
  setTimeout(function() {

    if(itemUrl) {

        const controller = new AbortController();
        const signal = controller.signal;

        try {
          var url = new Request(itemUrl);
        } catch(error) {
          console.log(error);
        }
        
        var request = fetchTimeout(7500, fetch(url))
        .then(function(response) {
          
          //Variables
          source == null ? liveUrlStatus = document.querySelector(".liveUrlStatus") : liveUrlStatus = source.querySelector(".liveUrlStatus");

          //Check response
          if(response.status == "404" ) {
              html = "<span class='liveStatusRed'><img loading='lazy' src=' " + global.dotRed + "'/> Not published (" + response.status + ")</span>";
              preview = "Preview (404) <img loading='lazy' src=' " + global.dotRed + "' class='liveUrlDot' />";
              disable = true;
              barStyle = "scError";
          } else if(response.status == "500" ) {
              html = "<span class='liveStatusRed'><img loading='lazy' src=' " + global.dotRed + "'/> Server error (" + response.status + ")</span>";
              preview = "Preview (500) <img loading='lazy' src=' " + global.dotRed + "'class='liveUrlDot' />";
              disable = true;
              barStyle = "scError";
          } else {
              html = "<span class='liveStatusGreen'><img loading='lazy' src=' " + global.dotGreen + "'/> Published</span>";
              preview = "Preview <img loading='lazy' src=' " + global.dotGreen + "'class='liveUrlDot' />";
              disable = false;
              barStyle = "scSuccess";
          }

          //Update Dom
          liveUrlStatus != null ? liveUrlStatus.innerHTML = html : liveUrlStatus.innerHTML = "";

          if(experimental) {
            //Update bar color
            var scMessageBarLiveUrl = document.querySelector("#scMessageBarLiveUrl");
            scMessageBarLiveUrl.setAttribute("class","scMessageBar " + barStyle);

            //Experimental mode ON
            let scPreviewButton = document.querySelector(".scPreviewButton");
            if(scPreviewButton) {
                  scPreviewButton.innerHTML = preview;
                  scPreviewButton.disabled = disable;
            }
          }

        })
        .catch(function(error) {
            console.info("Sitecore Author Toolbox:", "Error in fetching your CD URL ("+itemUrl+"), it might be a timeout, a mixed content error (if you are over https) or a settings issue, please check or log a ticket at https://github.com/ugo-quaisse/sitecore-author-toolbox/issues/new/choose");
            html = "<span class='liveStatusGray'>...timeout</span>";
            liveUrlStatus != null ? liveUrlStatus.innerHTML = "" : false;

            //Experimental mode ON
            let scPreviewButton = document.querySelector(".scPreviewButton");
            if(scPreviewButton) {
                    scPreviewButton.innerHTML = "Preview this page";
                    scPreviewButton.disabled = false;
            }
        });

        // Abort request
        controller.abort();

    }
}, 200)
}