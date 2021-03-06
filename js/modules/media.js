/* eslint-disable prefer-named-capture-group */
/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode, setPlural, getScItemData } from "./helpers.js";
import { getAccentColor } from "./experimentalui.js";

export { getImageInfo, initMediaExplorer, initMediaCounter, initMediaDragDrop, initMediaViewButtons, initUploadButton, initUploader, initLightbox, initMediaSearchBox };

/**
 * Convert bytes to Size
 */
const bytesToSize = (bytes) => {
  // eslint-disable-next-line array-element-newline
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 MB";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / 1024 ** i, 2) + " " + sizes[i];
};

/**
 * Get file type
 */
const getFileType = (type) => {
  var fileType = type.split("/");
  fileType = fileType[1] ? fileType[1] : fileType[0];
  fileType = fileType == "x-zip-compressed" ? "Zip file" : fileType;
  fileType = fileType == "svg+xml" ? "SVG image" : fileType;
  fileType = fileType == "jpg" ? "JPEG image" : fileType;
  fileType = fileType == "jpeg" ? "JPEG image" : fileType;
  fileType = fileType == "png" ? "PNG image" : fileType;
  fileType = fileType == "gif" ? "GIF image" : fileType;
  fileType = fileType == "wepb" ? "WEBP image" : fileType;
  fileType = fileType == "svg+xml" ? "SVG image" : fileType;
  fileType = fileType == "pdf" ? "PDF document" : fileType;
  fileType = fileType == "mp4" ? "MP4 video" : fileType;
  fileType = fileType == "avi" ? "AVI video" : fileType;
  fileType = fileType == "mov" ? "MOV video" : fileType;
  fileType = fileType == "mpeg" ? "MPEG video" : fileType;
  fileType = fileType == "ogg" ? "OGG video" : fileType;
  fileType = fileType.includes("-officedocument") ? "Office document" : fileType;

  return fileType;
};

/**
 * Get image information
 */
const getImageInfo = (imageUrl, imageId, jsonObject) => {
  var blob = null;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", imageUrl, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (xhr.status == "200") {
      blob = xhr.response;

      document.querySelector(".mediaType_" + imageId).innerHTML = `<span>` + getFileType(blob.type) + `</span>`;
      document.querySelector(".mediaSize_" + imageId).innerHTML = bytesToSize(blob.size);

      jsonObject.type = getFileType(blob.type);
      jsonObject.size = bytesToSize(blob.size);

      document.querySelector(".mediaSize_" + imageId).dataset.size = blob.size;
    }
  };
  xhr.send();
};

/**
 * Init Media Library Explorer
 */
const initMediaExplorer = (storage) => {
  storage.feature_medialist == undefined ? (storage.feature_medialist = true) : false;
  storage.feature_mediacard == undefined ? (storage.feature_mediacard = true) : false;
  let isExperimental = storage.feature_experimentalui;
  if (localStorage.getItem("scMediaView") == "list" && storage.feature_medialist) {
    let mediaItems = document.querySelectorAll("#FileList > a:not(.scButton)");
    mediaItems.forEach((el) => {
      el.remove();
    });
    let mediaId, mediaThumbnail, mediaImage, mediaTitle, mediaDimensions, mediaWarning, mediaUsage, mediaFolder, mediaArrow, mediaClass, mediaClick, showDownload;
    let mediaItemsJson = {};
    let scMediaThumbnailSize = localStorage.getItem("scMediaThumbnailSize") ? localStorage.getItem("scMediaThumbnailSize") : 25;

    getAccentColor();

    // prettier-ignore
    let mediaExplorer =
      `<input id="mediaThumbnailSize" class="mediaThumbnailSize" type ="range" min ="25" max="150" step ="5" value ="${scMediaThumbnailSize}" onchange="updateMediaThumbnails(this.value)"/>

      <table class="scMediaExplorer">
        <thead>
          <tr>
            <th colspan="3" width="35%" onclick="sortTable('name', 'Name', 0)">Name</th>
            <th width="12%" onclick="sortTable('datainfo', 'Info', 1)" data-sort="ASC">Info</th>
            <th width="12%" onclick="sortTable('datatype', 'Type', 2)" data-sort="ASC">Type</th>
            <th width="12%" onclick="sortTable('datasize', 'Size', 3)" data-sort="ASC">Size</th>
            <th onclick="sortTable('datavalidation', 'Validation', 4)" data-sort="ASC">Validation</th>
            <th onclick="sortTable('datausage', 'Usage', 5)" data-sort="ASC">Usage</th>
            <th width="150px" class="noSort"></th>
          </tr>
        </thead>
        <tbody>`;

    for (let item of mediaItems) {
      mediaId = item ? item.getAttribute("id") : false;
      //.replace("&h=72", "&h=300").replace("&w=72", "&w=300")
      mediaThumbnail = item.querySelector(".scMediaBorder > img") ? item.querySelector(".scMediaBorder > img").getAttribute("src").replace("&h=72", "&h=180").replace("&w=72", "") : false;
      mediaImage = item.querySelector(".scMediaBorder > img") ? item.querySelector(".scMediaBorder > img").getAttribute("src").replace("&h=72", "").replace("&thn=1", "").replace("&w=72", "").replace("bc=white&", "") : false;
      mediaTitle = item.querySelector(".scMediaTitle") ? item.querySelector(".scMediaTitle").innerText : "--";
      mediaDimensions = item.querySelector(".scMediaDetails") ? item.querySelector(".scMediaDetails").innerText : "--";
      mediaWarning = item.querySelector(".scMediaValidation") ? item.querySelector(".scMediaValidation").innerText : "--";
      mediaWarning = mediaWarning.includes(" warning") ? mediaWarning.split(" warning")[0] + " warning" + setPlural(mediaWarning.split(" warning")[0]) : mediaWarning;
      //iconWarningMedia
      mediaUsage = item.querySelector(".scMediaUsages") ? item.querySelector(".scMediaUsages").innerText : "not used";
      mediaFolder = mediaImage.includes("/folder.png") ? "Folder" : "--";
      mediaClass = mediaImage.includes("/folder.png") ? "scMediaFolder" : "scMediaPreview";
      mediaArrow = mediaImage.includes("/folder.png") && mediaDimensions.toLowerCase() != "0 items" ? "▶" : " ";
      mediaUsage = mediaImage.includes("/folder.png") ? "--" : mediaUsage;
      showDownload = mediaImage.includes("/folder.png") ? "hidden" : "visible";
      mediaClick = item ? item.getAttribute("onclick") : false;

      //Build a JSON object
      mediaItemsJson[mediaId] = {
        id: mediaId,
        title: mediaTitle,
        dimensions: mediaDimensions,
        warning: mediaWarning,
        usage: mediaUsage,
        type: "--",
        size: "--",
      };

      //Item ID
      let itemId = mediaClick.split("{")[1].split("}")[0];

      //Invert color icons
      let invert = isExperimental ? "t-invert" : "";

      //Lightbox action
      let lightbox = mediaFolder != "Folder" ? `openLightbox('${mediaId}')` : mediaClick;

      //Prepare html table
      // prettier-ignore
      mediaExplorer += `
      <tr id="mediaItem_${mediaId}">
        <td class="mediaArrow" onclick="${mediaClick}">${mediaArrow}</td>
        <td class="mediaThumbnail ${mediaClass}">
          <img src='${mediaThumbnail}' onclick="${lightbox}" data-name="${mediaTitle}" data-size="${mediaDimensions}" data-id="${mediaId}" style="width: ${scMediaThumbnailSize}px !important; height: ${scMediaThumbnailSize}px !important" class="${mediaClass} scMediaThumbnail" loading="lazy" title="Preview"/>
        </td>
        <td class="mediaTitle_${mediaId}" onclick="doubleClick('${mediaId}','${itemId}')" title="${mediaTitle} (Double click to rename)">
          <div class="mediaTitle">${mediaTitle}</div>
        </td>
        <td class="left" onclick="${mediaClick}">${mediaDimensions}</td>
        <td class="mediaType mediaType_${mediaId}" onclick="${mediaClick}"><span>${mediaFolder}</span></td>
        <td class="mediaSize mediaSize_${mediaId}" data-size="0" onclick="${mediaClick}">--</td>
        <td class="left" onclick="${mediaClick}">${mediaWarning}</td>
        <td class="left" onclick="${mediaClick}">${mediaUsage}</td>
        <td class="center">  
          <a download href="${mediaImage}" class="scMediaActions t-sm t-top ${invert}" data-tooltip="Download" style="visibility: ${showDownload}">
            <img src="${global.iconDownload}" class="scMediaIcon">
          </a>
          <button class="scMediaActions t-sm t-top ${invert}" data-tooltip="Publish" type="button" onclick="javascript:return scForm.postEvent(this,event,'item:publish(id={${itemId}})')">
            <img src="${global.iconPublish}" class="scMediaIcon">
          </button>
          <button class="scMediaActions t-sm t-top ${invert}" data-tooltip="Delete" type="button" onclick="javascript:return scForm.postEvent(this,event,'item:delete(id={${itemId}})')">
            <img src="${global.iconTrash}" class="scMediaIcon">
          </button>
        </td>
      </tr>`;

      //Get size and type from URL
      mediaFolder != "Folder" ? getImageInfo(mediaImage, mediaId, mediaItemsJson[mediaId]) : "Folder";
    }
    mediaExplorer += `</tbody></table>`;

    //Insert list view
    document.querySelectorAll(".scTitle").forEach((el) => {
      el.innerText.toLowerCase().includes("media") ? el.insertAdjacentHTML("afterend", mediaExplorer) : false;
    });

    //Buttom view
    document.querySelector(".scButtonGrid") ? document.querySelector(".scButtonGrid").classList.remove("selected") : false;
    document.querySelector(".scButtonList") ? document.querySelector(".scButtonList").classList.add("selected") : false;

    //Sort
    let scMediaSortPos = localStorage.getItem("scMediaSortPos") ? localStorage.getItem("scMediaSortPos") : null;
    let scMediaSortOrder = localStorage.getItem("scMediaSortOrder") ? localStorage.getItem("scMediaSortOrder") : 2;

    if (scMediaSortPos != null) {
      setTimeout(function () {
        document.querySelectorAll(".scMediaExplorer > thead > tr > th")[scMediaSortPos] ? document.querySelectorAll(".scMediaExplorer > thead > tr > th")[scMediaSortPos].click() : false;
      }, 250);
    }
    if (scMediaSortOrder == -1) {
      setTimeout(function () {
        document.querySelectorAll(".scMediaExplorer > thead > tr > th")[scMediaSortPos] ? document.querySelectorAll(".scMediaExplorer > thead > tr > th")[scMediaSortPos].click() : false;
      }, 270);
    }
  } else if (storage.feature_mediacard) {
    document.querySelectorAll("#FileList > a:not(.scButton) > .scMediaBorder").forEach((el) => {
      let item = el.parentElement;
      // eslint-disable-next-line no-script-url
      let mediaClick = item ? item.getAttribute("onclick").replace("javascript:", "").replace("return false", "") : false;
      let mediaId = item ? item.getAttribute("id") : false;
      let mediaImage = item.querySelector(".scMediaBorder > img") ? item.querySelector(".scMediaBorder > img").getAttribute("src").replace("&h=72", "").replace("&thn=1", "").replace("&w=72", "").replace("bc=white&", "") : false;
      let mediaThumbnail = item.querySelector(".scMediaBorder > img") ? item.querySelector(".scMediaBorder > img").getAttribute("src").replace("&h=72", "&h=300").replace("&w=72", "") : false;
      let mediaTitle = item.querySelector(".scMediaTitle") ? item.querySelector(".scMediaTitle").innerText : "--";
      let mediaDimensions = item.querySelector(".scMediaDetails") ? item.querySelector(".scMediaDetails").innerText : "--";
      let mediaFolder = mediaImage.includes("/folder.png") ? "Folder" : "--";
      let mediaWarning = item.querySelector(".scMediaValidation") ? item.querySelector(".scMediaValidation").innerText : "No warning";

      //Ovverride old listener
      item.addEventListener(
        "click",
        (event) => {
          event.target.getAttribute("class") == "scMediaIcon" ? exeJsCode(`${mediaClick}`) : false;
          event.target.getAttribute("class") == "scMediaLightbox" ? exeJsCode(`openLightbox('${mediaId}');`) : false;
          // eslint-disable-next-line no-unneeded-ternary
          event.target.getAttribute("class") == "scMediaInfo" ? false : false;
          event.target.getAttribute("class") == "scMediaDelete"
            ? exeJsCode(
                `scForm.postEvent(this,event,'item:delete(id={` +
                  mediaId.substring(1).replace(
                    // eslint-disable-next-line prefer-named-capture-group
                    /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/u,
                    "$1-$2-$3-$4-$5"
                  ) +
                  `})')`
              )
            : false;
          event.stopPropagation();
        },
        true
      );
      //Action wapper
      el.parentElement ? el.parentElement.insertAdjacentHTML("beforeend", '<div class="scMediaActionsWrapper"</div>') : false;

      //Lightbox action
      let lightboxIcon = `<span class="t-sm t-top" data-tooltip="Preview"><img src="${global.iconLightbox}" class="scMediaLightbox"/></span>`;
      lightboxIcon = mediaFolder != "Folder" ? lightboxIcon : false;
      el.parentElement && lightboxIcon ? el.parentElement.querySelector(".scMediaActionsWrapper").insertAdjacentHTML("beforeend", lightboxIcon) : false;
      //Info Icon
      let infoIcon = `<span class="t-sm t-top" data-tooltip="${mediaWarning}"><img src="${global.iconInfo}" class="scMediaInfo"/></span>`;
      infoIcon = mediaFolder != "Folder" ? infoIcon : false;
      el.parentElement && infoIcon ? el.parentElement.querySelector(".scMediaActionsWrapper").insertAdjacentHTML("beforeend", infoIcon) : false;
      //Delete Icon
      let deleteIcon = `<span class="t-sm t-top" data-tooltip="Delete"><img src="${global.iconTrash}" class="scMediaDelete"/></span>`;
      deleteIcon = mediaFolder != "Folder" ? deleteIcon : false;
      el.parentElement && deleteIcon ? el.parentElement.querySelector(".scMediaActionsWrapper").insertAdjacentHTML("beforeend", deleteIcon) : false;

      //Adjust style
      item.querySelector(".scMediaBorder > img").setAttribute("loading", "lazy");
      mediaFolder == "Folder" ? item.querySelector(".scMediaBorder > img").setAttribute("src", global.iconMediaFolder) : item.querySelector(".scMediaBorder > img").setAttribute("src", mediaThumbnail);
      mediaFolder == "Folder" ? item.classList.add("scMediaFolder") : false;
      item.querySelector(".scMediaBorder > img").setAttribute("data-id", mediaId);
      item.querySelector(".scMediaBorder > img").setAttribute("data-size", mediaDimensions);
      item.querySelector(".scMediaBorder > img").setAttribute("data-name", mediaTitle);
      item.querySelector(".scMediaBorder").classList.add("mediaThumbnail");
      item.querySelector(".scMediaBorder").removeAttribute("style");
      item.querySelector(".scMediaBorder > img").setAttribute("title", item.querySelector(".scMediaTitle").innerText);
      item.removeAttribute("href");
      item.removeAttribute("onclick");
      item.classList.add("scMediaCard");
    });
  }
  //Escape and arrow navigation for lightbox
  let lightbox = parent.document.querySelector("#scLightbox");
  let lightboxPrev = parent.document.querySelector("#scLightboxPrev");
  let lightboxNext = parent.document.querySelector("#scLightboxNext");
  parent.document.onkeydown = function (evt) {
    evt.key == "Escape" && lightbox ? lightbox.setAttribute("style", "display:none") : false;
    evt.key == "ArrowRight" && lightbox ? lightboxNext.click() : false;
    evt.key == "ArrowLeft" && lightbox ? lightboxPrev.click() : false;
  };
  document.onkeydown = function (evt) {
    evt.key == "Escape" && lightbox ? lightbox.setAttribute("style", "display:none") : false;
    evt.key == "ArrowRight" && lightbox ? lightboxNext.click() : false;
    evt.key == "ArrowLeft" && lightbox ? lightboxPrev.click() : false;
  };
  if (lightbox) {
    lightbox.addEventListener("click", (evt) => {
      evt.target.getAttribute("class") != "action" ? lightbox.querySelector(".scLightboxContent > img").setAttribute("src", "") : false;
      evt.target.getAttribute("class") != "action" ? lightbox.querySelector(".scLightboxContent > iframe").setAttribute("src", "") : false;
      evt.target.getAttribute("class") != "action" ? lightbox.setAttribute("style", "display:none") : false;
    });
  }
};

/**
 * Init Media Library Counter
 */
const initMediaCounter = (storage) => {
  storage.feature_medialibrary == undefined ? (storage.feature_medialibrary = true) : false;
  if (storage.feature_medialibrary) {
    let totalItem = document.querySelectorAll("#FileList > a").length;
    document.querySelectorAll(".scTitle").forEach((el) => {
      el.innerText.toLowerCase().includes("media") ? (el.innerHTML = `${el.innerText} <i>(${totalItem})</i>`) : false;
    });
    //If empty
    if (totalItem == 0) {
      let scFolderButtons = document.querySelector(".scFolderButtons");
      let scButtonHtml = `<div class="scNoVersion"><p>The folder is empty.</p><br /></div>`;
      if (scFolderButtons) {
        scFolderButtons.insertAdjacentHTML("afterend", scButtonHtml);
      } else {
        document.querySelectorAll(".scTitle").forEach((el) => {
          el.innerText.toLowerCase().includes("media") ? el.insertAdjacentHTML("beforebegin", scButtonHtml) : false;
        });
      }
    }
  }
};

/**
 * Init Media Library Drag and Drop button
 */
const initMediaDragDrop = (storage) => {
  storage.feature_medialibrary == undefined ? (storage.feature_medialibrary = true) : false;
  if (storage.feature_medialibrary) {
    var scIframeSrc = window.location.href.split("id=%7B");
    scIframeSrc = scIframeSrc[1].split("%7B");
    scIframeSrc = scIframeSrc[0].split("%7D");
    var scMediaID = scIframeSrc[0];
    //Prepare HTML
    var scUploadMediaUrl = `/sitecore/client/Applications/Dialogs/UploadMediaDialog?ref=list&ro=sitecore://master/%7b${scMediaID}%7d%3flang%3den&fo=sitecore://master/%7b${scMediaID}%7d`;
    //Add upload button
    var scFolderButtons = document.querySelector(".scFolderButtons");
    var scButtonHtml = `<a class="scButton t-sm t-top" data-tooltip="Drag and drop upload" id="scUploadDragDrop" onclick="javascript:scSitecore.prototype.showModalDialog('${scUploadMediaUrl}', '', '', null, null); return false;"><img loading="lazy" src=" ${global.iconGallery} " width="16" height="16" class="scIcon" alt="" border="0"><div class="scHeader">Upload files</div></a>`;
    scFolderButtons ? scFolderButtons.insertAdjacentHTML("afterbegin", scButtonHtml) : false;
  }
};

/**
 * Init Media Library View buttons
 */
const initMediaViewButtons = (storage) => {
  storage.feature_medialist == undefined ? (storage.feature_medialist = true) : false;
  if (storage.feature_medialist) {
    let scFolderButtons = document.querySelector(".scFolderButtons");
    let listSelected, gridSelected;
    localStorage.getItem("scMediaView") == "list" ? (listSelected = "selected") : (gridSelected = "selected");

    // prettier-ignore
    let scButtonHtml = `
  <a class="scButton scButtonList ${listSelected} t-sm t-top" data-tooltip="List view"  onclick="switchMediaView('list')"><img loading="lazy" src="${global.iconListView}" width="16" height="16" class="scIcon" alt="" border="0"></a>
  <a class="scButton scButtonGrid ${gridSelected} t-sm t-top" data-tooltip="Grid view""  onclick="switchMediaView('grid')"><img loading="lazy" src="${global.iconGridView}" width="16" height="16" class="scIcon" alt="" border="0"></a>`;

    //Insert grid/list buttons
    if (scFolderButtons) {
      scFolderButtons.insertAdjacentHTML("beforeend", scButtonHtml);
    } else {
      document.querySelectorAll(".scTitle").forEach((el) => {
        el.innerText.toLowerCase().includes("media") ? el.insertAdjacentHTML("beforebegin", scButtonHtml) : false;
      });
    }

    //Back button
    setTimeout(function () {
      var elem = parent.document.querySelector(".scContentTreeNodeActive");
      var count = 0;
      for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.classList) {
          if (elem.classList.contains("scContentTreeNode")) {
            count++;
            if (count == 2) {
              var parentScTitle = elem.querySelector(".scContentTreeNodeNormal > span").innerText;
              var parentScId = elem
                .querySelector(".scContentTreeNodeNormal")
                .getAttribute("id")
                .replace("Tree_Node_", "")
                .replace(
                  // eslint-disable-next-line prefer-named-capture-group
                  /(.{8})(.{4})(.{4})(.{4})(.{12})/u,
                  "$1-$2-$3-$4-$5"
                );
              //Insert Refresh
              let scButtonHtml = `<a class="scButton scSmall t-sm t-top" data-tooltip="Refresh" onclick="javascript:location.reload(); return false;" title="Refresh view"><img loading="lazy" src=" ${global.iconRefresh} " width="16" height="16" class="scIcon" alt="Refresh view" border="0"><div class="scHeader">&nbsp;</div></a>`;
              if (scFolderButtons) {
                scFolderButtons.insertAdjacentHTML("afterbegin", scButtonHtml);
              } else {
                document.querySelectorAll(".scTitle").forEach((el) => {
                  el.innerText.toLowerCase().includes("media") ? el.insertAdjacentHTML("beforebegin", scButtonHtml) : false;
                });
              }
              //Insert Back
              //prettier-ignore
              scButtonHtml = `<a class="scButton scSmall t-sm t-top" data-tooltip="Back" onclick="javascript:scForm.getParentForm().invoke('item:load(id={` + parentScId + `})');return false" title="Back to ` + parentScTitle + `"><img loading="lazy" src=" ${global.iconParent} " width="16" height="16" class="scIcon" alt="alt="Back to ` + parentScTitle + `" border="0"><div class="scHeader">&nbsp;</div></a>`;
              if (scFolderButtons) {
                scFolderButtons.insertAdjacentHTML("afterbegin", scButtonHtml);
              } else {
                document.querySelectorAll(".scTitle").forEach((el) => {
                  el.innerText.toLowerCase().includes("media") ? el.insertAdjacentHTML("beforebegin", scButtonHtml) : false;
                });
              }
              break;
            }
          }
        }
      }
    }, 150);
  }
};

/**
 * Init Media Search box
 */
const initMediaSearchBox = (storage) => {
  storage.feature_medialibrary == undefined ? (storage.feature_medialibrary = true) : false;
  if (storage.feature_medialibrary) {
    var scFolderButtons = document.querySelector(".scFolderButtons");
    var scSearchHtml = `<div class="scSearch"><input type="text" placeholder="Search in folder"></div>`;
    scFolderButtons ? scFolderButtons.insertAdjacentHTML("afterend", scSearchHtml) : false;

    //Listerner
    let searchBox = document.querySelector(".scSearch > input");
    searchBox.addEventListener("input", () => {
      let count = 0;
      //Grid view
      document.querySelectorAll("#FileList a:not(.scButton)").forEach((elem) => {
        // eslint-disable-next-line require-unicode-regexp
        let regExp = new RegExp(searchBox.value, "i");
        if (elem.querySelector(".scMediaTitle")) {
          elem.querySelector(".scMediaTitle").innerText.match(regExp) ? elem.setAttribute("style", "display:block") : elem.setAttribute("style", "display:none");
          elem.querySelector(".scMediaTitle").innerText.match(regExp) ? count++ : false;
        }
      });
      //List view
      document.querySelectorAll(".scMediaExplorer > tbody > tr").forEach((elem) => {
        let count = 0;
        // eslint-disable-next-line require-unicode-regexp
        let regExp = new RegExp(searchBox.value, "i");
        if (elem.querySelector(".mediaTitle")) {
          elem.querySelector(".mediaTitle").innerText.match(regExp) ? elem.setAttribute("style", "display:content") : elem.setAttribute("style", "display:none");
          elem.querySelector(".mediaTitle").innerText.match(regExp) ? count++ : false;
        }
      });
      //Update counter
      document.querySelectorAll(".scTitle").forEach((el) => {
        el.innerText.toLowerCase().includes("media") ? (el.querySelector("i").innerHTML = `(${count})`) : false;
      });
    });
  }
};

/**
 * Resize Table
 */
// eslint-disable-next-line no-unused-vars
const resizeTable = (id) => {
  const setListeners = (div) => {
    var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

    div.addEventListener("mousedown", function (e) {
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX;

      var padding = paddingDiff(curCol);

      curColWidth = curCol.offsetWidth - padding;
      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
    });

    div.addEventListener("mouseover", function (e) {
      e.target.style.borderRight = "2px solid #0000ff";
    });

    div.addEventListener("mouseout", function (e) {
      e.target.style.borderRight = "";
    });

    document.addEventListener("mousemove", function (e) {
      if (curCol) {
        var diffX = e.pageX - pageX;

        if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

        curCol.style.width = curColWidth + diffX + "px";
      }
    });

    document.addEventListener("mouseup", function () {
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined;
    });
  };

  const createDiv = (height) => {
    var div = document.createElement("div");
    div.style.top = 0;
    div.style.right = 0;
    div.style.width = "5px";
    div.style.position = "absolute";
    div.style.cursor = "col-resize";
    div.style.userSelect = "none";
    div.style.height = height + "px";

    return div;
  };

  const paddingDiff = (col) => {
    if (getStyleVal(col, "box-sizing") == "border-box") {
      return 0;
    }

    var padLeft = getStyleVal(col, "padding-left");
    var padRight = getStyleVal(col, "padding-right");

    return parseInt(padLeft) + parseInt(padRight);
  };

  const getStyleVal = (elm, css) => window.getComputedStyle(elm, null).getPropertyValue(css);

  var table = document.querySelector(id);
  var row = table.getElementsByTagName("tr")[0],
    cols = row ? row.children : undefined;
  if (!cols) return;

  table.style.overflow = "hidden";

  var tableHeight = table.offsetHeight;

  for (var i = 0; i < cols.length; i++) {
    var div = createDiv(tableHeight);
    cols[i].appendChild(div);
    cols[i].style.position = "relative";
    setListeners(div);
  }
};

/**
 * Init Uploader styling in speak window
 */
const initUploadButton = (storage) => {
  storage.feature_medialibrary == undefined ? (storage.feature_medialibrary = true) : false;
  if (storage.feature_medialibrary) {
    let button = document.querySelector("button[data-sc-id='UploadButton']");
    let icon = `<img src="${global.iconUpload}" class="scUploadIcon"/>`;
    button ? button.insertAdjacentHTML("afterbegin", icon) : false;
  }
};

/**
 * Init Uploader styling
 */
const initUploader = () => {
  //Add visual
  let drop = document.querySelector(".sc-uploader-content");
  let icon = `<img src="${global.iconDrop}" class="scUploadIconDrop"/>`;
  drop ? drop.insertAdjacentHTML("afterbegin", icon) : false;

  if (document.querySelector("form[data-sc-id='Uploader']")) {
    //Drag events
    document.querySelector("form[data-sc-id='Uploader']").addEventListener(
      "dragover",
      function (event) {
        document.querySelector("form[data-sc-id='Uploader']").classList.add("scUploaderOver");
        event.preventDefault();
      },
      false
    );
    document.querySelector("form[data-sc-id='Uploader']").addEventListener(
      "dragleave",
      function (event) {
        document.querySelector("form[data-sc-id='Uploader']").classList.remove("scUploaderOver");
        event.preventDefault();
      },
      false
    );
    document.querySelector("form[data-sc-id='Uploader']").addEventListener(
      "drop",
      function (event) {
        document.querySelector("form[data-sc-id='Uploader']").classList.remove("scUploaderOver");
        event.preventDefault();
      },
      false
    );
  }
};

/**
 * Init Lightbox
 */
const initLightbox = () => {
  let scLightbox = document.querySelector("#scLightbox");
  let scItemPath = getScItemData().path;
  let html = `
  <div id="scLightbox" data-path="${scItemPath}">
    <div class="scLightboxHeader">
      <div class="scLightboxTitle"></div>
      <button class="sclightboxClose t-bottom t-xs" data-tooltip="Close">
        <img src="${global.iconWindowClose}" />
      </button>
      <button class="sclightboxDownload t-bottom t-xs" data-tooltip="Download" >
        <a download href="#"><img src="${global.iconDownloadWhite}" class="action" /></a>
      </button>
      <button class="sclightboxFullscreen t-bottom t-xs" data-tooltip="Fullscreen" >
        <img src="${global.iconFullscreen}" class="action" />
      </button>
      <button class="sclightboxCopy t-bottom t-xs" data-tooltip="Copy path" >
        <img src="${global.iconCopyWhite}" class="action" />
      </button>
    </div>
    <div class="action" id="scLightboxPrev"><img src="${global.iconArrowLeft}" class="action"/></div>
    <div class="scLightboxContent">
      <img src="" />
      <iframe src=""></iframe> 
    </div>
    <div class="action" id="scLightboxNext"><img src="${global.iconArrowRight}" class="action"/></div>
    <div class="scLightboxFooter"></div>
  </div>`;
  !scLightbox ? document.querySelector("body").insertAdjacentHTML("beforeend", html) : false;
};
