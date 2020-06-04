/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {showSnackbar};
 
/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = (version) => {

    //Snackbar settings
    let snackbarHtml = `
    <b>Welcome to Sitecore Author Toolbox 2.2</b><br />
    You've got upgrated to the latest version. Give a try to our new settings UI by activing it in your options.`;
    let html=`<div class="snackbar">` + snackbarHtml + `<button onclick="window.open('` + global.launchpadPage + `')">SETTINGS</button><button id="sbDismiss">DISMISS</button></div>`;

    //Show Snackbar
    document.querySelector('body').insertAdjacentHTML( 'beforeend', html );


    //Add listener on click #sbDismiss
    document.querySelector("#sbDismiss").addEventListener("click", function() {
        localStorage.setItem("sbDismiss", version);
        document.querySelector('.snackbar').setAttribute('style','display: none');
    });
}