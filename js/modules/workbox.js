/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js';
import {sendNotification} from './notification.js';

export {checkWorkbox};

/**
 * Check how many items are pending in the user's workbox
 */
const checkWorkbox = () => {

    var html;
    var wfWorkflows = 0;
    var wfNotification = 0;
    var wfChecksum = "#checksum#"; 

    var ajax = new XMLHttpRequest();
    ajax.timeout = 7000; 
    ajax.open("GET", "/sitecore/shell/default.aspx?xmlcontrol=Workbox", true);
    ajax.onreadystatechange = function() {

        if (ajax.readyState === 4) {

            if(ajax.status == "200") {
                //If success
                var html = new DOMParser().parseFromString(ajax.responseText, "text/html");
                var scWorkflows = html.querySelectorAll("#States > div");

                //Loop workflows
                for(var scWorkflow of scWorkflows) {

                  var scWorkflowTitle = scWorkflow.querySelector(".scPaneHeader").innerText;
                  wfWorkflows += 1;
                  wfChecksum += "-workflow:" + scWorkflowTitle.replace(" ","").toLowerCase();

                  var wfStates = scWorkflow.querySelectorAll(".scBackground");

                      for(var wfState of wfStates) {

                        var wfStateTitle = wfState.querySelector(".scSectionCenter").innerText;
                        var sfStateCount = wfState.querySelectorAll(".scWorkBoxData")
                        var wfStateTitleCount = wfStateTitle.split(" - (")[1].toLowerCase();
                        wfStateTitleCount = wfStateTitleCount.replace(")","").replace(" item","").replace("s","");
                        if(wfStateTitleCount == "none") { wfStateTitleCount = 0; }
                        wfNotification += parseInt(wfStateTitleCount)
                        wfChecksum += "-state:" + wfStateTitle.split(" - ")[0].replace(" ","").toLowerCase() + ":" + wfNotification;

                      }         

                }

                //Store Checksum
                var storedChecksum = localStorage.getItem('wfChecksum');
                localStorage.setItem('wfChecksum', wfChecksum);

                //Notification if changes detected
                if(storedChecksum != wfChecksum && wfNotification > 0) {
                  sendNotification("Workflow changes detected","Check your workbox!");
                }

            } else if(ajax.status == "0") {
                wfNotification = "?"
            }

            if(global.isLaunchpad) {

                //Show badge (launchpad)
                html = '<span class="launchpadBadge">' + wfNotification + '</span>';
                global.workboxLaunchpad ? global.workboxLaunchpad.insertAdjacentHTML( 'afterbegin', html ) : false;

            } else {

                //Show badge (status bar)
                document.querySelectorAll(".scDockBottom > a").forEach((a) => { if(a.innerText=="Workbox") { 
                        html = '<span class="wbNotification">' + wfNotification + '</span>';
                        a.setAttribute("style","padding-right:35px");
                        a.insertAdjacentHTML( 'afterend', html );
                    }
                })
            }

        }
    
    }
    setTimeout(function() {
        ajax.send(null);
    },300);

}