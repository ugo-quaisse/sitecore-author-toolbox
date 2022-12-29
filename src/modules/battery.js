/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { showSnackbarBattery } from "./snackbar.js";
export { getBatteryLevel };

/**
 * Get battery level
 */
const getBatteryLevel = (storage) => {
  navigator.getBattery().then(function (battery) {
    saveBatteryPrompt();
    battery.addEventListener("levelchange", function () {
      saveBatteryPrompt();
    });
    battery.addEventListener("chargingchange", function () {
      saveBatteryPrompt();
    });
  });
};

/**
 * Prompt battery save mode
 */
const saveBatteryPrompt = () => {
  navigator.getBattery().then(function (battery) {
    let batteryPercentage = Math.round(battery.level * 100);
    let isDarkMode = document.querySelector("body").classList.contains("satDark");
    if (batteryPercentage <= 20 && !battery.charging && !isDarkMode) {
      //Show toast
      showSnackbarBattery(batteryPercentage, battery.dischargingTime);
    }
    if (batteryPercentage > 20 || battery.charging) {
      //Update local storage
      localStorage.setItem("scSaveBatteryPrompt", false);
    }
  });
};
