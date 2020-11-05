/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode, getScItemData, setTextColour } from "./helpers.js";

export {
  initExperimentalUi,
  insertSavebar,
  insertBreadcrumb,
  insertLanguageButton,
  insertVersionButton,
  insertMoreButton,
  insertNavigatorButton,
  insertLockButton,
  pathToBreadcrumb,
  initInsertIcon,
  getAccentColor,
  initColorPicker,
  initSitecoreMenu,
  initUserMenu,
  initGutter,
  getParentNode,
  initContrastedIcons,
  initSvgAnimation,
  initEventListeners,
};

/**
 * Init Experimental UI
 */
const initExperimentalUi = (storage) => {
  //Hide search
  let SearchPanel = document.querySelector("#SearchPanel");
  //prettier-ignore
  SearchPanel ? (SearchPanel.innerHTML = `<button class="scMenuButton" type="button"><img src="` + global.iconMenu + `" class="scBurgerMenu"/></button> <div class="scBurgerMenuTitle t-top t-sm" data-tooltip="Go back home" onclick="javascript:return scForm.invoke('contenteditor:home', event)" title="Go back Home">Content</div>`) : false;

  //Load CSS
  if (storage.feature_experimentalui) {
    document.body.classList.add("experimentalui");
    getAccentColor();
  }
  if (storage.feature_contrast_icons === false) {
    document.documentElement.style.setProperty("--iconBrightness", 1);
    document.documentElement.style.setProperty("--iconContrast", 1);
  }
};

/**
 * Insert Save bar
 */
const insertSavebar = () => {
  //If preview mode
  let scPrimaryBtn = global.hasModePreview
    ? `<button class="primary scExitButton" onclick="javascript:return scForm.invoke('contenteditor:closepreview', event)">Close Panel</button>`
    : `<button id="scPublishMenuMore" class="grouped" type="button">▾</button>
            <ul class="scPublishMenu">             
            <li onclick="javascript:return scForm.invoke('item:setpublishing', event)">Unpublish...</li>
            <li onclick="javascript:return scForm.postEvent(this,event,'item:publishingviewer(id=)')">Scheduler...</li>
            <li onclick="javascript:return scForm.invoke('item:publishnow', event)">Quick Publish...</li>  
            </ul>
            <button class="primary primaryGrouped" onclick="javascript:return scForm.postEvent(this,event,'item:publish(id=)')">Save and Publish</button>`;

  let scLiveyBtn = !global.hasModePreview ? `<button class="scPreviewButton" onclick="javascript:return scForm.invoke('contenteditor:preview', event)">Preview</button>` : ``;

  //Save Bar
  //prettier-ignore
  let scSaveBar =
    `<div class="scSaveBar">
        <div class="scActions">
            ` + scPrimaryBtn + `
            <button class="scSaveButton" onclick="javascript:return scForm.invoke('contenteditor:save', event)">Save</button>
            ` + scLiveyBtn + `
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
const pathToBreadcrumb = (pathname, delimiter = "/", underline = true) => {
  let breadcrumb = "#####";
  let count = 0;
  let elipsis = false;

  if (pathname) {
    let path = pathname.toLowerCase() + "/";
    path = path.split("/home/");
    if (path[1] != undefined) {
      path = path[1].split("/");
      underline ? (breadcrumb += '<u class="home" onclick="javascript:return scForm.invoke(\'contenteditor:home\', event)">Home</u> ') : (breadcrumb += "Home ");
    } else {
      path = path[0].split("/");
    }

    for (let level of path) {
      count++;
      if (path.length > 8 && count > 3 && count < path.length - 2) {
        if (!elipsis) {
          level != "" ? (breadcrumb += "<i>" + delimiter + "</i> [...] ") : false;
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
  document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Insert More button
 */
const insertMoreButton = () => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let ScItem = getScItemData();
  // let button = `
  // <button class="scEditorHeaderButton" id="scInfoButton" title="Quick Info" type="button">
  // <img src="` + global.iconInfo + `" class="scLanguageIcon">
  // </button>`;

  //prettier-ignore
  let button =
    `<button class="scEditorHeaderButton" id="scMoreButton" title="More actions" type="button">
    <img src="` +
    global.iconMore +
    `" class="scLanguageIcon">
    </button>
    <ul class="scMoreMenu">
        <li onclick="javascript:if(confirm('Do you really want to create a new version for this item?')) { return scForm.postEvent(this,event,'item:addversion(id=)') }">Add new version</li>
        <li onclick="javascript:return scForm.invoke('contenteditor:edit')" id="scLockMenuText">Lock item</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:rename')">Rename item</li>
        <li onclick="javascript:return scForm.invoke('item:duplicate')">Duplicate</li>
        <li class="separator" onclick="javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor')">Edit in Experience Editor...</li>
        <li class="separator" onclick="javascript:return scForm.postEvent(this,event,'item:sethelp')">Help texts</li>
        <li id="scInfoButton">Item details</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:executescript(id=` +
    ScItem.id +
    `,db=master,script={1876D433-4FAE-46B2-B2EF-AAA0FDA110E7},scriptDb=master)')">Author statistics</li>
        <li class="separator danger" onclick="javascript:return scForm.invoke('item:delete(id=` +
    ScItem.id +
    `)', event)">Delete</li>
    </ul>`;
  container && !document.querySelector("#scMoreButton") ? container.insertAdjacentHTML("afterbegin", button) : false;

  let panel = document.querySelector("#scPanel");
  //prettier-ignore
  let html =
    `<div class="content">
      <h2>Item details</h2>
      <h3>Item ID:</h3> ` + ScItem.id + `
      <h3>Name:</h3> ` + ScItem.name + `
      <h3>Path:</h3> ` + ScItem.path + `
      <h3>Template:</h3> ` + ScItem.template + `
      <h3>Template ID:</h3> ` + ScItem.templateId + `
      <h3>From:</h3> ` + ScItem.from + `
      <h3>Owner:</h3> ` + ScItem.owner + `
      <h3>Language:</h3> ` + ScItem.language + `
      <h3>Version:</h3> ` + ScItem.version + `
    </div>`;
  panel ? (panel.innerHTML = html) : false;

  document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Insert Version button
 */
const insertVersionButton = (scItemId, scLanguage = "EN", scVersion = 1) => {
  //Button
  let container = document.querySelector(".scEditorTabControlsHolder");
  //prettier-ignore
  let button = `<button class="scEditorHeaderButton" id="scVersionButton" type="button"><img src="` + global.iconVersion + `" class="scLanguageIcon"> ` + scVersion + ` ▾</button>`;
  container && !document.querySelector("#scVersionButton") && scVersion != null ? container.insertAdjacentHTML("afterbegin", button) : false;

  //Iframe
  document.querySelector("#scVersionIframe") ? document.querySelector("#scVersionIframe").remove() : false;
  let body = document.querySelector("body");
  //prettier-ignore
  let iframe = `<iframe loading="lazy" id="scVersionIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Versions&id=` + scItemId + `&la=` + scLanguage + `&vs=` + scVersion + `&db=master"></iframe>`;
  body && !document.querySelector("#scVersionIframe") ? body.insertAdjacentHTML("beforeend", iframe) : false;

  //Remove old button
  document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Insert Navigator button
 */
const insertNavigatorButton = () => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button = `<button class="scEditorHeaderButton" id="scNavigatorButton" type="button"><img src="` + global.iconNotebook + `" class="scLanguageIcon"> ▾</button>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Insert Lock button
 */
const insertLockButton = (locked = false) => {
  let icon = locked === false ? global.iconUnlocked : global.iconLocked;
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button = `<button onclick="javascript:return scForm.postEvent(this,event,'item:checkout')" class="scEditorHeaderButton" id="scLockButton" title="Lock this item" type="button"><img src="` + icon + `" class="scLanguageIcon"></button>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;
};

/**
 * Init Sitecore ribbon
 */
const initSitecoreMenu = () => {
  let storage = localStorage.getItem("scSitecoreMenu");
  let dock = document.querySelector(".scDockTop");
  let icon = document.querySelector("#scSitecoreMenu");

  if (storage == "true") {
    dock ? dock.classList.add("showSitecoreMenu") : false;
    icon ? icon.classList.add("scSitecoreMenu") : false;
  } else {
    dock ? dock.classList.remove("showSitecoreMenu") : false;
    icon ? icon.classList.remove("scSitecoreMenu") : false;
  }
};

/**
 * Get Accent Color
 */
const getAccentColor = () => {
  let color, text, brightness, invert;
  let storage = localStorage.getItem("scColorPicker");
  let root = document.documentElement;

  if (storage) {
    color = storage;
    text = setTextColour(color);
    text == "#ffffff" ? (brightness = 10) : (brightness = 0);
    text == "#ffffff" ? (invert = 1) : (invert = 0);

    root.style.setProperty("--accent", color);
    root.style.setProperty("--accentText", text);
    root.style.setProperty("--accentBrightness", brightness);
    root.style.setProperty("--accentInvert", invert);
  } else {
    color = "#ee3524"; //red
    root.style.setProperty("--accent", "#ee3524");
    root.style.setProperty("--accentText", "#ffffff");
    root.style.setProperty("--accentBrightness", 50);
    root.style.setProperty("--accentInvert", 1);
  }

  return color;
};

/**
 * Init Color Picker
 */
const initColorPicker = () => {
  let color, text, brightness, invert;

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
      text == "#ffffff" ? (brightness = 10) : (brightness = 0);
      text == "#ffffff" ? (invert = 1) : (invert = 0);

      //Root
      let root = document.documentElement;
      root.style.setProperty("--accent", color);
      root.style.setProperty("--accentText", text);
      root.style.setProperty("--accentBrightness", brightness);
      root.style.setProperty("--accentInvert", invert);

      //Iframes
      document.querySelectorAll("iframe").forEach(function (e) {
        let iframe = e.contentWindow.document.documentElement;
        iframe.style.setProperty("--accent", color);
        iframe.style.setProperty("--accentText", text);
        iframe.style.setProperty("--accentBrightness", brightness);
        iframe.style.setProperty("--accentInvert", invert);
      });

      localStorage.setItem("scColorPicker", color);
    });
  }
};

/**
 * Init Sitecore User Menu
 */
const initUserMenu = () => {
  let accountInformation = document.querySelector(".sc-accountInformation");
  let startButton = document.querySelector(".sc-globalHeader-startButton");

  if (accountInformation) {
    let dialogParamsLarge = "center:yes; help:no; resizable:yes; scroll:yes; status:no; dialogMinHeight:200; dialogMinWidth:300; dialogWidth:1100; dialogHeight:700; header:";

    //Add app name
    let htmlApp = `<div class="sc-globalheader-appName" onclick="javascript:return scForm.invoke('contenteditor:home', event)">Content Editor</div>`;
    startButton ? startButton.insertAdjacentHTML("afterend", htmlApp) : false;

    //Add Notification and arrow icons
    //prettier-ignore
    let htmlIcon =
      `<span class="t-bottom t-sm" data-tooltip="Workbox notification"><img loading="lazy" id="scNotificationBell" onclick="javascript:scSitecore.prototype.showModalDialog('` + global.workboxPage.replace("&sc_bw=1", "&sc_bw=0") + `', '', '` + dialogParamsLarge + `Workbox', null, null); false" src="` + global.iconBell + `" class="scIconMenu" accesskey="w" /></span>
       <span class="t-bottom t-sm" data-tooltip="Toggle ribbon"><img loading="lazy" id="scSitecoreMenu" onclick="showSitecoreMenu()" src="` + global.iconDownArrow + `" class="scIconMenu" accesskey="a" /></span>`;
    accountInformation.insertAdjacentHTML("afterbegin", htmlIcon);

    //Get User Name and add extra id to avatar
    let accountUser = accountInformation.querySelectorAll("li")[1].innerText.trim();
    accountInformation.querySelector("li").remove();
    accountInformation.querySelector("li").innerHTML = accountInformation.querySelector("li > img").outerHTML;
    accountInformation.querySelector("li > img").setAttribute("id", "globalHeaderUserPortrait");

    //Generate menu
    let htmlMenu =
      `<ul class="scAccountMenu">
        <li onclick="javascript:return scForm.invoke('item:myitems', event)">My locked items</li>    
        <li onclick="javascript:return scForm.invoke('preferences:changeuserinformation', event)">My account (` +
      accountUser +
      `)</li>
            <li onclick="javascript:return scForm.invoke('security:changepassword', event) ">Change Password</li>
            <li onclick="javascript:return scForm.invoke('shell:useroptions', event)">Application Options</li>
            <li onclick="window.open('` +
      global.launchpadPage +
      `')">Sitecore Author Toolbox Options</li>
            <li onclick="javascript:return scForm.invoke('preferences:changeregionalsettings', event)">Region and Languages</li>
            <li onclick="javascript:return scForm.invoke('system:showlicenses', event)">Licences</li>
            <li onclick="javascript:return scForm.invoke('system:showabout', event)">Licence details</li>
            <li onclick="javascript:return scForm.invoke('contenteditor:close', event)">Log out</li>
        </ul>`;
    accountInformation.insertAdjacentHTML("afterbegin", htmlMenu);

    //Listeners
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "Shift") {
        exeJsCode(`showSitecoreMenu()`);
        event.preventDefault();
        event.stopPropagation();
      }
    });

    //Events
    if (document.querySelector(".scAccountMenu")) {
      document.addEventListener("click", (event) => {
        event.srcElement.id == "globalHeaderUserPortrait"
          ? document.querySelector(".scAccountMenu").setAttribute("style", "visibility: visible; top: 50px; opacity: 1;")
          : document.querySelector(".scAccountMenu").setAttribute("style", "visibility: hidden; top: 40px; opacity: 0;");
      });
    }

    if (document.querySelector("#DesktopLinks")) {
      document.querySelector("#DesktopLinks").addEventListener("click", () => {
        document.querySelector(".scAccountMenu").setAttribute("style", "visibility: hidden; top: 40px; opacity: 0;");
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

  //Span text around a div to support text-overflow elipsis
  //a.querySelector("span").innerHTML = itemIcon.outerHTML + `<div class="scItemName">` + itemName + `</div>`;

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
 * Init Insert Icon
 */
const initInsertIcon = () => {
  let contentTree = document.querySelector(".scContentTree");
  let treeNode = document.querySelector(".scContentTreeContainer");
  let node, nodeIcon, nodeContent;
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
      //Updating html structure to allow text-overflow and avoid icons overlap
      if (node && !node.classList.contains("scNoOverlap")) {
        nodeIcon = node.querySelector("span > img").src;
        nodeContent = node.querySelector("span").innerText;
        node.querySelector("span").innerHTML = `<img src="` + nodeIcon + `" width="16" height="16" class="scContentTreeNodeIcon" alt="" border="0"><div>` + nodeContent + `</div>`;
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
 * Insert Gutter
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
 * Init contrasted Icons
 */
const initContrastedIcons = (storage) => {
  if (storage.feature_contrast_icons === false) {
    document.documentElement.style.setProperty("--iconBrightness", 1);
    document.documentElement.style.setProperty("--iconContrast", 1);
  }
};

/**
 * Init contrasted Icons
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
      event.target.id == "scPublishMenuMore" ? document.querySelector(".scPublishMenu").classList.toggle("visible") : document.querySelector(".scPublishMenu").classList.remove("visible");
    }

    //More menu
    if (document.querySelector(".scMoreMenu")) {
      event.target.id == "scMoreButton" || event.path[1].id == "scMoreButton" ? document.querySelector(".scMoreMenu").classList.toggle("visible") : document.querySelector(".scMoreMenu").classList.remove("visible");
    }

    //Quick Info panel
    if (document.querySelector("#scInfoButton")) {
      event.target.id == "scInfoButton" || event.path[1].id == "scInfoButton" || event.target.id == "scPanel" || event.path[0].className == "content" ? scPanel.classList.toggle("open") : scPanel.classList.remove("open");
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
