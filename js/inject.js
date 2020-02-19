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