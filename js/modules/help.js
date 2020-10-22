/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";

export { checkHelpLink, checkUrlType, checkIconType };

const checkIconType = (host) => {
  let service;

  if (host.includes("confluence")) {
    service = global.iconConfluence;
  } else if (host.includes("youtube")) {
    service = global.iconPlay;
  } else if (host.includes("jira")) {
    service = global.iconJira;
  } else {
    service = global.iconHelp;
  }

  return service;
};

const checkUrlType = (host) => {
  let service;

  if (host.includes("confluence")) {
    service = "Confluence";
  } else if (host.includes("youtube.com") || host.includes("youtu.be")) {
    service = "Youtube";
  } else if (host.includes("jira")) {
    service = "Jira";
  } else {
    service = "documentation";
  }

  return service;
};

/**
 * Check if helplin exist
 */
const checkHelpLink = (item, language, version) => {
  if (item) {
    let itemUrl = `sitecore/shell/default.aspx?xmlcontrol=SetHelp&id=${item}&la=${language}&vs=${version}`;
    var ajax = new XMLHttpRequest();
    ajax.timeout = 7000;
    ajax.open("GET", itemUrl, true);
    // eslint-disable-next-line consistent-return
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status == "200") {
        let dom = new DOMParser().parseFromString(ajax.responseText, "text/html");
        let link = dom.querySelector("#Link").value;
        let short = dom.querySelector("#ShortDescription").value;
        let long = dom.querySelector("#LongDescription").innerHTML;
        let title = short ? `<div class="scMessageBarTitle">` + short + `</div>` : `<div class="scMessageBarTitle">Documentation and help available</div>`;
        let text = long ? `<div class="scMessageBarText">` + long + `</div>` : ``;

        if (link) {
          try {
            let url = new URL(link);
            let titleHelp = document.querySelector(".scEditorHeaderTitleHelp");
            titleHelp && url.href ? (titleHelp.innerHTML = "<a href='" + url.href + "' target='_blank'>" + titleHelp.innerText + "</a>") : false;
            let scEditorID = document.querySelector(".scEditorHeader");
            let service = checkUrlType(url.host);
            let icon = checkIconType(url.host);
            //prettier-ignore
            let scMessage = `<div id="scMessageBarUrl" class="scMessageBar scInformation">
            <div class="scMessageBarIcon" style="background-image:url(` + icon + `)"></div>
              <div class="scMessageBarTextContainer">
                ` + title + `
                ` + text + `
                <ul class="scMessageBarOptions" style="margin:0px">
                <li class="scMessageBarOptionBullet"><a href="` + url.href + `" target="_blank" class="scMessageBarOption">Open ` + service + ` page</a></li>
                </ul>
              </div>
            </div>`;
            scEditorID.insertAdjacentHTML("afterend", scMessage);
          } catch (error) {
            //error
            console.info("Sitecore Author Toolbox:", "The url " + link + " is not a valid link.");
          }

          return link;
        }
      }
    };

    setTimeout(function () {
      ajax.send(null);
    }, 1000);
  }
};
