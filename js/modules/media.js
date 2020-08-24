/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { setPlural } from "./helpers.js";

export { getImageInfo, initMediaExplorer, initMediaCounter, initMediaDragDrop };

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
  fileType = fileType == "x-zip-compressed" ? "zip" : fileType;
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
const getImageInfo = (imageUrl, imageId, imageJson) => {
  var blob = null;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", imageUrl, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    blob = xhr.response;

    document.querySelector(".mediaType_" + imageId).innerHTML = getFileType(blob.type);
    document.querySelector(".mediaSize_" + imageId).innerHTML = bytesToSize(blob.size);

    document.querySelector(".mediaType_" + imageId).dataset.type = blob.size;
    document.querySelector(".mediaSize_" + imageId).dataset.size = blob.size;

    imageJson.size = bytesToSize(blob.size);
    imageJson.type = getFileType(blob.type);
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
  let mediaId,
    mediaThumbnail,
    mediaImage,
    mediaTitle,
    mediaDimensions,
    mediaWarning,
    mediaUsage,
    mediaFolder,
    mediaArrow,
    mediaClass,
    mediaClick;
  let mediaItemsJson = {};
  let scMediaThumbnailSize = localStorage.getItem("scMediaThumbnailSize")
    ? localStorage.getItem("scMediaThumbnailSize")
    : 25;
  // prettier-ignore
  let mediaExplorer = `
      <input id="mediaThumbnailSize" type ="range" min ="25" max="100" step ="5" value ="` + scMediaThumbnailSize + `" onchange="updateMediaThumbnails(this.value)" style="float: right;
    margin: -20px 30px 5px 0px;"/>

      <table class="scMediaExplorer">
        <tr>
          <th colspan="3" width="35%" onclick="sortTable(2, this, 'Name')">Name</th>
          <th width="13%" onclick="sortTable(3, this, 'Info')" data-sort="ASC">Info</th>
          <th width="13%" onclick="sortTable(4, this, 'Type')" data-sort="ASC">Type</th>
          <th width="13%" onclick="sortTable(5, this, 'Size')" data-sort="ASC">Size</th>
          <th width="13%" onclick="sortTable(6, this, 'Validation')" data-sort="ASC">Validation</th>
          <th width="13%" onclick="sortTable(7, this, 'Usage')" data-sort="ASC">Usage</th>
        </tr>`;

  for (let item of mediaItems) {
    mediaId = item ? item.getAttribute("id") : false;
    mediaThumbnail = item.querySelector(".scMediaBorder > img")
      ? item.querySelector(".scMediaBorder > img").getAttribute("src")
      : false;
    mediaImage = item.querySelector(".scMediaBorder > img")
      ? item
          .querySelector(".scMediaBorder > img")
          .getAttribute("src")
          .replace("&h=72&thn=1&w=72", "")
          .replace("bc=white&", "")
      : false;
    mediaTitle = item.querySelector(".scMediaTitle") ? item.querySelector(".scMediaTitle").innerText : "--";
    mediaDimensions = item.querySelector(".scMediaDetails") ? item.querySelector(".scMediaDetails").innerText : "--";
    mediaWarning = item.querySelector(".scMediaValidation") ? item.querySelector(".scMediaValidation").innerText : "";
    mediaWarning = mediaWarning.includes(" warning")
      ? mediaWarning.split(" warning")[0] + " warning" + setPlural(mediaWarning.split(" warning")[0])
      : mediaWarning;
    mediaUsage = item.querySelector(".scMediaUsages") ? item.querySelector(".scMediaUsages").innerText : "";
    mediaFolder = mediaImage.includes("/folder.png") ? "Folder" : "--";
    mediaClass = mediaImage.includes("/folder.png") ? "scMediaFolder" : "scMediaPreview";
    mediaArrow = mediaImage.includes("/folder.png") ? "▶" : " ";
    mediaClick = item ? item.getAttribute("onclick") : false;

    //Build a JSON object
    mediaItemsJson[mediaId] = {
      id: mediaId,
      thumbnail: mediaThumbnail,
      image: mediaImage,
      title: mediaTitle,
      dimensions: mediaDimensions,
      warning: mediaWarning,
      usage: mediaUsage,
      size: "--",
      type: "--",
    };

    //Prepare html table
    // prettier-ignore
    mediaExplorer += `
    <tr id="mediaItem_` + mediaId + `" onclick="` + mediaClick + `">
      <td class="mediaArrow">` + mediaArrow + `</td>
      <td class="mediaThumbnail"><img src='` + mediaThumbnail + `' style="width: ` + scMediaThumbnailSize + `px !important" class="` + mediaClass + ` scMediaThumbnail" loading="lazy"/></td>
      <td class="mediaTitle"><span data-title="` + mediaTitle + `">` + mediaTitle + `</span></td>
      <td class="mediaDimensions"><span data-dimensions="` + mediaDimensions + `">` + mediaDimensions + `</span></td>
      <td class="mediaType"><span class="mediaType_` + mediaId + `" data-type="` + mediaFolder + `">` + mediaFolder + `</span></td>
      <td class="mediaSize"><span class="mediaSize_` + mediaId + `" data-size="--">--</span></td>
      <td><span data-warning="` + mediaWarning + `">` + mediaWarning + `</span></td>
      <td><span data-usage="` + mediaUsage + `">` + mediaUsage + `</span></td>
    </tr>`;

    //Get size and type from URL
    mediaFolder != "Folder" ? getImageInfo(mediaImage, mediaId, mediaItemsJson[mediaId]) : "Folder";
  }
  mediaExplorer += `</table>`;
  document.querySelectorAll(".scTitle")[1].insertAdjacentHTML("afterend", mediaExplorer);
  resizeTable(".scMediaExplorer");
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
  //scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ')
  var scButtonHtml = `<a href="#" class="scButton" onclick="javascript:scSitecore.prototype.showModalDialog('${scUploadMediaUrl}', '', '', null, null); false"><img loading="lazy" src=" ${global.launchpadIcon} " width="16" height="16" class="scIcon" alt="" border="0"><div class="scHeader">Upload files (Drag and Drop)</div></a>`;
  // //Insert new button
  scFolderButtons.insertAdjacentHTML("afterbegin", scButtonHtml);
};

/**
 * Init Media Library Drag and Drop button
 */
const resizeTable = (id) => {
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

  function setListeners(div) {
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

    document.addEventListener("mouseup", function (e) {
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined;
    });
  }

  function createDiv(height) {
    var div = document.createElement("div");
    div.style.top = 0;
    div.style.right = 0;
    div.style.width = "5px";
    div.style.position = "absolute";
    div.style.cursor = "col-resize";
    div.style.userSelect = "none";
    div.style.height = height + "px";
    return div;
  }

  function paddingDiff(col) {
    if (getStyleVal(col, "box-sizing") == "border-box") {
      return 0;
    }

    var padLeft = getStyleVal(col, "padding-left");
    var padRight = getStyleVal(col, "padding-right");
    return parseInt(padLeft) + parseInt(padRight);
  }

  function getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css);
  }
};
