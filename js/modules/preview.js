/* eslint-disable prefer-named-capture-group */
/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { insertPreviewButton, listenPreviewTab };

/**
 * Insert Preview buttons
 */
const insertPreviewButton = (experimental) => {
  let iframeId = window.frameElement.getAttribute("id");
  let container = parent.document.querySelector("#EditorTabs");

  //Experimental mode
  let extraClass = experimental ? "t-top t-sm" : "t-hide scButtonExtended";

  //Preview Button style
  //parent.document.querySelector(".scPreviewButton").classList.add("focus");

  //prettier-ignore
  let button = `
    <div id="EditorTabControls_Preview" class="scEditorTabControlsHolder">
        <button disabled class="scEditorHeaderButton ` + extraClass + `" data-tooltip="Rotate" id="scRotateDeviceButton" type="button" onclick="changePreviewRotation('` + iframeId + `')"><img src="` + global.iconRotate + `" class="scLanguageIcon"></button>
        <input id="previewRange" type ="range" min ="0.3" max="1" step ="0.01" value ="1" onchange="updatePreviewSize('` + iframeId + `',this.value)"/>
        <button class="scEditorHeaderButton ` + extraClass + `" data-tooltip="Mobile" id="scMobileDeviceButton" type="button" onclick="changeDevicePreview('` + iframeId + `', 'mobile', 'v')"><img src="` + global.iconMobile + `" class="scLanguageIcon"></button>
        <button class="scEditorHeaderButton ` + extraClass + `" data-tooltip="Tablet" id="scTabletDeviceButton" type="button" onclick="changeDevicePreview('` + iframeId + `', 'tablet', 'v')"><img src="` + global.iconTablet + `" class="scLanguageIcon"></button>
        <button class="scEditorHeaderButton ` + extraClass + `" data-tooltip="Normal" id="scWebDeviceButton" type="button" onclick="changeDevicePreview('` + iframeId + `', 'web', 'v')"><img src="` + global.iconWeb + `" class="scLanguageIcon"></button>
    </div>`;

  //Add to view
  container && !document.querySelector("#EditorTabControls_Preview") ? container.insertAdjacentHTML("beforeend", button) : false;
};

/**
 * Insert Preview buttons
 */
const listenPreviewTab = (experimental) => {
  let target = parent.document.querySelector("[id^='FPreview']");
  let observer = new MutationObserver(function (mutation) {
    console.log(mutation);
    mutation[0].target.style.display != "none"
      ? insertPreviewButton(experimental)
      : parent.document.querySelector(".scPreviewButton").classList.remove("focus");
  });

  //Observer
  target
    ? observer.observe(target, {
        attributes: true,
        childList: false,
        characterData: false,
        subtree: false,
      })
    : false;
};
