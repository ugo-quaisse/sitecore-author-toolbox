/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode, loadCssFile, startDrag, sitecoreItemJson } from "./helpers.js";

export { storeCurrentPageEE, addToolbarEditCE, addToolbarTooltip, addPlaceholderTooltip, addHideRibbonButton, resetExperienceEditor };

/**
 * Add button to toolbar to open datasource in CE
 */
const storeCurrentPageEE = () => {
  let dataItemId = document.querySelector("[data-sc-itemid]");
  let dataItemLanguage = document.querySelector("[data-sc-language]");
  let dataItemVersion = document.querySelector("[data-sc-version]");

  if (dataItemId && dataItemVersion) {
    var sitecoreItemID = decodeURI(dataItemId.getAttribute("data-sc-itemid"));
    var scLanguage = decodeURI(dataItemLanguage.getAttribute("data-sc-language"));
    var scVersion = decodeURI(dataItemVersion.getAttribute("data-sc-version"));
    sitecoreItemJson(sitecoreItemID, scLanguage, scVersion);
  }
};

/**
 * Add button to toolbar to open datasource in CE
 */
const addToolbarEditCE = () => {
  let target = document.querySelector(".scChromeDropDown");
  let observer = new MutationObserver(function () {
    let scChromeDropDownRow = document.querySelectorAll(".scChromeDropDownRow");
    let scLanguage = document.querySelector("#scLanguage").value;
    let scVersion = "";

    for (var row of scChromeDropDownRow) {
      if (row.getAttribute("title")) {
        if (row.getAttribute("title").toLowerCase() == "change associated content") {
          var id = row.getAttribute("onclick").split("id={")[1].split("}")[0];
          //prettier-ignore
          var html = `<a href="#" title="Edit in Content Editor" class="scChromeDropDownRow" onclick="javascript:window.open('/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#{` + id + `}_` + scLanguage.toLowerCase() + `_` + scVersion + `')"><img src="/~/icon/applicationsv2/32x32/window_edit.png" style="width:16px" alt="Edit in Content Editor"><span>Edit in Content Editor</span></a>`;
          row.insertAdjacentHTML("beforebegin", html);
        }
      }
    }
  });

  //Observer
  target
    ? observer.observe(target, {
        attributes: false,
        childList: true,
        characterData: false,
      })
    : false;
};

/**
 * Add /Move component tooltip
 */
const addToolbarTooltip = () => {
  let target = document.querySelector(".scChromeControls");
  let observer = new MutationObserver(function () {
    var scChromeToolbar = document.querySelectorAll(".scChromeToolbar");
    //Find scChromeCommand
    for (var controls of scChromeToolbar) {
      controls.setAttribute("style", "margin-left:50px");
      var scChromeCommand = controls.querySelectorAll(".scChromeCommand");
      var changeColor = false;

      for (var command of scChromeCommand) {
        var title = command.getAttribute("title");
        command.setAttribute("style", "z-index:auto");

        if (!changeColor && title) {
          if (title.toLowerCase().includes("move component") || title.toLowerCase().includes("remove component")) {
            document.querySelectorAll(".scFrameSideHorizontal, .scFrameSideVertical").forEach(function (e) {
              e.classList.remove("scFrameYellow");
            });
            changeColor = true;
          } else {
            document.querySelectorAll(".scFrameSideHorizontal, .scFrameSideVertical").forEach(function (e) {
              e.classList.add("scFrameYellow");
            });
          }
        }

        if (title != null && title != "") {
          command.setAttribute("data-tooltip", title);
          command.classList.add("t-bottom");
          command.classList.add("t-md");
          command.removeAttribute("title");
        }
      }
    }
  });

  //Observer
  target
    ? observer.observe(target, {
        attributes: true,
        childList: true,
        characterData: true,
      })
    : false;
};

/**
 * Add / Move placeholder tooltip
 */
const addPlaceholderTooltip = () => {
  let target = document.querySelector("body");
  let observer = new MutationObserver(function (mutation) {
    mutation.forEach(function (el) {
      if (el.addedNodes[0]) {
        var node = el.addedNodes[0];
        var title;
        if (el.addedNodes[0].className == "scInsertionHandle") {
          // eslint-disable-next-line newline-per-chained-call
          title = node.getAttribute("title").toLowerCase().split("'")[1].split("'")[0];
          node.insertAdjacentHTML("beforeend", "<span class='scAddRendering'>Add component here</span>");
          if (title != null && title != "") {
            node.setAttribute("data-tooltip", "Placeholder: " + title);
            node.classList.add("t-bottom");
            node.classList.add("t-md");
            node.removeAttribute("title");
          }
        } else if (el.addedNodes[0] && el.addedNodes[0].className == "scSortingHandle") {
          // eslint-disable-next-line newline-per-chained-call
          title = node.getAttribute("title").toLowerCase().split("'")[1].split("'")[0];
          node.insertAdjacentHTML("beforeend", "<span class='scAddRendering'>Move component here</span>");
          if (title != null && title != "") {
            node.setAttribute("data-tooltip", "Placeholder: " + title);
            node.classList.add("t-bottom");
            node.classList.add("t-md");
            node.removeAttribute("title");
          }
        }
      }
    });
  });
  //Observer
  target
    ? observer.observe(target, {
        childList: true,
      })
    : false;
};

/**
 * add show/hide tab to Experience Editor
 */
const addHideRibbonButton = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  var pagemodeEdit = document.querySelector(".pagemode-edit");
  !pagemodeEdit ? (pagemodeEdit = document.querySelector(".on-page-editor")) : false;
  !pagemodeEdit ? (pagemodeEdit = document.querySelector(".experience-editor")) : false;
  !pagemodeEdit ? (pagemodeEdit = document.querySelector(".scWebEditRibbon")) : false;

  let target = document.body;
  let observer = new MutationObserver(function (mutations) {
    for (var mutation of mutations) {
      for (var addedNode of mutation.addedNodes) {
        if (addedNode.id == "scCrossPiece") {
          //prettier-ignore
          var html = `<div class="scExpTab">
                        <span class="tabHandle"></span>
                        <span class="tabText" onclick="toggleRibbon()">▲ Hide<span>
                        </div>`;
          addedNode.insertAdjacentHTML("afterend", html);
          observer.disconnect();
          startDrag();

          //Listeners
          document.addEventListener("keydown", (event) => {
            if (event.key === "Shift") {
              exeJsCode(`toggleRibbon()`);
              event.preventDefault();
              event.stopPropagation();
            }
          });
        }
      }
    }
  });

  //Observer
  storage.feature_experienceeditor && target
    ? observer.observe(target, {
        attributes: false,
        childList: true,
        characterData: false,
      })
    : false;

  /*
   * Go to Normal mode
   */
  var linkNormalMode;

  if (global.isEditMode) {
    linkNormalMode = global.windowLocationHref.replace("sc_mode=edit", "sc_mode=normal");
  } else if (global.isPreviewMode) {
    linkNormalMode = global.windowLocationHref.replace("sc_mode=preview", "sc_mode=normal");
  } else {
    global.windowLocationHref.includes("?") ? (linkNormalMode = global.windowLocationHref + "&sc_mode=normal") : (linkNormalMode = global.windowLocationHref + "?sc_mode=normal");
  }

  if (storage.feature_experienceeditor && !global.isRibbon) {
    //prettier-ignore
    let html = '<div class="scNormalModeTab"><span class="t-right t-sm" data-tooltip="Open in Normal Mode"><a href="' + linkNormalMode + '" target="_blank"><img loading="lazy" src="' + global.iconChrome + '"/></a></span></div>';
    pagemodeEdit ? pagemodeEdit.insertAdjacentHTML("beforeend", html) : false;
  }

  /*
   * Go to Content Editor
   */
  if (storage.feature_experienceeditor && !global.isRibbon) {
    let html =
      `<div class="scContentEditorTab"><span class="t-right t-sm" data-tooltip="Open in Content Editor"><a href="` +
      window.location.origin +
      `/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1"><img loading="lazy" src="` +
      global.iconCE +
      `"/></a></span></div>`;
    pagemodeEdit ? pagemodeEdit.insertAdjacentHTML("beforeend", html) : false;
  }

  /*
   * Show editable content
   */
  if (storage.feature_experienceeditor && !global.isRibbon) {
    let html =
      `<div class="scEditableTab"><span class="t-right t-sm" data-tooltip="Show/hide editable content"><a onclick="showEditableContent()"><img loading="lazy" src="` +
      global.iconED +
      `" id="scEditableImg" class="grayscaleClass"/></a></span></div>`;
    pagemodeEdit ? pagemodeEdit.insertAdjacentHTML("beforeend", html) : false;
  }
  //document.querySelectorAll("[contenteditable]").forEach( function(e) { e.classList.add("scFrameYellow"); })
};

/**
 * Reset Experience Editor CSS
 */
const resetExperienceEditor = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    loadCssFile("css/experienceeditor.min.css");
  }
  //Remove satExtension satDark satExperimetalUI from main frame
  document.body.classList.add("satEE");
  document.body.classList.remove("satExtension");
  // document.body.classList.remove("satDark");
  document.body.classList.remove("satExperimentalUi");
};
