/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import {getScItemData} from './helpers.js';

export {insertModal};

/**
 * Get insert menu for an item
 */
const insertModal = (sitecoreItemID, scLanguage, scVersion, scItemName = "", mutationObserver = true) => {

	var ajax = new XMLHttpRequest();
    ajax.timeout = 7000; 
    ajax.open("GET", "/sitecore/shell/default.aspx?xmlcontrol=Gallery.New&id=" + sitecoreItemID + "&la=" + scLanguage + "&vs=" + scVersion + "&db=master", true);
    ajax.onreadystatechange = function() {

        if (ajax.readyState === 4 && ajax.status == "200") {

        	let html = new DOMParser().parseFromString(ajax.responseText, "text/html");
        	let jsonOptions = [];
        	let ScItem = getScItemData();
        	var count = 0;
        	var table;
        	let scModal = document.querySelector( "#scModal" );

        	scModal ? scModal.innerHTML = "Loading..." : false;

        	let dom = html.querySelectorAll(".scScrollbox > .scMenuHeader, .scScrollbox > .scRibbonToolbarSmallButton").forEach((el) => { 
        		if(el.className == "scMenuHeader") {

        			count = 0;
        			el.innerText == "Insert a new subitem" ?
        			table = jsonOptions["subitems"] = [] :
        			el.innerText == "Insert a new sibling" ?
        			table = jsonOptions["siblings"] = [] : false;

        		} else if(el.className == "scRibbonToolbarSmallButton") {

        			table[count] = []
	        		table[count].push(el.innerText);
	        		table[count].push(el.querySelector("img").getAttribute("src").replace("/temp//iconcache/","/icon/").replace("16x16","48x48"));
	        		table[count].push(el.getAttribute("onclick"));
	        		count++;

        		} 

        	});

        	//Add layers
	        var menuTiles = '';
	        //Item name
	        scItemName != "" ? ScItem.name = scItemName.toLowerCase() : false;

        	if(jsonOptions["subitems"]) {
	        	
	        	//If empty
	        	jsonOptions["subitems"].length == 0
	        	? document.querySelector("#scSitecoreMenu").setAttribute("style","opacity:0.2; visibility:visible")
	        	: document.querySelector("#scSitecoreMenu").setAttribute("style","visibility:visible");

	        	//If empty
	        	jsonOptions["subitems"].length == 0
	        	? menuTiles = '<div class="noResult">Nothing to insert under <u>' + ScItem.name.capitalize() + '</u> node.</div>'
	        	: false;

	        	for (var options of jsonOptions["subitems"]) {
	       	 		menuTiles += '<div class="item"><a href="#" onclick="insertPageClose(); ' + options[2] + '"><img loading="lazy" src="' + options[1] + '" /><br />' + options[0] + '</a></div>';
	       	 	}

       	 	}
       	 	let htmlMenuInner = '<div class="header"><span class="title">Insert under ' + ScItem.name.capitalize() + '</span> <span class="maximize"></span> <span class="close"></span></div><div class="main"> ' + menuTiles + ' </div>';
       	 	let htmlMenu = '<div class="scOverlay"></div><div id="scModal">' + htmlMenuInner + '</div>';
       	 	
       	 	scModal ? scModal.innerHTML = htmlMenuInner : document.querySelector("body").insertAdjacentHTML( 'afterend', htmlMenu );
        	
       	 	//Section below will be executed on load only (true)
       	 	if(mutationObserver) {
	       	 	
	       	 	//Observer on data-scitem change
	       	 	scModal = document.querySelector( "#scModal" );
			    let observer = new MutationObserver((mutations) => {
			    	for(let mutation of mutations) {
			    		if(mutation.attributeName == "data-scitem" && mutation.target.dataset.scitem != "undefined" && mutation.target.dataset.scitem != null) {
			    			var scItem = mutation.target.dataset.scitem.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/,"$1-$2-$3-$4-$5");
			    			var scItemName = mutation.target.dataset.scitemname;
			    			insertModal(scItem, "en", "1", scItemName, false)
			    		}
			    	}
			    });
			    //Observer
			    scModal ? observer.observe(scModal, { attributes: true, childList: false, characterData: false, subtree: false }) : false;

			}

        	//Press escape
        	document.addEventListener('keyup', (event) => {
		
				if (event.key === 'Escape') {

					document.querySelector(".scOverlay").setAttribute('style', 'visibility: hidden');
	       	 		document.querySelector("#scModal").setAttribute('style', 'opacity:0; visibility: hidden; top: calc(50% - 540px/2 - 10px)');
	       	 		document.querySelector(".scPublishMenu").setAttribute("style","visibility:hidden; opacity:0")
	       	 	}

       	 	});

        	//Clic close button
       	 	document.querySelector("#scModal > .header > .close").addEventListener('click', (event) => {

       	 		document.querySelector(".scOverlay").setAttribute('style', 'visibility: hidden');
	       	 	document.querySelector("#scModal").setAttribute('style', 'opacity:0; visibility: hidden; top: calc(50% - 540px/2 - 10px)');

       	 	});

        }
    }
    sitecoreItemID ? ajax.send(null) : false;

}