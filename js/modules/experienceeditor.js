/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode, loadCssFile, startDrag, sitecoreItemJson } from "./helpers.js";
import { currentColorScheme } from "./dark.js";

export {
  initPreviewButtonsEE,
  updateEETitle,
  storeCurrentPageEE,
  initDefaultTextEE,
  addToolbarEditCE,
  addToolbarTooltip,
  addPlaceholderTooltip,
  addHideRibbonButton,
  resetExperienceEditor,
  initRenderingSearchBox,
  initOptionalFields,
  initNotificationsEE,
  initGroupedErrorsEE,
};

/**
 * Add button to toolbar to open datasource in CE
 */
const initPreviewButtonsEE = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    //Making room in the header bar section
    document.querySelector(".sc-ext-dbName") ? document.querySelector(".sc-ext-dbName").setAttribute(`style`, `opacity:0`) : false;

    //Experimental mode
    let extraClass = storage.feature_experimentalui ? "t-bottom t-sm" : "t-bottom t-sm";

    let button = `
    <div id="EditorTabControls_Preview" class="scExpEditorTabControlsHolder"> 
        <button class="scEditorHeaderButton scMobileDeviceButton ${extraClass}" data-tooltip="Mobile preview" id="scMobileDeviceButton" type="button" onclick="changeDevicePreviewEE('mobile', 'v')"><img src="${global.iconMobile}" class="scLanguageIcon"></button>
        - - - - -
        <button class="scEditorHeaderButton scTabletDeviceButton ${extraClass}" data-tooltip="Tablet preview" id="scTabletDeviceButton" type="button" onclick="changeDevicePreviewEE('tablet', 'v')"><img src="${global.iconTablet}" class="scLanguageIcon"></button>
        - - - - -
        <button class="scEditorHeaderButton ${extraClass}" data-tooltip="Normal preview" id="scWebDeviceButton" type="button" onclick="changeDevicePreviewEE('web', 'v')"><img src="${global.iconWeb}" class="scLanguageIcon"></button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button class="scEditorHeaderButton scRotateDeviceButton ${extraClass}" data-tooltip="Rotate" id="scRotateDeviceButton" type="button" onclick="changePreviewEERotation()" style="visibility:hidden"><img src="${global.iconRotate}" class="scLanguageIcon"></button>
    </div>`;

    //Add buttons to view
    document.querySelector(".sc-globalHeader-content") ? document.querySelector(".sc-globalHeader-content").insertAdjacentHTML("beforeend", button) : false;

    //Close button
    let close = `<button id="EditorTabControls_Preview_Close" data-state="close" class="btn sc-button btn-primary" style="position: fixed; right: 13px; top: 9px; display:none" onclick="closeDevicePreviewEE()">Close preview</button>`;
    document.querySelector(".sc-globalHeader-loginInfo") ? document.querySelector(".sc-globalHeader-loginInfo").insertAdjacentHTML("beforebegin", close) : false;

    //Add overlay and iFrame
    let previewIframe = `<div id="Page" class="mobile_v" style="background-image: url(${global.bgPreview})">
      <div id="Shadow">  
      <iframe src="" width="100%" height="100%" frameborder="no" marginwidth="0" marginheight="0" onload="previewLoader('hide')"></iframe>
      </div>
    </div>`;

    //Add to view
    parent.document.querySelector("body") ? parent.document.querySelector("body").insertAdjacentHTML("afterbegin", previewIframe) : false;

    //Add resize event
    parent.document.querySelector("body") ? parent.document.querySelector("body").setAttribute("onresize", `updatePreviewEE()`) : false;
  }
};

/**
 * Add button to toolbar to open datasource in CE
 */
const updateEETitle = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    // document.title = `✏️ ${document.title}`;
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = global.iconExperienceEditor;
  }
};

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
  document.querySelector("#sc-ext-toggleRibon-button") ? document.querySelector("#sc-ext-toggleRibon-button").remove() : false;
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
        if (result === 0) {
          document.querySelector(`#Tabs_tab_${tabNumber}`).setAttribute("style", "opacity:0.2");
        } else {
          document.querySelector(`#Tabs_tab_${tabNumber}`).setAttribute("style", "opacity:1");
        }
      });
    });
  }
};

/**
 * Highlight validation errors in the page TODO
 */
const initOptionalFields = (storage) => {
  storage.feature_experienceeditor == undefined ? (storage.feature_experienceeditor = true) : false;
  if (storage.feature_experienceeditor) {
    document.querySelectorAll('[scwatermark="true"]').forEach((elem) => {
      //elem.tagName.toLowerCase() == "code" ? elem.parentNode.setAttribute("style", `opacity: ${opacity} !important;`) : elem.setAttribute("style", `opacity: ${opacity} !important;`);
      elem.tagName.toLowerCase() == "code" ? elem.parentNode.classList.add("sat-watermark") : elem.classList.add("sat-watermark");
    });
  }
};

/**
 * Init notifications in Experience Editor
 */
const initNotificationsEE = () => {
  let html = `<div class="notifications-container notify-is-right notify-is-bottom" style="--distance:20px;" data-count="0"></div>`;
  parent.document.querySelector("body").insertAdjacentHTML("beforeend", html);
  //Event listener
};

/**
 * Init notifications in Experience Editor
 */
// eslint-disable-next-line no-unused-vars, max-params
const addNotificationsEE = (title, message, type = "success", autoclose = 0) => {
  let icon;
  switch (type) {
    case "success":
      icon = global.notifyIconSuccess;
      break;

    case "warning":
      icon = global.notifyIconWarning;
      break;

    case "error":
      icon = global.notifyIconError;
      break;

    case "notifications":
      icon = global.notifyIconInfo;
      break;

    default:
      icon = global.notifyIconSuccess;
      break;
  }
  let html = `<div class="notify notify--type-3 notify--${type} notify--fade notify--fadeIn" style="--gap:15px; transition-duration: 300ms;">
                  <div class="notify__icon">
                    ${icon}
                  </div>
                  <div class="notify__close" onclick="closeNotify(event)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m8.94 8 4.2-4.193a.67.67 0 0 0-.947-.947L8 7.06l-4.193-4.2a.67.67 0 1 0-.947.947L7.06 8l-4.2 4.193a.667.667 0 0 0 .217 1.093.666.666 0 0 0 .73-.146L8 8.94l4.193 4.2a.665.665 0 0 0 .947 0 .665.665 0 0 0 0-.947L8.94 8Z" fill="currentColor"></path></svg>
                  </div>
                  <div class="notify-content">
                    <div class="notify__title">${title}</div>
                    <div class="notify__text">${message}</div>
                  </div>
                </div>`;

  parent.document.querySelector("body .notifications-container").insertAdjacentHTML("afterbegin", html);
  parent.document.querySelector("body .notifications-container").dataset.count++;

  if (autoclose > 0) {
    setTimeout(() => {
      parent.document.querySelector(".notify").classList.remove("notify--fadeIn");
      setTimeout(() => {
        parent.document.querySelector(".notify").remove();
      }, 500);
    }, autoclose);
  }
};

/**
 * Get Experience Editor Errors
 */
const initGroupedErrorsEE = (storage) => {
  storage.feature_eenotify == undefined ? (storage.feature_eenotify = true) : false;
  let editMode = parent.window.location ? parent.window.location.href.includes("sc_mode=edit") : false;
  if (storage.feature_eenotify && editMode) {
    initNotificationsEE();
    //Variables
    let urlParams = new URLSearchParams(parent.window.location.search);
    let sc_token = document.getElementsByName("__RequestVerificationToken")[0].value;
    let sc_itemid = urlParams.get("sc_itemid");
    let sc_language = parent.document.querySelector("input#scLanguage").value;
    let sc_version = urlParams.get("sc_version") || 1;
    let scFieldValues = ``;
    parent.document.querySelectorAll("#scFieldValues > input").forEach(function (item) {
      scFieldValues += `"${item.id}":"",`;
    });
    scFieldValues += `######`;
    scFieldValues = scFieldValues.replace(`,######`, ``).replace(`######`, ``);

    //1. Datasource fields validation
    setTimeout(() => {
      let scErrorType = `error`;
      fetch("/-/speak/request/v1/expeditor/ExperienceEditor.FieldsValidation.ValidateFields", {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body:
          "__RequestVerificationToken=" +
          sc_token +
          '&data={"language":"' +
          sc_language +
          '","version":' +
          sc_version +
          ',"isFallback":false,"isHome":false,"itemId":"' +
          sc_itemid +
          '","database":"master","value":"{0930CAE5-BB35-4B57-B9B4-7D8E8CD1A8F1}","scValidatorsKey":"VK_SC_PAGEEDITOR","scFieldValues":{' +
          scFieldValues +
          "}}",
        method: "POST",
        mode: "cors",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          data.responseValue.value.forEach((item) => {
            //Priority
            if (item.Priority == 0) {
              scErrorType = "error";
            } else {
              scErrorType = "warning";
            }
            //Unknown error
            if (item.Text.includes("[unknown]")) {
              item.Text = `Language version "${sc_language}" seems missing for a datasource`;
              scErrorType = "warning";
            }
            addNotificationsEE(
              `${item.Text}`,
              `<a href="/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#${item.DataSourceId}_${sc_language.toLowerCase()}_${sc_version}" class="OptionTitle" target="_blank" style="color:rgba(255,255,255,0.8)">Fix this error</a>`,
              scErrorType
            );
          });
        });
    }, 500);

    //2. Page fields validation
    setTimeout(() => {
      fetch("/-/speak/request/v1/expeditor/ExperienceEditor.Proofing.Validation", {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body:
          "__RequestVerificationToken=" +
          sc_token +
          '&data={"language":"' +
          sc_language +
          '","version":' +
          sc_version +
          ',"isFallback":false,"isHome":false,"itemId":"' +
          sc_itemid +
          '","database":"master","value":"{0930CAE5-BB35-4B57-B9B4-7D8E8CD1A8F1}","scValidatorsKey":"VK_SC_PAGEEDITOR","scFieldValues":{' +
          scFieldValues +
          "}}",
        method: "POST",
        mode: "cors",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => fetch(data.responseValue.value))
        .then((response) => response.text())
        .then((data) => {
          let dom = new DOMParser().parseFromString(data, "text/html");
          let validatorLink = dom.querySelector("form").getAttribute("action");
          dom.querySelectorAll(".scListControl tr").forEach(function (line) {
            if (line.querySelectorAll("td") && line.querySelectorAll("td").length == 3) {
              let errorType = line.querySelectorAll("td")[0].querySelector("img").src;
              let fixLink = `<a href="/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#${sc_itemid}_${sc_language}_${sc_version}" class="OptionTitle" target="_blank" style="color:rgba(255,255,255,0.8)">Fix this error</a>`;
              //Unknown error
              if (line.querySelector("td.scValidatorResult").innerText.includes("[unknown]")) {
                line.querySelector("td.scValidatorResult").innerText = `Language version "${sc_language}" seems missing for a field`;
              }
              if (errorType.includes("yellow.png") && !line.querySelector("td.scValidatorTitle > div:last-child").innerText.toLowerCase().includes("spaces")) {
                addNotificationsEE(line.querySelector("td.scValidatorResult").innerText, `${fixLink} &nbsp; <a href="${validatorLink}" class="OptionTitle" target="_blank" style="color:rgba(255,255,255,0.8)">More details</a>`, `warning`);
              } else if (errorType.includes("red.png") && !line.querySelector("td.scValidatorResult").innerText.includes("(403)") && !line.querySelector("td.scValidatorTitle > div:last-child").innerText.includes("XHTML")) {
                addNotificationsEE(line.querySelector("td.scValidatorResult").innerText, `${fixLink} &nbsp; <a href="${validatorLink}" class="OptionTitle" target="_blank" style="color:rgba(255,255,255,0.8)">More details</a>`, `error`);
              }
            }
          });
        });
    }, 600);

    //3. Validation bar warnings and info
    setTimeout(() => {
      document.querySelectorAll(".sc-messageBar-messages-wrap > div").forEach(function (group) {
        if (group.dataset.bind.toLowerCase().includes("notifications") || group.dataset.bind.toLowerCase().includes("warning")) {
          let className = group.dataset.bind.toLowerCase().includes("notifications") ? "info" : "warning";
          group.querySelectorAll(".sc-messageBar-messageText").forEach(function (item) {
            //Get content
            let doc = new DOMParser().parseFromString(item.innerHTML, "text/html");
            //Links
            let count = 0;
            let docAction = ``;
            doc.querySelectorAll("a").forEach(function (link) {
              link.setAttribute(`onclick`, `document.querySelector('#scWebEditRibbon').contentDocument.querySelectorAll("[data-bind*='notifications' i] .sc-messageBar-messageText a")[${count}].click()`);
              link.setAttribute("style", "opacity:0.8; padding: 0px 10px 0px 0px;");
              docAction += link.outerHTML + " ";
              count++;
            });
            //Title
            let docTitle = item.innerHTML ? new DOMParser().parseFromString(item.innerHTML, "text/html") : ``;
            if (docTitle != ``) {
              docTitle.querySelectorAll("a").forEach(function (link) {
                link.remove();
              });
              docTitle = docTitle.querySelector("body").innerHTML;
              //Exceptions
              docAction = docAction.includes("has locked this item") ? `Try unlocking from the "Home" tab` : docAction;
              //Show notification
              addNotificationsEE(docTitle, docAction, className);
            }
          });
        }
      });
    }, 4000);

    //4. Check if no error on this page
    setTimeout(() => {
      if (parent.document.querySelector("body .notifications-container").dataset.count == 0) {
        addNotificationsEE(`This page looks great! 🎉`, `No error found on this page.`, `success`, 4000);
      }
      if (parent.document.querySelector("body .notifications-container").dataset.count > 3) {
        parent.document.querySelector("body .notifications-container").insertAdjacentHTML("afterbegin", `<div onclick="closeAllNotify()" class="notify-clearall">Clear All</div>`);
      }
    }, 4500);
  }
};
