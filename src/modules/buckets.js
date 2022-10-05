/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { enhancedBucketLists };

/**
 * Enhanced Bucket List Select Box
 */
const enhancedBucketLists = () => {
  var scBucketListSelectedBox = document.querySelectorAll(".scBucketListSelectedBox, .scContentControlMultilistBox");
  var Section_Data = document.querySelector("#Section_Data");

  scBucketListSelectedBox[1] ? (scBucketListSelectedBox = scBucketListSelectedBox[1]) : (scBucketListSelectedBox = scBucketListSelectedBox[0]);

  if (scBucketListSelectedBox) {
    scBucketListSelectedBox.addEventListener("change", function () {
      var itemId = scBucketListSelectedBox.value;
      itemId = itemId.includes("|") ? itemId.split("|")[1] : itemId;
      var itemName = scBucketListSelectedBox[scBucketListSelectedBox.selectedIndex].text;
      //prettier-ignore
      var scMessageEditText = `<a class="scMessageBarOption" href="${window.location.origin}/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#${itemId}" target="_blank"><u>Click here ⧉</u></a> `;
      //var scMessageExperienceText = '<a class="scMessageBarOption" href="' + window.location.origin + '/?sc_mode=edit&sc_itemid=' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
      //prettier-ignore
      var scMessageEdit = `<div id="Warnings" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(` + global.icon + `)"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">` + itemName + `</div>`;
      //prettier-ignore
      scMessageEdit += `<span id="Information" class="scMessageBarText"><span class="scMessageBarOptionBullet">` + scMessageEditText + `</span> to edit this datasource in <b>Content Editor</b>.</span>`;
      //scMessageEdit += `<span id="Information" class="scMessageBarText"><br /><span class="scMessageBarOptionBulletXP">` + scMessageExperienceText + `</span> to edit this datasource in <b>Experience Editor</b>.</span>`
      scMessageEdit += `</div></div>`;

      //Add hash to URL
      if (!document.querySelector(".scMessageBar")) {
        Section_Data.insertAdjacentHTML("beforebegin", scMessageEdit);
      } else {
        document.querySelector(".scMessageBarTitle").innerHTML = itemName;
        document.querySelector(".scMessageBarOptionBullet").innerHTML = scMessageEditText;
      }
    });
  }
};
