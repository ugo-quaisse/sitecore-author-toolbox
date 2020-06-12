/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {consoleLog, loadCssFile, loadJsFile, exeJsCode, preferesColorScheme, sitecoreItemJson, fetchTimeout, getScItemData, setPlural, setTextColour, repositionElement, startDrag, calcMD5};


/**
 * Show message in console
 */
const consoleLog = (message, color) => {

    let bgColor, txtColor, fontSize;

    switch(color) {
        case "yellow":
            bgColor = "#ffce42";
            txtColor = "black";
            fontSize = "14px";
        break

        case "red":
            bgColor = "#f33d35";
            txtColor = "white";
            fontSize = "14px";
        break;

        case "green":
            bgColor = "#32ed74";
            txtColor = "black";
            fontSize = "10px";
        break;

        case "orange":
            bgColor = "#f16100";
            txtColor = "black";
            fontSize = "10px";
        break;

        case "purple":
            bgColor = "#32ed74";
            txtColor = "black";
            fontSize = "10px";
        break;

        case "beige":
            bgColor = "#cdc4ba";
            txtColor = "black";
            fontSize = "10px";
        break;
    }

    global.debug ? console.info("%c " + message + " ", 'font-size: ' + fontSize  + '; background: ' + bgColor  + '; color: ' + txtColor  + '; border-radius:5px; padding 3px;') : false;

}

/**
 * Load CSS file
 */
const loadCssFile = (file) => {

    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href =  chrome.runtime.getURL(file);
    (document.head||document.documentElement).appendChild(link);

}

/**
 * Load Javascript file
 */
const loadJsFile = (file) => {

    var script = document.createElement('script');
    script.src = chrome.runtime.getURL(file);
    (document.head||document.documentElement).appendChild(script);
    script.remove();

}

/**
 * Execute Javascript code
 */
const exeJsCode = (code) => {

    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();

}

/**
 * Get active OS color Scheme
 */
const preferesColorScheme = () => {
    let color = "light";
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        color = "dark";
    } else {
        color = "light";
    }
    return color;
}

/**
 * Get active Siteore item from Chrome Storage
 */
const sitecoreItemJson = (itemID, languageID, versionID) => {
    //Read data
    chrome.storage.sync.get(["scData"], function(result) {
        let scData = new Object();
        if(result.scData != undefined) {
            scData = result.scData;
            scData[window.document.location.origin] = { scItemID: itemID, scLanguage: languageID, scVersion:versionID};
        } else {
            scData[window.document.location.origin] = { scItemID: itemID, scLanguage: languageID, scVersion:versionID};
        }

        //Save data
        chrome.storage.sync.set({"scData": scData}, function() {
            global.debug ? console.info("%c [Write] Item : " + itemID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;') : false;
            global.debug ? console.info("%c [Write] Language : " + languageID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;') : false;
            global.debug ? console.info("%c [Write] Version : " + versionID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;') : false;
            return scData;
        });
    });
  
}

/**
 *  Create a new object with Sitecore Actime item (From Quickinfo)
 */
const getScItemData = () => {

    var scItem = new Object();
    var dom = document.querySelectorAll(".scEditorQuickInfo  > tbody > tr");

    for(var tr of dom) {
        tr.cells[0].innerText == "Item ID:" ? scItem.id = tr.cells[1].querySelector("input").value.toLowerCase() : false;
        tr.cells[0].innerText == "Item name:" ? scItem.name = tr.cells[1].innerText.toLowerCase() : false;
        tr.cells[0].innerText == "Item path:" ? scItem.path = tr.cells[1].querySelector("input").value.toLowerCase() : false;
        tr.cells[0].innerText == "Template:" ? scItem.template = tr.cells[1].querySelector("a").innerText.toLowerCase() : false;
        tr.cells[0].innerText == "Template:" ? scItem.templateId = tr.cells[1].querySelector("input").value.toLowerCase() : false;
        tr.cells[0].innerText == "Created from:" ? scItem.from = tr.cells[1].innerText.toLowerCase() : false;
        tr.cells[0].innerText == "Item owner:" ? scItem.owner = tr.cells[1].querySelector("input").value.toLowerCase() : false;
        scItem.language = document.querySelector("#scLanguage") ? document.querySelector("#scLanguage").value.toLowerCase() : "en";
        scItem.version = document.querySelector (".scEditorHeaderVersionsVersion > span") ? document.querySelector( ".scEditorHeaderVersionsVersion > span" ).innerText : "1";
    }

    return scItem;
}

/**
 * Plural english
 */
const setPlural = (int) => {
    return int > 1 ? "s" : "";
}

/**
 * Used with Fetch as a timout event
 */
const fetchTimeout = (time, promise) => {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, time);
    promise.then(resolve, reject); 
  });
}

/**
 * Reposition element when dragged
 */
function repositionElement(event) {
    this.setAttribute("style", "left:" + (event.clientX + 37) + "px");
}

/**
 * Make an element draggable
 */
function startDrag() {
    var initX, mousePressX;
    var contextmenu = document.querySelector('.scExpTab');
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
}

const setTextColour = (hex) => {

    hex = hex.replace("#","");
    let rgb = [];

    //Convert hex to RGB
    let bigint = parseInt(hex, 16);
    rgb[0] = (bigint >> 16) & 255;
    rgb[1] = (bigint >> 8) & 255;
    rgb[2] = bigint & 255;

    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                          (parseInt(rgb[1]) * 587) +
                          (parseInt(rgb[2]) * 114)) / 1000);
    const textColour = (brightness > 170) ? '#111111' : '#ffffff';

    return textColour;
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

let srt, a,b, c, d, e, f, g, h, i, j ,k ,l ,m ,n ,o ,p ,q ,r, s, t, u, v, w, x, y ,z;

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  var str = "";
  for(var j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  var nblk = ((str.length + 8) >> 6) + 1;
  var blks = new Array(nblk * 16);
  for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}