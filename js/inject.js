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

 function goToNormalMode() {

 	var url = window.location.href.toLowerCase();
 	var isQuery = url.includes('?');
 	var isEditMode = url.includes('sc_mode=edit');

 	if(isEditMode) {
 		url = url.replace("sc_mode=edit","sc_mode=normal");
 	} else if(isQuery) {
 		url = url+"&sc_mode=normal";
 	} else {
 		url = url+"?sc_mode=normal";
 	}

 	window.location.href=url;

 }

  function goToContentEditor() {

 	window.location.href=window.location.origin+'/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&sc_lang=en';

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

var contextmenu = document.querySelector('.scExpTab');
var initX, initY, mousePressX;

if(contextmenu) {
	contextmenu.addEventListener('mousedown', function(event) {

		initX = this.offsetLeft;
		mousePressX = event.clientX;

		this.addEventListener('mousemove', repositionElement, false);

		window.addEventListener('mouseup', function() {
		  contextmenu.removeEventListener('mousemove', repositionElement, false);
		}, false);

	}, false);
}

function repositionElement(event) {
	this.style.left = initX + event.clientX - mousePressX + 'px';
}