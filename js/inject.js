/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */

 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

//TODO: Autosave in Experience Editor
// ((() => {
//     const origOpen = XMLHttpRequest.prototype.open;
//     XMLHttpRequest.prototype.open = function() {
//         this.addEventListener('load', function() {
//             console.log(this.responseURL);
//             if(this.responseURL.include(".Save.CallServerSavePipeline")) {
//             	console.log("SAVING!!!!!");
//             }
//             // console.log(this.responseText); //whatever the response was
//         });
//         origOpen.apply(this, arguments);
//     };
// }))();

const copyTranslate = (leftElemId,rightElemId) => {
 	var left = document.querySelector('#'+leftElemId);
 	var right = document.querySelector('#'+rightElemId);
 	left.value = right.value;
 }

const copyTranslateAll = () => {
 	var scTranslateRTL = document.querySelectorAll(".scTranslateRTL");
 	for(var field of scTranslateRTL) {
 		field.click();
 	}
 }

const toggleRibbon = () => {
 	
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

const toggleSection = (elem,name,fromerror = false) => {

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

const hideTab = (title, extensionId) => {
	  var txt;
	  var confirmation = confirm("Do you want to hide all \"" + title + "\" tabs?");
	  if (confirmation == true) {
	  	chrome.runtime.sendMessage(extensionId, {getTargetData: true, greeting: "hide_tab"}, function(response) {
		  console.log(response);
		});
	  	//Save tab title in storage as a hidden tab
	  	//Need to send a message to background script or toolbox
	  	// chrome.storage.sync.get(["hidden_tabs"], function(result) {
	   //      var array = result[hidden_tabs]?result[hidden_tabs]:[];
	   //      array.unshift(title);
	   //      var jsonObj = {};
	   //      jsonObj[hidden_tabs] = array;
	   //      chrome.storage.sync.set(jsonObj, function() {
	   //          console.info('--> New array entry, This tab will be hidden: ' + title);
	   //      });
	   //  });
	  	//Confirmation message
	    alert("Ok, you will be able to revert from the \"🙈\" pinned tab");
	  } else {
	    txt = "You pressed Cancel!";
	  }
	  return false;
}

const toggleMediaIframe = (url) => {

	var features = 'dialogWidth:1200px;dialogHeight:700px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no';	
	scSitecore.prototype.showModalDialog(url, "", features, "", "")

}