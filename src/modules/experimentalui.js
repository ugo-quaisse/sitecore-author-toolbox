/* eslint-disable no-script-url */
/* eslint-disable no-tabs */
/* eslint-disable max-params */
/* eslint-disable newline-per-chained-call */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import * as icons from "./icons.js";
import { getMaterializeIcon, getScItemData, setTextColour } from "./helpers.js";
import { findCountryName } from "./language.js";

export {
  initOnboarding,
  initExperimentalUi,
  insertSavebar,
  insertSavebarEE,
  insertBreadcrumb,
  insertLanguageButton,
  insertVersionButton,
  insertMoreButton,
  insertProfilesButton,
  insertNavigatorButton,
  pathToBreadcrumb,
  initInsertIcon,
  getAccentColor,
  initColorPicker,
  initSitecoreRibbon,
  initGutter,
  getParentNode,
  initSvgAnimation,
  initSvgAnimationPublish,
  initEventListeners,
  initTitleBarDesktop,
  replaceIcons,
  initMaterializeIcons,
};

/**
 * Experimental UI Onboarding
 */
const initOnboarding = () => {
  if (!localStorage.getItem("scWelcome")) {
    if (!document.querySelector(".scWelcome")) {
      setTimeout(function () {
        let html = `
        <div class="scWelcome">
          <div class="header">
            <div class="logo"></div>
            <div class="clouds"></div>
          </div>
          <div class="scContent">
            <h2>Hello Experimental Theme!</h2>
            <h3>Sitecore Author Toolbox extension</h3>
            <p><b>What is that?</b><br />Experimental UI is a new modern theme for Sitecore. It comes with a simple and clean interface that will help authors to focus more on their content and accelerate their workflow.</p>
            <p><b>Where is the ribbon?</b><br />You can click the little arrow/chevron on the top right to toggle the ribbon. Alternatively, you can press CTRL + SHIFT.</p>
            <button id="scWelcomeClose">Ok, let's start!</button>
            <p class="switch" id="scWelcomeSwitch"><u>Switch back to classic Sitecore</u></p>
          </div>
        </div>
        <div class="scWelcomeOverlay"></div>`;
        document.querySelector("body").insertAdjacentHTML("beforeend", html);
        window.focus();

        //Add listener on click
        document.querySelector("#scWelcomeClose").addEventListener("click", function () {
          localStorage.setItem("scWelcome", true);
          document.querySelector(".scWelcome").remove();
          document.querySelector(".scWelcomeOverlay") ? document.querySelector(".scWelcomeOverlay").remove() : false;
        });
        document.querySelector("#scWelcomeSwitch").addEventListener("click", function () {
          document.querySelectorAll(".interfaceRadio")[0] ? document.querySelectorAll(".interfaceRadio")[0].click() : false;
          parent.document.querySelectorAll(".interfaceRadio")[0] ? parent.document.querySelectorAll(".interfaceRadio")[0].click() : false;
        });
        document.querySelector(".scWelcomeOverlay").addEventListener("click", function () {
          document.querySelector(".scWelcome").remove();
          document.querySelector(".scWelcomeOverlay") ? document.querySelector(".scWelcomeOverlay").remove() : false;
        });
      }, 1000);
    }
  }
};

/**
 * Init Experimental UI
 */
const initExperimentalUi = (storage) => {
  if (storage.feature_experimentalui) {
    //Hide search
    let SearchPanel = document.querySelector("#SearchPanel");
    let urlParams = new URLSearchParams(window.location.search);
    let contentTitle = urlParams.has("he") ? urlParams.get("he") : "Content";
    //Change content tree title
    //prettier-ignore
    SearchPanel ? (SearchPanel.innerHTML = `<button class="scMenuButton" type="button"><img src="${global.iconMenu}" class="scBurgerMenu"/></button> <div class="scBurgerMenuTitle t-top t-sm" data-tooltip="Go back home" onclick="javascript:return scForm.invoke('contenteditor:home', event)" title="Go back Home">${contentTitle}</div>`) : false;
    //Change menu theme
    document.body && !global.isPreviewMode ? document.body.classList.add("satExperimentalUi") : false;
    if (document.querySelector(".interfaceRadio[value='experimental']")) {
      document.querySelector(".interfaceRadio[value='experimental']").checked = true;
      document.querySelector(".themeMenuHint").innerText = "Experimental UI";
    }
    getAccentColor();
  }
};

/**
 * Insert Save bar
 */
const insertSavebar = () => {
  //If preview mode
  let scPrimaryBtn = global.hasModePreview
    ? `<button class="scPublishButton primary scExitButton" onclick="javascript:return scForm.invoke('contenteditor:closepreview', event)">Close Panel</button>`
    : `<button id="scPublishMenuMore" class="grouped" type="button"><span class="scPublishMenuMoreArrow">▾</span></button>
          <ul class="scPublishMenu">             
            <li onclick="javascript:return scForm.invoke('item:setpublishing', event)">Publishing settings...</li>
            <li onclick="javascript:return scForm.postEvent(this,event,'item:publishingviewer(id=)')">Scheduler...</li>
            <li onclick="javascript:return scForm.invoke('item:publishnow', event)">Quick Publish...</li>  
          </ul>
        <button class="scPublishButton primary primaryGrouped" onclick="javascript:return scForm.postEvent(this,event,'item:publish(id=)')">Save and Publish</button>`;
  let scPreviewBtn =
    !global.hasModePreview && getScItemData().path && getScItemData().path.includes("/home") ? `<button class="scPreviewButton" onclick="javascript:return scForm.invoke('contenteditor:preview', event)">Preview</button>` : ``;

  //Save Bar
  //prettier-ignore
  let scSaveBar = `<div class="scSaveBar">
        <div class="scActions">
            ${scPrimaryBtn}
            <button class="scSaveButton" onclick="javascript:return scForm.invoke('contenteditor:save', event)">Save</button>
            ${scPreviewBtn}
        </div>
        <div class="scBreadcrumb"></div>
    </div>`;

  let contentEditor = document.querySelector("#ContentEditor");
  document.querySelector(".scSaveBar") ? document.querySelector(".scSaveBar").remove() : false;
  contentEditor ? contentEditor.insertAdjacentHTML("afterbegin", scSaveBar) : false;

  //Save mesasge
  let scSaveMessage = `<div class="saveMessage">Your changes have been saved successfully!</div>`;
  !document.querySelector(".saveMessage") ? document.querySelector("body").insertAdjacentHTML("afterbegin", scSaveMessage) : false;
};

/**
 * Path to Breadcrumb
 */
const pathToBreadcrumb = (pathname, delimiter = "", underline = true, full = false) => {
  let breadcrumb = "#####";
  let count = 0;
  let elipsis = false;
  let path, site;

  if (pathname) {
    path = pathname.toLowerCase() + "/";
    path = path.split("/home/");
    //If home is part of the path
    if (path[1] != undefined) {
      site = path[0].split("/").pop();
      path = path[1].split("/");
      underline
        ? (breadcrumb += `<u onclick="getParentNode(${path.length + 1})">...</u> <i>${delimiter}</i> <u class="scBreadcrumbHome" onclick="getParentNode(${
            path.length
          });">${site.capitalize()}</u> <i>${delimiter}</i> <u onclick="getParentNode(${path.length - 1});">Home</u> `)
        : (breadcrumb += `<i>${delimiter}</i> ${site.capitalize()} <i>${delimiter}</i> Home `);
    } else {
      path = path[0].split("/");
    }

    for (let level of path) {
      count++;
      if (!full && path.length > 8 && count > 3 && count < path.length - 3) {
        if (!elipsis) {
          level != "" ? (breadcrumb += `<i>${delimiter}</i> <span onclick="showFullBreadcrumb()" class="scBreadcrumbElipsis t-right t-sm" data-tooltip="Click to show all">...</span> `) : false;
          elipsis = true;
        }

        // eslint-disable-next-line no-continue
        continue;
      }

      if (underline) {
        level != "" ? (breadcrumb += `<i>${delimiter}</i> <u onclick="getParentNode(` + (path.length - count - 1) + `, '` + global.tabLoadingTitle + `');">` + level.toLowerCase().capitalize() + `</u> `) : false;
      } else {
        level != "" ? (breadcrumb += `<i>${delimiter}</i> ` + level.toLowerCase().capitalize() + ` `) : false;
      }
    }
  }

  breadcrumb = breadcrumb.replace(`#####<i>${delimiter}</i>`, ``).replace(`#####`, ``);

  return breadcrumb;
};

/**
 * Insert Breadcrumb
 */
const insertBreadcrumb = (path) => {
  let breadcrumb = `<span class="scBreadcrumbShort">${pathToBreadcrumb(path)}</span>`;
  let breadcrumbFull = `<span class="scBreadcrumbFull">${pathToBreadcrumb(path, "", true, true)}</span>`;
  let scBreadcrumb = document.querySelector(".scBreadcrumb");
  scBreadcrumb && path ? (scBreadcrumb.innerHTML = breadcrumb) : false;
  scBreadcrumb && path ? scBreadcrumb.insertAdjacentHTML("beforeend", breadcrumbFull) : false;
};

/**
 * Insert Language button
 */
const insertLanguageButton = (scItemId, scLanguage = "EN", scVersion = 1) => {
  //Button
  let container = document.querySelector(".scEditorTabControlsHolder");
  //prettier-ignore
  let button = `<button class="scEditorHeaderButton" id="scLanguageButton" type="button"><img src="` + global.iconLanguage + `" class="scLanguageIcon"> ` + scLanguage.toUpperCase() + ` ▾</button>`;
  container && !document.querySelector("#scLanguageButton") ? container.insertAdjacentHTML("afterbegin", button) : false;

  //Iframe
  document.querySelector("#scLanguageIframe") ? document.querySelector("#scLanguageIframe").remove() : false;
  let body = document.querySelector("body");
  //prettier-ignore
  let iframe = `<iframe loading="lazy" id="scLanguageIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Languages&id=${scItemId}&la=${scLanguage}&vs=${scVersion}&db=master"></iframe>`;
  body && !document.querySelector("#scLanguageIframe") ? body.insertAdjacentHTML("beforeend", iframe) : false;

  //Scroll position
  //document.querySelector("#scLanguageIframe").contentWindow.document.body.querySelector(".scGalleryContent13").scrollTop = 0;

  //Remove old
  //document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Insert More button
 */
const insertMoreButton = () => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let ScItem = getScItemData();
  //prettier-ignore
  let button = `<button class="scEditorHeaderButton" id="scMoreButton" title="More actions" type="button">
    <img src="${global.iconMore}" class="scLanguageIcon">
    </button>
    <ul class="scMoreMenu">
        <li onclick="javascript:if(confirm('Do you really want to create a new version for this item?')) { return scForm.postEvent(this,event,'item:addversion(id=)') }">Add new version</li>
        <li onclick="javascript:return scForm.invoke('contenteditor:edit')" id="scLockMenuText">Lock item</li>
        <li class="separator" onclick="javascript:return scForm.postEvent(this,event,'item:rename')">Rename item</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:setdisplayname')">Display name</li>
        <li onclick="javascript:return scForm.invoke('item:duplicate')">Duplicate</li>
        <li onclick="javascript:return scForm.invoke('item:clone')">Clone</li>
        <li class="separator" onclick="javascript:return scForm.invoke('item:setlayoutdetails', event)">Presentation details...</li>
        <li class="separator" onclick="javascript:return scForm.postEvent(this,event,'item:sethelp')">Help texts</li>
        <!-- <li id="scInfoButton">Item details</li> -->
        <li  onclick="javascript:return scForm.postEvent(this,event,'contenteditor:properties')">Item properties</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:executescript(id=${ScItem.id},db=master,script={1876D433-4FAE-46B2-B2EF-AAA0FDA110E7},scriptDb=master)')">Author statistics</li>
        <li class="separator danger" onclick="javascript:return scForm.invoke('item:delete(id=${ScItem.id})', event)">Delete</li>
    </ul>`;
  container && !document.querySelector("#scMoreButton") ? container.insertAdjacentHTML("afterbegin", button) : false;

  let panel = document.querySelector("#scPanel");
  //prettier-ignore
  let html =
    `<div class="content satItemDetails">
      <h2>Item details</h2>
      <h3>Item ID:</h3> <span class="itemDetail">${ScItem.id}</span>
      <h3>Name:</h3> <span class="itemDetail">${ScItem.name}</span>
      <h3>Path:</h3> <span class="itemDetail scItemPath">${ScItem.path}</span>
      <h3>Template:</h3> <span class="itemDetail">${ScItem.template}</span>
      <h3>Template ID:</h3> <span class="itemDetail">${ScItem.templateId}</span>
      <h3>From:</h3> <span class="itemDetail">${ScItem.from}</span>
      <h3>Owner:</h3> <span class="itemDetail">${ScItem.owner}</span>
      <h3>Language:</h3> <span class="itemDetail">${ScItem.language}</span>
      <h3>Version:</h3> <span class="itemDetail">${ScItem.version}</span>
    </div>`;
  panel ? (panel.innerHTML = html) : false;
};

/**
 * Insert Version button
 */
const insertVersionButton = (scItemId, scLanguage = "EN", scVersion = 1) => {
  //Button
  let container = document.querySelector(".scEditorTabControlsHolder");
  //prettier-ignore
  let button = `<button class="scEditorHeaderButton" id="scVersionButton" type="button"><img src="${global.iconVersion}" class="scLanguageIcon"> ${scVersion} ▾</button>`;
  container && !document.querySelector("#scVersionButton") && scVersion != null ? container.insertAdjacentHTML("afterbegin", button) : false;

  //Iframe
  document.querySelector("#scVersionIframe") ? document.querySelector("#scVersionIframe").remove() : false;
  let body = document.querySelector("body");
  //prettier-ignore
  let iframe = `<iframe loading="lazy" id="scVersionIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Versions&id=${scItemId}&la=${scLanguage}&vs=${scVersion}&db=master"></iframe>`;
  body && !document.querySelector("#scVersionIframe") ? body.insertAdjacentHTML("beforeend", iframe) : false;

  //Remove old button
  //document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Insert Profiles button
 */
const insertProfilesButton = () => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button = document.querySelector(".scEditorHeaderCustomizeProfilesIcon")
    ? `<button class="scEditorHeaderButton" id="scProfilesButton" type="button" onclick="javascript:return scForm.invoke('item:personalize')"><img src="${global.iconProfiles}" class="scLanguageIcon"></button>`
    : ``;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;
};

/**
 * Insert Navigator button
 */
const insertNavigatorButton = () => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button = `<button class="scEditorHeaderButton" id="scNavigatorButton" type="button"><img src="${global.iconNotebook}" class="scLanguageIcon"> ▾</button>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Get last status of Sitecore Ribbon (Open or Close)
 */
const initSitecoreRibbon = () => {
  let storage = localStorage.getItem("scSitecoreRibbon");
  let dock = document.querySelector(".scDockTop");
  !dock && document.querySelector("div[data-sc-id='PageEditBar']") ? (dock = document.querySelector("div[data-sc-id='PageEditBar']")) : false;
  let icon = document.querySelector("#scSitecoreRibbon");

  if (storage == "true") {
    dock ? dock.classList.add("showSitecoreRibbon") : false;
    icon ? icon.classList.add("scSitecoreRibbon") : false;
  } else {
    dock ? dock.classList.remove("showSitecoreRibbon") : false;
    icon ? icon.classList.remove("scSitecoreRibbon") : false;
  }
};

/**
 * Get Accent Color
 */
const getAccentColor = () => {
  let color, text, brightness, invert, revert;
  let storage = localStorage.getItem("scColorPicker");
  let root = document.documentElement;
  if (storage) {
    color = storage;
    text = setTextColour(color);
    text == "#ffffff" ? (brightness = 20) : (brightness = 0);
    text == "#ffffff" ? (invert = 0) : (invert = 1);
    text == "#ffffff" ? (revert = 1) : (revert = 0);
    root.style.setProperty("--accent", color);
    root.style.setProperty("--accentTransparent", color + "99");
    root.style.setProperty("--accentText", text);
    root.style.setProperty("--accentBrightness", brightness);
    root.style.setProperty("--accentInvert", invert);
    root.style.setProperty("--accentRevert", revert);
  } else {
    color = "#ee3524"; //red
    root.style.setProperty("--accent", "#ee3524");
    root.style.setProperty("--accentTransparent", "#ee352499");
    root.style.setProperty("--accentText", "#ffffff");
    root.style.setProperty("--accentBrightness", 20);
    root.style.setProperty("--accentInvert", 0);
    root.style.setProperty("--accentRevert", 1);
  }

  return color;
};

/**
 * Add Color Picker into top bar (Experimental UI)
 */
const initColorPicker = (storage) => {
  if (storage.feature_experimentalui) {
    let color, text, brightness, invert, revert, borderAlpha;

    //prettier-ignore
    let input = `<input type="color" id="scAccentColor" name="scAccentColor" value="` + getAccentColor() + `" class="t-bottom t-sm" data-tooltip="Your accent color">`;
    let menu = document.querySelector(".sc-accountInformation");
    menu ? menu.insertAdjacentHTML("afterbegin", input) : false;

    //Listenenr on change
    let colorPicker = document.querySelector("#scAccentColor");
    if (colorPicker) {
      colorPicker.addEventListener("change", () => {
        color = colorPicker.value;
        text = setTextColour(color);
        text == "#ffffff" ? (brightness = 20) : (brightness = 0);
        text == "#ffffff" ? (invert = 0) : (invert = 1);
        text == "#ffffff" ? (revert = 1) : (revert = 0);
        text == "#ffffff" ? (borderAlpha = "rgba(255, 255, 255, 0.4)") : (borderAlpha = "rgba(0, 0, 0, 0.4)");
        //Root
        let root = document.documentElement;
        root.style.setProperty("--accent", color);
        root.style.setProperty("--accentTransparent", color + "99");
        root.style.setProperty("--accentText", text);
        root.style.setProperty("--accentBrightness", brightness);
        root.style.setProperty("--accentInvert", invert);
        root.style.setProperty("--accentRevert", revert);
        root.style.setProperty("--accentBorder", borderAlpha);

        //Iframes
        document.querySelectorAll("iframe").forEach(function (e) {
          let iframe = e.contentWindow.document.documentElement;
          iframe.style.setProperty("--accent", color);
          iframe.style.setProperty("--accentTransparent", color + "99");
          iframe.style.setProperty("--accentText", text);
          iframe.style.setProperty("--accentBrightness", brightness);
          iframe.style.setProperty("--accentInvert", invert);
          iframe.style.setProperty("--accentRevert", revert);
          root.style.setProperty("--accentBorder", borderAlpha);
        });

        localStorage.setItem("scColorPicker", color);
      });
    }
  }
};

/**
 * Set Insert + Icon in Content Tree
 */
const setInsertIcon = (treeNode) => {
  let id = treeNode.replace("Tree_Node_", "");
  let language = document.querySelector("#scLanguage") ? document.querySelector("#scLanguage").value : "en";
  let idFormat = id.replace(
    // eslint-disable-next-line prefer-named-capture-group
    /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/u,
    "$1-$2-$3-$4-$5"
  );
  let a = document.querySelector("#Tree_Node_" + id);
  let itemName = a.querySelector("span").innerText;
  let active = document.querySelector(".scContentTreeNodeActive") ? document.querySelector(".scContentTreeNodeActive").id.replace("Tree_Node_", "") : false;
  let activeClass = "";
  let isDarkMode = document.querySelector("body").classList.contains("satDark");
  id == active ? (activeClass = "scInsertItemIconInverted") : false;

  //Remove existing Insert Icons
  document.querySelectorAll(".scInsertItemIcon").forEach((el) => {
    el.remove();
  });
  //Add Insert Icon
  //prettier-ignore
  a.insertAdjacentHTML("afterend", `<span id="scIcon${id}" class="scInsertItemIcon ${activeClass} t-left t-sm" data-tooltip="Insert" onclick="insertPage('${id}', '${itemName}')"></span>`);
  let target = document.querySelector("#scIcon" + id);
  target ? target.setAttribute("style", "opacity:1") : false;

  //Listener when hover scInsertItemIcon
  document.querySelector(".scInsertItemIcon").addEventListener("mouseenter", function () {
    let parent = document.querySelector(".scInsertItemIcon").parentNode.querySelector("a > span");
    !isDarkMode ? parent.setAttribute("style", "background-color: var(--grey5)") : parent.setAttribute("style", "background-color: var(--dark2)");
  });
  document.querySelector(".scInsertItemIcon").addEventListener("mouseleave", function () {
    let parent = document.querySelector(".scInsertItemIcon").parentNode.querySelector("a > span");
    parent.setAttribute("style", "");
  });

  //Remove existing Edit Icons
  document.querySelectorAll(".scEditItemIcon").forEach((el) => {
    el.remove();
  });
  //Custom editor
  let userEditor = !global.isXmCloud ? `Edit in Experience Editor` : `Edit in Pages`;
  //prettier-ignore
  let userEditorAction = !global.isXmCloud
    ? `javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor(id={${idFormat}})')`
    : `javascript:window.open('https://pages.sitecorecloud.io/composer/pages/editor?sc_itemid=${idFormat}&sc_lang=${language}&sc_version=${getScItemData().version}')`;

  //prettier-ignore
  a.insertAdjacentHTML("afterend", `<span id="scIconEE${id}" class="scEditItemIcon ${activeClass} t-left t-sm" data-tooltip="${userEditor}" onclick="${userEditorAction}"></span>`);
  target = document.querySelector("#scIconEE" + id);
  target ? target.setAttribute("style", "opacity:1") : false;

  //Listener when hover scEditItemIcon
  document.querySelector(".scEditItemIcon").addEventListener("mouseenter", function () {
    let parent = document.querySelector(".scEditItemIcon").parentNode.querySelector("a > span");
    !isDarkMode ? parent.setAttribute("style", "background-color: var(--grey5)") : parent.setAttribute("style", "background-color: var(--dark2)");
  });
  document.querySelector(".scEditItemIcon").addEventListener("mouseleave", function () {
    let parent = document.querySelector(".scEditItemIcon").parentNode.querySelector("a > span");
    parent.setAttribute("style", "");
  });
};

/**
 * Init Insert action icons (create, edit in EE) in content tree when you hover an item
 */
const initInsertIcon = (storage) => {
  let contentTree = document.querySelector(".scContentTree");
  let treeNode = document.querySelector(".scContentTreeContainer");
  let node, nodeId, nodeIcon, nodeContent;
  if (treeNode) {
    treeNode.addEventListener("mouseover", (event) => {
      if (event.path[1].classList.contains("scContentTreeNodeNormal") || event.path[1].classList.contains("scContentTreeNodeActive")) {
        setInsertIcon(event.path[1].getAttribute("id"));
        node = event.path[1];
        nodeContent = node.querySelector("span").innerText;
        node.setAttribute("title", nodeContent);
      }
      if (event.path[2].classList.contains("scContentTreeNodeNormal") || event.path[2].classList.contains("scContentTreeNodeActive")) {
        setInsertIcon(event.path[2].getAttribute("id"));
        node = event.path[2];
      }

      //Colors of icons (black or white)
      var contrastedIcon = storage.feature_material_icons === true ? "scMaterialIcon" : "";

      //Updating html structure to allow text-overflow and avoid icons overlap
      if (node && !node.classList.contains("scNoOverlap")) {
        nodeId = node.getAttribute("id").replace("Tree_Node_", "");
        nodeIcon = node.querySelector("span > img").src;
        nodeContent = node.querySelector("span").innerText;
        node.querySelector("span").innerHTML =
          `<img src="${nodeIcon}" loading="lazy" width="16" height="16" class="scContentTreeNodeIcon ${contrastedIcon}" alt="" border="0"><div ondblclick="javascript:return scForm.postEvent(this,event,'item:rename(id={` +
          nodeId.replace(
            // eslint-disable-next-line prefer-named-capture-group
            /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/u,
            "$1-$2-$3-$4-$5"
          ) +
          `})')">${nodeContent}</div>`;
        node.classList.add("scNoOverlap");
      }
    });

    contentTree.addEventListener("mouseleave", () => {
      document.querySelector(".scInsertItemIcon") ? document.querySelector(".scInsertItemIcon").setAttribute("style", "opacity:0") : false;
      document.querySelector(".scEditItemIcon") ? document.querySelector(".scEditItemIcon").setAttribute("style", "opacity:0") : false;
    });
  }
};

/**
 * Insert Sitecore Gutter in Content Tree
 */
const initGutter = () => {
  let treeNode = document.querySelector(".scContentTreeContainer");
  let html = `<div class="scGutter" onclick="javascript:if (window.scGeckoActivate) window.scGeckoActivate(); return scContent.onTreeClick(this, event)" oncontextmenu="javascript:return scContent.onTreeContextMenu(this, event)" onkeydown="javascript:return scContent.onTreeKeyDown(this, event)"></div>`;
  treeNode ? treeNode.insertAdjacentHTML("afterbegin", html) : false;
};

/**
 * Get parent in tree node
 */
const getParentNode = (int = 1) => {
  var elem = parent.document.querySelector(".scContentTreeNodeActive");
  var count = 0;
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.classList) {
      if (elem.classList.contains("scContentTreeNode")) {
        count++;
        if (count == 1 + int) {
          elem
            .querySelector(".scContentTreeNodeNormal")
            .getAttribute("id")
            .replace("Tree_Node_", "")
            .replace(
              // eslint-disable-next-line prefer-named-capture-group
              /(.{8})(.{4})(.{4})(.{4})(.{12})/u,
              "$1-$2-$3-$4-$5"
            );
          break;
        }
      }
    }
  }
};

/**
 * Init SVG animation
 */
const initSvgAnimation = (storage) => {
  if (storage.feature_experimentalui) {
    let isExist = document.querySelector("#svgAnimation");
    let svgAnimation = `<div id="svgAnimation">${global.svgAnimation}</div>`;
    document.querySelector("#EditorFrames") && !isExist ? document.querySelector("#EditorFrames").insertAdjacentHTML("beforebegin", svgAnimation) : false;
  }
};

/**
 * Init SVG animation during publish
 */
const initSvgAnimationPublish = (storage) => {
  if (storage.feature_experimentalui) {
    if (document.querySelector("#Publishing > .scFormDialogHeader")) {
      document.querySelector("#Publishing > .scFormDialogHeader > div").insertAdjacentHTML("afterend", `<div class="scIndeterminateProgress"></div>`);
      document.querySelector("#Publishing > .scWizardProgressPage").insertAdjacentHTML("afterbegin", `<div id="svgAnimationCircle">${global.svgAnimationCircle}</div>`);
    }
    if (document.querySelector("#Exporting > .scFormDialogHeader")) {
      document.querySelector("#Exporting > .scFormDialogHeader > div").insertAdjacentHTML("afterend", `<div class="scIndeterminateProgress"></div>`);
      document.querySelector("#Exporting > .scWizardProgressPage").insertAdjacentHTML("afterbegin", `<div id="svgAnimationCircle">${global.svgAnimationCircle}</div>`);
    }
    if (document.querySelector("#Uploading > .scFormDialogHeader")) {
      document.querySelector("#Uploading > .scFormDialogHeader > div").insertAdjacentHTML("afterend", `<div class="scIndeterminateProgress"></div>`);
      document.querySelector("#Uploading > .scWizardProgressPage").insertAdjacentHTML("afterbegin", `<div id="svgAnimationCircle">${global.svgAnimationCircle}</div>`);
    }
    if (document.querySelector("#Installing > .scFormDialogHeader")) {
      document.querySelector("#Installing > .scFormDialogHeader > div").insertAdjacentHTML("afterend", `<div class="scIndeterminateProgress"></div>`);
      document.querySelector("#Installing > .scWizardProgressPage").insertAdjacentHTML("afterbegin", `<div id="svgAnimationCircle">${global.svgAnimationCircle}</div>`);
    }
    if (document.querySelector("#Rebuilding > .scFormDialogHeader")) {
      document.querySelector("#Rebuilding > .scFormDialogHeader > div").insertAdjacentHTML("afterend", `<div class="scIndeterminateProgress"></div>`);
      document.querySelector("#Rebuilding > .scWizardProgressPage").insertAdjacentHTML("afterbegin", `<div id="svgAnimationCircle">${global.svgAnimationCircle}</div>`);
    }
  }
};

/**
 * Init Experimental Event Listeners
 */
const initEventListeners = () => {
  document.addEventListener("click", (event) => {
    //Panels position
    let topPos = document.querySelector("#EditorTabs") ? document.querySelector("#EditorTabs").getBoundingClientRect().bottom : "100";
    let scPanel = document.querySelector("#scPanel");
    let scLanguageIframe = document.querySelector("#scLanguageIframe");
    let scVersionIframe = document.querySelector("#scVersionIframe");
    scPanel ? scPanel.setAttribute("style", "top: " + topPos + "px !important") : false;
    scLanguageIframe ? scLanguageIframe.setAttribute("style", "top: " + topPos + "px !important; height: calc(100% - " + topPos + "px) !important;") : false;
    scVersionIframe ? scVersionIframe.setAttribute("style", "top: " + topPos + "px !important; height: calc(100% - " + topPos + "px) !important;") : false;

    //Publish menu
    if (document.querySelector(".scPublishMenu")) {
      event.target.id == "scPublishMenuMore" || event.target.className == "scPublishMenuMoreArrow"
        ? document.querySelector(".scPublishMenu").classList.toggle("visible")
        : document.querySelector(".scPublishMenu").classList.remove("visible");
    }

    //More menu
    if (document.querySelector(".scMoreMenu")) {
      event.target.id == "scMoreButton" || event.path[1].id == "scMoreButton" ? document.querySelector(".scMoreMenu").classList.toggle("visible") : document.querySelector(".scMoreMenu").classList.remove("visible");
    }

    //Quick Info panel
    if (document.querySelector("#scInfoButton")) {
      if (event.path[0].className != "itemDetail" && event.path[0].className != "open") {
        event.target.id == "scInfoButton" || event.path[1].id == "scInfoButton" || event.target.id == "scPanel" || event.path[0].className == "content" ? scPanel.classList.toggle("open") : scPanel.classList.remove("open");
      }
    }

    //Language menu
    if (scLanguageIframe) {
      event.target.id == "scLanguageButton" || event.path[1].id == "scLanguageButton" ? scLanguageIframe.classList.toggle("open") : scLanguageIframe.classList.remove("open");
    }

    //Version menu
    if (scVersionIframe) {
      event.target.id == "scVersionButton" || event.path[1].id == "scVersionButton" ? scVersionIframe.classList.toggle("open") : scVersionIframe.classList.remove("open");
    }

    //Overlay
    if (document.querySelector("#scModal")) {
      event.target.className == "scOverlay" ? document.querySelector(".scOverlay").setAttribute("style", "visibility: hidden") : false;
      event.target.className == "scOverlay" ? document.querySelector("#scModal").setAttribute("style", "opacity:0; visibility: hidden; top: calc(50% - 550px/2 - 10px)") : false;
    }
  });
};

/**
 * Add title bar to windows on Desktop mode
 */
const initTitleBarDesktop = () => {
  //Icons
  let close = `<img onclick="javascript:return scForm.postEvent(this,event,'javascript:scWin.closeWindow()')" src="${global.iconWindowClose}" class="windowIcon" title="Close"/>`;
  let max = `<img onclick="javascript:return scForm.postEvent(this,event,'javascript:scWin.maximizeWindow()')" src="${global.iconWindowMax}" class="windowIcon" title="Maximize"/>`;
  let min = `<img onclick="javascript:return scForm.postEvent(this,event, 'javascript:scWin.minimizeWindow()')"src="${global.iconWindowMin}" class="windowIcon" title="Minimize"/>`;
  //Dock
  let dock = document.querySelector(".scDockTop");
  dock && global.isWindowedMode
    ? dock.insertAdjacentHTML("beforebegin", `<div class="titleBarDesktop scWindowHandle" ondblclick="javascript:scWin.maximizeWindow();"><span class="titleBarText">New window</span> ` + close + max + min + `</div>`)
    : false;
  if (dock.classList.contains("showSitecoreRibbon") && document.querySelector(".titleBarDesktop") == true) {
    document.querySelector(".titleBarDesktop").classList.add("hide");
  } else if (document.querySelector(".titleBarDesktop")) {
    document.querySelector(".titleBarDesktop").classList.remove("hide");
  }
};

/**
 * Replace Glyph Images
 */
const replaceIcons = (
  storage,
  nodes = ".scButtonIconImage, .scTileItemIconImage, .scPreviewItem > img, .scContentControlLayoutDeviceRenderings img, .scTreelistEx img, .icon, .glyph, .scNavButton, .item-icon, .sc-breadcrumb-item-path > img, .scContentControlLayoutDeviceName > img, .scRendering > img, .scTabContent img, .scContentTreeNodeGlyph, .scContentTreeNodeIcon, #scModal .main img, .scInstantSearchResults img, .dynatree-container img, .dynatree-node > img, .scTabs .scImageContainer > img, form[action*='Gallery'] img, form[action*='Media'] .scFolderButtons img, .scPopup .scMenuItemIcon > img, .satEE .scChromeCommand > img"
) => {
  if (storage.feature_experimentalui === true && storage.feature_material_icons === true) {
    let imgGlyph = document.querySelectorAll(nodes);
    for (let icon of imgGlyph) {
      let filename = icon.src.substring(icon.src.lastIndexOf("/") + 1).toLowerCase();
      let parent = icon.parentElement.parentElement;
      parent = parent ? parent.getAttribute("id") : false;
      let parentId = parent ? parent.split("_").pop() : false;
      //Sitecore tree chevron
      if (filename.includes("treemenu_expanded.png")) {
        icon.src = global.iconTreeExpanded;
      } else if (filename.includes("treemenu_collapsed.png")) {
        icon.src = global.iconTreeCollapsed;
      } else if (parentId == "11111111111111111111111111111111") {
        icon.src = global.iconSitecoreTree;
        icon.classList.add("scMaterialIcon");
      } else if (filename.includes("flag_")) {
        icon.src = chrome.runtime.getURL("images/Flags/svg/" + findCountryName(filename).replace(".aspx", "") + ".svg");
        icon.classList.add("scNoContrastedFlag");
        icon.classList.add("scMaterialIcon");
      } else {
        //Loop Json with icons references, find and match
        for (let entry of Object.entries(icons.jsonIcons)) {
          if (filename.includes(entry[1].search)) {
            let path = entry[1].icon.split("::");
            icon.src = getMaterializeIcon(path[0], path[1]);
            icon.classList.add("scMaterialIcon");
            break;
          } else {
            icon.classList.add("scContrastedIcon");
          }
        }
      }

      //If media image, no filter
      if (filename.includes(".ashx")) {
        icon.setAttribute("loading", "lazy");
        icon.classList.add("scIconImage");
      }
    }
  }
};

/**
 * Replace Glyph Images
 */
const initMaterializeIcons = (storage) => {
  if (storage.feature_experimentalui === true && storage.feature_material_icons === true) {
    let target, observer;
    replaceIcons(storage);
    document.documentElement.style.setProperty("--iconBrightness", 0.1);
    document.documentElement.style.setProperty("--iconContrast", 2);
    //In Content Editor
    target = document.querySelector("body");
    observer = new MutationObserver(function (el) {
      if (el[0].target.className) {
        el[0].target.className != "satCharsCount" && el[0].target.className != "scValidatorPanel" && el[0].target.className != "scContentTree" && el[0].target.className != "scContentTreeNode" ? replaceIcons(storage) : false;
        el[0].target.className == "scContentTreeNode" ? replaceIcons(storage, ".scContentTreeNodeGlyph, .scContentTreeNodeIcon") : false;
      }
    });
    //Observer UI
    target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: false,
          subtree: true,
        })
      : false;
  }
};

/**
 * Insert Save bar Experience Editor
 */
const insertSavebarEE = (storage) => {
  if (storage.feature_experimentalui === true && storage.feature_material_icons === true) {
    //Reset Ribbon
    document.querySelector("body").setAttribute("style", "overflow: hidden !important;");
    //Add listener for refreshing
    addEventListener("beforeunload", () => {
      let saveMessage = document.querySelector(".saveMessage");
      parent.document.querySelector("html").setAttribute("style", "cursor: wait !important");

      if (saveMessage) {
        saveMessage.classList.add("warning");
        saveMessage.classList.add("visible");
        saveMessage.innerHTML = "Refreshing the page...";
      }
    });

    //Variables
    let scItemId = document.querySelector(".sc-pageeditbar").dataset.scItemid;
    let scSitename = document.querySelector(".sc-pageeditbar").dataset.scSitename;
    let scLanguage = document.querySelector(".sc-pageeditbar").dataset.scLanguage.toUpperCase();
    let scVersion = document.querySelector(".sc-pageeditbar").dataset.scVersion;
    let body = parent.document.querySelector("body");

    //Sitecore Tree iFrame
    document.querySelector("#scTreeIframe") ? document.querySelector("#scTreeIframe").remove() : false;
    let iframeTree = `<iframe loading="lazy" id="scTreeIframe" src="/sitecore/client/Applications/ExperienceEditor/Pages/NavigationTreeView.aspx?lang=${scLanguage}"></iframe>`;
    body && !document.querySelector("#scTreeIframe") ? body.insertAdjacentHTML("beforeend", iframeTree) : false;

    //Language iFrame
    parent.document.querySelector("#scLanguageIframe") ? parent.document.querySelector("#scLanguageIframe").remove() : false;
    let iframeLanguage = `<iframe loading="lazy" id="scLanguageIframe" src="/sitecore/client/Applications/ExperienceEditor/Pages/Galleries/SelectLanguageGallery.aspx?itemId=${scItemId}&pageSite=UK&database=master&la=${scLanguage}&vs=${scVersion}"></iframe>`;
    body && !document.querySelector("#scLanguageIframe") ? body.insertAdjacentHTML("beforeend", iframeLanguage) : false;

    //Version iFrame
    document.querySelector("#scVersionIframe") ? document.querySelector("#scVersionIframe").remove() : false;
    let iframeVersion = `<iframe loading="lazy" id="scVersionIframe" src="/sitecore/client/Applications/ExperienceEditor/Pages/Galleries/SelectVersionGallery.aspx?itemId=${scItemId}&pageSite=${scSitename}&database=master&la=${scLanguage}&vs=${scVersion}"></iframe>`;
    body && !document.querySelector("#scVersionIframe") ? body.insertAdjacentHTML("beforeend", iframeVersion) : false;

    //Settings iFrame
    document.querySelector("#scSettingsIframe") ? document.querySelector("#scSettingsIframe").remove() : false;
    let iframeSettings = `<iframe id="scSettingsIframe" src="/sitecore/shell/default.aspx?xmlcontrol=LayoutDetails&id=${scItemId}&la=${scLanguage}&vs=${scVersion}"></iframe>`;
    body && !document.querySelector("#scSettingsIframe") ? body.insertAdjacentHTML("beforeend", iframeSettings) : false;

    //Primary Bar with buttons
    let scSaveBar = `<div id="SaveTabs" class="scSaveBar scSaveBarEE">
        <div class="scActions">
            <button id="scPublishMenuMore" class="grouped" type="button"><span class="scPublishMenuMoreArrow">▾</span></button>
              <ul class="scPublishMenu scPublishMenuEE">             
                <li onclick="settingsPage()">Publishing settings...</li>
              </ul>
            <button class="scPublishButton primary primaryGrouped" onclick="publishPage()">Save and Publish</button>
            <button class="scSaveButton" onclick="savePage()">Save</button>
            <!--<button class="scSaveButton" onclick="changeDevicePreviewEE('mobile', 'v')">Preview</button>-->
            
            <div class="scBurgerMenuTitle">Content</div>
            <button id="scTreeButton" class="scMenu t-right t-sm" onclick="toggleTreePanel()" data-tooltip="Show Sitecore Tree"><img src="${global.iconMenu}" /></button>
            <button class="scAddPage t-right t-sm" onclick="addPage()" data-tooltip="Create a new page"><img src="${global.iconPencil}" /></button>
            </div>
    </div>`;

    //Secondary Bar with buttons
    let scEditorBar = `<div id="EditorTabs" class="EditorTabsEE">
    <div class="scEditorTabControlsHolder">
      <button class="scEditorHeaderButton" id="scLanguageButton" type="button" onclick="toggleLanguagePanel()"><img src="${global.iconLanguage}" class="scLanguageIcon"> ${scLanguage.toUpperCase()} ▾</button>
      <button class="scEditorHeaderButton" id="scVersionButton" type="button" onclick="toggleVersionPanel()"><img src="${global.iconVersion}" class="scLanguageIcon"> ${scVersion} ▾</button>
      <button class="scEditorHeaderButton" id="scMoreButton" title="More actions" type="button" onclick="toggleSettingsPanel()"><img src="${global.iconCog}" class="scLanguageIcon"></button>
      <button class="scAddComponent" onclick="addComponent()"><img src="${global.iconAdd}" /> ADD A COMPONENT</button>
    </div>
  </div>`;

    //Insert Save Bar
    let pageEditBar = document.querySelector("div[data-sc-id='PageEditBar']");
    document.querySelector(".scSaveBar") ? document.querySelector(".scSaveBar").remove() : false;
    pageEditBar ? pageEditBar.insertAdjacentHTML("afterend", scSaveBar + scEditorBar) : false;

    //Save mesasge
    let scSaveMessage = `<div class="saveMessage">Your changes have been saved successfully!</div>`;
    !document.querySelector(".saveMessage") ? document.querySelector("body").insertAdjacentHTML("afterbegin", scSaveMessage) : false;

    //Listener save button
    let target = document.querySelector("a[data-sc-id='QuickSave']");
    let observer = new MutationObserver(function () {
      if (target.classList.contains("disabled")) {
        document.querySelector(".scSaveBar .scSaveButton").disabled = true;
        document.querySelector(".scSaveBar .scSaveButton").innerText = "Save";
        document.querySelector(".scSaveBar .scPublishButton").innerText = "Save and Publish";
        document.querySelector(".scSaveBar .scSaveButton").removeAttribute("style");
      } else {
        document.querySelector(".scSaveBar .scSaveButton").disabled = false;
        document.querySelector(".scSaveBar .scSaveButton").innerText = "Save";
        document.querySelector(".scSaveBar .scPublishButton").innerText = "Save and Publish";
      }
    });

    //Observer UI
    target ? observer.observe(target, { attributes: true }) : false;

    //Listener to close all panels
    document.addEventListener("click", (event) => {
      closeAllPanelsEE(event);
      showPublishMenuMore(event);
    });
    parent.document.addEventListener("click", (event) => {
      closeAllPanelsEE(event);
    });

    //Get all placeholders and renderings
    ///sitecore/shell/default.aspx?xmlcontrol=DeviceEditor&de={FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}&id={25818957-9772-41d1-be0e-eee6fb7b4526}&vs=1&la=en
    // document.querySelectorAll("#Renderings table tr td:nth-child(2) b").forEach((item) => {
    //   console.log(item.innerText);
    // });
  }
};

/**
 * Close all EE panel - Utility function
 */
const closeAllPanelsEE = (event) => {
  if (
    event.path[0].id != "scLanguageButton" &&
    event.path[1].id != "scLanguageButton" &&
    event.path[0].id != "scVersionButton" &&
    event.path[1].id != "scVersionButton" &&
    event.path[0].id != "scMoreButton" &&
    event.path[1].id != "scMoreButton" &&
    event.path[0].id != "scTreeButton" &&
    event.path[1].id != "scTreeButton"
  ) {
    let iframeLanguage = parent.document.querySelector("#scLanguageIframe");
    iframeLanguage && iframeLanguage.classList.contains("open") ? iframeLanguage.classList.remove("open") : false;
    let iframeVersion = parent.document.querySelector("#scVersionIframe");
    iframeVersion && iframeVersion.classList.contains("open") ? iframeVersion.classList.remove("open") : false;
    // let iframeSettings = parent.document.querySelector("#scSettingsIframe");
    // iframeSettings && iframeSettings.classList.contains("open") ? iframeSettings.classList.remove("open") : false;
    let iframeTree = parent.document.querySelector("#scTreeIframe");
    iframeTree && iframeTree.classList.contains("open") ? iframeTree.classList.remove("open") : false;
  }
};

/**
 * Close all EE panel - Utility function
 */
const showPublishMenuMore = (event) => {
  if (document.querySelector(".scPublishMenu")) {
    let moreButton = document.querySelector("#scPublishMenuMore").getBoundingClientRect();
    let moreMenu = document.querySelector(".scPublishMenuEE");
    let posY = moreButton.top + moreButton.height;
    moreMenu.setAttribute("style", `top: ${posY}px !important;`);
    event.target.id == "scPublishMenuMore" || event.target.className == "scPublishMenuMoreArrow" ? document.querySelector(".scPublishMenu").classList.toggle("visible") : document.querySelector(".scPublishMenu").classList.remove("visible");
  }
};
