/* eslint-disable require-jsdoc */
/* eslint-disable default-param-last */
/* eslint-disable consistent-return */
/* eslint-disable newline-before-return */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-array-constructor */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-mixed-operators */
/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

/**
 * Overwrtting Sitecore scSaveAnimation function
 */
function scSaveAnimation(id) {
  var indicator = document.createElement("div");
  indicator.id = "saveAnimation";
  document.body.appendChild(indicator);
  setTimeout(function () {
    indicator.remove();
  }, 1000);

  if (document.querySelector(".scSaveButton")) {
    let saveMessage = document.querySelector(".saveMessage");
    let saveButton = document.querySelector(".scSaveButton");
    // saveMessage.classList.remove("success");
    // saveMessage.innerHTML = "Saving...";
    // saveMessage.classList.add("visible");
    saveButton.innerText = "Saving...";
    saveButton.setAttribute("disabled", true);

    setTimeout(function () {
      saveMessage.classList.add("success");
      saveMessage.classList.add("visible");
      saveMessage.innerHTML = "Saved successfully";
      saveButton.innerText = "Save";
      saveButton.removeAttribute("disabled");
    }, 800);

    setTimeout(function () {
      saveMessage.classList.remove("visible");
    }, 2500);
  }
}

const copyTranslate = (leftElemId, rightElemId) => {
  var left = document.querySelector("#" + leftElemId);
  var right = document.querySelector("#" + rightElemId);
  left.value = right.value;
};

const copyTranslateAll = () => {
  var scTranslateRTL = document.querySelectorAll(".scTranslateRTL");
  for (var field of scTranslateRTL) {
    field.click();
  }
};

const toggleRibbon = () => {
  var scCrossPiece = document.querySelector("#scCrossPiece");
  var scWebEditRibbon = document.querySelector("#scWebEditRibbon");
  var scExpTab = document.querySelector(".scExpTab");
  var tabText = scExpTab.querySelector(".tabText");

  var scWebEditRibbonStatus = scWebEditRibbon.getAttribute("style");

  if (scWebEditRibbonStatus != "display:none !important") {
    scCrossPiece.setAttribute("style", "height:0px !important");
    scWebEditRibbon.setAttribute("style", "display:none !important");
    tabText.innerText = "▼ Show";
  } else {
    //scCrossPiece.setAttribute("style", "height:300px !important");
    scWebEditRibbon.setAttribute("style", "display:block !important");
    tabText.innerText = "▲ Hide";
  }
};

const toggleSection = (elem, name, experimental = false) => {
  //Change status of the tabs
  var isExperimental = experimental == "true";
  var scEditorTab = document.querySelectorAll(".scEditorTab");
  var scSections = document.querySelector("#scSections");
  scSections.value = encodeURI(name + "=0");

  for (var tab of scEditorTab) {
    //Get real section and panel
    var sectionId = tab.dataset.id;
    var section = document.querySelector("#" + sectionId);
    var sectionPanel = section.nextSibling;
    var calc;

    if (sectionPanel) {
      if (tab != elem) {
        //Inactive tab
        tab.classList.remove("scEditorTabSelected");
        sectionPanel ? sectionPanel.setAttribute("style", "display: none !important") : false;
        section.classList.add("scEditorSectionCaptionCollapsed");
        section.classList.remove("scEditorSectionCaptionExpanded");
        scSections.value += encodeURI("&" + tab.innerText + "=1");
      } else if (sectionPanel.tagName == "TABLE") {
        //Active tab
        tab.classList.add("scEditorTabSelected");
        sectionPanel.setAttribute("style", "display: table !important");
        section.classList.remove("scEditorSectionCaptionCollapsed");
        section.classList.add("scEditorSectionCaptionExpanded");

        localStorage.setItem("scTabSection", name);

        if (isExperimental) {
          //X Scroll to
          let container = document.querySelector("#scEditorTabs").getBoundingClientRect();
          let x1 = container.left;
          let x2 = container.right;
          let m = container.width / 2 + x1;

          //Clicked tab
          let clicked = tab.getBoundingClientRect();

          //Tabs to be scrolled
          let tabsSection = document.querySelector("#scEditorTabs > ul");
          let currentOffset = tabsSection.currentStyle || window.getComputedStyle(tabsSection);
          currentOffset = parseFloat(currentOffset.marginLeft.replace("px", ""));
          let tabs = tabsSection.getBoundingClientRect();
          let tabsWidth = tabsSection.scrollWidth;

          //Calculation
          calc = Math.round(currentOffset + (m - clicked.left));
          let calcPos = Math.round(tabs.left + tabsWidth + (m - clicked.left));

          //Detect boundaries
          calcPos < x2 ? (calc = Math.round(calc + (x2 - calcPos))) : false;
          calc > 0 ? (calc = 0) : false;

          //Scroll to position
          tabsSection.setAttribute("style", "margin-left: " + calc + "px");
        }
      } else {
        section.innerText = section.innerText == "Quick Info" ? "QuickInfo" : section.innerText;
        console.info("No table section for " + section.innerText);
        // eslint-disable-next-line no-undef
        scForm.postRequest("", "", "", 'ToggleSection("' + section.innerText + '","1")');
      }
    }
  }
};

const togglePip = (video) => {
  try {
    if (video !== document.pictureInPictureElement) {
      video.requestPictureInPicture();
    } else {
      document.exitPictureInPicture();
    }
  } catch (error) {
    //console.warn(`Picture in Picture! ${error}`);
  } finally {
    //togglePipButton.disabled = false;
  }
};

const toggleMediaIframe = (url) => {
  var features = "dialogWidth:1200px;dialogHeight:700px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no";
  // eslint-disable-next-line no-undef
  scSitecore.prototype.showModalDialog(url, "", features, "", "");
};

const saveSearchTerms = (entryTitle) => {
  let numResult = 4;
  // Parse any JSON previously stored in allEntries
  let existingEntries = JSON.parse(localStorage.getItem("scSearchTerms"));
  if (existingEntries == null) existingEntries = [];
  if (existingEntries.length > numResult) {
    existingEntries.splice(0, existingEntries.length - numResult);
  }
  var entry = {
    title: entryTitle,
  };
  // Save allEntries back to local storage
  existingEntries.push(entry);
  localStorage.setItem("scSearchTerms", JSON.stringify(existingEntries));
};

const fadeEditorFrames = () => {
  let divResults = document.querySelector(".scInstantSearchResults");
  divResults.setAttribute("style", "height:0px; opacity: 0; visibility: hidden; top: 43px;");

  if (document.querySelector("#EditorFrames")) {
    document.querySelector("#EditorFrames").setAttribute("style", "opacity:0.6");
    document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:0.6");
    document.querySelectorAll(".scEditorTabHeaderNormal, .scEditorTabHeaderActive > span")[0].innerText = "Loading...";
    setTimeout(function () {
      document.querySelector("#EditorFrames").setAttribute("style", "opacity:1");
      document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:1");
    }, 8000);
  }
};

const insertPage = (scItem, scItemName) => {
  document.querySelector(".scOverlay") ? document.querySelector(".scOverlay").setAttribute("style", "visibility:visible") : false;
  document.querySelector("#scModal").setAttribute("data-scItem", scItem);
  document.querySelector("#scModal").setAttribute("data-scItemName", scItemName);
  scItemName != undefined ? (document.querySelector("#scModal > .header > .title").innerHTML = "Insert") : false;
  document.querySelector("#scModal").setAttribute("style", "opacity:1; visibility:visible; top: calc(50% - 550px/2)");
  document.querySelector("#scModal > .main").innerHTML = "";
  document.querySelector("#scModal > .preload").setAttribute("style", "opacity:1");
};

const insertPageClose = () => {
  setTimeout(function () {
    document.querySelector(".scOverlay").setAttribute("style", "visibility:hidden");
    document.querySelector("#scModal").setAttribute("style", "opacity:0; visibility:hidden; top: calc(50% - 550px/2 - 20px)");
  }, 10);
};

const showSitecoreRibbon = () => {
  //Update Ribbons
  if (document.querySelector(".scDockTop")) {
    document.querySelector(".scDockTop").classList.toggle("showSitecoreRibbon");
  } else {
    document.querySelectorAll("iframe").forEach(function (iframe) {
      iframe.contentWindow.document.querySelector(".scDockTop") ? iframe.contentWindow.document.querySelector(".scDockTop").classList.toggle("showSitecoreRibbon") : false;
    });
  }

  let dock = document.querySelector(".scDockTop") ? document.querySelector(".scDockTop") : false;
  !dock && document.querySelector("iframe") ? (dock = document.querySelector("iframe").contentWindow.document.querySelector(".scDockTop")) : false;

  if (dock) {
    //Update icon and local storage
    if (dock.classList.contains("showSitecoreRibbon")) {
      localStorage.setItem("scSitecoreRibbon", true);
      document.querySelector("#scSitecoreRibbon").classList.add("scSitecoreRibbon");
    } else {
      localStorage.setItem("scSitecoreRibbon", false);
      document.querySelector("#scSitecoreRibbon").classList.remove("scSitecoreRibbon");
    }
    //Update title bar on Desktop
    if (dock.classList.contains("showSitecoreRibbon")) {
      document.querySelectorAll("iframe").forEach(function (iframe) {
        iframe.contentWindow.document.querySelector(".titleBarDesktop") ? iframe.contentWindow.document.querySelector(".titleBarDesktop").classList.add("hide") : false;
      });
    } else {
      document.querySelectorAll("iframe").forEach(function (iframe) {
        iframe.contentWindow.document.querySelector(".titleBarDesktop") ? iframe.contentWindow.document.querySelector(".titleBarDesktop").classList.remove("hide") : false;
      });
    }
  }
};

const showSitecoreRibbonEE = () => {
  //let ribbon = document.querySelector("div[data-sc-id='PageEditBar']");
  document.querySelector("[data-sc-id='QuickRibbon']").click();
  if (document.querySelector("[data-sc-id='QuickRibbon'] > div").classList.contains("navigate_down")) {
    document.querySelector("#scSitecoreRibbon").classList.remove("scSitecoreRibbon");
  } else if (document.querySelector("[data-sc-id='QuickRibbon'] > div").classList.contains("navigate_up")) {
    document.querySelector("#scSitecoreRibbon").classList.add("scSitecoreRibbon");
  }
};

const showLanguageMenu = () => {
  console.log("Languages");
};

const copyContent = (value, targetClass) => {
  navigator.clipboard.writeText(value).then(
    function () {
      let targetMessage = document.querySelector(".copyCountMessage_" + targetClass);
      let saveMessage = document.querySelector(".saveMessage");
      saveMessage ? (saveMessage.innerHTML = "Copied") : (targetMessage.innerHTML = "Copied!");
      saveMessage ? saveMessage.classList.add("visible") : false;
      setTimeout(function () {
        saveMessage ? saveMessage.classList.remove("visible") : (targetMessage.innerHTML = "");
      }, 1000);
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

const showEditableContent = () => {
  document.querySelectorAll("[contenteditable]").forEach(function (e) {
    e.classList.toggle("scFrameYellow");
  });
  document.querySelector("#scEditableImg").classList.toggle("grayscaleClass");
};

var asc = 0;
/**
 * Sort media table
 */
function sortTable(col, title, pos) {
  //Variables
  document.querySelector(".mediaSortOrder") ? document.querySelector(".mediaSortOrder").remove() : false;
  document.querySelector(".mediaSelected") ? document.querySelector(".mediaSelected").classList.remove("mediaSelected") : false;
  asc == 2 ? (asc = -1) : (asc = 2);
  var head = document.querySelector(".scMediaExplorer > thead > tr");
  var rows = document.querySelectorAll(".scMediaExplorer > tbody > tr");
  var rlen = rows.length;
  var arr = new Array();
  var cells;

  // fill the array with values from the table
  for (var i = 0; i < rlen; i++) {
    cells = rows[i].cells;
    arr[i] = new Array();
    arr[i].arrow = cells[0].outerHTML;
    arr[i].img = cells[1].outerHTML;
    arr[i].title = cells[2].outerHTML;
    arr[i].name = cells[2].innerText;
    arr[i].info = cells[3].outerHTML;
    arr[i].datainfo = cells[3].innerText.replace("items", "").replace("item", "");
    arr[i].type = cells[4].outerHTML;
    arr[i].datatype = cells[4].innerText;
    arr[i].size = cells[5].outerHTML;
    arr[i].datasize = cells[5].dataset.size;
    arr[i].validation = cells[6].outerHTML;
    arr[i].datavalidation = cells[6].innerText;
    arr[i].usage = cells[7].outerHTML;
    arr[i].datausage = cells[7].innerText;
    arr[i].actions = cells[8].outerHTML;
  }
  // sort the array by the specified column number (col) and order (asc)
  arr.sort(function (a, b) {
    var retval = 0;
    var col1 = a[col].toLowerCase();
    var col2 = b[col].toLowerCase();
    var fA = parseFloat(col1);
    var fB = parseFloat(col2);
    if (col1 != col2) {
      if (fA == col1 && fB == col2) {
        retval = fA > fB ? asc : -1 * asc;
      } else {
        retval = col1 > col2 ? asc : -1 * asc;
      }
    }

    return retval;
  });
  //Draw the new sorted table
  for (i = 0; i < rlen; i++) {
    rows[i].cells[0].outerHTML = arr[i].arrow;
    rows[i].cells[1].outerHTML = arr[i].img;
    rows[i].cells[2].outerHTML = arr[i].title;
    rows[i].cells[3].outerHTML = arr[i].info;
    rows[i].cells[4].outerHTML = arr[i].type;
    rows[i].cells[5].outerHTML = arr[i].size;
    rows[i].cells[5].dataset.size = arr[i].datasize;
    rows[i].cells[6].outerHTML = arr[i].validation;
    rows[i].cells[7].outerHTML = arr[i].usage;
    rows[i].cells[8].outerHTML = arr[i].actions;
  }

  //Add sort icon to column
  head.cells[pos].innerHTML = asc == -1 ? title + ` <span class="mediaSortOrder">▼</span>` : title + ` <span class="mediaSortOrder">▲</span>`;
  head.cells[pos].classList.add("mediaSelected");

  localStorage.setItem("scMediaSortPos", pos);
  localStorage.setItem("scMediaSortOrder", asc);
}

/**
 * Update media thumbnail size
 */
function updateMediaThumbnails(value) {
  document.querySelectorAll(".scMediaThumbnail").forEach((el) => {
    el.setAttribute("style", "width:" + value + "px !important; height:" + value + "px !important");
    localStorage.setItem("scMediaThumbnailSize", value);
  });
}

/**
 * Update preview thumbnail size
 */
function updatePreviewSize(iframeId, value) {
  //prettier-ignore
  document.querySelector('#' + iframeId).contentWindow.document.body.querySelector('#Page').setAttribute('style', 'transform: scale(' + value + ')');
}

/**
 * Update media thumbnail size
 */
function switchMediaView(view) {
  if (view == "grid") {
    localStorage.setItem("scMediaView", "grid");
  } else {
    localStorage.setItem("scMediaView", "list");
  }
  document.location.reload();
}

/**
 * Update media thumbnail size
 */
function doubleClick(id, itemId) {
  var el = document.querySelector(".mediaTitle_" + id);

  if (el.getAttribute("data-dblclick") == null) {
    el.setAttribute("data-dblclick", 1);
    // eslint-disable-next-line consistent-return
    setTimeout(function () {
      if (el.getAttribute("data-dblclick") == 1) {
        // eslint-disable-next-line no-undef
        return scForm.getParentForm().invoke("item:load(id={" + itemId + "})");
      }
      el.removeAttribute("data-dblclick");
    }, 300);
  } else {
    el.removeAttribute("data-dblclick");
    // eslint-disable-next-line no-undef
    return scForm.postEvent(el, event, "item:rename(id={" + itemId + "})");
  }
}

/**
 * Get parent in tree node
 */
function getParentNode(int = 1, tabLoadingTitle = "Loading...") {
  var elem = parent.document.querySelector(".scContentTreeNodeActive");
  var count = 0;
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.classList) {
      if (elem.classList.contains("scContentTreeNode")) {
        count++;
        if (count == 1 + int && elem.querySelector(".scContentTreeNodeNormal")) {
          var parentScId = elem
            .querySelector(".scContentTreeNodeNormal")
            .getAttribute("id")
            .replace("Tree_Node_", "")
            .replace(
              // eslint-disable-next-line prefer-named-capture-group
              /(.{8})(.{4})(.{4})(.{4})(.{12})/u,
              "$1-$2-$3-$4-$5"
            );

          document.querySelector("#svgAnimation").setAttribute("style", "opacity:1");
          document.querySelector("#EditorFrames").setAttribute("style", "opacity:0");
          document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:0.5");
          document.querySelectorAll(".scEditorTabHeaderNormal, .scEditorTabHeaderActive > span")[0] = tabLoadingTitle;

          // eslint-disable-next-line no-undef
          return scForm.invoke("item:load(id={" + parentScId + "})");
        }
      }
    }
  }
}

/**
 * Change device preview
 */
function changeDevicePreview(iframeId, device, orientation = "v") {
  let ratio;

  //Get preview page size
  let pageHeight = document.querySelector("#" + iframeId).clientHeight;

  //Clear existing class
  document.querySelector("#" + iframeId).removeAttribute("class");

  //Rotate icons
  if (orientation == "v") {
    document.querySelectorAll("#scRotateDeviceButton > img, #scMobileDeviceButton > img, #scTabletDeviceButton > img").forEach(function (elem) {
      elem.setAttribute("style", "transform: rotate(0deg);");
    });
  } else if (orientation == "h") {
    document.querySelectorAll("#scRotateDeviceButton > img, #scMobileDeviceButton > img, #scTabletDeviceButton > img").forEach(function (elem) {
      elem.setAttribute("style", "transform: rotate(90deg);");
    });
  }

  //Switch to device
  switch (device) {
    case "mobile":
      //Add class
      document
        .querySelector("#" + iframeId)
        .contentWindow.document.body.querySelector("#Page")
        .setAttribute("class", "mobile_" + orientation);
      //Check viewport height

      ratio = pageHeight / 812 - 0.05;
      ratio = Math.round(ratio * 100) / 100;
      ratio > 1 ? (ratio = 1) : false;
      document.querySelector("#previewRange").value = ratio;
      updatePreviewSize(iframeId, ratio);

      //Enable rotate
      document.querySelectorAll("#scRotateDeviceButton").forEach(function (elem) {
        elem.disabled = false;
      });
      break;

    case "tablet":
      //Add class
      document
        .querySelector("#" + iframeId)
        .contentWindow.document.body.querySelector("#Page")
        .setAttribute("class", "tablet_" + orientation);
      //Check viewport height

      ratio = pageHeight / 1366 - 0.05;
      ratio = Math.round(ratio * 100) / 100;
      ratio > 1 ? (ratio = 1) : false;
      document.querySelector("#previewRange").value = ratio;
      updatePreviewSize(iframeId, ratio);

      //Enable rotate
      document.querySelector("#scRotateDeviceButton").disabled = false;
      break;

    default:
      //Reset class
      document
        .querySelector("#" + iframeId)
        .contentWindow.document.body.querySelector("#Page")
        .setAttribute("class", "");
      //Reset viewport
      document.querySelector("#previewRange").value = "1";
      updatePreviewSize(iframeId, 1);
      //Enable rotate
      document.querySelector("#scRotateDeviceButton").disabled = true;
  }
}

/**
 * Change device preview
 */
function changePreviewRotation(iframeId) {
  let orientation = document
    .querySelector("#" + iframeId)
    .contentWindow.document.body.querySelector("#Page")
    .getAttribute("class");

  if (orientation !== null) {
    let device = orientation.split("_");
    if (device[1] == "v") {
      changeDevicePreview(iframeId, device[0], "h");
    } else if (device[1] == "h") {
      changeDevicePreview(iframeId, device[0], "v");
    }
  }
}

/**
 * Show submenu in user menu account
 */
function goToSubmenu(id, width = 300) {
  let height = document.querySelectorAll(".scAccountMenu > .scAccountMenuWrapper .scAccountColumn > ul")[id].offsetHeight;
  let count = 0;
  id == 0 ? document.querySelector(".scAccountMenuWrapper").setAttribute("style", "margin-left:0px") : document.querySelector(".scAccountMenuWrapper").setAttribute("style", "margin-left:-" + width + "px");
  document.querySelectorAll(".scAccountMenu > .scAccountMenuWrapper .scAccountColumn").forEach(function (elem) {
    if (count == id) {
      elem.setAttribute("style", "opacity:1; z-index:1");
    } else {
      elem.setAttribute("style", "opacity:0; z-index:0");
    }
    count++;
  });

  document.querySelector(".scAccountMenu").setAttribute("style", "height:" + height + "px");
}

/**
 * Add new site
 */
// eslint-disable-next-line max-params
function addSite(optionPage, urlOrigin, sitePath, siteName) {
  //prettier-ignore
  window.open(optionPage + `?configure_domains=true&launchpad=true&domain=${urlOrigin}&site=${sitePath}&name=${siteName}`);
}

/*
 * Full screen lightbox
 */
function fullscreenLightbox() {
  document.querySelector("#scLightbox").requestFullscreen();
}
/*
 * Copy path lightbox
 */
function copyPathLightbox(path) {
  console.log(path);
  navigator.clipboard.writeText(path).then(
    function () {
      //Success
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
/**
 * Open Lightbox
 */
function openLightbox(id, from = "frame") {
  let lightbox = parent.document.querySelector("#scLightbox");
  let item = from == "frame" ? document.querySelector(`img[data-id='${id}']`) : document.querySelector("iframe[src*='/Media/']").contentDocument.querySelector(`img[data-id='${id}']`);
  let img = item.src.replace("&h=180", "").replace("&w=180", "").replace("&h=300", "").replace("&thn=1", "");
  let name = item.dataset.name;
  let size = item.dataset.size;
  let path = document.querySelector(".satItemDetails > .scItemPath") ? document.querySelector(".satItemDetails > .scItemPath").innerText : lightbox.dataset.path;
  let mediaType = size == "--" ? "other" : "img";
  lightbox ? lightbox.classList.remove("scLightboxHideSpinner") : false;
  lightbox ? lightbox.querySelector(".sclightboxDownload > a").setAttribute("href", img) : false;
  lightbox ? lightbox.querySelector(".sclightboxFullscreen").setAttribute("onclick", `fullscreenLightbox()`) : false;
  lightbox ? lightbox.querySelector(".sclightboxCopy").setAttribute("onclick", `copyPathLightbox('${path}/${name}')`) : false;
  if (mediaType == "img") {
    lightbox ? lightbox.querySelector(".scLightboxContent > iframe").setAttribute("style", "display: none") : false;
    lightbox ? lightbox.querySelector(".scLightboxContent > img").setAttribute("style", "display: block") : false;
    lightbox ? lightbox.querySelector(".scLightboxContent > img").setAttribute("src", img) : false;
    lightbox ? (lightbox.querySelector(".scLightboxTitle").innerHTML = `<b>${name}</b> (${size})`) : false;
  } else {
    lightbox ? lightbox.querySelector(".scLightboxContent > img").setAttribute("style", "display: none") : false;
    lightbox ? lightbox.querySelector(".scLightboxContent > iframe").setAttribute("style", "display: block") : false;
    lightbox ? lightbox.querySelector(".scLightboxContent > iframe").setAttribute("src", img) : false;
    lightbox ? (lightbox.querySelector(".scLightboxTitle").innerHTML = `<b>${name}</b>`) : false;
  }
  //Remove spinner
  lightbox.querySelectorAll(".scLightboxContent > img, .scLightboxContent > iframe").forEach((elem) => {
    elem.onload = function () {
      lightbox.classList.add("scLightboxHideSpinner");
    };
  });
  //Show lightbox
  lightbox ? lightbox.setAttribute("style", "display:block") : false;
  //Browse all items
  let mediaThumbnails =
    from == "frame"
      ? document.querySelectorAll("*:not(.scMediaFolder) > .mediaThumbnail:not(.scMediaFolder) > img")
      : document.querySelector("iframe[src*='/Media/']").contentDocument.querySelectorAll("*:not(.scMediaFolder) > .mediaThumbnail:not(.scMediaFolder) > img");
  for (var i = 0; i < mediaThumbnails.length; ++i) {
    if (item == mediaThumbnails[i]) {
      let prev = mediaThumbnails[i - 1] ? mediaThumbnails[i - 1].dataset.id : false;
      let next = mediaThumbnails[i + 1] ? mediaThumbnails[i + 1].dataset.id : false;
      if (prev) {
        lightbox.querySelector("#scLightboxPrev").setAttribute(`onclick`, `openLightbox('${prev}','arrow')`);
        lightbox.querySelector("#scLightboxPrev").setAttribute("style", "display:block");
      } else {
        lightbox.querySelector("#scLightboxPrev").setAttribute(`onclick`, ``);
        lightbox.querySelector("#scLightboxPrev").setAttribute("style", "display:none");
      }
      if (next) {
        lightbox.querySelector("#scLightboxNext").setAttribute(`onclick`, `openLightbox('${next}','arrow')`);
        lightbox.querySelector("#scLightboxNext").setAttribute("style", "display:block");
      } else {
        lightbox.querySelector("#scLightboxNext").setAttribute(`onclick`, ``);
        lightbox.querySelector("#scLightboxNext").setAttribute("style", "display:none");
      }
    }
  }
}
/**
 * Logout
 */
function satLogout() {
  document.querySelector(".sc-globalHeader .logout") ? document.querySelector(".sc-globalHeader .logout").click() : false;
  //javascript:return scForm.invoke('system:logout', event)
}
