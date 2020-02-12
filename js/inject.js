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
 	
	var scCrossPiece = document.querySelectorAll("#scCrossPiece");
	var scWebEditRibbon = document.querySelectorAll("#scWebEditRibbon"); 
	var scExpTab = document.querySelectorAll(".scExpTab"); 

	var scWebEditRibbonStatus = scWebEditRibbon[0].getAttribute("style");

	if(scWebEditRibbonStatus != "display:none !important") {

		scCrossPiece[0].setAttribute( 'style', 'height:0px !important' );
		scWebEditRibbon[0].setAttribute( 'style', 'display:none !important' );
		scExpTab[0].innerText = "▼ Show";

	} else {

		scCrossPiece[0].setAttribute( 'style', 'height:300px !important' );
		scWebEditRibbon[0].setAttribute( 'style', 'display:block !important' );
		scExpTab[0].innerText = "▲ Hide";

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