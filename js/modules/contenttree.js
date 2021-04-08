/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { initStorageFeature } from "./helpers.js";

export { initAutoExpandTree, initTreeGutterTooltips };

/**
 * Auto Expand Tree
 */
const initAutoExpandTree = (storage) => {
  storage.feature_autoexpand = initStorageFeature(storage.feature_autoexpand, false);
  storage.feature_autoexpandcount = initStorageFeature(storage.feature_autoexpandcount, true);

  if (storage.feature_autoexpand && document.querySelector(".scContentTree")) {
    //Content tree
    document.querySelector(".scContentTree").addEventListener(
      "click",
      function (event) {
        //Change EditorFrames opacity on load item
        if (event.target.offsetParent != null) {
          if (event.target.offsetParent.offsetParent.matches(".scContentTreeNodeNormal")) {
            storage.feature_experimentalui ? document.querySelector("#svgAnimation").setAttribute("style", "opacity:1") : false;
            storage.feature_experimentalui ? document.querySelector("#EditorFrames").setAttribute("style", "opacity:0") : document.querySelector("#EditorFrames").setAttribute("style", "opacity:0.5");
            document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:0.5");
            document.querySelectorAll(".scEditorTabHeaderNormal, .scEditorTabHeaderActive > span")[0].innerText = global.tabLoadingTitle;

            //Experimental mode
            if (document.querySelector(".scPreviewButton")) {
              document.querySelector(".scPreviewButton").innerText = global.tabLoadingTitle;
              document.querySelector(".scPreviewButton").disabled = true;
            }

            setTimeout(function () {
              document.querySelector("#svgAnimation") ? document.querySelector("#svgAnimation").setAttribute("style", "opacity:0") : false;
              document.querySelector("#EditorFrames").setAttribute("style", "opacity:1");
              document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:1");
            }, 7000);
          }
        }

        //Content Tree
        if (event.target.matches(".scContentTreeNodeGlyph")) {
          let glyphId = event.target.id;

          setTimeout(function () {
            if (document && glyphId) {
              let subTreeDiv = document.querySelector("#" + glyphId).nextSibling.nextSibling.nextSibling;
              if (subTreeDiv) {
                let newNodes = subTreeDiv.querySelectorAll(".scContentTreeNode");
                newNodes.length == 1 ? newNodes[0].querySelector(".scContentTreeNodeGlyph").click() : false;
              }
            }
          }, 500);
        }

        //Media Upload
        if (event.target.matches(".dynatree-expander")) {
          let glyphId = event.path[1];

          setTimeout(function () {
            if (document && glyphId) {
              let subTreeDiv = glyphId.nextSibling;
              console.log(subTreeDiv);
              if (subTreeDiv) {
                let newNodes = subTreeDiv.querySelectorAll(".dynatree-has-children");
                newNodes.length == 1 ? newNodes[0].querySelector(".dynatree-expander").click() : false;
                console.log(newNodes);
              }
            }
          }, 500);
        }
      },
      false
    );

    //Security Editor
    document.addEventListener(
      "mousedown",
      function (event) {
        if (!event.target.matches(".glyph")) return;
        let glyphId = event.target.id;
        let glyphSrc = event.target.src;
        let isCollapsed = glyphSrc.includes("collapsed");

        setTimeout(function () {
          if (document && glyphId && isCollapsed) {
            var subTreeDiv = document.querySelector("#" + glyphId).closest("ul").nextSibling;
            if (subTreeDiv) {
              var nextGlyphId = subTreeDiv.querySelector(".glyph");
              nextGlyphId.click();
            }
          }
        }, 500);
      },
      false
    );
  }
};

/**
 * Content Tree Error Tooltip
 */
const initTreeGutterTooltips = () => {
  //TODO to be triggered on TREE VIEW refresh
  setTimeout(function () {
    document.querySelectorAll(".scContentTreeNodeGutterIcon").forEach(function (el) {
      let parent = el.parentElement;
      parent.setAttribute("data-tooltip", el.getAttribute("title"));
      parent.classList.add("t-right");
      parent.classList.add("t-xs");
      el.removeAttribute("title");
    });
  }, 2500);
};
