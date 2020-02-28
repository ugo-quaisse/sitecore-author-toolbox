/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

function copyTranslate(leftElemId,rightElemId) {

 	var left = document.querySelector('#'+leftElemId);
 	var right = document.querySelector('#'+rightElemId);

 	left.value = right.value;

 }

function copyTranslateAll() {

 	var scTranslateRTL = document.querySelectorAll(".scTranslateRTL");

 	for(var field of scTranslateRTL) {

 		field.click();

 	}

 }

function toggleRibbon() {
 	
	var scCrossPiece = document.querySelector("#scCrossPiece");
	var scWebEditRibbon = document.querySelector("#scWebEditRibbon"); 
	var scExpTab = document.querySelector(".scExpTab");
	var tabText = scExpTab.querySelector(".tabText"); 

	var scWebEditRibbonStatus = scWebEditRibbon.getAttribute("style");

	if(scWebEditRibbonStatus != "display:none !important") {

		scCrossPiece.setAttribute( 'style', 'height:0px !important' );
		scWebEditRibbon.setAttribute( 'style', 'display:none !important' );
		tabText.innerText = "▼ Show";

	} else {

		scCrossPiece.setAttribute( 'style', 'height:300px !important' );
		scWebEditRibbon.setAttribute( 'style', 'display:block !important' );
		tabText.innerText = "▲ Hide";

	}

}

function toggleSection(elem,name) {

	//Change status of the tabs
	var scEditorTab = document.querySelectorAll(".scEditorTab");

	var scSections = document.querySelector("#scSections");
	scSections.value = encodeURI(name+"=0");
	
	for(var tab of scEditorTab) {

		//Get real section and panel
		var sectionId = tab.dataset.id;
 		var section = document.querySelector("#"+sectionId);
 		var sectionPanel = section.nextSibling;

		if(tab!=elem) {
			//Other tabs not clicked
 			tab.classList.remove("scEditorTabSelected");
 			sectionPanel.setAttribute( 'style', 'display: none !important' );
 			section.classList.add("scEditorSectionCaptionCollapsed");
          	section.classList.remove("scEditorSectionCaptionExpanded");
          	scSections.value += encodeURI("&"+tab.innerText+"=1");
 		} else {
 			//Tab is clicked
 			tab.classList.add("scEditorTabSelected");
 			sectionPanel.setAttribute( 'style', 'display: table !important' );
 			section.classList.remove("scEditorSectionCaptionCollapsed");
          	section.classList.add("scEditorSectionCaptionExpanded");
 		}

 	}

}