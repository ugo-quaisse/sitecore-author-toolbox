/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';
import {getScItemData, setTextColour} from './helpers.js';

export {insertSavebar, insertBreadcrumb, insertLanguageButton, insertVersionButton, insertMoreButton, insertNavigatorButton, insertLockButton, pathToBreadcrumb, initInsertIcon, getAccentColor, initColorPicker, initSitecoreMenu, initGutter };


/**
 * Insert Save bar
 */
const insertSavebar = () => {
	//Save Bar
    let scSaveBar = `
    <div class="scSaveBar">
        <div class="scActions">
            <button id="scPublishMenuMore" class="grouped" type="button">▾</button>
            <ul class="scPublishMenu">
                <li onclick="javascript:return scForm.invoke('item:setpublishing', event)">Unpublish...</li>
                <li onclick="javascript:return scForm.postEvent(this,event,'item:publishingviewer(id=)')">Scheduler...</li>
            </ul>
            <button class="primary primaryGrouped" onclick="javascript:return scForm.postEvent(this,event,'item:publish(id=)')">Save and Publish</button>
            <button class="scSaveButton" onclick="javascript:return scForm.invoke('contenteditor:save', event)">Save</button>
            <button class="scPreviewButton" disabled>Checking url...</button>
        </div>
        <div class="scBreadcrumb"></div>
    </div>`;
    let contentEditor = document.querySelector("#ContentEditor");
    document.querySelector(".scSaveBar") ? document.querySelector(".scSaveBar").remove() : false;
    contentEditor ? contentEditor.insertAdjacentHTML( 'afterbegin', scSaveBar ) : false;

}

/**
 * Path to Breadcrumb
 */
const pathToBreadcrumb = (path, delimiter = "/", underline = true) => {

	let breadcrumb = '#####';
	
	if(path) {
		path = path.toLowerCase() + "/";
		path = path.split("/home/");
		if(path[1] != undefined) {
			path = path[1].split("/");
			underline ? breadcrumb += '<u class="home" onclick="javascript:return scForm.invoke(\'contenteditor:home\', event)">Home</u> ' : breadcrumb += 'Home ';
		} else {
			path = path[0].split("/");
		}

		for(let level of path) {
			if(underline) {
				level != "" ? breadcrumb += '<i>' + delimiter + '</i> <u>' + level.toLowerCase().capitalize().replace("Loreal","uquaisse,io") + '</u> ' : false;
			} else {
				level != "" ? breadcrumb += '<i>' + delimiter + '</i> ' + level.toLowerCase().capitalize().replace("Loreal","uquaisse,io")  + ' ' : false;
			}
		}
	}

	breadcrumb = breadcrumb.replace('#####<i>' + delimiter + '</i>','').replace('#####','');
	return breadcrumb;

}

/**
 * Insert Breadcrumb
 */
const insertBreadcrumb = (path) => {

	let breadcrumb = pathToBreadcrumb(path);
	let scBreadcrumb = document.querySelector(".scBreadcrumb");
	scBreadcrumb && path ? scBreadcrumb.innerHTML = breadcrumb : false;

}

/**
 * Insert Language button
 */
const insertLanguageButton = (scItemId, scLanguage = "EN", scVersion = 1) => {

	//Button
	let container = document.querySelector(".scEditorTabControlsHolder");
	let button = `<button class="scEditorHeaderButton" id="scLanguageButton" type="button"><img src="` + global.iconLanguage + `" class="scLanguageIcon"> ` + scLanguage + ` ▾</button>`;
	container ? container.insertAdjacentHTML( 'afterbegin', button) : false;

	//Iframe
	document.querySelector("#scLanguageIframe") ? document.querySelector("#scLanguageIframe").remove() : false;
	let body = document.querySelector("body");
	let iframe = `<iframe loading="lazy" id="scLanguageIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Languages&id=` + scItemId + `&la=` + scLanguage + `&vs=` + scVersion + `&db=master"></iframe>`
	body ? body.insertAdjacentHTML( 'beforeend', iframe) : false;
	
	//Scroll position
	//document.querySelector("#scLanguageIframe").contentWindow.document.body.querySelector(".scGalleryContent13").scrollTop = 0;
	
	//Hide old button
	document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;

}

/**
 * Insert More button
 */
const insertMoreButton = (locked = false) => {

	let container = document.querySelector(".scEditorTabControlsHolder");
	let button = `
	<button class="scEditorHeaderButton" id="scInfoButton" title="Quick Info" type="button">
	<img src="` + global.iconInfo + `" class="scLanguageIcon">
	</button>

	<button class="scEditorHeaderButton" id="scMoreButton" title="More actions" type="button">
	<img src="` + global.iconMore + `" class="scLanguageIcon">
	</button>
	<ul class="scMoreMenu">
        <li onclick="javascript:return scForm.postEvent(this,event,'item:addversion(id=)')">Add new version</li>
 		<li onclick="javascript:return scForm.invoke('contenteditor:edit')" id="scLockMenuText">Lock item</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'webedit:openexperienceeditor')">Open in Experience Editor</li>
       	<li onclick="javascript:return scForm.invoke('item:duplicate')">Duplicate item</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:rename')">Rename item</li>
        <li onclick="javascript:return scForm.postEvent(this,event,'item:sethelp')">Help texts</li>
        <li onclick="javascript:return scForm.invoke('item:delete(id={E5B3214B-16F5-405A-8E88-AB7084D23E36})', event)" class="danger">Delete</li>
    </ul>`;
	container ? container.insertAdjacentHTML( 'afterbegin', button) : false;

	let ScItem = getScItemData();
	let panel = document.querySelector("#scPanel");
	let html = `
	<div class="content">
		<h2>Quick info</h2>
		<h3>Item ID:</h3>
		` + ScItem.id + `
		<h3>Name:</h3>
		` + ScItem.name + `
		<h3>Path:</h3>
		` + ScItem.path + `
		<h3>Template:</h3>
		` + ScItem.template + `
		<h3>Template ID:</h3>
		` + ScItem.templateId + `
		<h3>From:</h3>
		` + ScItem.from + `
		<h3>Owner:</h3>
		` + ScItem.owner + `
		<h3>Language:</h3>
		` + ScItem.language + `
		<h3>Version:</h3>
		` + ScItem.version + `
	</div>`;
	panel ? panel.innerHTML = html : false;

	document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;

}

/**
 * Insert Version button
 */
const insertVersionButton = (scItemId, scLanguage = "EN", scVersion = 1) => {

	let container = document.querySelector(".scEditorTabControlsHolder");
	let button = `<button class="scEditorHeaderButton" id="scVersionButton" type="button"><img src="` + global.iconVersion + `" class="scLanguageIcon"> ` + scVersion + ` ▾</button>`;
	container && scVersion != null ? container.insertAdjacentHTML( 'afterbegin', button) : false;

	//Iframe
	document.querySelector("#scVersionIframe") ? document.querySelector("#scVersionIframe").remove() : false;
	let body = document.querySelector("body");
	let iframe = `<iframe loading="lazy" id="scVersionIframe" src="/sitecore/shell/default.aspx?xmlcontrol=Gallery.Versions&id=` + scItemId + `&la=` + scLanguage + `&vs=` + scVersion + `&db=master"></iframe>`
	body ? body.insertAdjacentHTML( 'beforeend', iframe) : false;

	document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;

}

/**
 * Insert Navigator button
 */
const insertNavigatorButton = () => {

	let container = document.querySelector(".scEditorTabControlsHolder");
	let button = `<button class="scEditorHeaderButton" id="scNavigatorButton" type="button"><img src="` + global.iconNotebook + `" class="scLanguageIcon"> ▾</button>`;
	container ? container.insertAdjacentHTML( 'afterbegin', button) : false;

	document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;

}

/**
 * Insert Lock button
 */
const insertLockButton = (locked = false) => {

	let icon = locked == false ? global.iconUnlocked : global.iconLocked;
	let container = document.querySelector(".scEditorTabControlsHolder");
	let button = `<button onclick="javascript:return scForm.postEvent(this,event,'item:checkout')" class="scEditorHeaderButton" id="scLockButton" title="Lock this item" type="button"><img src="` + icon + `" class="scLanguageIcon"></button>`;
	container ? container.insertAdjacentHTML( 'afterbegin', button) : false;

	document.querySelector(".scEditorTabControls") ? document.querySelector(".scEditorTabControls").remove() : false;

}

/**
 * Init Sitecore ribbon
 */
const initSitecoreMenu = () => {
	let storage = localStorage.getItem('scSitecoreMenu');
	let dock = document.querySelector(".scDockTop");
	let icon = document.querySelector("#scSitecoreMenu");
	// let button = document.querySelector("#scSitecoreRibbon > span");
	

	if(storage == "true") {
		dock.classList.add("showSitecoreMenu");
		icon.classList.add("scSitecoreMenu");
		// button.classList.add("active");
	} else {
		dock.classList.remove("showSitecoreMenu");
		icon.classList.remove("scSitecoreMenu");
		// button.classList.remove("active");
	}

}

/**
 * Get Accent Color 
 */
const getAccentColor = () => {

	let color, text, brightness;
	let storage = localStorage.getItem('scColorPicker');
	if(storage) {
		color = storage;
		text = setTextColour(color);
		(text == "#ffffff") ? brightness = 10 : brightness = 0;

		let root = document.documentElement;
		root.style.setProperty('--accent', color);
		root.style.setProperty('--accentText', text);
		root.style.setProperty('--accentBrightness', brightness);
	} else {
		color = "#ee3524"; //red
	}

	return color;

}

/**
 * Init Color Picker
 */
const initColorPicker = () => {

	let color, text, brightness;
	
	let input = '<input type="color" id="scAccentColor" name="scAccentColor" value="' + getAccentColor() + '" title="Choose your accent color">';
	let menu = document.querySelector(".sc-accountInformation");
	menu.insertAdjacentHTML( 'afterbegin', input);


	//Listenenr on change
	//To change text color based on BG light -> https://css-tricks.com/switch-font-color-for-different-backgrounds-with-css/
	let colorPicker = document.querySelector("#scAccentColor");
	colorPicker.addEventListener('change', (event) => {

		color = colorPicker.value;
		text = setTextColour(color);
		(text == "#ffffff") ? brightness = 10 : brightness = 0;

		//Reload all Gallery iframes
		let allIframes = document.querySelectorAll("iframe").forEach(function(e) {
			e.src.includes("xmlcontrol=Gallery") ? e.contentWindow.location.reload() : false;
		});

		let root = document.documentElement;
		root.style.setProperty('--accent', color);
		root.style.setProperty('--accentText', text);
		root.style.setProperty('--accentBrightness', brightness);

		localStorage.setItem('scColorPicker', color);
	});

}

/**
 * Set Insert + Icon in Content Tree
 */
const setInsertIcon = (id) => {
	
	id = id.replace("Tree_Node_","");
	let item = document.querySelector("#Tree_Glyph_" + id);
	let a = document.querySelector("#Tree_Node_" + id);
	let itemName = a.querySelector("span").innerText;
	let active = document.querySelector(".scContentTreeNodeActive").id.replace("Tree_Node_","");
	let rect = item.getBoundingClientRect();
	let left = document.querySelector(".splitter-bar").style.left.replace("px","");
	let activeClass = "";
	id == active ? activeClass = "scInsertItemIconInverted" : false;

	//Remove existing Insert Icons
	document.querySelectorAll(".scInsertItemIcon").forEach((el) => { el.remove() });
    //Add Insert Icon
    a.insertAdjacentHTML( 'afterend', `<span id="scIcon` + id + `" title="Insert under this node" class="scInsertItemIcon ` + activeClass + `" onclick="insertPage('` + id + `', '` + itemName + `')"></span>` );
    let target = document.querySelector('#scIcon' + id);
	target ? target.setAttribute("style","opacity:1") : false;

}

/**
 * Init Insert Icon
 */
const initInsertIcon = () => {

	let contentTree = document.querySelector(".scContentTree");
	let treeNode = document.querySelector(".scContentTreeContainer");
	if(treeNode) {

	    // let observer = new MutationObserver((mutations) => {
	    // 	console.log(mutations);
	    // 	contentTree.innerHTML = contentTree.innerHTML.replace('style="color:green"','');
	    // });
	    // //Observer
	    // contentTree ? observer.observe(contentTree, { attributes: false, childList: true, characterData: false, subtree: false }) : false;

		contentTree.addEventListener('mouseleave', (event) => {
			document.querySelector(".scInsertItemIcon") ? document.querySelector(".scInsertItemIcon").setAttribute("style","opacity:0") : false;
		});

		treeNode.addEventListener('mouseover', (event) => {
			if(event.path[1].className == "scContentTreeNodeNormal" || event.path[1].className == "scContentTreeNodeActive") {
				setInsertIcon(event.path[1].getAttribute("id"));
			}
			if(event.path[2].className == "scContentTreeNodeNormal" || event.path[2].className == "scContentTreeNodeActive") {
				setInsertIcon(event.path[2].getAttribute("id"));
			}
		});
	}

}

/**
 * Insert Gutter
 */
const initGutter = () => {

	let treeNode = document.querySelector(".scContentTreeContainer");
	let html = `<div class="scGutter" onclick="javascript:if (window.scGeckoActivate) window.scGeckoActivate(); return scContent.onTreeClick(this, event)" oncontextmenu="javascript:return scContent.onTreeContextMenu(this, event)" onkeydown="javascript:return scContent.onTreeKeyDown(this, event)"></div>`;
	treeNode ? treeNode.insertAdjacentHTML( 'afterbegin', html) : false;

}
