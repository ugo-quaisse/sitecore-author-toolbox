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

          // console.log(calcPos)
          // console.log("Margin-left: "+calc);

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
  document.querySelector(".scOverlay")
    ? document.querySelector(".scOverlay").setAttribute("style", "visibility:visible")
    : false;
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
    document
      .querySelector("#scModal")
      .setAttribute("style", "opacity:0; visibility:hidden; top: calc(50% - 550px/2 - 20px)");
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
    dock.classList.contains("showSitecoreMenu")
      ? localStorage.setItem("scSitecoreMenu", true)
      : localStorage.setItem("scSitecoreMenu", false);
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
      console.log(target);
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

/**
 * Sort media table
 */
function sortTable(column, id, title) {
  let table, rows, switching, i, x, y, sort, shouldSwitch;

  table = document.querySelector(".scMediaExplorer");
  sort = id.dataset.sort;

  if (sort == "ASC") {
    id.innerText = title + " ▲";
  } else if (sort == "DESC") {
    id.innerText = title + " ▼";
  }

  id.classList.add("selected");

  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;

      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];

      x = x.querySelector("span").dataset.size ? x.querySelector("span").dataset.size : x.innerText.toLowerCase();
      y = y.querySelector("span").dataset.size ? y.querySelector("span").dataset.size : y.innerText.toLowerCase();

      //check if the two rows should switch place:
      if (sort == "ASC") {
        if (x > y) {
          shouldSwitch = true;
          id.dataset.sort = "DESC";
          break;
        }
      } else if (sort == "DESC") {
        if (x < y) {
          shouldSwitch = true;
          id.dataset.sort = "ASC";
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
/**
 * Update media thumbnail size
 */
function updateMediaThumbnails(value) {
  console.log(value);
  document.querySelectorAll(".scMediaThumbnail").forEach((el) => {
    el.setAttribute("style", "width:" + value + "px !important");
    localStorage.setItem("scMediaThumbnailSize", value);
  });
}
