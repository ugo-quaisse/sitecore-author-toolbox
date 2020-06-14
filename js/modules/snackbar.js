/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export { showSnackbar };

/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = (version) => {

    //Snackbar settings
    let snackbarHtml = `
    <b>Welcome to Sitecore Author Toolbox ` + global.extensionVersion + `</b><br />
    Give a try to the new Sitecore Experimental Interface by activing it under settings.`;
    let html = `<div class="snackbar">` + snackbarHtml + `<button onclick="window.open('` + global.launchpadPage + `')">SETTINGS</button><button id="sbDismiss">DISMISS</button></div>`;

    //Show Snackbar
    document.querySelector('body').insertAdjacentHTML('beforeend', html);


    //Add listener on click #sbDismiss
    document.querySelector("#sbDismiss").addEventListener("click", function() {
        localStorage.setItem("sbDismiss", version);
        document.querySelector('.snackbar').setAttribute('style', 'display: none');
    });
}