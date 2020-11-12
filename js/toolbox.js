/**
 * Sitecore Author Toolbox
 * A Chrome/Edge Extension
 * by Ugo Quaisse
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

/**
 * Load modules
 */
import * as global from "./modules/global.js";
import { consoleLog, loadJsFile, initDarkMode, autoDarkMode, getScItemData } from "./modules/helpers.js";
import { showSnackbar } from "./modules/snackbar.js";
import { workboxNotifications } from "./modules/workbox.js";
import { resumeFromWhereYouLeftOff, historyNavigation } from "./modules/history.js";
import { checkNotificationPermissions, checkPublishNotification } from "./modules/notification.js";
import { initFlagRibbonEE, initLanguageMenuEE, initLanguageMenuCE, initFlagsPublishingWindow, initFlagsPublish } from "./modules/language.js";
import { initCharsCount, initCheckboxes, initPublishCheckboxes, refreshContentEditor } from "./modules/contenteditor.js";
import { initGravatarImage, initUserMenu } from "./modules/users.js";
import { initInstantSearch, enhancedSitecoreSearch } from "./modules/search.js";
import { insertModal, insertPanel } from "./modules/insert.js";
import { initMediaExplorer, initMediaCounter, initMediaDragDrop, initMediaViewButtons } from "./modules/media.js";
import { initExperimentalUi, insertSavebar, initInsertIcon, initGutter, initColorPicker, initSitecoreMenu, initContrastedIcons, initSvgAnimation, initEventListeners } from "./modules/experimentalui.js";
import { initFavorites } from "./modules/favorites.js";
import { initGroupedErrors } from "./modules/errors.js";
import { enhancedBucketLists } from "./modules/buckets.js";
import { initRteTooltips, initSyntaxHighlighterRte } from "./modules/rte.js";
import { initPreviewButton, listenPreviewTab } from "./modules/preview.js";
import { initLaunchpadIcon, initLaunchpadMenu } from "./modules/launchpad.js";
import { initAutoExpandTree, initTreeGutterTooltips } from "./modules/contenttree.js";
import { storeCurrentPageEE, toolbarEditInCE, addToolbarTooltip, addComponentTooltip, addExtraButtons, resetExperienceEditor } from "./modules/experienceeditor.js";

/**
 * Get all user's settings from chrome storage
 */
chrome.storage.sync.get((storage) => {
  /*
   **********************
   * Sitecore detection *
   **********************
   */
  if (global.isSitecore && !global.isEditMode && !global.isLoginPage && !global.isCss && !global.isUploadManager) {
    consoleLog("Sitecore detected", "red");
    document.body.classList.add("satExtension");
    loadJsFile("js/inject.js");
    checkNotificationPermissions();
    checkPublishNotification(storage);
    initUserMenu(storage);
    initDarkMode(storage);
    autoDarkMode(storage);
    initExperimentalUi(storage);
    initContrastedIcons(storage);
    initAutoExpandTree(storage);
    initTreeGutterTooltips();
    refreshContentEditor();

    /*
     **********************
     * 1. CE Application  *
     **********************
     */
    if (global.isContentEditor) {
      consoleLog("**** CE ****", "yellow");
      let ScItem = getScItemData();
      resumeFromWhereYouLeftOff(storage);
      initInstantSearch(storage);
      initFavorites(storage);
      workboxNotifications(storage);
      historyNavigation();
      showSnackbar();
      if (storage.feature_experimentalui) {
        consoleLog("**** Experimental ****", "yellow");
        initSvgAnimation();
        insertSavebar();
        insertModal(ScItem.id, ScItem.language, ScItem.version);
        insertPanel();
        initInsertIcon();
        initGutter();
        initColorPicker();
        initSitecoreMenu();
        initEventListeners();
      }
    }

    /*
     ************************
     * 2. Sitecore pages  *
     ************************
     */
    if ((global.isDesktop && !global.isGalleryFavorites && !global.isXmlControl) || global.isLaunchpad) {
      consoleLog("**** Launchpad - Desktop Shell ****", "orange");
      initLaunchpadIcon(storage);
      initLaunchpadMenu(storage);
      workboxNotifications(storage);
    }

    /*
     ************************
     * 3. Sitecore iframes  *
     ************************
     */
    if (global.isPreviewTab) {
      consoleLog("**** Preview tab ****", "orange");
      initPreviewButton(storage);
      listenPreviewTab(storage);
    } else if (global.isMediaFolder) {
      consoleLog("**** Media Folder ****", "orange");
      initMediaCounter();
      initMediaDragDrop();
      initMediaViewButtons();
      initMediaExplorer(storage);
    } else if (global.isFieldEditor) {
      consoleLog("**** Field editor ****", "orange");
      initCheckboxes(storage);
      initCharsCount(storage);
      initGroupedErrors(storage);
      enhancedBucketLists();
    } else if (global.isExperienceProfile) {
      consoleLog("**** Experience Profile ****", "orange");
      initGravatarImage(storage);
    } else if (global.isRichTextEditor || global.isHtmlEditor) {
      consoleLog("**** Rich Text Editor ****", "orange");
      initRteTooltips(storage);
      initSyntaxHighlighterRte(storage);
    } else if ((global.isContentEditorApp && storage.feature_experimentalui) || (global.isContentEditorApp && storage.feature_instantsearch)) {
      //Change logo href target on Desktop mode if
      document.querySelector("#globalLogo") ? document.querySelector("#globalLogo").setAttribute("target", "_parent") : false;
    } else if (global.isSearch) {
      consoleLog("**** Internal Search ****", "orange");
      enhancedSitecoreSearch();
    } else if (global.isGalleryLanguage) {
      consoleLog("**** Languages menu ****", "orange");
      initLanguageMenuCE(storage);
    } else if (global.isPublishDialog) {
      consoleLog("**** Publishing window ****", "orange");
      initFlagsPublishingWindow(storage);
    } else if (global.isPublishWindow) {
      consoleLog("**** Publish / Rebuild / Package ****", "orange");
      initPublishCheckboxes(storage);
      initFlagsPublish(storage);
    } else if (global.isEditorFolder) {
      consoleLog("**** Editors folder ****", "orange");
    } else if (global.isGalleryVersion) {
      consoleLog("**** Versions menu ****", "orange");
    } else if (global.isLayoutDetails) {
      consoleLog("**** Layout Details ****", "orange");
    } else if (global.isXmlControl && !global.isRichText) {
      consoleLog("**** XML Control (Window) ****", "orange");
    } else if (global.isDialog || global.isLockedItems) {
      consoleLog("**** Dialog UI ****", "orange");
    } else if (global.isSourceBrowser) {
      consoleLog("**** Source Browser ****", "orange");
    } else if (global.isGalleryLinks) {
      consoleLog("**** Links menu ****", "orange");
    }
  }

  /*
   *******************************
   * Experience Editor detection *
   *******************************
   */
  if ((global.isEditMode && !global.isLoginPage) || (global.isPreviewMode && !global.isLoginPage)) {
    consoleLog("Experience Editor detected", "red");
    document.body.classList.add("satExtension");
    loadJsFile("js/inject.js");
    checkNotificationPermissions();
    initDarkMode(storage);
    autoDarkMode(storage);
    initExperimentalUi(storage);
    initContrastedIcons(storage);

    /*
     ************************
     * 4. Sitecore iframes  *
     ************************
     */
    if (global.isRibbon) {
      consoleLog("**** EE Ribbon ****", "orange");
      initFlagRibbonEE(storage);
    } else if (global.isGalleryLanguageExpEd) {
      consoleLog("**** Language Menu ****", "orange");
      initLanguageMenuEE(storage);
    } else {
      consoleLog("**** Page in EE ****", "orange");
      storeCurrentPageEE();
      toolbarEditInCE();
      addComponentTooltip();
      addToolbarTooltip();
      addExtraButtons(storage);
      resetExperienceEditor(storage);
    }
  }
});
