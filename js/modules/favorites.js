/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { getScItemData } from "./helpers.js";

export { initFavorites };

const initFavorites = (storage) => {
  storage.feature_favorites == undefined ? (storage.feature_favorites = false) : false;
  if (storage.feature_favorites && !global.isPublishWindow && global.scContentTree) {
    let scFavoritesIframe = document.querySelector("#satFavorites");
    scFavoritesIframe ? scFavoritesIframe.remove() : false;
    let ScItem = getScItemData();
    var scFavoritesUrl = `../default.aspx?xmlcontrol=Gallery.Favorites&id=${ScItem.id}&la=en&vs=1`;
    var scMyShortcut = `<div id="satFavoritesDrag"></div><iframe loading="lazy" id="satFavorites" class="satFavorites" src="${scFavoritesUrl}" style="width:100%; height:150px; margin-top: 0px; resize: vertical;"></iframe>`;
    global.scContentTree.insertAdjacentHTML("afterend", scMyShortcut);

    //Drag handler event
    let offsetTop, isResizing;
    let iframe = document.querySelector("#satFavorites");
    let handle = document.querySelector("#satFavoritesDrag");
    handle.addEventListener("mousedown", function () {
      isResizing = true;
    });
    document.querySelector("body, #satFavorites").addEventListener("mousemove", function (e) {
      if (!isResizing) return;
      offsetTop = window.innerHeight - e.clientY - 2;
      iframe.setAttribute("style", "height:" + offsetTop + "px; visibility:hidden");
    });
    document.querySelector("body, #satFavorites").addEventListener("mouseup", function (e) {
      isResizing = false;
      offsetTop = window.innerHeight - e.clientY - 2;
      iframe.setAttribute("style", "height:" + offsetTop + "px; visibility:visible");
    });
  }
};
