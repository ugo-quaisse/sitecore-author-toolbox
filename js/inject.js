/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

function scSaveAnimation(id) {

    var indicator = document.createElement('div');
    indicator.id = 'saveAnimation';
    document.body.appendChild(indicator);
    setTimeout(function() { indicator.remove(); }, 2000);

    if (document.querySelector(".scSaveButton")) {
        let saveMessage = document.querySelector(".saveMessage");
        document.querySelector(".scSaveButton").innerText = "Saving...";
        document.querySelector(".scSaveButton").setAttribute("disabled", true);

        setTimeout(function() {
            saveMessage.classList.add("visible");
        }, 500);

        setTimeout(function() {
            document.querySelector(".scSaveButton").innerText = "Save";
            document.querySelector(".scSaveButton").removeAttribute("disabled");
            saveMessage.classList.remove("visible");
        }, 2000);
    }

}

const copyTranslate = (leftElemId, rightElemId) => {
    var left = document.querySelector('#' + leftElemId);
    var right = document.querySelector('#' + rightElemId);
    left.value = right.value;
}

const copyTranslateAll = () => {
    var scTranslateRTL = document.querySelectorAll(".scTranslateRTL");
    for (var field of scTranslateRTL) {
        field.click();
    }
}

const toggleRibbon = () => {

    var scCrossPiece = document.querySelector("#scCrossPiece");
    var scWebEditRibbon = document.querySelector("#scWebEditRibbon");
    var scExpTab = document.querySelector(".scExpTab");
    var tabText = scExpTab.querySelector(".tabText");

    var scWebEditRibbonStatus = scWebEditRibbon.getAttribute("style");

    if (scWebEditRibbonStatus != "display:none !important") {

        scCrossPiece.setAttribute('style', 'height:0px !important');
        scWebEditRibbon.setAttribute('style', 'display:none !important');
        tabText.innerText = "▼ Show";

    } else {

        scCrossPiece.setAttribute('style', 'height:300px !important');
        scWebEditRibbon.setAttribute('style', 'display:block !important');
        tabText.innerText = "▲ Hide";

    }

}

const toggleSection = (elem, name, fromerror = false, experimental = false) => {

    //Change status of the tabs
    var isExperimental = (experimental == 'true');
    var scEditorTab = document.querySelectorAll(".scEditorTab");
    var scSections = document.querySelector("#scSections");
    scSections.value = encodeURI(name + "=0");

    for (var tab of scEditorTab) {

        //Get real section and panel
        var sectionId = tab.dataset.id;
        var section = document.querySelector("#" + sectionId);
        var sectionPanel = section.nextSibling;
        var calc;

        if (tab != elem) {

            //Inactive tab
            tab.classList.remove("scEditorTabSelected");
            sectionPanel.setAttribute('style', 'display: none !important');
            section.classList.add("scEditorSectionCaptionCollapsed");
            section.classList.remove("scEditorSectionCaptionExpanded");
            scSections.value += encodeURI("&" + tab.innerText + "=1");

        } else {

            //Active tab
            tab.classList.add("scEditorTabSelected");
            sectionPanel.setAttribute('style', 'display: table !important');
            section.classList.remove("scEditorSectionCaptionCollapsed");
            section.classList.add("scEditorSectionCaptionExpanded");

            if (isExperimental) {
                //X Scroll to
                let container = document.querySelector("#scEditorTabs").getBoundingClientRect();
                let x1 = container.left;
                let x2 = container.right;
                let m = (container.width / 2) + x1;

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
                calcPos < x2 ? calc = Math.round(calc + (x2 - calcPos)) : false;
                calc > 0 ? calc = 0 : false;

                // console.log(calcPos)
                // console.log("Margin-left: "+calc);

                //Scroll to position
                tabsSection.setAttribute("style", "margin-left: " + calc + "px");
            }

        }

    }

}

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

    var features = 'dialogWidth:1200px;dialogHeight:700px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no';
    scSitecore.prototype.showModalDialog(url, "", features, "", "")

}

const fadeEditorFrames = () => {

    let divResults = document.querySelector('.scInstantSearchResults');
    divResults.setAttribute('style', 'height:0px; opacity: 0; visibility: hidden; top: 43px;');

    document.querySelector("#EditorFrames").setAttribute("style", "opacity:0.6");
    document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:0.6");
    document.querySelector(".scEditorTabHeaderActive > span").innerText = "Loading...";
    var timeout = setTimeout(function() {
        document.querySelector("#EditorFrames").setAttribute("style", "opacity:1");
        document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:1");
    }, 8000)
}

const insertPage = (scItem, scItemName) => {
    document.querySelector(".scOverlay").setAttribute("style", "visibility:visible")
    document.querySelector("#scModal").setAttribute("data-scItem", scItem);
    document.querySelector("#scModal").setAttribute("data-scItemName", scItemName);
    scItemName != undefined ? document.querySelector("#scModal > .header > .title").innerHTML = 'Insert' : false;
    document.querySelector("#scModal").setAttribute("style", "opacity:1; visibility:visible; top: calc(50% - 550px/2)");
    document.querySelector("#scModal > .main").innerHTML = "";
    document.querySelector("#scModal > .preload").setAttribute("style", "opacity:1");
}

const insertPageClose = () => {
    setTimeout(function() {
        document.querySelector(".scOverlay").setAttribute("style", "visibility:hidden")
        document.querySelector("#scModal").setAttribute("style", "opacity:0; visibility:hidden; top: calc(50% - 550px/2 - 20px)")
    }, 10);
}

const showSitecoreMenu = () => {
    let dock = document.querySelector(".scDockTop");
    dock.classList.toggle("showSitecoreMenu");

    let icon = document.querySelector("#scSitecoreMenu");
    icon.classList.toggle("scSitecoreMenu");

    // let button = document.querySelector("#scSitecoreRibbon > span");
    // button.classList.toggle("active");

    dock.classList.contains("showSitecoreMenu") ? localStorage.setItem('scSitecoreMenu', true) : localStorage.setItem('scSitecoreMenu', false);
}

const showLanguageMenu = () => {
    console.log("Languages");
}