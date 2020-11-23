/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

// import * as global from "./global.js";

export { initWindowsManager };

/**
 * Add windows manager options to desktop context menu
 */
const initWindowsManager = () => {
  //Add listener / mutation on ApplicationMenu
  document.querySelectorAll("#ApplicationMenu").forEach((menu) => {
    console.log(menu);
  });
};
