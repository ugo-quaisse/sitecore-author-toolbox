/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { showSnackbar };

/**
 * Show Materialize-style message bar from bottom-right
 */
const showSnackbar = () => {
  //Snackbar settings
  let snackbarHtml = `
    <b>Sitecore Author Toolbox is updated!</b><br />
    A new "preview mode" is available in Content Editor (Presentation tab), give it a try!`;
  let html =
    `<div class="snackbar">` + snackbarHtml + `<button onclick="window.open('https://uquaisse.io/sitecore-cms/new-preview-mode-in-sitecore-author-toolbox-4-0/')">READ&nbsp;MORE</button><button id="sbDismiss">DISMISS</button></div>`;

  //Show Snackbar
  if (!global.isLaunchpad && global.showSnackbar && localStorage.getItem("sbDismiss") != global.extensionVersion) {
    document.querySelector("body").insertAdjacentHTML("beforeend", html);

    //Add listener on click #sbDismiss
    document.querySelector("#sbDismiss").addEventListener("click", function () {
      localStorage.setItem("sbDismiss", global.extensionVersion);
      document.querySelector(".snackbar").setAttribute("style", "display: none");
    });
  }
};
