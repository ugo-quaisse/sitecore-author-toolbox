/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode, getScItemData, setTextColour } from "./helpers.js";

export {
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
};

/**
 * Insert Save bar
 */
const insertSavebar = () => {
  //If preview mode
  //<li onclick="javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor')">Edit in Experience Editor...</li>
  let scPrimaryBtn = global.hasModePreview
    ? `<button class="primary scExitButton" onclick="javascript:return scForm.invoke('contenteditor:closepreview', event)">Close Panel</button>`
    : `<button id="scPublishMenuMore" class="grouped" type="button">▾</button>
            <ul class="scPublishMenu">            
                <li onclick="javascript:return scForm.invoke('item:setpublishing', event)">Unpublish...</li>
                <li onclick="javascript:return scForm.postEvent(this,event,'item:publishingviewer(id=)')">Scheduler...</li>
            </ul>
            <button class="primary primaryGrouped" onclick="javascript:return scForm.postEvent(this,event,'item:publish(id=)')">Save and Publish</button>`;

  let scLiveyBtn = !global.hasModePreview
    ? `<button class="scPreviewButton" disabled>...</button>`
    : ``;

  //Save Bar
  let scSaveBar =
    `
    <div class="scSaveBar">
        <div class="scActions">
            ` +
    scPrimaryBtn +
    `
            <button class="scSaveButton" onclick="javascript:return scForm.invoke('contenteditor:save', event)">Save</button>
            ` +
    scLiveyBtn +
    `
        </div>
        <div class="scBreadcrumb"></div>
    </div>`;

  let contentEditor = document.querySelector("#ContentEditor");
  document.querySelector(".scSaveBar")
    ? document.querySelector(".scSaveBar").remove()
    : false;
  contentEditor
    ? contentEditor.insertAdjacentHTML("afterbegin", scSaveBar)
    : false;

  //Save mesasge
  let scSaveMessage = `<div class="saveMessage">Your changes have been saved successfully!</div>`;
  !document.querySelector(".saveMessage")
    ? document
        .querySelector("body")
        .insertAdjacentHTML("afterbegin", scSaveMessage)
    : false;
};

/**
 * Path to Breadcrumb
 */
const pathToBreadcrumb = (pathname, delimiter = "/", underline = true) => {
  let breadcrumb = "#####";

  if (pathname) {
    let path = pathname.toLowerCase() + "/";
    path = path.split("/home/");
    if (path[1] != undefined) {
      path = path[1].split("/");
      underline
        ? (breadcrumb +=
            '<u class="home" onclick="javascript:return scForm.invoke(\'contenteditor:home\', event)">Home</u> ')
        : (breadcrumb += "Home ");
    } else {
      path = path[0].split("/");
    }

    for (let level of path) {
      if (underline) {
        level != ""
          ? (breadcrumb +=
              "<i>" +
              delimiter +
              "</i> <u>" +
              level.toLowerCase().capitalize() +
              "</u> ")
          : false;
      } else {
        level != ""
          ? (breadcrumb +=
              "<i>" +
              delimiter +
              "</i> " +
              level.toLowerCase().capitalize() +
              " ")
          : false;
      }
    }
  }

  breadcrumb = breadcrumb
    .replace("#####<i>" + delimiter + "</i>", "")
    .replace("#####", "");

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
  let button =
    `<button class="scEditorHeaderButton" id="scLanguageButton" type="button"><img src="` +
    global.iconLanguage +
    `" class="scLanguageIcon"> ` +
    scLanguage +
    ` ▾</button>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  //Iframe
  document.querySelector("#scLanguageIframe")
    ? document.querySelector("#scLanguageIframe").remove()
    : false;
  let body = document.querySelector("body");
  let iframe =
    `<iframe loading="lazy" id="scLanguageIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Languages&id=` +
    scItemId +
    `&la=` +
    scLanguage +
    `&vs=` +
    scVersion +
    `&db=master"></iframe>`;
  body ? body.insertAdjacentHTML("beforeend", iframe) : false;

  //Scroll position
  //document.querySelector("#scLanguageIframe").contentWindow.document.body.querySelector(".scGalleryContent13").scrollTop = 0;

  //Hide old button
  document.querySelector(".scEditorTabControls")
    ? document.querySelector(".scEditorTabControls").remove()
    : false;
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

  let button =
    `<button class="scEditorHeaderButton" id="scMoreButton" title="More actions" type="button">
    <img src="` +
    global.iconMore +
    `" class="scLanguageIcon">
    </button>
    <ul class="scMoreMenu">
        <li onclick="javascript:return scForm.invoke('contenteditor:edit')" id="scLockMenuText">Lock item</li>
        <li onclick="javascript:if(confirm('Do you really want to create a new version for this item?')) { return scForm.postEvent(this,event,'item:addversion(id=)') }">Add new version</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:rename')">Rename item</li>
        <li onclick="javascript:return scForm.invoke('item:duplicate')">Duplicate</li>
        <li class="separator" onclick="javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor')">Edit in Experience Editor...</li>
        <li class="separator"  onclick="javascript:return scForm.postEvent(this,event,'item:sethelp')">Help texts</li>
        <li id="scInfoButton">Item details</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:executescript(id=` +
    ScItem.id +
    `,db=master,script={1876D433-4FAE-46B2-B2EF-AAA0FDA110E7},scriptDb=master)')">Author statistics</li>
        <li class="separator danger" onclick="javascript:return scForm.invoke('item:delete(id=` +
    ScItem.id +
    `)', event)">Delete</li>
    </ul>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  let panel = document.querySelector("#scPanel");
  let html =
    `<div class="content">
        <h2>Item details</h2>
        <h3>Item ID:</h3>
        ` +
    ScItem.id +
    `
        <h3>Name:</h3>
    ` +
    ScItem.name +
    `
        <h3>Path:</h3>
    ` +
    ScItem.path +
    `
        <h3>Template:</h3>
    ` +
    ScItem.template +
    `
        <h3>Template ID:</h3>
    ` +
    ScItem.templateId +
    `
        <h3>From:</h3>
    ` +
    ScItem.from +
    `
        <h3>Owner:</h3>
    ` +
    ScItem.owner +
    `
        <h3>Language:</h3>
    ` +
    ScItem.language +
    `
        <h3>Version:</h3>
    ` +
    ScItem.version +
    `
    </div>`;
  panel ? (panel.innerHTML = html) : false;

  document.querySelector(".scEditorTabControls")
    ? document.querySelector(".scEditorTabControls").remove()
    : false;
};

/**
 * Insert Version button
 */
const insertVersionButton = (scItemId, scLanguage = "EN", scVersion = 1) => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button =
    `<button class="scEditorHeaderButton" id="scVersionButton" type="button"><img src="` +
    global.iconVersion +
    `" class="scLanguageIcon"> ` +
    scVersion +
    ` ▾</button>`;
  container && scVersion != null
    ? container.insertAdjacentHTML("afterbegin", button)
    : false;

  //Iframe
  document.querySelector("#scVersionIframe")
    ? document.querySelector("#scVersionIframe").remove()
    : false;
  let body = document.querySelector("body");
  let iframe =
    `<iframe loading="lazy" id="scVersionIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Versions&id=` +
    scItemId +
    `&la=` +
    scLanguage +
    `&vs=` +
    scVersion +
    `&db=master"></iframe>`;
  body ? body.insertAdjacentHTML("beforeend", iframe) : false;

  document.querySelector(".scEditorTabControls")
    ? document.querySelector(".scEditorTabControls").remove()
    : false;
};

/**
 * Insert Navigator button
 */
const insertNavigatorButton = () => {
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button =
    `<button class="scEditorHeaderButton" id="scNavigatorButton" type="button"><img src="` +
    global.iconNotebook +
    `" class="scLanguageIcon"> ▾</button>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  document.querySelector(".scEditorTabControls")
    ? document.querySelector(".scEditorTabControls").remove()
    : false;
};

/**
 * Insert Lock button
 */
const insertLockButton = (locked = false) => {
  let icon = locked == false ? global.iconUnlocked : global.iconLocked;
  let container = document.querySelector(".scEditorTabControlsHolder");
  let button =
    `<button onclick="javascript:return scForm.postEvent(this,event,'item:checkout')" class="scEditorHeaderButton" id="scLockButton" title="Lock this item" type="button"><img src="` +
    icon +
    `" class="scLanguageIcon"></button>`;
  container ? container.insertAdjacentHTML("afterbegin", button) : false;

  document.querySelector(".scEditorTabControls")
    ? document.querySelector(".scEditorTabControls").remove()
    : false;
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
  let color, text, brightness;
  let storage = localStorage.getItem("scColorPicker");
  if (storage) {
    color = storage;
    text = setTextColour(color);
    text == "#ffffff" ? (brightness = 10) : (brightness = 0);

    let root = document.documentElement;
    root.style.setProperty("--accent", color);
    root.style.setProperty("--accentText", text);
    root.style.setProperty("--accentBrightness", brightness);
  } else {
    color = "#ee3524"; //red
  }

  return color;
};

/**
 * Init Color Picker
 */
const initColorPicker = () => {
  let color, text, brightness;

  let input =
    '<input type="color" id="scAccentColor" name="scAccentColor" value="' +
    getAccentColor() +
    '" title="Choose your accent color">';
  let menu = document.querySelector(".sc-accountInformation");
  menu ? menu.insertAdjacentHTML("afterbegin", input) : false;

  //Listenenr on change
  let colorPicker = document.querySelector("#scAccentColor");
  if (colorPicker) {
    colorPicker.addEventListener("change", () => {
      color = colorPicker.value;
      text = setTextColour(color);
      text == "#ffffff" ? (brightness = 10) : (brightness = 0);

      //Root
      let root = document.documentElement;
      root.style.setProperty("--accent", color);
      root.style.setProperty("--accentText", text);
      root.style.setProperty("--accentBrightness", brightness);

      //Iframes
      document.querySelectorAll("iframe").forEach(function (e) {
        let iframe = e.contentWindow.document.documentElement;
        iframe.style.setProperty("--accent", color);
        iframe.style.setProperty("--accentText", text);
        iframe.style.setProperty("--accentBrightness", brightness);
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
    let dialogParamsLarge =
      "center:yes; help:no; resizable:yes; scroll:yes; status:no; dialogMinHeight:200; dialogMinWidth:300; dialogWidth:1100; dialogHeight:700; header:";

    //Add app name
    let htmlApp = `<div class="sc-globalheader-appName">Content Editor</div>`;
    startButton ? startButton.insertAdjacentHTML("afterend", htmlApp) : false;

    //Add Notification and arrow icons
    let htmlIcon =
      `<img loading="lazy" title="No notification in your workbox" id="scNotificationBell" onclick="javascript:scSitecore.prototype.showModalDialog('` +
      global.workboxPage.replace("&sc_bw=1", "&sc_bw=0") +
      `', '', '` +
      dialogParamsLarge +
      `Workbox', null, null); false" src="` +
      global.iconBell +
      `" class="scIconMenu" accesskey="w"/>
        <img loading="lazy" title="Show ribbon" id="scSitecoreMenu" onclick="showSitecoreMenu()" src="` +
      global.iconDownArrow +
      `" class="scIconMenu" accesskey="a" />`;
    accountInformation.insertAdjacentHTML("afterbegin", htmlIcon);

    //Get User Name and add extra id to avatar
    let accountUser = accountInformation
      .querySelectorAll("li")[1]
      .innerText.trim();
    accountInformation.querySelector("li").remove();
    accountInformation.querySelector(
      "li"
    ).innerHTML = accountInformation.querySelector("li > img").outerHTML;
    accountInformation
      .querySelector("li > img")
      .setAttribute("id", "globalHeaderUserPortrait");

    //Generate menu
    let htmlMenu =
      `
        <ul class="scAccountMenu">
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
          ? document
              .querySelector(".scAccountMenu")
              .setAttribute(
                "style",
                "visibility: visible; top: 50px; opacity: 1;"
              )
          : document
              .querySelector(".scAccountMenu")
              .setAttribute(
                "style",
                "visibility: hidden; top: 40px; opacity: 0;"
              );
      });
    }

    if (document.querySelector("#DesktopLinks")) {
      document.querySelector("#DesktopLinks").addEventListener("click", () => {
        document
          .querySelector(".scAccountMenu")
          .setAttribute("style", "visibility: hidden; top: 40px; opacity: 0;");
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
  let active = document.querySelector(".scContentTreeNodeActive")
    ? document
        .querySelector(".scContentTreeNodeActive")
        .id.replace("Tree_Node_", "")
    : false;
  let activeClass = "";
  id == active ? (activeClass = "scInsertItemIconInverted") : false;

  //Span text around a div to support text-overflow elipsis
  //a.querySelector("span").innerHTML = itemIcon.outerHTML + `<div class="scItemName">` + itemName + `</div>`;

  //Remove existing Insert Icons
  document.querySelectorAll(".scInsertItemIcon").forEach((el) => {
    el.remove();
  });
  //Add Insert Icon
  a.insertAdjacentHTML(
    "afterend",
    `<span id="scIcon` +
      id +
      `" title="Insert under this node" class="scInsertItemIcon ` +
      activeClass +
      `" onclick="insertPage('` +
      id +
      `', '` +
      itemName +
      `')"></span>`
  );
  let target = document.querySelector("#scIcon" + id);
  target ? target.setAttribute("style", "opacity:1") : false;

  //Listener when hover scInsertItemIcon
  document
    .querySelector(".scInsertItemIcon")
    .addEventListener("mouseenter", function () {
      let parent = document
        .querySelector(".scInsertItemIcon")
        .parentNode.querySelector("a > span");
      parent.setAttribute("style", "background-color: var(--grey5)");
    });
  document
    .querySelector(".scInsertItemIcon")
    .addEventListener("mouseleave", function () {
      let parent = document
        .querySelector(".scInsertItemIcon")
        .parentNode.querySelector("a > span");
      parent.setAttribute("style", "");
    });

  //Remove existing Edit Icons
  document.querySelectorAll(".scEditItemIcon").forEach((el) => {
    el.remove();
  });
  //Add Edit icon
  a.insertAdjacentHTML(
    "afterend",
    `<span id="scIconEE` +
      id +
      `" title="Edit in Experience Editor" class="scEditItemIcon ` +
      activeClass +
      `" onclick="javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor(id={` +
      id.replace(
        // eslint-disable-next-line prefer-named-capture-group
        /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/u,
        "$1-$2-$3-$4-$5"
      ) +
      `})')"></span>`
  );
  target = document.querySelector("#scIconEE" + id);
  target ? target.setAttribute("style", "opacity:1") : false;

  //Listener when hover scEditItemIcon
  document
    .querySelector(".scEditItemIcon")
    .addEventListener("mouseenter", function () {
      let parent = document
        .querySelector(".scEditItemIcon")
        .parentNode.querySelector("a > span");
      parent.setAttribute("style", "background-color: var(--grey5)");
    });
  document
    .querySelector(".scEditItemIcon")
    .addEventListener("mouseleave", function () {
      let parent = document
        .querySelector(".scEditItemIcon")
        .parentNode.querySelector("a > span");
      parent.setAttribute("style", "");
    });
};

/**
 * Init Insert Icon
 */
const initInsertIcon = () => {
  let contentTree = document.querySelector(".scContentTree");
  let treeNode = document.querySelector(".scContentTreeContainer");
  if (treeNode) {
    treeNode.addEventListener("mouseover", (event) => {
      if (
        event.path[1].className == "scContentTreeNodeNormal" ||
        event.path[1].className == "scContentTreeNodeActive"
      ) {
        setInsertIcon(event.path[1].getAttribute("id"));
      }
      if (
        event.path[2].className == "scContentTreeNodeNormal" ||
        event.path[2].className == "scContentTreeNodeActive"
      ) {
        setInsertIcon(event.path[2].getAttribute("id"));
      }
    });

    contentTree.addEventListener("mouseleave", () => {
      document.querySelector(".scInsertItemIcon")
        ? document
            .querySelector(".scInsertItemIcon")
            .setAttribute("style", "opacity:0")
        : false;
      document.querySelector(".scEditItemIcon")
        ? document
            .querySelector(".scEditItemIcon")
            .setAttribute("style", "opacity:0")
        : false;
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
