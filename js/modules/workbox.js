/* eslint-disable radix */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { sendNotification } from "./notification.js";
import { setPlural } from "./helpers.js";

export { checkWorkbox };

/**
 * Check how many items are pending in the user's workbox
 */
const checkWorkbox = (storage) => {
  storage.feature_workbox == undefined ? (storage.feature_workbox = true) : false;
  if (storage.feature_workbox && !storage.feature_experimentalui) {
    var wfNotification = 0;
    var wfChecksum = "#checksum#";

    var ajax = new XMLHttpRequest();
    ajax.timeout = global.timeoutAsync;
    ajax.open("GET", "/sitecore/shell/default.aspx?xmlcontrol=Workbox", true);
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status == "200") {
          //If success
          var html = new DOMParser().parseFromString(ajax.responseText, "text/html");
          var scWorkflows = html.querySelectorAll("#States > div");

          //Loop workflows
          for (var scWorkflow of scWorkflows) {
            var scWorkflowTitle = scWorkflow.querySelector(".scPaneHeader").innerText;
            wfChecksum += "-workflow:" + scWorkflowTitle.replace(" ", "").toLowerCase();

            var wfStates = scWorkflow.querySelectorAll(".scBackground");

            for (var wfState of wfStates) {
              var wfStateTitle = wfState.querySelector(".scSectionCenter").innerText;
              var wfStateTitleCount = wfStateTitle.split(" - (")[1].toLowerCase();
              // eslint-disable-next-line newline-per-chained-call
              wfStateTitleCount = wfStateTitleCount.replace(")", "").replace(" item", "").replace("s", "");
              if (wfStateTitleCount == "none") {
                wfStateTitleCount = 0;
              }
              wfNotification += parseInt(wfStateTitleCount);
              wfChecksum += "-state:" + wfStateTitle.split(" - ")[0].replace(" ", "").toLowerCase() + ":" + wfNotification;
            }
          }

          //Store Checksum
          var storedChecksum = localStorage.getItem("wfChecksum");
          localStorage.setItem("wfChecksum", wfChecksum);

          //Notification if changes detected
          if (storedChecksum != wfChecksum && wfNotification > 0) {
            sendNotification("Workflow changes detected", "Check your workbox!");
          }
        } else if (ajax.status == "0") {
          wfNotification = "?";
        }

        if (global.isLaunchpad) {
          //Show badge (launchpad)
          html = `<span class="launchpadBadge">${wfNotification}</span>`;
          global.workboxLaunchpad ? global.workboxLaunchpad.insertAdjacentHTML("afterbegin", html) : false;
          //Sitecore Launchpad version detection
          let oldScDetect = document.querySelector(".sc-applicationHeader-row2");
          //Change top left logo
          !oldScDetect && document.querySelector(".launchpadBadge") ? document.querySelector(".launchpadBadge").classList.add("sc10launchpad") : "";
        } else {
          //Show badge (status bar)
          document.querySelectorAll(".scDockBottom > a").forEach((a) => {
            if (a.innerText == "Workbox") {
              html = `<span class="wbNotification">${wfNotification}</span>`;
              a.setAttribute("style", "padding-right:35px");
              a.insertAdjacentHTML("afterend", html);
            }
          });

          //Show badge menu
          let scNotificationBell = document.querySelector("#scNotificationBell");
          if (scNotificationBell && wfNotification > 0) {
            html = '<span class="wbNotificationMenu"></span>';
            scNotificationBell.setAttribute("title", "You have " + wfNotification + " notification" + setPlural(wfNotification) + " in your workbox");
            scNotificationBell.insertAdjacentHTML("afterend", html);
          }
        }
      }
    };
    setTimeout(function () {
      ajax.send(null);
    }, 1000);
  }
};
