/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { getScItemData } from "./helpers.js";

export { initFavorites };

const initFavorites = () => {
  let scFavoritesIframe = document.querySelector("#sitecorAuthorToolboxFav");
  scFavoritesIframe ? scFavoritesIframe.remove() : false;

  let ScItem = getScItemData();
  var scFavoritesUrl = `../default.aspx?xmlcontrol=Gallery.Favorites&id=` + ScItem.id + `&la=en&vs=1`;
  //prettier-ignore
  var scMyShortcut = `<iframe loading="lazy" id="sitecorAuthorToolboxFav" class="sitecorAuthorToolboxFav" src="` + scFavoritesUrl + `" style="width:100%; height:150px; margin-top: 0px; resize: vertical;"></iframe>`;

  global.scContentTree.insertAdjacentHTML("afterend", scMyShortcut);
};
