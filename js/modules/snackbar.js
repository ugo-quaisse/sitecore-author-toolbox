/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {showSnackbar};
 
/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = (version) => {

    //Snackbar settings
    var snackbarHtml = "<b>Welcome to Sitecore Author Toolbox 2.1</b><br />You've got upgrated to the latest version. If you like it, please take time to rate it on Chrome Web Store.";        
    var html='<div class="snackbar"> ' + snackbarHtml + ' <button onclick="window.open(\' https://chrome.google.com/webstore/detail/sitecore-author-toolbox/mckfcmcdbgkgffdknpkaihjigmcnnbco \')">REVIEW</button><button id="sbDismiss">DISMISS</button></div>';

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