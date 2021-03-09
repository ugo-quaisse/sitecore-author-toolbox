/* eslint-disable newline-per-chained-call */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import * as icons from "./icons.js";
import { getMaterializeIcon, getScItemData, setTextColour } from "./helpers.js";
// import { getFiltersCss } from "./colors.js";

export {
  initOnboarding,
  initExperimentalUi,
  insertSavebar,
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
    document.body ? document.body.classList.add("satExperimentalUi") : false;
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
    ? `<button class="primary scExitButton" onclick="javascript:return scForm.invoke('contenteditor:closepreview', event)">Close Panel</button>`
    : `<button id="scPublishMenuMore" class="grouped" type="button"><span class="scPublishMenuMoreArrow">▾</span></button>
          <ul class="scPublishMenu">             
            <li onclick="javascript:return scForm.invoke('item:setpublishing', event)">Unpublish...</li>
            <li onclick="javascript:return scForm.postEvent(this,event,'item:publishingviewer(id=)')">Scheduler...</li>
            <li onclick="javascript:return scForm.invoke('item:publishnow', event)">Quick Publish...</li>  
          </ul>
        <button class="primary primaryGrouped" onclick="javascript:return scForm.postEvent(this,event,'item:publish(id=)')">Save and Publish</button>`;

  let scPreviewBtn = !global.hasModePreview && getScItemData().path.includes("/home") ? `<button class="scPreviewButton" onclick="javascript:return scForm.invoke('contenteditor:preview', event)">Preview</button>` : ``;

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
const pathToBreadcrumb = (pathname, delimiter = "", underline = true) => {
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
        ? (breadcrumb += `<i>${delimiter}</i> <u class="scBreadcrumbHome" onclick="getParentNode(` + path.length + `);">${site.capitalize()}</u> <i>${delimiter}</i> <u onclick="getParentNode(` + (path.length - 1) + `);">Home</u> `)
        : (breadcrumb += `<i>${delimiter}</i> ${site.capitalize()} <i>${delimiter}</i> Home `);
    } else {
      path = path[0].split("/");
    }

    for (let level of path) {
      count++;
      if (path.length > 8 && count > 3 && count < path.length - 2) {
        if (!elipsis) {
          level != "" ? (breadcrumb += "<i>" + delimiter + "</i> ... ") : false;
          elipsis = true;
        }

        // eslint-disable-next-line no-continue
        continue;
      }

      if (underline) {
        level != "" ? (breadcrumb += `<i>` + delimiter + `</i> <u onclick="getParentNode(` + (path.length - count - 1) + `, '` + global.tabLoadingTitle + `');">` + level.toLowerCase().capitalize() + `</u> `) : false;
      } else {
        level != "" ? (breadcrumb += `<i>` + delimiter + `</i> ` + level.toLowerCase().capitalize() + ` `) : false;
      }
    }
  }

  breadcrumb = breadcrumb.replace(`#####<i>` + delimiter + `</i>`, ``).replace(`#####`, ``);

  return breadcrumb;
};

/**
 * Insert Breadcrumb
 */
const insertBreadcrumb = (path) => {
  let breadcrumb = pathToBreadcrumb(path);
  let scBreadcrumb = document.querySelector(".scBreadcrumb");
  scBreadcrumb && path ? (scBreadcrumb.innerHTML = breadcrumb) : false;
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
  let iframe = `<iframe loading="lazy" id="scLanguageIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Languages&id=` + scItemId + `&la=` + scLanguage + `&vs=` + scVersion + `&db=master"></iframe>`;
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
  let button =
    `<button class="scEditorHeaderButton" id="scMoreButton" title="More actions" type="button">
    <img src="${global.iconMore}" class="scLanguageIcon">
    </button>
    <ul class="scMoreMenu">
        <li onclick="javascript:if(confirm('Do you really want to create a new version for this item?')) { return scForm.postEvent(this,event,'item:addversion(id=)') }">Add new version</li>
        <li onclick="javascript:return scForm.invoke('contenteditor:edit')" id="scLockMenuText">Lock item</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:rename')">Rename item</li>
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

  //document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
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
  let a = document.querySelector("#Tree_Node_" + id);
  let itemName = a.querySelector("span").innerText;
  let active = document.querySelector(".scContentTreeNodeActive") ? document.querySelector(".scContentTreeNodeActive").id.replace("Tree_Node_", "") : false;
  let activeClass = "";
  id == active ? (activeClass = "scInsertItemIconInverted") : false;

  //Remove existing Insert Icons
  document.querySelectorAll(".scInsertItemIcon").forEach((el) => {
    el.remove();
  });
  //Add Insert Icon
  //prettier-ignore
  a.insertAdjacentHTML("afterend", `<span id="scIcon` + id + `" class="scInsertItemIcon ` + activeClass + ` t-left t-sm" data-tooltip="Insert" onclick="insertPage('` + id + `', '` + itemName + `')"></span>`
  );
  let target = document.querySelector("#scIcon" + id);
  target ? target.setAttribute("style", "opacity:1") : false;

  //Listener when hover scInsertItemIcon
  document.querySelector(".scInsertItemIcon").addEventListener("mouseenter", function () {
    let parent = document.querySelector(".scInsertItemIcon").parentNode.querySelector("a > span");
    parent.setAttribute("style", "background-color: var(--grey5)");
  });
  document.querySelector(".scInsertItemIcon").addEventListener("mouseleave", function () {
    let parent = document.querySelector(".scInsertItemIcon").parentNode.querySelector("a > span");
    parent.setAttribute("style", "");
  });

  //Remove existing Edit Icons
  document.querySelectorAll(".scEditItemIcon").forEach((el) => {
    el.remove();
  });
  //Add Edit icon
  //prettier-ignore
  a.insertAdjacentHTML("afterend", `<span id="scIconEE` + id + `" class="scEditItemIcon ` + activeClass + ` t-left t-sm" data-tooltip="Edit in Experience Editor" onclick="javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor(id={` +
        id.replace(
        // eslint-disable-next-line prefer-named-capture-group
        /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/u,
        "$1-$2-$3-$4-$5") + `})')"></span>`
  );
  target = document.querySelector("#scIconEE" + id);
  target ? target.setAttribute("style", "opacity:1") : false;

  //Listener when hover scEditItemIcon
  document.querySelector(".scEditItemIcon").addEventListener("mouseenter", function () {
    let parent = document.querySelector(".scEditItemIcon").parentNode.querySelector("a > span");
    parent.setAttribute("style", "background-color: var(--grey5)");
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

      // if (event.path[1].classList.contains("scContentTreeNodeNormal") || event.path[1].classList.contains("scContentTreeNodeActive")) {
      //   node = event.path[1];
      // }
      // if (event.path[2].classList.contains("scContentTreeNodeNormal") || event.path[2].classList.contains("scContentTreeNodeActive")) {
      //   node = event.path[2];
      // }
      // //Updating html structure to allow text-overflow and avoid icons overlap
      // if (node.classList.contains("scNoOverlap")) {
      //   nodeIcon = node.querySelector("span > img").src;
      //   nodeContent = node.querySelector("span").innerText;
      //   node.querySelector("span").innerHTML =
      //     `<img src="` + nodeIcon + `" width="16" height="16" class="scContentTreeNodeIcon" alt="" border="0">` + nodeContent;
      //   node.classList.remove("scNoOverlap");
      // }
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
const initSvgAnimation = () => {
  let svgAnimation = `<div id="svgAnimation">` + global.svgAnimation + `</div>`;
  document.querySelector("#EditorFrames") ? document.querySelector("#EditorFrames").insertAdjacentHTML("beforebegin", svgAnimation) : false;
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
    scLanguageIframe ? scLanguageIframe.setAttribute("style", "top: " + topPos + "px !important") : false;
    scVersionIframe ? scVersionIframe.setAttribute("style", "top: " + topPos + "px !important") : false;

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
  if (dock.classList.contains("showSitecoreRibbon") && document.querySelector(".titleBarDesktop")) {
    document.querySelector(".titleBarDesktop").classList.add("hide");
  } else if (document.querySelector(".titleBarDesktop")) {
    document.querySelector(".titleBarDesktop").classList.remove("hide");
  }
};

/**
 * Replace Glyph Images
 */
const replaceIcons = (storage) => {
  if (storage.feature_experimentalui === true && storage.feature_material_icons === true) {
    let imgGlyph = document.querySelectorAll(
      ".icon, .glyph, .scNavButton, .item-icon, .sc-breadcrumb-item-path > img, .scContentControlLayoutDeviceName > img, .scRendering > img, .scTabContent img, .scContentTreeNodeGlyph, .scContentTreeNodeIcon, #scModal .main img, .scInstantSearchResults img, .dynatree-container img, .dynatree-node > img, .scTabs .scImageContainer > img, form[action*='Gallery'] img, form[action*='Media'] .scFolderButtons img, .scPopup .scMenuItemIcon > img, .satEE .scChromeCommand > img"
    );
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
    observer = new MutationObserver(function () {
      replaceIcons(storage);
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
