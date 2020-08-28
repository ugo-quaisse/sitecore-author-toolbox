/* eslint-disable prefer-named-capture-group */
/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { setPlural } from "./helpers.js";
import { getAccentColor } from "./experimentalui.js";

export { getImageInfo, initMediaExplorer, initMediaCounter, initMediaDragDrop, initMediaViewButtons };

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
    blob = xhr.response;

    document.querySelector(".mediaType_" + imageId).innerHTML = getFileType(blob.type);
    document.querySelector(".mediaSize_" + imageId).innerHTML = bytesToSize(blob.size);

    jsonObject.type = getFileType(blob.type);
    jsonObject.size = bytesToSize(blob.size);

    document.querySelector(".mediaSize_" + imageId).dataset.size = blob.size;
  };
  xhr.send();
};

/**
 * Init Media Library Explorer
 */
const initMediaExplorer = () => {
  let mediaItems = document.querySelectorAll("#FileList > a");
  mediaItems.forEach((el) => {
    el.remove();
  });
  let mediaId, mediaThumbnail, mediaImage, mediaTitle, mediaDimensions, mediaWarning, mediaUsage, mediaFolder, mediaArrow, mediaClass, mediaClick;
  let mediaItemsJson = {};
  let scMediaThumbnailSize = localStorage.getItem("scMediaThumbnailSize") ? localStorage.getItem("scMediaThumbnailSize") : 25;

  getAccentColor();

  // prettier-ignore
  let mediaExplorer =
    `<input id="mediaThumbnailSize" class="mediaThumbnailSize" type ="range" min ="25" max="100" step ="5" value ="` +
    scMediaThumbnailSize +
    `" onchange="updateMediaThumbnails(this.value)"/>

      <table class="scMediaExplorer">
        <thead>
          <tr>
            <th colspan="3" width="35%" onclick="sortTable('name', 'Name', 0)">Name</th>
            <th width="12%" onclick="sortTable('info', 'Info', 1)" data-sort="ASC">Info</th>
            <th width="12%" onclick="sortTable('type', 'Type', 2)" data-sort="ASC">Type</th>
            <th width="12%" onclick="sortTable('datasize', 'Size', 3)" data-sort="ASC">Size</th>
            <th onclick="sortTable('validation', 'Validation', 4)" data-sort="ASC">Validation</th>
            <th onclick="sortTable('usage', 'Usage', 5)" data-sort="ASC">Usage</th>
            <th width="100px" class="noSort"></th>
          </tr>
        </thead>
        <tbody>`;

  for (let item of mediaItems) {
    mediaId = item ? item.getAttribute("id") : false;
    mediaThumbnail = item.querySelector(".scMediaBorder > img") ? item.querySelector(".scMediaBorder > img").getAttribute("src") : false;
    mediaImage = item.querySelector(".scMediaBorder > img")
      ? item.querySelector(".scMediaBorder > img").getAttribute("src").replace("&h=72&thn=1&w=72", "").replace("bc=white&", "")
      : false;
    mediaTitle = item.querySelector(".scMediaTitle") ? item.querySelector(".scMediaTitle").innerText : "--";
    mediaDimensions = item.querySelector(".scMediaDetails") ? item.querySelector(".scMediaDetails").innerText : "--";
    mediaWarning = item.querySelector(".scMediaValidation") ? item.querySelector(".scMediaValidation").innerText : "--";
    mediaWarning = mediaWarning.includes(" warning")
      ? mediaWarning.split(" warning")[0] + " warning" + setPlural(mediaWarning.split(" warning")[0])
      : mediaWarning;
    //iconWarningMedia
    mediaUsage = item.querySelector(".scMediaUsages") ? item.querySelector(".scMediaUsages").innerText : "not used";
    mediaFolder = mediaImage.includes("/folder.png") ? "Folder" : "--";
    mediaClass = mediaImage.includes("/folder.png") ? "scMediaFolder" : "scMediaPreview";
    mediaArrow = mediaImage.includes("/folder.png") ? "▶" : " ";
    mediaUsage = mediaImage.includes("/folder.png") ? "--" : mediaUsage;
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

    //Prepare html table
    // prettier-ignore
    mediaExplorer += `
      <tr id="mediaItem_` + mediaId + `">
        <td class="mediaArrow" onclick="` + mediaClick + `">` + mediaArrow + `</td>
        <td class="mediaThumbnail" onclick="` + mediaClick + `"><img src='` + mediaThumbnail + `' style="width: ` + scMediaThumbnailSize + `px !important" class="` + mediaClass + ` scMediaThumbnail" loading="lazy"/></td>
        <td onclick="` + mediaClick + `"><div onclick="javascript:return scForm.postEvent(this,event,'item:rename(id={` + itemId + `})')" class="mediaTitle"  title="` + mediaTitle + ` (Click to rename)" >` + mediaTitle + `</div></td>
        <td class="left" onclick="` + mediaClick + `">` + mediaDimensions + `</td>
        <td class="mediaType mediaType_` + mediaId + `" onclick="` + mediaClick + `">` + mediaFolder + `</td>
        <td class="mediaSize mediaSize_` + mediaId + `" data-size="0" onclick="` + mediaClick + `">--</td>
        <td class="left" onclick="` + mediaClick + `">` + mediaWarning + `</td>
        <td class="left" onclick="` + mediaClick + `">` + mediaUsage + `</td>
        <td class="center">
          <a download href="` + mediaImage + `" class="scMediaActions t-sm t-top t-invert" data-tooltip="Download">
            <img src="` + global.iconDownload + `" class="scLanguageIcon">
          </a>
          <button class="scMediaActions t-sm t-top t-invert" data-tooltip="Delete" type="button" onclick="javascript:return scForm.postEvent(this,event,'item:delete(id={` + itemId + `})')">
            <img src="` + global.iconBin + `" class="scLanguageIcon">
          </button>
        </td>
      </tr>`;

    //Get size and type from URL
    mediaFolder != "Folder" ? getImageInfo(mediaImage, mediaId, mediaItemsJson[mediaId]) : "Folder";
  }
  mediaExplorer += `</tbody></table>`;
  document.querySelectorAll(".scTitle")[1] ? document.querySelectorAll(".scTitle")[1].insertAdjacentHTML("afterend", mediaExplorer) : false;

  //Buttom view
  document.querySelector(".scButtonGrid").classList.remove("selected");
  document.querySelector(".scButtonList").classList.add("selected");

  //Sort
  let scMediaSortPos = localStorage.getItem("scMediaSortPos") ? localStorage.getItem("scMediaSortPos") : null;
  let scMediaSortOrder = localStorage.getItem("scMediaSortOrder") ? localStorage.getItem("scMediaSortOrder") : 2;

  if (scMediaSortPos != null) {
    setTimeout(function () {
      document.querySelectorAll(".scMediaExplorer > thead > tr > th")[scMediaSortPos].click();
    }, 200);
  }
  if (scMediaSortOrder == -1) {
    setTimeout(function () {
      document.querySelectorAll(".scMediaExplorer > thead > tr > th")[scMediaSortPos].click();
    }, 210);
  }
};

/**
 * Init Media Library Counter
 */
const initMediaCounter = () => {
  let totalItem = document.querySelectorAll("#FileList > a").length;
  let titleMedia = document.querySelectorAll(".scTitle")[1];
  titleMedia ? (titleMedia.innerText = titleMedia.innerText + ` (` + totalItem + `)`) : false;
};

/**
 * Init Media Library Drag and Drop button
 */
const initMediaDragDrop = () => {
  var scIframeSrc = window.location.href.split("id=%7B");
  scIframeSrc = scIframeSrc[1].split("%7B");
  scIframeSrc = scIframeSrc[0].split("%7D");
  var scMediaID = scIframeSrc[0];
  //Prepare HTML
  var scUploadMediaUrl = `/sitecore/client/Applications/Dialogs/UploadMediaDialog?ref=list&ro=sitecore://master/%7b${scMediaID}%7d%3flang%3den&fo=sitecore://master/%7b${scMediaID}%7d`;
  //Add button
  var scFolderButtons = document.querySelector(".scFolderButtons");
  var scButtonHtml = `<a class="scButton t-sm t-top" data-tooltip="Drag and drop upload" id="scUploadDragDrop" onclick="javascript:scSitecore.prototype.showModalDialog('${scUploadMediaUrl}', '', '', null, null); return false;"><img loading="lazy" src=" ${global.iconGallery} " width="16" height="16" class="scIcon" alt="" border="0"><div class="scHeader">Upload multiple files</div></a>`;
  scFolderButtons.insertAdjacentHTML("afterbegin", scButtonHtml);
};

/**
 * Init Media Library View buttons
 */
const initMediaViewButtons = () => {
  let scFolderButtons = document.querySelector(".scFolderButtons");
  let listSelected, gridSelected;
  localStorage.getItem("scMediaView") == "list" ? (listSelected = "selected") : (gridSelected = "selected");

  //Insert Media view
  // prettier-ignore
  let scButtonHtml = `
  <a class="scButton scButtonList ` + listSelected + ` t-sm t-top" data-tooltip="List view"  onclick="switchMediaView('list')"><img loading="lazy" src=" ${global.iconListView} " width="16" height="16" class="scIcon" alt="" border="0"></a>
  <a class="scButton scButtonGrid ` + gridSelected + ` t-sm t-top" data-tooltip="Grid view""  onclick="switchMediaView('grid')"><img loading="lazy" src=" ${global.iconGridView} " width="16" height="16" class="scIcon" alt="" border="0"></a>`;
  scFolderButtons.insertAdjacentHTML("beforeend", scButtonHtml);

  //Back to parent
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
            document.querySelector(".scFolderButtons").insertAdjacentHTML("afterbegin", scButtonHtml);
            //Insert Back
            scButtonHtml =
              `<a class="scButton scSmall t-sm t-top" data-tooltip="Back" onclick="javascript:scForm.getParentForm().invoke('item:load(id={` +
              parentScId +
              `})');return false" title="Back to ` +
              parentScTitle +
              `"><img loading="lazy" src=" ${global.iconParent} " width="16" height="16" class="scIcon" alt="alt="Back to ` +
              parentScTitle +
              `" border="0"><div class="scHeader">&nbsp;</div></a>`;
            document.querySelector(".scFolderButtons").insertAdjacentHTML("afterbegin", scButtonHtml);
            break;
          }
        }
      }
    }
  }, 150);
};

/**
 * Init Media Library Drag and Drop button
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
