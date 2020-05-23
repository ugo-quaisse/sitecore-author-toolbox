/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';
import {getScItemData, setTextColour} from './helpers.js';

export {insertBreadcrumb, pathToBreadcrumb, initIcon, initColorPicker, initSitecoreMenu };

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
			underline ? breadcrumb += '<u class="home" onclick="javascript:return scForm.invoke(\'contenteditor:home\', event)">Home</u>' : breadcrumb += 'Home';
		} else {
			path = path[0].split("/");
		}

		for(let level of path) {
			if(underline) {
				level != "" ? breadcrumb += '<i>' + delimiter + '</i> <u>' + level.toLowerCase().capitalize() + '</u> ' : false;
			} else {
				level != "" ? breadcrumb += '<i>' + delimiter + '</i> ' + level.toLowerCase().capitalize() + ' ' : false;
			}
		}
	}

	breadcrumb = breadcrumb.replace('#####<i>' + delimiter + '</i>','').replace('#####','');
	return breadcrumb;

}

/**
 * Get insert menu for an item
 */
const insertBreadcrumb = (path) => {

	let breadcrumb = pathToBreadcrumb(path);
	let scBreadcrumb = document.querySelector(".scBreadcrumb");
	scBreadcrumb && path ? scBreadcrumb.innerHTML = breadcrumb : false;

}

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
    a.insertAdjacentHTML( 'afterend', '<span id="scIcon' + id + '" title="Insert under this node" class="scInsertItemIcon ' + activeClass + '" onclick="insertPage(\'' + id + '\', \'' + itemName + '\')"></span>' );
    let target = document.querySelector('#scIcon' + id);
	target ? target.setAttribute("style","opacity:1") : false;

}

const initSitecoreMenu = () => {
	let storage = localStorage.getItem('scSitecoreMenu');
	let dock = document.querySelector(".scDockTop");
	let icon = document.querySelector("#scSitecoreMenu");
	if(storage == "true") {
		dock.classList.add("showSitecoreMenu");
		icon.classList.add("scSitecoreMenu");
	} else {
		dock.classList.remove("showSitecoreMenu");
		icon.classList.remove("scSitecoreMenu");
	}

}

const initColorPicker = () => {

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
		color = "#2bc37c";
	}
	let input = '<input type="color" id="scAccentColor" name="scAccentColor" value="' + color + '">';
	let menu = document.querySelector(".sc-accountInformation");
	menu.insertAdjacentHTML( 'afterbegin', input);


	//Listenenr on change
	//To change text color based on BG light -> https://css-tricks.com/switch-font-color-for-different-backgrounds-with-css/
	let colorPicker = document.querySelector("#scAccentColor");
	colorPicker.addEventListener('change', (event) => {

		color = colorPicker.value;
		text = setTextColour(color);
		(text == "#ffffff") ? brightness = 10 : brightness = 0;

		let root = document.documentElement;
		root.style.setProperty('--accent', color);
		root.style.setProperty('--accentText', text);
		root.style.setProperty('--accentBrightness', brightness);

		localStorage.setItem('scColorPicker', color);
	});

}

const initIcon = () => {

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
