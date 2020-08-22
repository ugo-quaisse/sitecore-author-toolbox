/* eslint-disable newline-per-chained-call */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

// import bytesToSize from "./helpers.js";
import { setPlural } from "./helpers.js";

export { getImageInfo, initMediaExplorer };

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
  let mediaId, mediaThumbnail, mediaImage, mediaTitle, mediaSize, mediaError, mediaUsage, mediaFolder, mediaArrow, mediaClass, mediaClick;
  let mediaItemsJson = {};
  //▼
  let mediaExplorer = `
      <input id="mediaThumbnailSize" type ="range" min ="20" max="80" step ="10" value ="20" onchange="updateMediaThumbnails(this.value)" style="float: right;
    margin: -20px 30px 5px 0px;"/>

      <table class="scMediaExplorer">
        <tr>
          <th colspan="3" width="35%" onclick="sortTable(2)">Name ▲</th>
          <th width="13%" onclick="sortTable(3)">Info</th>
          <th width="13%" onclick="sortTable(4)">Type</th>
          <th width="13%" onclick="sortTable(5)">Size</th>
          <th width="13%" onclick="sortTable(6)">Validation</th>
          <th width="13%" onclick="sortTable(7)">Usage</th>
        </tr>`;

  for (let item of mediaItems) {
    mediaId = item ? item.getAttribute("id") : false;
    mediaThumbnail = item.querySelector(".scMediaBorder > img") ? item.querySelector(".scMediaBorder > img").getAttribute("src") : false;
    mediaImage = item.querySelector(".scMediaBorder > img")
      ? item.querySelector(".scMediaBorder > img").getAttribute("src").replace("&h=72&thn=1&w=72", "").replace("bc=white&", "")
      : false;
    mediaTitle = item.querySelector(".scMediaTitle") ? item.querySelector(".scMediaTitle").innerText : "--";
    mediaSize = item.querySelector(".scMediaDetails") ? item.querySelector(".scMediaDetails").innerText : "--";
    mediaError = item.querySelector(".scMediaValidation") ? item.querySelector(".scMediaValidation").innerText : "";
    mediaError = mediaError.includes(" warning") ? mediaError.split(" warning")[0] + " warning" + setPlural(mediaError.split(" warning")[0]) : mediaError;
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
      dimensions: mediaSize,
      error: mediaError,
      usage: mediaUsage,
      size: "--",
      type: "--",
    };

    //Prepare html table
    mediaExplorer +=
      `
        <tr onclick="` +
      mediaClick +
      `" id="mediaItem_` +
      mediaId +
      `">
          <td style="text-align:right; width:2%" class="mediaArrow">` +
      mediaArrow +
      `</td>
          <td style="text-align:center; width:3%">
          <img loading="lazy" src='` +
      mediaThumbnail +
      `' class="` +
      mediaClass +
      ` scMediaThumbnail"/>
          </td>
          <td class="mediaTitle">` +
      mediaTitle +
      `</td>
          <td>` +
      mediaSize +
      `</td>
          <td><span class="mediaType_` +
      mediaId +
      `">` +
      mediaFolder +
      `</span></td>
          <td><span class="mediaSize_` +
      mediaId +
      `">--</span></td>
          <td>` +
      mediaError +
      `</td>
          <td>` +
      mediaUsage +
      `</td>
        </tr>`;

    //Get size and type from URL
    mediaFolder != "Folder" ? getImageInfo(mediaImage, mediaId, mediaItemsJson[mediaId]) : "Folder";

    //Inject
  }
  mediaExplorer += `</table>`;
  document.querySelectorAll(".scTitle")[1].insertAdjacentHTML("afterend", mediaExplorer);
};
