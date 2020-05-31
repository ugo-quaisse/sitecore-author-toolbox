/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';

export {checkNotification, sendNotification};


/**
 * Check notification permission
 */
const checkNotification = () => {
    let url = window.location.href;
    if(url.proticol =="https") {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission()
            .then(function(p) {
            p !== 'granted' ? console.info('User blocked notifications.') : false;
            })
            .catch(function(e) {
            console.info(e);
            });
        }
    } else {
        console.info("Sitecore Author Toolbox: Notification only works over https protocol.");
    }
}

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