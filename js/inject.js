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
  }, 0);

  if (document.querySelector(".scSaveButton")) {
    let saveMessage = document.querySelector(".saveMessage");
    saveMessage.innerHTML = "Saving...";
    saveMessage.classList.add("visible");
    document.querySelector(".scSaveButton").innerText = "Saving...";
    document.querySelector(".scSaveButton").setAttribute("disabled", true);

    setTimeout(function () {
      let saveMessage = document.querySelector(".saveMessage");
      saveMessage.innerHTML = "Your changes have been saved successfully!";
      document.querySelector(".scSaveButton").innerText = "Save";
      document.querySelector(".scSaveButton").removeAttribute("disabled");
      saveMessage.classList.add("visible");
    }, 2000);

    setTimeout(function () {
      saveMessage.classList.remove("visible");
    }, 3000);
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
    scCrossPiece.setAttribute("style", "height:300px !important");
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
          let calc = Math.round(currentOffset + (m - clicked.left));
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
  var features =
    "dialogWidth:1200px;dialogHeight:700px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no";
  // eslint-disable-next-line no-undef
  scSitecore.prototype.showModalDialog(url, "", features, "", "");
};

const fadeEditorFrames = () => {
  let divResults = document.querySelector(".scInstantSearchResults");
  divResults.setAttribute("style", "height:0px; opacity: 0; visibility: hidden; top: 43px;");

  document.querySelector("#EditorFrames").setAttribute("style", "opacity:0.6");
  document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:0.6");
  document.querySelector(".scEditorTabHeaderActive > span").innerText = "Loading...";
  var timeout = setTimeout(function () {
    document.querySelector("#EditorFrames").setAttribute("style", "opacity:1");
    document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:1");
  }, 8000);
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

const showSitecoreMenu = () => {
  let dock = document.querySelector(".scDockTop")
    ? document.querySelector(".scDockTop")
    : document.querySelector("iframe").contentWindow.document.querySelector(".scDockTop");
  dock ? dock.classList.toggle("showSitecoreMenu") : false;

  let icon = document.querySelector("#scSitecoreMenu")
    ? document.querySelector("#scSitecoreMenu")
    : document.querySelector("iframe").contentWindow.document.querySelector("#scSitecoreMenu");
  icon ? icon.classList.toggle("scSitecoreMenu") : false;

  if (dock) {
    dock.classList.contains("showSitecoreMenu") ? localStorage.setItem("scSitecoreMenu", true) : localStorage.setItem("scSitecoreMenu", false);
  }
};

const showLanguageMenu = () => {
  console.log("Languages");
};

const copyContent = (value, targetClass) => {
  navigator.clipboard.writeText(value).then(
    function () {
      let target = document.querySelector(".copyCount_" + targetClass);
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
  var table = document.querySelectorAll(".scMediaExplorer");
  var head = document.querySelector(".scMediaExplorer > thead > tr");
  var rows = document.querySelectorAll(".scMediaExplorer > tbody > tr");
  var rlen = rows.length;
  var arr = new Array();
  var cells, clen;

  // fill the array with values from the table
  for (var i = 0; i < rlen; i++) {
    cells = rows[i].cells;
    clen = cells.length;
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
    el.setAttribute("style", "width:" + value + "px !important");
    localStorage.setItem("scMediaThumbnailSize", value);
  });
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
