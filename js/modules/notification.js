/* eslint-disable no-unused-vars */
/* eslint-disable no-new */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import { currentColorScheme } from "./helpers.js";
import { checkUrlStatus } from "./url.js";

export { checkNotificationPermissions, sendNotification, checkPublishNotification };

/**
 * Check if User granted notification permission
 */
const checkNotificationPermissions = () => {
  let url = new URL(window.location.href);
  if (url.protocol == "https:") {
    if (Notification.permission !== "granted") {
      Notification.requestPermission()
        .then(function (p) {
          p !== "granted" ? console.info("User blocked notifications.") : false;
        })
        .catch(function (e) {
          console.info(e);
        });
    }
  } else {
    console.info("Sitecore Author Toolbox: Notification only works over https protocol.");
  }
};

/**
 * Send native browser notification and play sound
 */
const sendNotification = (scTitle, scBody) => {
  //Show notification
  new Notification(scTitle, {
    body: scBody,
    icon: chrome.runtime.getURL("images/icon.png"),
  });
  //Play sound
  var sound = new Audio(chrome.runtime.getURL("audio/notification.mp3"));
  var play = sound.play();
  if (play !== undefined) {
    play
      .then((_) => {
        // Autoplay started
      })
      .catch((error) => {
        // Autoplay was prevented.
      });
  }
};

/**
 * Send a notification to the browser when an action is ended up
 */
const checkPublishNotification = (storage) => {
  /**
   * > 10. Publish notification
   */
  let target = document.querySelector("#LastPage");
  let observer = new MutationObserver(function () {
    storage.feature_notification == undefined ? (storage.feature_notification = true) : false;
    storage.feature_experimentalui == undefined ? (storage.feature_experimentalui = false) : false;

    if (storage.feature_notification) {
      //Variable
      target = document.querySelector("#LastPage");
      let darkMode;
      var notificationSubTitle = target.querySelector(".sc-text-largevalue").innerHTML;
      var notificationBody = target.querySelector(".scFieldLabel").innerHTML;
      if (notificationBody == "Result:") {
        notificationBody = "Finished " + document.querySelector("#ResultText").value.split("Finished")[1];
      }

      //Send notification
      sendNotification(notificationSubTitle, notificationBody);

      //Is dark mode on?
      darkMode = !!((storage.feature_darkmode && !storage.feature_darkmode_auto) || (storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "dark"));

      //Update url Status
      var parentSelector = parent.parent.document.querySelector("body");
      checkUrlStatus(parentSelector.querySelector(".liveUrlStatus"), parentSelector, darkMode, storage.feature_experimentalui);
    }
  });

  //Observer publish
  target ? observer.observe(target, { attributes: true }) : false;
};
