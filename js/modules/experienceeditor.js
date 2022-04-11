/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode, loadCssFile, startDrag, sitecoreItemJson } from "./helpers.js";
import { currentColorScheme } from "./dark.js";

export { storeCurrentPageEE, initDefaultTextEE, addToolbarEditCE, addToolbarTooltip, addPlaceholderTooltip, addHideRibbonButton, resetExperienceEditor, initRenderingSearchBox, initHighlightValidationError };

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
 * Style default component text
 */
const initDefaultTextEE = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    document.querySelectorAll("*[scdefaulttext], .meta-component-wrapper, .scEnabledChrome, .scTextWrapper").forEach(function (text) {
      let test = text.innerText.toLowerCase();
      if (test.includes(" field]") || test.includes(" empty]") || test.includes(" link]")) {
        text.innerHTML = `<i class="scDefaultTextEE">${text.innerText}</i>`;
      }
    });
  }
};

/**
 * Add button to toolbar to open datasource in CE
 */
const addToolbarEditCE = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  let target = document.querySelector(".scChromeControls");
  let observer = new MutationObserver(function () {
    let scLanguage = document.querySelector("#scLanguage").value;
    let associatedContent = document.querySelector(".scChromeDropDown a[title*='associated']");
    let itemId = associatedContent ? associatedContent.getAttribute("onclick").split("id={")[1].split("}")[0] : false;
    let editClick = `javascript:window.open('/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#{${itemId}}_${scLanguage.toLowerCase()}_1')`;
    let editInCE = `<a class="scChromeDropDownRow satEditInCE" onclick="${editClick}"><img src="/~/icon/apps/16x16/Pencil.png" style="width:16px"><span>Edit in the Content Editor</span></a>`;
    let eeOptions = document.querySelector(".scChromeDropDown a[title*='options']");
    let dropDown = eeOptions ? eeOptions.parentElement : false;
    //Add class
    associatedContent ? associatedContent.classList.add("satAssociatedContent") : false;
    //let relatedItem = document.querySelector(".scChromeDropDown a[title*='related']");
    //let componentProperties = document.querySelector(".scChromeDropDown a[title*='properties']");
    // associatedContent ? associatedContent.insertAdjacentHTML("beforebegin", html) : false;
    // dropDown ? dropDown.insertAdjacentHTML("afterbegin", componentProperties.outerHTML) : false;
    // dropDown ? dropDown.insertAdjacentHTML("afterbegin", eeOptions.outerHTML) : false;
    //dropDown ? dropDown.insertAdjacentHTML("afterbegin", relatedItem.outerHTML) : false;
    if (dropDown) {
      !dropDown.querySelector(".satEditInCE") ? dropDown.insertAdjacentHTML("afterbegin", editInCE) : dropDown.querySelector(".satEditInCE").setAttribute("onclick", editClick);
      !dropDown.querySelector(".satAssociatedContent") ? dropDown.insertAdjacentHTML("afterbegin", associatedContent.outerHTML) : false;
    }
  });

  //Observer
  storage.feature_experienceeditor && storage.feature_experimentalui && target
    ? observer.observe(target, {
        attributes: false,
        childList: true,
        characterData: false,
      })
    : false;
};

/**
 * Add / Move component tooltip
 */
const addToolbarTooltip = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  let target = document.querySelector(".scChromeControls");
  let observer = new MutationObserver(function () {
    var scChromeToolbar = document.querySelectorAll(".scChromeToolbar");
    //Find EE toolbars
    for (var controls of scChromeToolbar) {
      controls.setAttribute("style", "margin-left:50px");
      let scChromeCommand = controls.querySelectorAll(".scChromeCommand");
      let changeColor = false;

      //Find buttons in the current EE toolbar
      setTimeout(() => {
        for (var button of scChromeCommand) {
          let title = button.getAttribute("title");
          button.setAttribute("style", "z-index:auto");
          //Find the Usage button
          if (title && storage.feature_experimentalui) {
            if (button.classList.contains("scChromeMoreSection") && title.toLowerCase().includes("more")) {
              button.innerHTML = `<img src="${chrome.runtime.getURL("images/more_vert.svg")}" class="scMaterialIcon" style="padding: 0px;"/>`;
            } else if (button.classList.contains("scChromeMoreSection") && title.toLowerCase().includes("webpages")) {
              button.querySelector("span").innerHTML = `<img src="${chrome.runtime.getURL("images/usage.svg")}" class="scMaterialIcon" style="padding: 2px 0px 0px 0px;"/>`;
            }
          }

          //Add Tooltip to the button
          if (title != null && title != "") {
            button.setAttribute("data-tooltip", title);
            button.classList.add("t-bottom");
            button.classList.add("t-md");
            button.removeAttribute("title");
          }

          //Change color of placehodlers
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
        }
      }, 500);
    }
  });

  //Observer
  storage.feature_experienceeditor && target
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
const addPlaceholderTooltip = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
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
  storage.feature_experienceeditor && target
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
            if (event.ctrlKey && event.shiftKey) {
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
    let html = `<div class="scNormalModeTab"><span class="t-right t-sm" data-tooltip="Open in Normal Mode"><a href="${linkNormalMode}" target="_blank"><img loading="lazy" src="${global.iconChrome}"/></a></span></div>`;
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
  storage.feature_experienceeditor ? loadCssFile("css/experienceeditor.min.css") : false;
  //Remove satExtension satDark satExperimetalUI from main frame
  document.body ? document.body.classList.add("satEE") : false;
  document.body ? document.body.classList.remove("satExtension") : false;
  document.body ? document.body.classList.remove("satDark") : false;
  document.body ? document.body.classList.remove("satExperimentalUi") : false;
  document.body && storage.feature_experimentalui ? document.body.classList.add("satEEExperimentalUi") : false;
  if ((document.body && storage.feature_darkmode && !storage.feature_darkmode_auto) || (document.body && storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "dark")) {
    document.body ? document.body.classList.add("satEEDark") : false;
  }
};

/**
 * Highlight validation errors in the page TODO
 */
const initHighlightValidationError = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    document.querySelectorAll(".alert-error .sc-messageBar-messageText-container .OptionTitle").forEach((elem) => {
      console.log(elem.id);
    });
  }
};

/**
 * Init Rendering Search box
 */
const initRenderingSearchBox = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    let resultList = document.querySelector(".scTabs");
    resultList ? resultList.setAttribute("style", "top:110px; padding: 0px 10px; background-color: transparent !important;") : false;

    var scFolderButtons = document.querySelector(".scTabstrip");
    var scSearchHtml = `<div class="scSearch"><input type="text" placeholder="Search for component"></div>`;
    scFolderButtons ? scFolderButtons.insertAdjacentHTML("afterend", scSearchHtml) : false;

    //Listerner
    let searchBox = document.querySelector(".scSearch > input");
    searchBox.addEventListener("input", () => {
      document.querySelectorAll(".scItemThumbnail").forEach((elem) => {
        // eslint-disable-next-line require-unicode-regexp
        let regExp = new RegExp(searchBox.value, "i");
        if (elem.querySelector(".scDisplayName")) {
          elem.querySelector(".scDisplayName").innerText.match(regExp) ? elem.setAttribute("style", "display:block") : elem.setAttribute("style", "display:none");
          elem.querySelector(".scDisplayName").innerText.match(regExp) ? elem.classList.add("hideTab") : elem.classList.remove("hideTab");
        }
      });
      //Search in each tab
      document.querySelectorAll(".scTabPage").forEach((tab) => {
        var result = tab.querySelectorAll(".hideTab").length;
        // eslint-disable-next-line newline-per-chained-call
        var tabNumber = tab.getAttribute("id").split("_").pop();
        console.log(tabNumber, result);
        if (result === 0) {
          document.querySelector(`#Tabs_tab_${tabNumber}`).setAttribute("style", "opacity:0.2");
        } else {
          document.querySelector(`#Tabs_tab_${tabNumber}`).setAttribute("style", "opacity:1");
        }
      });
    });
  }
};
