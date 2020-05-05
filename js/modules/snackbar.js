/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {showSnackbar};
 
/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = (version) => {

    //Snackbar settings
    var snackbarHtml = "<b>Welcome to Sitecore Author Toolbox 2.0</b><br />You can now setup your CM or CD/Live domains to get better Live URL, clic the Settings button.";        
    var html='<div class="snackbar"> ' + snackbarHtml + ' <button onclick="window.open(\' ' + global.launchpadPage + '?configure_domains=false&launchpad=true&url= ' + global.windowLocationHref + ' &tabs=0 \')">SETTINGS</button><button id="sbDismiss">DISMISS</button></div>';

    //Show Snackbar
    document.querySelector('body').insertAdjacentHTML( 'beforeend', html );


    //Add listener on click #sbDismiss
    document.querySelector("#sbDismiss").addEventListener("click", function(){     
      chrome.runtime.sendMessage({greeting: "hide_snackbar", version: version}, function(response) {
        if(response.farewell != null) {

          document.querySelector('.snackbar').setAttribute('style','display: none');

        }
      });
    });
}