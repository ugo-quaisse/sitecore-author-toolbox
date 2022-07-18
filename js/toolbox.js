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
import { log, loadJsFile, getScItemData } from "./modules/helpers.js";
import { initDarkMode, detectSwitchDarkMode } from "./modules/dark.js";
import { addHelptextIcons } from "./modules/help.js";
import { showSnackbar } from "./modules/snackbar.js";
import { checkWorkbox } from "./modules/workbox.js";
import { resumeFromWhereYouLeftOff, historyNavigation } from "./modules/history.js";
import { checkNotificationPermissions, checkPublishNotification } from "./modules/notification.js";
import { initFlagRibbonEE, initLanguageMenuEE, initLanguageMenuCE, initFlagsPublishingWindow, initFlagsPublish } from "./modules/language.js";
import { initCharsCount, initCheckboxes, initDateTimeField, initPasswordField, refreshContentEditor, contentTreeScrollTo, keyEventListeners, resetContentEditor } from "./modules/contenteditor.js";
import { initAppName, initGravatarImage, initUserMenu, initIntroScreen } from "./modules/users.js";
import { initInstantSearch, enhancedSitecoreSearch } from "./modules/search.js";
import { insertModal, insertPanel } from "./modules/insert.js";
import { initMediaExplorer, initMediaCounter, initMediaDragDrop, initMediaViewButtons, initUploadButton, initUploader, initLightbox, initMediaSearchBox } from "./modules/media.js";
import {
  initOnboarding,
  initExperimentalUi,
  initInsertIcon,
  initGutter,
  initSitecoreRibbon,
  initSvgAnimation,
  initSvgAnimationPublish,
  initEventListeners,
  initTitleBarDesktop,
  initMaterializeIcons,
  insertSavebarEE,
} from "./modules/experimentalui.js";
import { initFavorites } from "./modules/favorites.js";
import { initGroupedErrors } from "./modules/errors.js";
import { enhancedBucketLists } from "./modules/buckets.js";
import { initRteTooltips, initSyntaxHighlighterRte } from "./modules/rte.js";
import { initPreviewButton, listenPreviewTab } from "./modules/preview.js";
import { initLaunchpadIcon, initLaunchpadMenu } from "./modules/launchpad.js";
import { initAutoExpandTree, initTreeGutterTooltips } from "./modules/contenttree.js";
import { initQuerySuggestions } from "./modules/template.js";
import { initPublishingStatus } from "./modules/publishingdashboard.js";
import {
  initPreviewButtonsEE,
  updateEETitle,
  storeCurrentPageEE,
  addToolbarEditCE,
  addToolbarTooltip,
  addPlaceholderTooltip,
  resetExperienceEditor,
  initRenderingSearchBox,
  initOptionalFields,
  initGroupedErrorsEE,
} from "./modules/experienceeditor.js";
import { initHorizon } from "./modules/horizon.js";
import { initTabSections } from "./modules/tabs.js";
/**
 * Get all user's settings from chrome storage
 */
chrome.storage.sync.get((storage) => {
  /*
   **********************
   * Sitecore detection *
   **********************
   */
  if (global.isSitecore && global.isSitecoreJs && !global.isEditMode && !global.isLoginPage && !global.isCss) {
    log("Sitecore detected", "red");
    document.body ? document.body.classList.add("satExtension") : false;
    loadJsFile("js/inject.js");
    checkNotificationPermissions();
    checkPublishNotification(storage);
    initAutoExpandTree(storage);
    keyEventListeners();
    initUserMenu(storage);
    initDarkMode(storage);
    detectSwitchDarkMode(storage);
    /*
     **********************
     * 1. CE Application  *
     **********************
     */
    if (global.isContentEditor) {
      log("**** CE ****", "yellow");
      let ScItem = getScItemData();
      initTreeGutterTooltips();
      refreshContentEditor(storage);
      resumeFromWhereYouLeftOff(storage);
      initInstantSearch(storage);
      initFavorites(storage);
      historyNavigation();
      showSnackbar(storage);
      contentTreeScrollTo();
      initLightbox();
      initIntroScreen();
      if (storage.feature_experimentalui) {
        log("**** Experimental ****", "yellow");
        initAppName(storage, "Content Editor");
        initSvgAnimation(storage);
        insertModal(storage, ScItem.id, ScItem.language, ScItem.version);
        insertPanel();
        initInsertIcon(storage);
        initGutter();
        initSitecoreRibbon();
        initEventListeners();
        initTitleBarDesktop();
        initOnboarding();
        initMaterializeIcons(storage);
      }
    }

    /*
     ************************
     * 2. Sitecore pages  *
     ************************
     */
    if (global.isLaunchpad) {
      log("**** Launchpad ****", "orange");
      initLaunchpadIcon(storage);
      checkWorkbox(storage);
      showSnackbar(storage);
      initIntroScreen();
    } else if (global.isDesktop && !global.isGalleryFavorites && !global.isXmlControl) {
      log("**** Desktop Shell ****", "orange");
      initAppName(storage, "Sitecore Desktop");
      initLaunchpadMenu(storage);
      checkWorkbox(storage);
      showSnackbar(storage);
    } else if (global.isUserManager) {
      log("**** User Manager ****", "orange");
      initAppName(storage, "User Manager");
    } else if (global.isSecurityEditor) {
      log("**** Security Editor ****", "orange");
      initAppName(storage, "Security Editor");
    } else if (global.isAccessViewer) {
      log("**** Access Viewer ****", "orange");
      initAppName(storage, "Access Viewer");
    } else if (global.isDomainManager) {
      log("**** Domain Manager ****", "orange");
      initAppName(storage, "Domain Manager");
    } else if (global.isRoleManager) {
      log("**** Role Manager ****", "orange");
      initAppName(storage, "Role Manager");
    } else if (global.isPowerShellIse) {
      log("**** PowerShell ISE ****", "orange");
      initAppName(storage, "PowerShell ISE");
    } else if (global.isPowerShellReports) {
      log("**** PowerShell Reports ****", "orange");
      initAppName(storage, "PowerShell Reports");
    } else if (global.isRecycleBin) {
      log("**** Recycle Bin ****", "orange");
      initAppName(storage, "Recycle Bin");
    } else if (global.isWorkbox) {
      log("**** Workbox ****", "orange");
      initAppName(storage, "Workbox");
    } else if (global.isTemplateBuilder) {
      log("**** Template Builder ****", "orange");
      initAppName(storage, "Template Builder");
      initQuerySuggestions(storage);
    } else if (global.isPublishDashboard) {
      log("**** Publishing Dashboard ****", "orange");
      initAppName(storage, "Publishing Dashboard");
      initPublishingStatus(storage);
    } else {
      log("**** Non identified ****", "green");
      log(global.windowLocationHref, "green");
      initExperimentalUi(storage);
      let appName = document.querySelector("*[data-sc-id=HeaderTitle]");
      appName = appName ? appName.innerText : "";
      initAppName(storage, appName);
    }

    /*
     ************************
     * 3. Sitecore iframes  *
     ************************
     */
    if (global.isPreviewTab) {
      log("**** Preview tab ****", "orange");
      initPreviewButton(storage);
      listenPreviewTab(storage);
    } else if (global.isMediaFolder) {
      log("**** Media Folder ****", "orange");
      initMediaCounter(storage);
      initMediaDragDrop(storage);
      initMediaViewButtons(storage);
      initMediaExplorer(storage);
      initMediaSearchBox(storage);
      initMaterializeIcons(storage);
    } else if (global.isFieldEditor) {
      log("**** Field editor ****", "orange");
      initCheckboxes(storage);
      initDateTimeField(storage);
      initPasswordField(storage);
      initCharsCount(storage);
      initGroupedErrors(storage);
      addHelptextIcons();
      enhancedBucketLists();
      initMaterializeIcons(storage);
      initTabSections(storage);
    } else if (global.isExperienceProfile) {
      log("**** Experience Profile ****", "orange");
      initGravatarImage(storage);
    } else if (global.isRichTextEditor || global.isHtmlEditor) {
      log("**** Rich Text Editor ****", "orange");
      initRteTooltips(storage);
      initSyntaxHighlighterRte(storage);
    } else if ((global.isContentEditorApp && storage.feature_experimentalui) || (global.isContentEditorApp && storage.feature_instantsearch)) {
      log("**** Content Editor App ****", "orange");
      document.querySelector("#globalLogo") ? document.querySelector("#globalLogo").setAttribute("target", "_parent") : false;
    } else if (global.isSearch) {
      log("**** Internal Search ****", "orange");
      enhancedSitecoreSearch(storage);
    } else if (global.isGalleryLanguage) {
      log("**** Languages menu ****", "orange");
      initLanguageMenuCE(storage);
    } else if (global.isPublishDialog) {
      log("**** Publishing window ****", "orange");
      initFlagsPublishingWindow(storage);
    } else if (global.isPublishWindow || global.isInstallationWizard) {
      log("**** Publish / Rebuild / Package ****", "orange");
      initCheckboxes(storage);
      initFlagsPublish(storage);
      initSvgAnimationPublish(storage);
    } else if (global.isExportSiteWizard) {
      log("**** Export Site Wizard ****", "orange");
      initSvgAnimationPublish(storage);
    } else if (global.isUploadPackage) {
      log("**** Upload Package ****", "orange");
      initSvgAnimationPublish(storage);
    } else if (global.isUserOptions) {
      log("**** User options ****", "orange");
      document.querySelectorAll(".scTabs > div > fieldset > div").forEach(function (elem) {
        elem.innerText == "Quick info section" ? elem.setAttribute("style", "color:red; font-weight:bold") : false;
        elem.innerText == "Item title bar" ? elem.setAttribute("style", "color:red; font-weight:bold") : false;
      });
    } else if (global.isEditorFolder) {
      log("**** Editors folder ****", "orange");
      initMaterializeIcons(storage);
    } else if (global.isGalleryVersion) {
      log("**** Versions menu ****", "orange");
    } else if (global.isLayoutDetails) {
      log("**** Layout Details ****", "orange");
      initMaterializeIcons(storage);
    } else if (global.isDialog || global.isLockedItems) {
      log("**** Dialog UI ****", "orange");
      initMaterializeIcons(storage);
      initUploader();
    } else if (global.isGalleryFavorites) {
      log("**** Favorites ****", "orange");
      initMaterializeIcons(storage);
    } else if (global.isMediaBrowser) {
      log("**** Media Browser ****", "orange");
      initUploadButton(storage);
    } else if (global.isSelectRendering && !global.isSourceBrowser) {
      log("**** Select Rendering ****", "orange");
      initAppName(storage, "Select Rendering");
      initRenderingSearchBox(storage);
      initMaterializeIcons(storage);
    } else if (global.isXmlControl && !global.isRichText && !global.isWorkbox) {
      log("**** XML Control (Window) ****", "orange");
      initCheckboxes(storage);
      initTabSections(storage);
      initDateTimeField(storage);
      initPasswordField(storage);
      initMaterializeIcons(storage);
    } else if (global.isSourceBrowser) {
      log("**** Source Browser ****", "orange");
    } else if (global.isGalleryLinks) {
      log("**** Links menu ****", "orange");
    }
  } else {
    //Reset default Sitecore
    resetContentEditor();
  }

  /*
   *******************************
   * Experience Editor detection *
   *******************************
   */
  if ((global.isEditMode && !global.isLoginPage) || (global.isPreviewMode && !global.isLoginPage) || (global.isSitecoreModule && !global.isLoginPage)) {
    log("Experience Editor detected", "red");
    document.body ? document.body.classList.add("satExtension") : false;
    loadJsFile("js/inject.js");
    checkNotificationPermissions();
    checkPublishNotification(storage);
    keyEventListeners();
    initFlagRibbonEE(storage);
    initUserMenu(storage, "EE");
    initDarkMode(storage);
    detectSwitchDarkMode(storage);

    /*
     ******************************
     * 4. Sitecore iframes in EE  *
     ******************************
     */
    if (global.isRibbon) {
      log("**** EE Ribbon ****", "orange");
      document.querySelector("body").classList.add("satEEExperimentalUi");
      initSitecoreRibbon();
      initPreviewButtonsEE(storage);
      storeCurrentPageEE();
      insertSavebarEE(storage);
      initGroupedErrorsEE(storage);
      checkWorkbox(storage);
    } else if (global.isPreviewMode && global.isEEPreview) {
      document.querySelector("#ribbonPreLoadingIndicator").remove();
      document.querySelector("#scWebEditRibbon").remove();
      document.querySelector("#sc-ext-toggleRibon-button") ? document.querySelector("#sc-ext-toggleRibon-button").remove() : false;
      log("**** Preview Mode ****", "orange");
    } else if (global.isGalleryLanguageExpEd) {
      log("**** Language Menu ****", "orange");
      initLanguageMenuEE(storage);
    } else if (global.isGalleryVersionExpEd) {
      log("**** Version Menu ****", "orange");
    } else if (global.isInsertPage) {
      log("**** Insert Page ****", "orange");
      initMaterializeIcons(storage);
    } else if (global.isSitecoreModule) {
      log("**** Sitecore Module ****", "orange");
    } else if (global.isDialogEE) {
      log("**** Dialog ****", "orange");
    } else if (global.isNavigationTree) {
      log("**** Navigation Tree ****", "orange");
      initMaterializeIcons(storage);
    } else {
      log("**** Website preview in EE ****", "orange");
      updateEETitle(storage);
      addToolbarEditCE(storage);
      addToolbarTooltip(storage);
      addPlaceholderTooltip(storage);
      //addHideRibbonButton(storage);
      resetExperienceEditor(storage);
      initMaterializeIcons(storage);
      initOptionalFields(storage);
    }
  }

  /*
   *********************
   * Horizon detection *
   *********************
   */
  if (global.isHorizon || global.isHorizonFieldBuilder || global.isHorizonExplorer) {
    log("Horizon detected", "red");
    document.body ? document.body.classList.add("satExtension") : false;
    initHorizon(storage);
  }
});
