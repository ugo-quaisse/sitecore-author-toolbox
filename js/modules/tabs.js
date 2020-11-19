/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

export { initTabSections };

/**
 *  Convert accordion section to tabs
 */
const initTabSections = (storage) => {
  storage.feature_cetabs == undefined ? (storage.feature_cetabs = false) : false;
  if (storage.feature_cetabs) {
    let scQuickInfo = document.querySelector("div[id^='QuickInfo_']");
    let scEditorPanel = document.querySelector(".scEditorPanel");
    let scEditorHeader = document.querySelector(".scEditorHeader");
    let scEditorTabs = document.querySelector("div#scEditorTabs");
    let scMessageBar = document.querySelectorAll(".scMessageBar");
    let scEditorSectionCaption = document.querySelectorAll(".scEditorSectionCaptionCollapsed, .scEditorSectionCaptionExpanded");
    let scEditorSectionPanel = document.querySelectorAll(".scEditorSectionPanel .scEditorSectionPanelCell")[1];
    let sectionActiveCount = false;

    //Remove existing tabs
    scEditorTabs ? scEditorTabs.remove() : false;
    scEditorTabs = '<div id="scEditorTabs"><ul>';

    for (let section of scEditorSectionCaption) {
      let sectionTitle = section.innerText;
      let sectionId = section.getAttribute("id");
      //let sectionClass = section.getAttribute("class");
      let sectionSelected, sectionPanelDisplay, sectionErrorHtml, sectionErrorClass, sectionError;
      let lastClickedTab = localStorage.getItem("scTabSection");

      //Detect active panel and show it if there, othjerwise fallback to quick Info
      if (sectionActiveCount == false && lastClickedTab != null && sectionTitle == lastClickedTab) {
        sectionSelected = "scEditorTabSelected";
        sectionPanelDisplay = "table";
        sectionActiveCount = true;
        // } else if (sectionActiveCount == false && sectionClass == "scEditorSectionCaptionExpanded" && sectionTitle != "Quick Info") {
        //   sectionSelected = "scEditorTabSelected";
        //   sectionPanelDisplay = "table";
        //   sectionActiveCount = true;
      } else {
        sectionSelected = "";
        sectionPanelDisplay = "none";
      }

      //Hide the accordion section
      section.setAttribute("style", "display: none !important");

      //Detect next scEditorSectionPanel
      scEditorSectionPanel = section.nextSibling;
      if (scEditorSectionPanel && scEditorSectionPanel.tagName == "TABLE") {
        scEditorSectionPanel.setAttribute("style", "display: " + sectionPanelDisplay + " !important");
        scEditorSectionPanel.classList.add("scTabsRounded");
      }

      //How many errors in this section
      sectionError = scEditorSectionPanel ? scEditorSectionPanel.querySelectorAll(".scEditorFieldMarkerBarCellRed").length : 0;
      if (sectionError > 0) {
        sectionErrorHtml = "<span id='scCrossTabError'></span>";
        sectionErrorClass = "scTabsError t-sm t-top";
      } else {
        sectionErrorHtml = "";
        sectionErrorClass = "";
      }

      //Add tabs to document
      //prettier-ignore
      scEditorTabs += `
        <li class="scEditorTabEmpty"></li>
        <li data-id="` + sectionId + `" class="scEditorTab ` + sectionSelected + ` ` + sectionErrorClass + `"
        onclick="toggleSection(this,'` + sectionTitle + `', false, '` + storage.feature_experimentalui + `')">` + sectionErrorHtml + sectionTitle + `</li>`;
    }

    scEditorTabs += '<li class="scEditorTabEmpty"></li></ul></div>';

    //Add tabs to Content Editor, depending if we already have a message bar
    if (scQuickInfo) {
      scQuickInfo.insertAdjacentHTML("beforebegin", scEditorTabs);
    } else if (scMessageBar.length > 0) {
      scMessageBar[scMessageBar.length - 1].insertAdjacentHTML("afterend", scEditorTabs);
    } else if (scEditorHeader) {
      scEditorPanel.insertAdjacentHTML("afterend", scEditorTabs);
    }

    //If there is no active tab
    var tab = document.querySelector(".scEditorTab");
    if (sectionActiveCount == 0 && tab != null) {
      var tabId = tab.dataset.id;
      var tabSection = document.querySelector("#" + tabId);
      tabSection.classList.remove("scEditorSectionCaptionCollapsed");
      tabSection.classList.add("scEditorSectionCaptionExpanded");
      var tabSectionPanel = tabSection.nextSibling;
      tab.classList.add("scEditorTabSelected");
      tabSectionPanel.setAttribute("style", "display: table !important");
    }
  }
};
