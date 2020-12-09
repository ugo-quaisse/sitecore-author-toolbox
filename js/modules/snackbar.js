/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { showSnackbar };

/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = (storage) => {
  if (!storage.feature_experimentalui) {
    //Snackbar settings
    let snackbarHtml = `
    <b>Sitecore Author Toolbox 5.0</b><br />
    Experimental UI theme is available for Desktop mode!<br />Click "TRY IT" to activate it now!`;
    let html = `<div class="snackbar">` + snackbarHtml + `<button id="sbAction" onclick='javascript:document.querySelectorAll(".interfaceRadio")[1].click()'>TRY IT</button><button id="sbDismiss">DISMISS</button></div>`;

    //Is Snackbar is already visible in a parent frame?
    let parentSnackbar = parent.document.querySelector(".snackbar");

    //Show Snackbar
    if (!parentSnackbar && global.showSnackbar && localStorage.getItem("sbDismiss") != global.extensionVersion) {
      document.querySelector("body").insertAdjacentHTML("beforeend", html);

      //Add listener on click #sbDismiss
      document.querySelector("#sbAction, #sbDismiss").addEventListener("click", function () {
        localStorage.setItem("sbDismiss", global.extensionVersion);
        document.querySelector(".snackbar").setAttribute("style", "display: none");
      });
    }
  }
};
