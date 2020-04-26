/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {sendNotification};

/**
 * Send native browser notification and play sound
 */
const sendNotification = (scTitle, scBody) => {

  //Show notification
  new Notification(scTitle, {
      body: scBody,
      icon: chrome.runtime.getURL("images/icon.png")
  });
  //Play sound
  var sound = new Audio(chrome.runtime.getURL("audio/notification.mp3"));
  var play = sound.play();
  if (play !== undefined) {
    play.then(_ => {
      // Autoplay started
    }).catch(error => {
      // Autoplay was prevented.
    });
  }
  
}