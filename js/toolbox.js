/* eslint-disable newline-per-chained-call */
/**
 * Sitecore Author Toolbox
 * A Chrome/Edge Extension
 * by Ugo Quaisse
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

/**
 * Modules
 */
import * as global from "./modules/global.js";
//prettier-ignore
import { consoleLog, loadCssFile, loadJsFile, exeJsCode, preferesColorScheme, initDarkMode, initDarkModeEditor, autoDarkMode, sitecoreItemJson, getScItemData, startDrag } from "./modules/helpers.js";
import { showSnackbar } from "./modules/snackbar.js";
import { checkWorkbox } from "./modules/workbox.js";
import { checkUrlStatus } from "./modules/url.js";
import { checkNotification, sendNotification } from "./modules/notification.js";
import { findCountryName } from "./modules/language.js";
import { sitecoreAuthorToolbox } from "./modules/contenteditor.js";
import { getGravatar } from "./modules/users.js";
import { instantSearch } from "./modules/instantsearch.js";
import { insertModal, insertPanel } from "./modules/menu.js";
import {
  initMediaExplorer,
  initMediaCounter,
  initMediaDragDrop,
  initMediaViewButtons,
} from "./modules/media.js";
import {
  initExperimentalUi,
  insertSavebar,
  initInsertIcon,
  initGutter,
  initColorPicker,
  initSitecoreMenu,
  initUserMenu,
} from "./modules/experimentalui.js";
import { initFavorites } from "./modules/favorites.js";
import { initGroupedErrors } from "./modules/errors.js";
import { insertPreviewButton, listenPreviewTab } from "./modules/preview.js";
import {
  insertLaunchpadIcon,
  insertLaunchpadMenu,
} from "./modules/launchpad.js";
/**
 * Get all user's settings from storage
 */
chrome.storage.sync.get((storage) => {
  /**
   * Variables
   */
  let currentScheme = preferesColorScheme();
  let darkMode = false;

  /*
   ************************
   * 1. Content Editor *
   ************************
   */
  if (
    global.isSitecore &&
    !global.isEditMode &&
    !global.isLoginPage &&
    !global.isCss &&
    !global.isUploadManager
  ) {
    /**
     * Load extra JS and CSS
     */
    document.body.classList.add("loaded");
    loadJsFile("js/inject.js");

    /**
     * Dark mode
     */
    initDarkMode(storage);

    /**
     * Browser notification
     */
    checkNotification();

    /**
     * Contrasted Icons
     */
    if (storage.feature_contrast_icons === false) {
      document.documentElement.style.setProperty("--iconBrightness", 1);
      document.documentElement.style.setProperty("--iconContrast", 1);
    }

    /**
     * Content Editor application
     */
    if (global.isContentEditor || global.isLaunchpad) {
      consoleLog("**** Content Editor / Launchpage ****", "yellow");

      /**
       * Experimental UI
       */
      storage.feature_experimentalui == undefined
        ? (storage.feature_experimentalui = false)
        : false;
      storage.feature_contrast_icons == undefined
        ? (storage.feature_contrast_icons = false)
        : false;

      if (!global.isLaunchpad && storage.feature_experimentalui) {
        //Variables
        let ScItem = getScItemData();

        //Load extra CSS
        initExperimentalUi(storage);
        initDarkMode(storage);

        //3 dots SVG animation
        let svgAnimation =
          `<div id="svgAnimation">` + global.svgAnimation + `</div>`;
        document.querySelector("#EditorFrames")
          ? document
              .querySelector("#EditorFrames")
              .insertAdjacentHTML("beforebegin", svgAnimation)
          : false;

        insertSavebar();
        insertModal(ScItem.id, ScItem.language, ScItem.version);
        insertPanel();
        initInsertIcon();
        initGutter();
        initUserMenu();
        initColorPicker();
        initSitecoreMenu();

        /**
         * Event listeners
         */
        document.addEventListener("click", (event) => {
          //Menus position
          let topPos = document.querySelector("#EditorTabs")
            ? document.querySelector("#EditorTabs").getBoundingClientRect()
                .bottom
            : "100";
          let scPanel = document.querySelector("#scPanel");
          let scLanguageIframe = document.querySelector("#scLanguageIframe");
          let scVersionIframe = document.querySelector("#scVersionIframe");

          //Panel position
          scPanel
            ? scPanel.setAttribute("style", "top: " + topPos + "px !important")
            : false;
          scLanguageIframe
            ? scLanguageIframe.setAttribute(
                "style",
                "top: " + topPos + "px !important"
              )
            : false;
          scVersionIframe
            ? scVersionIframe.setAttribute(
                "style",
                "top: " + topPos + "px !important"
              )
            : false;

          //Publish menu
          if (document.querySelector(".scPublishMenu")) {
            event.srcElement.id == "scPublishMenuMore"
              ? document
                  .querySelector(".scPublishMenu")
                  .classList.toggle("visible")
              : document
                  .querySelector(".scPublishMenu")
                  .classList.remove("visible");
          }

          //More menu
          if (document.querySelector(".scMoreMenu")) {
            event.srcElement.id == "scMoreButton" ||
            event.path[1].id == "scMoreButton"
              ? document
                  .querySelector(".scMoreMenu")
                  .classList.toggle("visible")
              : document
                  .querySelector(".scMoreMenu")
                  .classList.remove("visible");
          }

          //More menu
          event.srcElement.id == "scInfoButton" ||
          event.path[1].id == "scInfoButton" ||
          event.srcElement.id == "scPanel" ||
          event.path[0].className == "content"
            ? scPanel.classList.toggle("open")
            : scPanel.classList.remove("open");

          //Language menu
          if (scLanguageIframe) {
            event.srcElement.id == "scLanguageButton" ||
            event.path[1].id == "scLanguageButton"
              ? scLanguageIframe.classList.toggle("open")
              : scLanguageIframe.classList.remove("open");
          }

          //Version menu
          if (scVersionIframe) {
            event.srcElement.id == "scVersionButton" ||
            event.path[1].id == "scVersionButton"
              ? scVersionIframe.classList.toggle("open")
              : scVersionIframe.classList.remove("open");
          }
          //Message bars
          // event.srcElement.className.includes("scMessageBar") ?
          // event.target.setAttribute("style","display:none") :
          // false;

          //Navigator menu
          if (document.querySelector(".scPublishMenu")) {
            // event.srcElement.id == "scNavigatorButton" || event.path[1].id == "scNavigatorButton"
            // ? document.querySelector(".scPublishMenu").setAttribute("style","visibility: visible; opacity: 1;")
            // : document.querySelector(".scPublishMenu").setAttribute("style","visibility: hidden; opacity: 0;");
          }

          //Overlay
          if (document.querySelector("#scModal")) {
            event.srcElement.className == "scOverlay"
              ? document
                  .querySelector(".scOverlay")
                  .setAttribute("style", "visibility: hidden")
              : false;
            event.srcElement.className == "scOverlay"
              ? document
                  .querySelector("#scModal")
                  .setAttribute(
                    "style",
                    "opacity:0; visibility: hidden; top: calc(50% - 550px/2 - 10px)"
                  )
              : false;
          }
        });
      }

      /**
       * Instant Search
       */
      storage.feature_instantsearch == undefined
        ? (storage.feature_instantsearch = true)
        : false;

      if (!global.isLaunchpad && storage.feature_instantsearch) {
        let globalHeader = document.querySelector(".sc-globalHeader");
        let html =
          '<input type="text" class="scInstantSearch scIgnoreModified" placeholder="Search for content or media" tabindex="1" accesskey="f">';
        let htmlResult = '<ul class="scInstantSearchResults"></ul>';
        globalHeader
          ? globalHeader.insertAdjacentHTML("afterbegin", htmlResult)
          : false;
        globalHeader
          ? globalHeader.insertAdjacentHTML("afterbegin", html)
          : false;
        globalHeader ? instantSearch() : false;
      }

      /**
       * Back/Previous buttons
       */
      window.onpopstate = function (event) {
        if (event.state && event.state.id != "") {
          //Store a local value to tell toolboxscript we are changing item from back/previous button, so no need to add #hash as it's already performed by the browser
          localStorage.setItem("scBackPrevious", true);
          exeJsCode(
            `scForm.invoke("item:load(id=` +
              event.state.id +
              `,language=` +
              event.state.language +
              `,version=` +
              event.state.version +
              `)");`
          );
        }
      };

      /**
       * Auto Dark Mode
       */
      autoDarkMode(storage);

      /**
       * Resume from where you left
       */
      if (!global.hasRedirectionOther && !global.isLaunchpad) {
        //fo parameters is the default Sitecore behaviour to open a specific item

        storage.feature_reloadnode == undefined
          ? (storage.feature_reloadnode = true)
          : false;
        if (
          storage.scData != undefined &&
          !global.urlParams.get("fo") &&
          !global.urlParams.get("ro")
        ) {
          //If Hash detected in the URL
          if (global.scUrlHash != "") {
            temp = global.scUrlHash.split("_");
            storage.scItemID = temp[0];
            storage.scLanguage = temp[1];
            storage.scVersion = temp[2];
            storage.scSource = "Hash";
          } else {
            //Get scData from storage
            var scData = storage.scData;
            for (var domain in scData) {
              // eslint-disable-next-line no-prototype-builtins
              if (
                // eslint-disable-next-line no-prototype-builtins
                scData.hasOwnProperty(domain) &&
                domain == window.location.origin
              ) {
                storage.scItemID = scData[domain].scItemID;
                storage.scLanguage = scData[domain].scLanguage;
                storage.scVersion = scData[domain].scVersion;
                storage.scSource = "Storage";
              }
            }
          }

          //Security check
          storage.scLanguage == undefined ? (storage.scLanguage = "en") : false;

          //Reload from where you left off
          if (storage.scItemID && storage.feature_reloadnode === true) {
            consoleLog(
              "[Read " + storage.scSource + "] Item : " + storage.scItemID,
              "beige"
            );
            consoleLog(
              "[Read " +
                storage.scSource +
                "] Language : " +
                storage.scLanguage,
              "beige"
            );
            consoleLog(
              "[Read " + storage.scSource + "] Version : " + storage.scVersion,
              "beige"
            );
            consoleLog("*** Redirection ***", "yellow");
            exeJsCode(
              `scForm.invoke("item:load(id=` +
                storage.scItemID +
                `,language=` +
                storage.scLanguage +
                `,version=` +
                storage.scVersion +
                `)");`
            );
          }

          sitecoreAuthorToolbox();
        } else {
          sitecoreAuthorToolbox();
        }
      }

      /**
       * Favorites bar
       */
      storage.feature_favorites == undefined
        ? (storage.feature_favorites = false)
        : false;
      storage.feature_favorites &&
      !global.isPublishWindow &&
      global.scContentTree
        ? initFavorites()
        : false;

      /**
       * Show Snackbar
       */
      if (!global.isLaunchpad) {
        localStorage.getItem("sbDismiss") != global.extensionVersion
          ? showSnackbar(global.extensionVersion)
          : false;
      }

      /**
       * Workbox badge
       */
      storage.feature_workbox == undefined
        ? (storage.feature_workbox = true)
        : false;
      storage.feature_workbox ? checkWorkbox() : false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
     ************************
     * 2. Sitecore pages  *
     ************************
     */

    if (
      global.isDesktop &&
      !global.isGalleryFavorites &&
      !global.isXmlControl
    ) {
      consoleLog("**** Desktop Shell ****", "orange");
      insertLaunchpadMenu(storage, currentScheme);

      if (storage.feature_experimentalui) {
        initExperimentalUi(storage);
        initUserMenu();
        initColorPicker();
        initSitecoreMenu();
      }
    }

    if (global.isLaunchpad) {
      consoleLog("**** Launchpad ****", "orange");
      insertLaunchpadIcon(storage, currentScheme);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
     ************************
     * 3. Sitecore frames  *
     ************************
     */

    if (global.isSearch) {
      consoleLog("**** Internal Search ****", "orange");

      //Add listener on search result list
      var target = document.querySelector("#results");
      var observer = new MutationObserver(function () {
        var resultsDiv = document.querySelector("#results");
        var BlogPostArea = resultsDiv.querySelectorAll(".BlogPostArea");

        for (var line of BlogPostArea) {
          var BlogPostFooter = line.querySelector(".BlogPostFooter");

          var getFullpath = line
            .querySelector(".BlogPostViews > a > img")
            .getAttribute("title");
          getFullpath = getFullpath.split(" - ");
          getFullpath = getFullpath[1].toLowerCase();
          if (getFullpath.includes("/home/")) {
            getFullpath = getFullpath.split("/home/");
            getFullpath = "/" + getFullpath[1];
          }
          var getNumLanguages = line
            .querySelector(".BlogPostHeader > span")
            .getAttribute("title");

          //Inject HTML
          var html =
            '<div class="BlogPostExtra BlogPostContent" style="padding: 5px 0 0px 78px; color: #0769d6"><strong>Sitecore path:</strong> ' +
            getFullpath +
            " <strong>Languages available:</strong> " +
            getNumLanguages +
            "</div>";
          getFullpath
            ? BlogPostFooter.insertAdjacentHTML("afterend", html)
            : false;
          //TODO Buttons, open in CE and open in EE
        }
      });

      //Observer
      target
        ? observer.observe(target, {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: false,
          })
        : false;
    } else if (global.isPreviewTab) {
      consoleLog("**** Preview tab ****", "orange");
      initExperimentalUi(storage);
      insertPreviewButton(storage);
      listenPreviewTab(storage);
    } else if (global.isDialog) {
      consoleLog("**** Dialog UI ****", "orange");
      initExperimentalUi(storage);
    } else if (global.isFieldEditor) {
      consoleLog("**** Field editor ****", "orange");
      storage.feature_contenteditor == undefined
        ? (storage.feature_contenteditor = true)
        : false;
      storage.feature_contenteditor
        ? loadCssFile("css/checkbox.min.css")
        : false;

      initExperimentalUi(storage);

      storage.feature_charscount == undefined
        ? (storage.feature_charscount = true)
        : false;

      if (storage.feature_charscount) {
        /*
         * Add a characters count next to each input and textarea field
         */
        var scTextFields = document.querySelectorAll(
          "input, textarea, checkbox"
        );
        var countHtml, labelHtml;
        var chars = 0;
        var charsText;

        //On load
        for (var field of scTextFields) {
          if (
            field.className == "scContentControl" ||
            field.className == "scContentControlMemo"
          ) {
            field.setAttribute("style", "padding-right: 70px !important");
            field.parentElement.setAttribute(
              "style",
              "position:relative !important"
            );
            chars = field.value.length;
            if (chars > 1) {
              charsText = chars + " chars";
            } else {
              charsText = chars + " char";
            }
            countHtml =
              '<div id="chars_' +
              field.id +
              '" style="position: absolute; bottom: 1px; right: 1px; padding: 6px 10px; border-radius: 4px; line-height: 20px; opacity:0.5;">' +
              charsText +
              "</div>";
            field.insertAdjacentHTML("afterend", countHtml);
          } else if (field.className == "scContentControlCheckbox") {
            //Add label
            labelHtml =
              '<label for="' +
              field.id +
              '" class="scContentControlCheckboxLabel"></label>';
            field.insertAdjacentHTML("afterend", labelHtml);
          }
        }

        // var scStylesList = document.querySelectorAll(".styles-list input[type=checkbox]");

        // //On load
        // for (var checkbox of scStylesList) {
        //     //Add label
        //     labelHtml = '<label for="' + field.id + '" class="scContentControlCheckboxLabel"></label>';
        //     checkbox.insertAdjacentHTML('afterend', labelHtml);
        // }

        //On keyup
        document.addEventListener(
          "keyup",
          function (event) {
            if (
              event.target.localName == "input" ||
              event.target.localName == "textarea"
            ) {
              chars = event.target.value.length;
              if (chars > 1) {
                charsText = chars + " chars";
              } else {
                charsText = chars + " char";
              }

              if (document.querySelector("#chars_" + event.target.id)) {
                document.querySelector(
                  "#chars_" + event.target.id
                ).innerText = charsText;
              }
            }
          },
          false
        );
      }

      /*
       * Enhanced Bucket List Select Box (multilist)
       */
      var scBucketListSelectedBox = document.querySelectorAll(
        ".scBucketListSelectedBox, .scContentControlMultilistBox"
      );
      var Section_Data = document.querySelector("#Section_Data");

      scBucketListSelectedBox[1]
        ? (scBucketListSelectedBox = scBucketListSelectedBox[1])
        : (scBucketListSelectedBox = scBucketListSelectedBox[0]);

      if (scBucketListSelectedBox) {
        scBucketListSelectedBox.addEventListener("change", function () {
          var itemId = scBucketListSelectedBox.value;
          itemId = itemId.includes("|") ? itemId.split("|")[1] : itemId;
          var itemName =
            scBucketListSelectedBox[scBucketListSelectedBox.selectedIndex].text;
          //prettier-ignore
          var scMessageEditText = `<a class="scMessageBarOption" href="${window.location.origin}/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#${itemId}" target="_blank"><u>Click here ⧉</u></a> `;
          //var scMessageExperienceText = '<a class="scMessageBarOption" href="' + window.location.origin + '/?sc_mode=edit&sc_itemid=' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
          //prettier-ignore
          var scMessageEdit = `<div id="Warnings" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(` + global.icon + `)"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">` + itemName + `</div>`;
          //prettier-ignore
          scMessageEdit += `<span id="Information" class="scMessageBarText"><span class="scMessageBarOptionBullet">` + scMessageEditText + `</span> to edit this datasource in <b>Content Editor</b>.</span>`;
          //scMessageEdit += `<span id="Information" class="scMessageBarText"><br /><span class="scMessageBarOptionBulletXP">` + scMessageExperienceText + `</span> to edit this datasource in <b>Experience Editor</b>.</span>`
          scMessageEdit += `</div></div>`;

          //Add hash to URL
          if (!document.querySelector(".scMessageBar")) {
            Section_Data.insertAdjacentHTML("beforebegin", scMessageEdit);
          } else {
            document.querySelector(".scMessageBarTitle").innerHTML = itemName;
            document.querySelector(
              ".scMessageBarOptionBullet"
            ).innerHTML = scMessageEditText;
          }
        });
      }

      /**
       * Grouped errors
       */
      storage.feature_errors == undefined
        ? (storage.feature_errors = true)
        : false;
      storage.feature_errors ? initGroupedErrors() : false;
    } else if (global.isSourceBrowser) {
      consoleLog("**** Source Browser ****", "orange");
    } else if (global.isMediaFolder) {
      consoleLog("**** Media Folder ****", "orange");
      storage.feature_dragdrop == undefined
        ? (storage.feature_dragdrop = true)
        : false;

      loadCssFile("css/tooltip.min.css");
      initExperimentalUi(storage);
      initDarkMode(storage);
      initMediaCounter();
      initMediaDragDrop();
      initMediaViewButtons();

      //Media Library explorer
      if (localStorage.getItem("scMediaView") == "list") {
        initMediaExplorer(storage.feature_experimentalui);
      }

      //Show Media Library explorer
      document.querySelector("#FileList")
        ? document
            .querySelector("#FileList")
            .setAttribute("style", "display:block")
        : false;
    } else if (global.isExperienceProfile) {
      consoleLog("**** Experience Profile ****", "orange");
      storage.feature_gravatarimage == undefined
        ? (storage.feature_gravatarimage = true)
        : false;

      if (storage.feature_gravatarimage) {
        //Listener
        target = document.querySelector("body");
        observer = new MutationObserver(function () {
          let InfoPhotoImage = document.querySelector(
            "img[data-sc-id=InfoPhotoImage]"
          );
          let InfoEmailLink = document.querySelector(
            "a[data-sc-id=InfoEmailLink]"
          );

          // InfoPhotoImage ? console.log(InfoPhotoImage.src) : false;
          // InfoEmailLink ? console.log(InfoEmailLink.innerHTML) : false;

          if (InfoPhotoImage && InfoEmailLink) {
            if (
              InfoEmailLink.innerHTML.includes("@") &&
              !InfoPhotoImage.src.includes("www.gravatar.com")
            ) {
              InfoPhotoImage.src = getGravatar(InfoEmailLink.innerHTML, 170);

              //Add https://www.fullcontact.com/developer-portal/ api to get more information
              // fetch('https://api.fullcontact.com/v3/person.enrich', {
              //   method: 'POST',
              //   headers: {
              //     "Authorization": "Bearer " + local.fullcontactApiKey
              //   },
              //   body: JSON.stringify({
              //     "email": "ugo.quaisse@gmail.com"
              //     })
              // })
              // .then(res => res)
              // .then(res => console.log(res));

              observer.disconnect();
            }
          }
        });

        //Observer publish
        target
          ? observer.observe(target, {
              attributes: false,
              childList: true,
              characterData: true,
              subtree: true,
            })
          : false;
      }
    } else if (global.isRichTextEditor || global.isHtmlEditor) {
      consoleLog("**** Rich Text Editor ****", "orange");
      storage.feature_rtecolor == undefined
        ? (storage.feature_rtecolor = true)
        : false;
      storage.feature_darkmode == undefined
        ? (storage.feature_darkmode = false)
        : false;
      storage.feature_darkmode_auto == undefined
        ? (storage.feature_darkmode_auto = false)
        : false;

      initExperimentalUi(storage);

      if (storage.feature_experimentalui) {
        //Tooltips
        loadCssFile("css/tooltip.min.css");
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

      if (storage.feature_rtecolor) {
        var contentIframe;

        //Which HTML editor
        contentIframe = global.isRichTextEditor
          ? document.querySelector("#Editor_contentIframe")
          : document.querySelector("#ctl00_ctl00_ctl05_Html");

        if (contentIframe) {
          //RTE Tabs
          let reTextArea = global.isRichTextEditor
            ? document.querySelector(".reTextArea")
            : false;

          /*
           * Codemirror css
           */
          loadCssFile("css/codemirror.min.css");
          let darkModeTheme = initDarkModeEditor(storage);

          //Extra variables
          if (global.isRichTextEditor) {
            reTextArea.insertAdjacentHTML(
              "afterend",
              '<input type="hidden" class="scDarkMode" value="' +
                darkModeTheme +
                '" />'
            );
            reTextArea.insertAdjacentHTML(
              "afterend",
              '<input type="hidden" class="scEditor" value="richTextEditor" />'
            );
          } else if (global.isHtmlEditor) {
            contentIframe.insertAdjacentHTML(
              "afterend",
              '<input type="hidden" class="scDarkMode" value="' +
                darkModeTheme +
                '" />'
            );
            contentIframe.insertAdjacentHTML(
              "afterend",
              '<input type="hidden" class="scEditor" value="htmlEditor" />'
            );
          }

          /*
           * Codemirror librairires
           */
          loadJsFile("js/bundle.min.js");
        }
      }
    } else if (
      (global.isContentEditorApp && storage.feature_experimentalui) ||
      (global.isContentEditorApp && storage.feature_instantsearch)
    ) {
      //Change logo href target on Desktop mode if
      let globalLogo = document.querySelector("#globalLogo");
      globalLogo ? globalLogo.setAttribute("target", "_parent") : false;
    } else if (global.isEditorFolder) {
      consoleLog("**** Editors folder ****", "orange");
      initExperimentalUi(storage);
    } else if (global.isGalleryVersion) {
      consoleLog("**** Versions menu ****", "orange");
      initExperimentalUi(storage);
    } else if (global.isGalleryLinks) {
      consoleLog("**** Links menu ****", "orange");
      initExperimentalUi(storage);

      let datasources = new Set();
      document.querySelectorAll("#Links > a.scLink").forEach(function (elem) {
        elem
          .getAttribute("title")
          .toLowerCase()
          .includes("'__final renderings'") &&
        !elem.innerText.toLowerCase().includes("/sitecore/system/") &&
        !elem.innerText.toLowerCase().includes("/rendering variants/")
          ? datasources.add(elem.innerText)
          : false;
      });
    } else if (global.isLayoutDetails) {
      consoleLog("**** Layout Details ****", "orange");

      document.querySelectorAll(".scRollOver").forEach(function (element) {
        let attribute = element.getAttribute("onclick");
        attribute.substring(
          attribute.lastIndexOf("{") + 1,
          attribute.lastIndexOf("}")
        );
      });
    } else if (global.isGalleryLanguage) {
      consoleLog("**** Languages menu ****", "orange");
      initExperimentalUi(storage);

      storage.feature_flags == undefined
        ? (storage.feature_flags = true)
        : false;

      if (storage.feature_flags) {
        var dom = document.querySelector("#Languages");
        var div = dom.querySelectorAll(
          ".scMenuPanelItem,.scMenuPanelItemSelected"
        );
        var td, tdlanguage, tdversion, tdimage, temp;
        var tdcount = 0;

        //Sort alphabetically or by version
        div = [].slice.call(div).sort(function (a, b) {
          return a.querySelector(
            "table > tbody > tr > td > div > div:last-child"
          ).textContent >
            b.querySelector("table > tbody > tr > td > div > div:last-child")
              .textContent
            ? -1
            : 1;
          //return a.textContent > b.textContent ? 1 : -1;
        });
        //Append dom
        div.forEach(function (language) {
          dom.appendChild(language);
        });

        for (let item of div) {
          tdcount = 0;
          td = item.getElementsByTagName("td");

          for (let item2 of td) {
            if (tdcount == 0) {
              tdimage = item2.getElementsByTagName("img");
            } else {
              tdlanguage = item2.getElementsByTagName("b");
              tdlanguage = tdlanguage[0].innerHTML;

              tdversion = item2.getElementsByTagName("div");
              tdversion = tdversion[2].innerHTML;
              tdversion = tdversion.split(" ");

              let rawVersion = item2
                .getElementsByTagName("div")[2]
                .innerHTML.toLowerCase();

              //Check version
              if (rawVersion == "fallback version") {
                temp = item2.getElementsByTagName("div");
                temp[2].setAttribute(
                  "style",
                  "background-color: lime; display: initial; padding: 0px 3px; color: #000000 !important"
                );
              } else if (tdversion[0] != "0") {
                temp = item2.getElementsByTagName("div");
                temp[2].setAttribute(
                  "style",
                  "background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important"
                );
              }

              tdlanguage = findCountryName(tdlanguage);
              tdimage[0].onerror = function () {
                this.src = global.iconFlagGeneric;
              };
              tdimage[0].src = storage.feature_experimentalui
                ? chrome.runtime.getURL(
                    "images/Flags/svg/" + tdlanguage + ".svg"
                  )
                : chrome.runtime.getURL(
                    "images/Flags/32x32/flag_" + tdlanguage + ".png"
                  );
            }

            tdcount++;
          }
        }
      }
    } else if (global.isPublishDialog) {
      consoleLog("**** Publishing window ****", "orange");

      storage.feature_flags == undefined
        ? (storage.feature_flags = true)
        : false;

      if (storage.feature_flags) {
        //Listener ScrollablePanelLanguages
        target = document.querySelector("body");
        observer = new MutationObserver(function () {
          var tdlanguage;
          var label = document.querySelectorAll(
            "div[data-sc-id=CheckBoxListLanguages] > table:last-child"
          )[0];

          if (label != undefined && label.children[0].children.length > 1) {
            //Loop
            for (var tr of label.children[0].children) {
              for (var td of tr.children) {
                tdlanguage = findCountryName(td.innerText.trim());
                if (td.querySelector("#scFlag") == null) {
                  let flag = storage.feature_experimentalui
                    ? chrome.runtime.getURL(
                        "images/Flags/svg/" + tdlanguage + ".svg"
                      )
                    : chrome.runtime.getURL(
                        "images/Flags/16x16/flag_" + tdlanguage + ".png"
                      );
                  td.querySelector("label > span").insertAdjacentHTML(
                    "beforebegin",
                    ' <img loading="lazy" id="scFlag" src="' +
                      flag +
                      '" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px;" onerror="this.onerror=null;this.src=\'' +
                      global.iconFlagGeneric +
                      "';\"/>"
                  );
                }
              }
            }
          }
        });

        //Observer publish
        target
          ? observer.observe(target, {
              attributes: false,
              childList: true,
              characterData: false,
              subtree: true,
            })
          : false;
      }
    } else if (global.isPublishWindow) {
      consoleLog("**** Publish / Rebuild / Package ****", "orange");
      initExperimentalUi(storage);

      if (storage.feature_contenteditor === true) {
        //Add #PublishingTargets input[type=checkbox] if needed
        document
          .querySelectorAll("#PublishChildrenPane input[type=checkbox]")
          .forEach(function (checkbox) {
            checkbox.classList.add("scContentControlCheckbox");
            let labelHtml =
              '<label for="' +
              checkbox.id +
              '" class="scContentControlCheckboxLabel"></label>';
            checkbox.insertAdjacentHTML("afterend", labelHtml);
          });
        loadCssFile("css/checkbox.min.css");
      }

      storage.feature_flags == undefined
        ? (storage.feature_flags = true)
        : false;

      if (storage.feature_flags) {
        var label = document.querySelectorAll("#Languages > label");

        for (let item of label) {
          tdlanguage = findCountryName(item.innerText.trim());
          let flag = storage.feature_experimentalui
            ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg")
            : chrome.runtime.getURL(
                "images/Flags/16x16/flag_" + tdlanguage + ".png"
              );
          item.insertAdjacentHTML(
            "beforebegin",
            ' <img loading="lazy" id="scFlag" src="' +
              flag +
              '" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px" onerror="this.onerror=null;this.src=\'' +
              global.iconFlagGeneric +
              "';\"/>"
          );
        }
      }
    } else if (global.isXmlControl && !global.isRichText) {
      consoleLog("**** XML Control (Window) ****", "orange");
      initExperimentalUi(storage);
    }

    /**
     * Auto Expand (Inspired by https://github.com/alan-null/sc_ext)
     */
    storage.feature_autoexpand == undefined
      ? (storage.feature_autoexpand = true)
      : false;
    storage.feature_autoexpandcount == undefined
      ? (storage.feature_autoexpandcount = false)
      : false;

    if (
      storage.feature_autoexpand &&
      document.querySelector(".scContentTree")
    ) {
      //Content tree
      document.querySelector(".scContentTree").addEventListener(
        "click",
        function (event) {
          //Chage EditorFrames opacity on load item
          if (event.target.offsetParent != null) {
            if (
              event.target.offsetParent.offsetParent.matches(
                ".scContentTreeNodeNormal"
              )
            ) {
              storage.feature_experimentalui
                ? document
                    .querySelector("#svgAnimation")
                    .setAttribute("style", "opacity:1")
                : false;
              storage.feature_experimentalui
                ? document
                    .querySelector("#EditorFrames")
                    .setAttribute("style", "opacity:0")
                : document
                    .querySelector("#EditorFrames")
                    .setAttribute("style", "opacity:0.5");
              document
                .querySelector(".scContentTreeContainer")
                .setAttribute("style", "opacity:0.5");
              document.querySelectorAll(
                ".scEditorTabHeaderNormal, .scEditorTabHeaderActive > span"
              )[0].innerText = global.tabLoadingTitle;

              //Experimental mode
              if (document.querySelector(".scPreviewButton")) {
                document.querySelector(".scPreviewButton").innerText =
                  global.tabLoadingTitle;
                document.querySelector(".scPreviewButton").disabled = true;
              }

              setTimeout(function () {
                document.querySelector("#svgAnimation")
                  ? document
                      .querySelector("#svgAnimation")
                      .setAttribute("style", "opacity:0")
                  : false;
                document
                  .querySelector("#EditorFrames")
                  .setAttribute("style", "opacity:1");
                document
                  .querySelector(".scContentTreeContainer")
                  .setAttribute("style", "opacity:1");
              }, 7000);
            }
          }

          //Content Tree
          if (event.target.matches(".scContentTreeNodeGlyph")) {
            let glyphId = event.target.id;

            setTimeout(function () {
              if (document && glyphId) {
                let subTreeDiv = document.querySelector("#" + glyphId)
                  .nextSibling.nextSibling.nextSibling;
                if (subTreeDiv) {
                  let newNodes = subTreeDiv.querySelectorAll(
                    ".scContentTreeNode"
                  );
                  newNodes.length == 1
                    ? newNodes[0]
                        .querySelector(".scContentTreeNodeGlyph")
                        .click()
                    : false;

                  if (storage.feature_autoexpandcount) {
                    document
                      .querySelectorAll(".scCountNodes")
                      .forEach(function (element) {
                        element.setAttribute("style", "display:none");
                      });
                  }
                } else {
                  let subTreeMain = document.querySelector("#" + glyphId)
                    .nextSibling.nextSibling;
                  subTreeMain.querySelector(".scCountNodes")
                    ? subTreeMain.querySelector(".scCountNodes").remove()
                    : false;
                }
              }
            }, 200);
          }

          //Media Upload
          if (event.target.matches(".dynatree-expander")) {
            let glyphId = event.path[1];

            setTimeout(function () {
              if (document && glyphId) {
                let subTreeDiv = glyphId.nextSibling;
                console.log(subTreeDiv);
                if (subTreeDiv) {
                  let newNodes = subTreeDiv.querySelectorAll(
                    ".dynatree-has-children"
                  );
                  newNodes.length == 1
                    ? newNodes[0].querySelector(".dynatree-expander").click()
                    : false;
                  console.log(newNodes);
                }
              }
            }, 200);
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
              var subTreeDiv = document
                .querySelector("#" + glyphId)
                .closest("ul").nextSibling;
              if (subTreeDiv) {
                var nextGlyphId = subTreeDiv.querySelector(".glyph");
                nextGlyphId.click();
              }
            }
          }, 200);
        },
        false
      );
    }

    /**
     * Content Tree Error Tooltip
     */
    //TODO to be triggered on TREE VIEW refresh
    loadCssFile("css/tooltip.min.css");
    setTimeout(function () {
      document
        .querySelectorAll(".scContentTreeNodeGutterIcon")
        .forEach(function (el) {
          let parent = el.parentElement;
          parent.setAttribute("data-tooltip", el.getAttribute("title"));
          parent.classList.add("t-right");
          parent.classList.add("t-xs");
          el.removeAttribute("title");
        });
    }, 2500);

    /**
     * > 10. Publish notification
     */
    target = document.querySelector("#LastPage");
    observer = new MutationObserver(function () {
      storage.feature_notification == undefined
        ? (storage.feature_notification = true)
        : false;
      storage.feature_experimentalui == undefined
        ? (storage.feature_experimentalui = false)
        : false;

      if (storage.feature_notification) {
        //Variable
        target = document.querySelector("#LastPage");

        var notificationSubTitle = target.querySelector(".sc-text-largevalue")
          .innerHTML;
        var notificationBody = target.querySelector(".scFieldLabel").innerHTML;
        if (notificationBody == "Result:") {
          notificationBody =
            "Finished " +
            document.querySelector("#ResultText").value.split("Finished")[1];
        }

        //Send notification
        sendNotification(notificationSubTitle, notificationBody);

        //Is dark mode on?
        (storage.feature_darkmode && !storage.feature_darkmode_auto) ||
        (storage.feature_darkmode &&
          storage.feature_darkmode_auto &&
          currentScheme == "dark")
          ? (darkMode = true)
          : false;

        //Update url Status
        var parentSelector = parent.parent.document.querySelector("body");
        checkUrlStatus(
          parentSelector.querySelector(".liveUrlStatus"),
          parentSelector,
          darkMode,
          storage.feature_experimentalui
        );
      }
    });

    //Observer publish
    target ? observer.observe(target, { attributes: true }) : false;

    /**
     * Update UI
     */
    target = document.querySelector("#scLanguage");
    observer = new MutationObserver(function (mutations) {
      consoleLog("*** Update UI ***", "yellow");

      //Sitecore Variables
      var scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput");

      /**
       * Update hash in URL, update pushsate history, update link if 2nd tab opened
       */
      if (scQuickInfo) {
        var sitecoreItemID = scQuickInfo.getAttribute("value");
        // eslint-disable-next-line newline-per-chained-call
        var scLanguage = document
          .querySelector("#scLanguage")
          .getAttribute("value")
          .toLowerCase();
        let scVersion = document.querySelector(
          ".scEditorHeaderVersionsVersion > span"
        );
        scVersion != null ? (scVersion = scVersion.innerText) : (scVersion = 1);
        var locaStorage = localStorage.getItem("scBackPrevious");

        //Add hash to URL
        if (
          !global.hasRedirection &&
          !global.hasRedirectionOther &&
          !global.hasModePreview
        ) {
          if (locaStorage != "true") {
            var state = {
              sitecore: true,
              id: sitecoreItemID,
              language: scLanguage,
              version: scVersion,
            };
            history.pushState(
              state,
              undefined,
              "#" + sitecoreItemID + "_" + scLanguage + "_" + scVersion
            );
          } else {
            localStorage.removeItem("scBackPrevious");
          }
        }
      }

      /**
       * Hide preview mode
       */
      setTimeout(() => {
        document
          .querySelectorAll("#EditorTabControls_Preview")
          .forEach((elem) => {
            elem.remove();
          });
      }, 500);

      //Execute a bunch of actions everytime the UI is refreshed
      mutations.forEach(function (e) {
        "attributes" == e.type && sitecoreAuthorToolbox();
      });
    });
    //Observer UI
    target ? observer.observe(target, { attributes: true }) : false;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*
   ************************
   * 4. Experience Editor *
   ************************
   */
  if (
    (global.isEditMode && !global.isLoginPage) ||
    (global.isPreviewMode && !global.isLoginPage)
  ) {
    consoleLog("Experience Editor detected", "red");

    /*
     * Load extra CSS
     */
    document.body.classList.add("loaded");
    loadCssFile("css/tooltip.min.css");
    loadJsFile("js/inject.js");

    /*
     * Store Item ID
     */
    let dataItemId = document.querySelector("[data-sc-itemid]");
    let dataItemLanguage = document.querySelector("[data-sc-language]");
    let dataItemVersion = document.querySelector("[data-sc-version]");

    if (dataItemId && dataItemVersion) {
      //Set ItemID (Storage)
      var sitecoreItemID = decodeURI(dataItemId.getAttribute("data-sc-itemid"));
      var scLanguage = decodeURI(
        dataItemLanguage.getAttribute("data-sc-language")
      );
      var scVersion = decodeURI(
        dataItemVersion.getAttribute("data-sc-version")
      );
      sitecoreItemJson(sitecoreItemID, scLanguage, scVersion);
    }

    /**
     * Flags in language menu
     */
    if (global.isGalleryLanguageExpEd) {
      consoleLog("**** Languages menu ****", "yellow");
      initExperimentalUi(storage);

      storage.feature_flags == undefined
        ? (storage.feature_flags = true)
        : false;

      if (storage.feature_flags) {
        var tdDiv;
        dom = document.querySelector(".sc-gallery-content");
        div = dom.querySelectorAll("a[data-sc-argument]");
        tdcount = 0;

        //Sort alphabetically or by version
        div = [].slice.call(div).sort(function (a, b) {
          return a.querySelector("a > div > div:last-child > span")
            .textContent >
            b.querySelector("a > div > div:last-child > span").textContent
            ? -1
            : 1;
          //return a.textContent > b.textContent ? 1 : -1;
        });
        //Append dom
        div.forEach(function (language) {
          dom.appendChild(language);
        });

        for (let item of div) {
          tdDiv = item.querySelector(
            ".sc-gallery-option-content,.sc-gallery-option-content-active"
          );
          tdlanguage = item.querySelector(
            ".sc-gallery-option-content-header > span"
          ).innerText;
          tdversion = item.querySelector(
            ".sc-gallery-option-content-description > span"
          );

          //Check version
          temp = tdversion.innerHTML.split(" ");
          if (temp[0] != "0") {
            tdversion.setAttribute(
              "style",
              "background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important"
            );
          }

          tdlanguage = findCountryName(tdlanguage);
          let flag = storage.feature_experimentalui
            ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg")
            : chrome.runtime.getURL(
                "images/Flags/32x32/flag_" + tdlanguage + ".png"
              );
          tdDiv.setAttribute(
            "style",
            "padding-left:48px; background-image: url(" +
              flag +
              "); background-repeat: no-repeat; background-position: 5px; background-size: 32px"
          );
        }
      }
    }

    /**
     * Flags in Ribbon
     */
    if (global.isRibbon) {
      consoleLog("**** Ribbon ****", "yellow");

      let scRibbonFlagIcons = document.querySelector(".flag_generic_24");

      scRibbonFlagIcons
        ? (tdlanguage = scRibbonFlagIcons.nextSibling.innerText)
        : false;

      //Clean country name
      if (tdlanguage) {
        tdlanguage = findCountryName(tdlanguage);
        let flag = storage.feature_experimentalui
          ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg")
          : chrome.runtime.getURL(
              "images/Flags/24x24/flag_" + tdlanguage + ".png"
            );
        scRibbonFlagIcons.setAttribute(
          "style",
          "background-image: url(" +
            flag +
            "); background-repeat: no-repeat; background-position: top left;"
        );
      }
    }

    /**
     * Component datasource to CE
     */
    target = document.querySelector(".scChromeDropDown");
    observer = new MutationObserver(function () {
      let scChromeDropDownRow = document.querySelectorAll(
        ".scChromeDropDownRow"
      );
      let scLanguage = document.querySelector("#scLanguage").value;
      let scVersion = "";

      for (var row of scChromeDropDownRow) {
        if (
          row.getAttribute("title").toLowerCase() == "change associated content"
        ) {
          var id = row.getAttribute("onclick").split("id={")[1].split("}")[0];
          //prettier-ignore
          var html = `<a href="#" title="Edit in Content Editor" class="scChromeDropDownRow" onclick="javascript:window.open('/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1#{` + id + `}_` + scLanguage.toLowerCase() + `_` + scVersion + `')"><img src="/~/icon/applicationsv2/32x32/window_edit.png" style="width:16px" alt="Edit in Content Editor"><span>Edit in Content Editor</span></a>`;
          row.insertAdjacentHTML("beforebegin", html);
        }
      }
    });

    //Observer
    // eslint-disable-next-line object-property-newline
    target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: false,
        })
      : false;

    /**
     * Tooltip bar
     */
    target = document.querySelector(".scChromeControls");
    observer = new MutationObserver(function () {
      var scChromeToolbar = document.querySelectorAll(".scChromeToolbar");
      //Find scChromeCommand
      for (var controls of scChromeToolbar) {
        controls.setAttribute("style", "margin-left:50px");
        var scChromeCommand = controls.querySelectorAll(".scChromeCommand");
        var changeColor = false;

        for (var command of scChromeCommand) {
          var title = command.getAttribute("title");
          command.setAttribute("style", "z-index:auto");

          if (!changeColor && title) {
            if (
              title.toLowerCase().includes("move component") ||
              title.toLowerCase().includes("remove component")
            ) {
              document
                .querySelectorAll(
                  ".scFrameSideHorizontal, .scFrameSideVertical"
                )
                .forEach(function (e) {
                  e.classList.remove("scFrameYellow");
                });
              changeColor = true;
            } else {
              document
                .querySelectorAll(
                  ".scFrameSideHorizontal, .scFrameSideVertical"
                )
                .forEach(function (e) {
                  e.classList.add("scFrameYellow");
                });
            }
          }

          if (title != null && title != "") {
            command.setAttribute("data-tooltip", title);
            command.classList.add("t-bottom");
            command.classList.add("t-md");
            command.removeAttribute("title");
          }
        }
      }
    });

    //Observer
    target
      ? observer.observe(target, {
          attributes: true,
          childList: true,
          characterData: true,
        })
      : false;

    /*
     * Dark mode + Toggle Ribbon
     */
    var pagemodeEdit = document.querySelector(".pagemode-edit");
    !pagemodeEdit
      ? (pagemodeEdit = document.querySelector(".on-page-editor"))
      : false;
    !pagemodeEdit
      ? (pagemodeEdit = document.querySelector(".experience-editor"))
      : false;
    !pagemodeEdit
      ? (pagemodeEdit = document.querySelector(".scWebEditRibbon"))
      : false;
    let tabColor;

    storage.feature_darkmode == undefined
      ? (storage.feature_darkmode = false)
      : false;
    storage.feature_darkmode_auto == undefined
      ? (storage.feature_darkmode_auto = false)
      : false;
    storage.feature_experienceeditor == undefined
      ? (storage.feature_experienceeditor = true)
      : false;

    if (storage.feature_experienceeditor) {
      //Experience Editor Reset (container, hover styles..)
      loadCssFile("css/reset.min.css");
    }

    if (
      (storage.feature_darkmode &&
        !storage.feature_darkmode_auto &&
        global.isRibbon) ||
      (storage.feature_darkmode &&
        !storage.feature_darkmode_auto &&
        global.isDialogConfirm) ||
      (storage.feature_darkmode &&
        !storage.feature_darkmode_auto &&
        global.isInsertPage) ||
      (storage.feature_darkmode &&
        storage.feature_darkmode_auto &&
        global.isRibbon &&
        currentScheme == "dark") ||
      (storage.feature_darkmode &&
        storage.feature_darkmode_auto &&
        global.isDialogConfirm &&
        currentScheme == "dark") ||
      (storage.feature_darkmode &&
        storage.feature_darkmode_auto &&
        global.isInsertPage &&
        currentScheme == "dark")
    ) {
      //Experience Editor buttons
      document.body.classList.add("dark");
      // loadCssFile("css/dark/experience.min.css");
    }

    if (
      (storage.feature_darkmode && !storage.feature_darkmode_auto) ||
      (storage.feature_darkmode &&
        storage.feature_darkmode_auto &&
        currentScheme == "dark")
    ) {
      tabColor = "dark";
    }

    /*
     * Extra buttons
     */
    target = document.body;
    observer = new MutationObserver(function (mutations) {
      for (var mutation of mutations) {
        for (var addedNode of mutation.addedNodes) {
          if (addedNode.id == "scCrossPiece") {
            //prettier-ignore
            var html = `<div class="scExpTab ` + tabColor + `">
                        <span class="tabHandle"></span>
                        <span class="tabText" onclick="toggleRibbon()">▲ Hide<span>
                        </div>`;
            addedNode.insertAdjacentHTML("afterend", html);
            observer.disconnect();
            startDrag();

            //Listeners
            document.addEventListener("keydown", (event) => {
              if (event.key === "Shift") {
                exeJsCode(`toggleRibbon()`);
                event.preventDefault();
                event.stopPropagation();
              }
            });
          }
        }
      }
    });

    //Observer
    storage.feature_experienceeditor && target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: false,
        })
      : false;

    /*
     * Go to Normal mode
     */
    var linkNormalMode;

    if (global.isEditMode) {
      linkNormalMode = global.windowLocationHref.replace(
        "sc_mode=edit",
        "sc_mode=normal"
      );
    } else if (global.isPreviewMode) {
      linkNormalMode = global.windowLocationHref.replace(
        "sc_mode=preview",
        "sc_mode=normal"
      );
    } else {
      global.windowLocationHref.includes("?")
        ? (linkNormalMode = global.windowLocationHref + "&sc_mode=normal")
        : (linkNormalMode = global.windowLocationHref + "?sc_mode=normal");
    }

    if (storage.feature_experienceeditor && !global.isRibbon) {
      //prettier-ignore
      let html = '<div class="scNormalModeTab ' + tabColor + '"><span class="t-right t-sm" data-tooltip="Open in Normal Mode"><a href="' + linkNormalMode + '" target="_blank"><img loading="lazy" src="' + global.iconChrome + '"/></a></span></div>';
      pagemodeEdit ? pagemodeEdit.insertAdjacentHTML("afterend", html) : false;
    }

    /*
     * Go to Content Editor
     */
    if (storage.feature_experienceeditor && !global.isRibbon) {
      let html =
        '<div class="scContentEditorTab ' +
        tabColor +
        '"><span class="t-right t-sm" data-tooltip="Open in Content Editor"><a href="' +
        window.location.origin +
        '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1"><img loading="lazy" src="' +
        global.iconCE +
        '"/></a></span></div>';
      pagemodeEdit ? pagemodeEdit.insertAdjacentHTML("afterend", html) : false;
    }

    /*
     * Show editable content
     */
    if (storage.feature_experienceeditor && !global.isRibbon) {
      let html =
        '<div class="scEditableTab ' +
        tabColor +
        '"><span class="t-right t-sm" data-tooltip="Show/hide editable content"><a onclick="showEditableContent()"><img loading="lazy" src="' +
        global.iconED +
        '" id="scEditableImg" class="grayscaleClass"/></a></span></div>';
      pagemodeEdit ? pagemodeEdit.insertAdjacentHTML("afterend", html) : false;
    }
    //document.querySelectorAll("[contenteditable]").forEach( function(e) { e.classList.add("scFrameYellow"); })
  }
}); //End chrome.storage
