/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { initStorageFeature } from "./helpers.js";

export { initCollection };

/**
 * Reset Experience Editor CSS
 */
const initCollection = (storage) => {
  storage.feature_collection = initStorageFeature(storage.feature_collection, true);
  let menu = document.querySelector(".sc-accountInformation");

  //prettier-ignore
  let htmlIcon = `<span id="satCollection" class="t-bottom t-sm" data-tooltip="My Collections"><img loading="lazy" id="scCollection" onclick="" src="${global.iconCollection}" class="scIconMenu" accesskey="w" /></span>`;
  menu ? menu.insertAdjacentHTML("afterbegin", htmlIcon) : false;

  let scModalCollection = document.querySelector("#scModalCollection");
  let htmlMenuInner = `<div class="header"><span class="title">My Collections</span> <span class="maximize"></span> <span class="close"></span></div><div class="main"></div><div class="preload"> ` + global.svgAnimation + `</div>`;
  let htmlMenu = `<div class="scCollectionOverlay"></div><div id="scModalCollection">${htmlMenuInner}</div>`;

  htmlMenu = `<dialog>
  <h2>My Collections</h2>
  
</dialog>`;

  scModalCollection ? (scModalCollection.innerHTML = htmlMenuInner) : document.querySelector("body").insertAdjacentHTML("beforeend", htmlMenu);
  console.log("Collection", scModalCollection);
};
