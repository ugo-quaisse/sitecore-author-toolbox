/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { initStorageFeature } from "./helpers.js";

export { addHelptextIcons, checkHelpLink, checkUrlType, checkIconType };

/**
 * Loop trhough fields and add help icon
 */
const addHelptextIcons = () => {
  document.querySelectorAll(".scEditorFieldLabel").forEach(function (elem) {
    //prettier-ignore
    let helpLink = elem.querySelector(".scEditorFieldLabelLink")
      ? `<a href="` + elem.querySelector(".scEditorFieldLabelLink").getAttribute("href") + `" target="_help"><img loading="lazy" src="` + global.iconInfo + `" class="scIconCopy" /></a>`
      : `<img loading="lazy" src="` + global.iconInfo + `" class="scIconCopy" />`;
    if (elem.getAttribute("title")) {
      // eslint-disable-next-line require-unicode-regexp
      // eslint-disable-next-line prefer-named-capture-group
      let text = elem.getAttribute("title").replace(/(<([^>]+)>)/u, "");
      elem.insertAdjacentHTML("beforebegin", `<div style="display:inline; margin-right: 5px; float:left" class="t-right t-sm" data-tooltip="` + text + `">` + helpLink + `</div>`);
      elem.removeAttribute("title");
    }
  });
};

/**
 * Pick an icon for each type of helplink
 */
const checkIconType = (host) => {
  let service;

  if (host.includes("confluence")) {
    service = global.iconConfluence;
  } else if (host.includes("youtube")) {
    service = global.iconPlay;
  } else if (host.includes("jira")) {
    service = global.iconJira;
  } else if (host.includes("azure")) {
    service = global.iconAzure;
  } else if (host.includes("zendesk")) {
    service = global.iconZendesk;
  } else {
    service = global.iconHelp;
  }

  return service;
};

/**
 * Check which type of url is assigned to help link
 */
const checkUrlType = (host) => {
  let service;

  if (host.includes("confluence")) {
    service = "Confluence";
  } else if (host.includes("youtube.com") || host.includes("youtu.be")) {
    service = "Youtube";
  } else if (host.includes("jira")) {
    service = "Jira";
  } else if (host.includes("dev.azure")) {
    service = "Azure Devops";
  } else if (host.includes("zendesk")) {
    service = "Zendesk";
  } else {
    service = "documentation";
  }

  return service;
};

/**
 * Check if helpl exist
 */
// eslint-disable-next-line max-params
const checkHelpLink = (item, language, version, storage) => {
  storage.feature_helplink = initStorageFeature(storage.feature_helplink, false);
  if (storage.feature_helplink) {
    if (item) {
      let itemUrl = `sitecore/shell/default.aspx?xmlcontrol=SetHelp&id=${item}&la=${language}&vs=${version}`;
      var ajax = new XMLHttpRequest();
      ajax.timeout = global.timeoutAsync;
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

          let titleHelp = document.querySelector(".scEditorHeaderTitleHelp");
          let scEditorID = document.querySelector(".scEditorHeader");
          let scMessageBarHelp = document.querySelector(".scMessageBarHelp");
          let service = ``;
          let icon = global.iconHelp;

          if (link) {
            try {
              let url = new URL(link);
              titleHelp && url.href ? (titleHelp.innerHTML = `<a href='${url.href}' target='_blank'>${titleHelp.innerText}</a>`) : false;
              icon = checkIconType(url.host);
              service = `<li class="scMessageBarOptionBullet"><a href="${url.href}" target="_blank" class="scMessageBarOption">Open ${checkUrlType(url.host)} page</a></li>`;
            } catch (error) {
              console.info(`Sitecore Author Toolbox:`, `The url ${link} is not a valid link.`);
            }
          }
          if (short && scEditorID) {
            //prettier-ignore
            let scMessage = `<div id="scMessageBarUrl" class="scMessageBar scInformation scMessageBarHelp">
            <div class="scMessageBarIcon" style="background-image:url(${icon})"></div>
              <div class="scMessageBarTextContainer">
                ${title}
                ${text}
                <ul class="scMessageBarOptions" style="margin:0px">
                ${service}
                </ul>
              </div>
            </div>`;
            !scMessageBarHelp ? scEditorID.insertAdjacentHTML("afterend", scMessage) : false;
          }
        }
      };

      setTimeout(function () {
        ajax.send(null);
      }, 1000);
    }
    addHelptextIcons();
  }
};
