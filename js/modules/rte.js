/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { loadCssFile, loadJsFile, getScItemData } from "./helpers.js";
import { initDarkModeEditor } from "./dark.js";

export { initRteTooltips, initSyntaxHighlighterRte, initSyntaxHighlighterScriban };

/**
 * Add tooltips to RTE Editor buttons
 */
const initRteTooltips = (storage) => {
  if (storage.feature_experimentalui) {
    setTimeout(function () {
      document.querySelectorAll("ul.Metro > li > a").forEach(function (el) {
        let parent = el.parentElement;
        let type = el.getAttribute("class");
        if (type != "reDropdown") {
          parent.setAttribute("data-tooltip", el.getAttribute("title"));
          parent.classList.add("t-bottom");
          parent.classList.add("t-xs");
          el.removeAttribute("title");
        }
      });
    }, 500);
  }
};

/**
 * Add syntax highlight to HTML editor
 */
const initSyntaxHighlighterRte = (storage) => {
  storage.feature_rtecolor == undefined ? (storage.feature_rtecolor = true) : false;
  if (storage.feature_rtecolor) {
    var contentIframe;
    //Which HTML editor
    contentIframe = global.isRichTextEditor ? document.querySelector("#Editor_contentIframe") : document.querySelector("#ctl00_ctl00_ctl05_Html");
    if (contentIframe) {
      //Inject codemirror
      loadCssFile("css/codemirror.min.css");
      loadCssFile("css/dark/ayu-dark.css");
      loadJsFile("js/codemirror.js");
      //RTE Tabs
      let reTextArea = global.isRichTextEditor ? document.querySelector(".reTextArea") : false;
      let darkModeTheme = initDarkModeEditor(storage);
      if (global.isRichTextEditor) {
        reTextArea.insertAdjacentHTML("afterend", '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />');
        reTextArea.insertAdjacentHTML("afterend", '<input type="hidden" class="scEditor" value="richTextEditor" />');
      } else if (global.isHtmlEditor) {
        contentIframe.insertAdjacentHTML("afterend", '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />');
        contentIframe.insertAdjacentHTML("afterend", '<input type="hidden" class="scEditor" value="htmlEditor" />');
      }
    }
  }
};

/**
 * Add syntax highlight to Scriban fields
 */
const initSyntaxHighlighterScriban = (storage) => {
  let ScItem = getScItemData();
  if (ScItem.template) {
    if (ScItem.template.includes("/experience accelerator/scriban") || ScItem.template.includes("/experience accelerator/generic meta rendering/html snippet")) {
      storage.feature_rtecolor == undefined ? (storage.feature_rtecolor = true) : false;
      if (storage.feature_rtecolor) {
        //Variables
        let darkModeTheme = initDarkModeEditor(storage);
        //Get Scriban template field
        let scribanTemplate = document.querySelector("textarea");
        scribanTemplate.setAttribute("style", "min-height: 300px; resize: vertical; overflow: auto; margin: 0px; padding-right: 0px !important; font-family: monospace;");
        //delete scCharCount
        let charCount = document.querySelector("textarea").nextSibling;
        charCount.getAttribute("class") == "scCharCount" ? charCount.remove() : false;
        //Inject codemirror
        loadCssFile("css/codemirror.min.css");
        loadCssFile("css/dark/ayu-dark.css");
        loadJsFile("js/codemirror.js");
        scribanTemplate.insertAdjacentHTML("afterend", '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />');
        scribanTemplate.insertAdjacentHTML("afterend", '<input type="hidden" class="scEditor" value="scribanTemplate" />');
      }
    }
  }
};
