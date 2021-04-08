/* eslint-disable require-unicode-regexp */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import { isFileExists } from "./helpers.js";

/**
 * Global variables declaration
 */
export const windowLocationHref = window.location.href.replace(/&amp;/g, "&").toLowerCase();
export const queryString = window.location.search.toLowerCase();
export const urlOrigin = new URL(windowLocationHref).origin;
export const urlParams = new URLSearchParams(queryString);
export const debug = !!urlParams.has("debug");
export const showSnackbar = true;
export const extensionVersion = chrome.runtime.getManifest().version;
export const extensionId = chrome.runtime.getURL("something").split("chrome-extension://")[1].split("/something")[0];
export const iconSitecore = chrome.runtime.getURL("images/sitecore_logo.svg");
export const iconSitecoreTree = chrome.runtime.getURL("images/sitecore_tree.svg");
export const iconPreload = chrome.runtime.getURL("images/preload.svg");
export const iconTimeout = chrome.runtime.getURL("images/timeout.svg");
export const icon = chrome.runtime.getURL("images/rocket.svg");
export const iconRocket = chrome.runtime.getURL("images/warning-rocket.svg");
export const iconInstantSearch = chrome.runtime.getURL("images/search.svg");
export const iconInstantSearchGeneric = chrome.runtime.getURL("images/document_text.png");
export const iconLock = chrome.runtime.getURL("images/lock.svg");
export const iconMenu = chrome.runtime.getURL("images/menu.svg");
export const iconData = chrome.runtime.getURL("images/data.svg");
export const iconWorkflow = chrome.runtime.getURL("images/workflow.svg");
export const iconReminder = chrome.runtime.getURL("images/reminder.svg");
export const iconUnicorn = chrome.runtime.getURL("images/unicorn.svg");
export const iconUser = chrome.runtime.getURL("images/user.svg");
export const iconDocument = chrome.runtime.getURL("images/document.svg");
export const iconError = chrome.runtime.getURL("images/error.svg");
export const iconEdit = chrome.runtime.getURL("images/edit.svg");
export const iconMedia = chrome.runtime.getURL("images/media.svg");
export const iconTranslate = chrome.runtime.getURL("images/translate.svg");
export const iconProfiles = chrome.runtime.getURL("images/profiles.svg");
export const iconVersion = chrome.runtime.getURL("images/version.svg");
export const iconLanguage = chrome.runtime.getURL("images/language.svg");
export const iconMore = chrome.runtime.getURL("images/more.svg");
export const iconRename = chrome.runtime.getURL("images/rename.svg");
export const iconBin = chrome.runtime.getURL("images/bin.svg");
export const iconDownload = chrome.runtime.getURL("images/download.svg");
export const iconDownloadWhite = chrome.runtime.getURL("images/download_white.svg");
export const iconCopyWhite = chrome.runtime.getURL("images/copy_white.svg");
export const iconFullscreen = chrome.runtime.getURL("images/fullscreen.svg");
export const iconArrowLeft = chrome.runtime.getURL("images/arrow_left.svg");
export const iconArrowRight = chrome.runtime.getURL("images/arrow_right.svg");
export const iconLightbox = chrome.runtime.getURL("images/lightbox.svg");
export const iconTrash = chrome.runtime.getURL("images/trash.svg");
export const iconMediaFolder = chrome.runtime.getURL("images/media_folder.svg");
export const iconGridView = chrome.runtime.getURL("images/grid.svg");
export const iconListView = chrome.runtime.getURL("images/list.svg");
export const iconWarningMedia = chrome.runtime.getURL("images/warning-media.svg");
export const iconGallery = chrome.runtime.getURL("images/gallery.svg");
export const iconRefresh = chrome.runtime.getURL("images/refresh.svg");
export const iconParent = chrome.runtime.getURL("images/parent.svg");
export const iconInfo = chrome.runtime.getURL("images/info.svg");
export const iconCopy = chrome.runtime.getURL("images/copy.svg");
export const iconSubmenu = chrome.runtime.getURL("images/submenu.svg");
export const iconEmpty = chrome.runtime.getURL("images/empty.svg");
export const iconForbidden = chrome.runtime.getURL("images/forbidden.svg");
export const iconFields = chrome.runtime.getURL("images/fields.svg");
export const iconNotebook = chrome.runtime.getURL("images/notebook.svg");
export const iconLocked = chrome.runtime.getURL("images/locked.svg");
export const iconUnlocked = chrome.runtime.getURL("images/unlocked.svg");
export const iconHelp = chrome.runtime.getURL("images/help.svg");
export const iconPlay = chrome.runtime.getURL("images/play.svg");
export const iconJira = chrome.runtime.getURL("images/jira.svg");
export const iconConfluence = chrome.runtime.getURL("images/confluence.svg");
export const iconFlagGeneric = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png");
export const iconBell = chrome.runtime.getURL("images/bell.svg");
export const iconUpload = chrome.runtime.getURL("images/upload.svg");
export const iconDrop = chrome.runtime.getURL("images/drop.svg");
export const iconPublish = chrome.runtime.getURL("images/publish.svg");
export const iconAdd = chrome.runtime.getURL("images/add.svg");
export const iconDownArrow = chrome.runtime.getURL("images/down-arrow.svg");
export const iconExternalLink = chrome.runtime.getURL("images/external-link.svg");
export const iconWindowClose = chrome.runtime.getURL("images/window_close.svg");
export const iconWindowMax = chrome.runtime.getURL("images/window_max.svg");
export const iconWindowMin = chrome.runtime.getURL("images/window_min.svg");
export const urlLoader = chrome.runtime.getURL("images/ajax-loader.gif");
export const urlLoaderiFrame = chrome.runtime.getURL("images/ajax-loader-iframe.gif");
export const urlLoaderDark = chrome.runtime.getURL("images/ajax-loader-dark.gif");
export const dotGreen = chrome.runtime.getURL("images/dot_green.svg");
export const dotRed = chrome.runtime.getURL("images/dot_red.svg");
export const iconChrome = chrome.runtime.getURL("images/chrome.png");
export const iconEE = chrome.runtime.getURL("images/sat.png");
export const iconCE = chrome.runtime.getURL("images/ce.png");
export const iconED = chrome.runtime.getURL("images/editable.png");
export const iconCalendar = chrome.runtime.getURL("images/calendar.svg");
export const iconPassword = chrome.runtime.getURL("images/password.svg");

export const rteLanguages = ["ARABIC", "HEBREW", "PERSIAN", "URDU", "SINDHI"];
export const launchpadPage = chrome.runtime.getURL("options/options.html");
export const launchpadIcon = chrome.runtime.getURL("images/icon.png");
export const launchpadIconBlue = chrome.runtime.getURL("images/icon_blue.png");
export const launchpadGroupTitle = "Sitecore Author Toolbox";
export const launchpadTitle = "Options";
export const tabLoadingTitle = "Loading...";
export const squareLogo = chrome.runtime.getURL("images/square-logo.png");
export const iconPreview = chrome.runtime.getURL("images/mobile.svg");
export const iconMobile = chrome.runtime.getURL("images/preview_mobile.svg");
export const iconTablet = chrome.runtime.getURL("images/preview_tablet.svg");
export const iconWeb = chrome.runtime.getURL("images/preview_web.svg");
export const iconRotate = chrome.runtime.getURL("images/preview_rotate.svg");
export const iconMenuBright = chrome.runtime.getURL("images/menu_bright.svg");
export const iconMenuTheme = chrome.runtime.getURL("images/menu_theme.svg");
export const iconMenuColor = chrome.runtime.getURL("images/menu_color.svg");
export const iconMenuOptions = chrome.runtime.getURL("images/menu_options.svg");
export const iconOwl = chrome.runtime.getURL("images/owl.svg");
export const iconTreeCollapsed = chrome.runtime.getURL("images/treemenu_collapsed.png");
export const iconTreeExpanded = chrome.runtime.getURL("images/treemenu_expanded.png");
export const iconIntro = chrome.runtime.getURL("images/intro.svg");

export let timeout;
export const isSitecore = windowLocationHref.includes("/sitecore/");
export const isSitecoreModule = windowLocationHref.includes("/sitecore%20modules/");
export const isSitecoreContentHome = windowLocationHref.includes("/sitecore/content/home");
export const isSitecoreJs = isFileExists("/sitecore/shell/");
export let isPreviewMode = document.querySelector(".pagemode-preview");
!isPreviewMode ? (isPreviewMode = windowLocationHref.includes("sc_mode=preview")) : false;
export let isEditMode = document.querySelector(".pagemode-edit, .on-page-editor"); // , #scCrossPiece, .scFrameSideVertical
!isEditMode ? (isEditMode = windowLocationHref.includes("sc_mode=edit")) : false;
!isEditMode ? (isEditMode = windowLocationHref.includes("/experienceeditor/")) : false;
export const isXmlControl = windowLocationHref.includes("default.aspx?xmlcontrol=");
export const scDatabase = urlParams.get("sc_content");
export const isGalleryLanguage = windowLocationHref.includes("gallery.language");
export const isGalleryVersion = windowLocationHref.includes("gallery.version");
export const isGalleryLinks = windowLocationHref.includes("gallery.links");
export const isSetIcon = windowLocationHref.includes("seticon");
export const isTemplateBuilder = windowLocationHref.includes("templatebuilder");
export const isLayoutDetails = windowLocationHref.includes("layoutdetails");
export const isRichText = windowLocationHref.includes("richtext.");
export const isGalleryLanguageExpEd = windowLocationHref.includes("selectlanguagegallery");
export const isGalleryVersionExpEd = windowLocationHref.includes("selectversiongallery");
export const isGalleryFavorites = windowLocationHref.includes("gallery.favorites");
export const isAdminCache = windowLocationHref.includes("/admin/cache.aspx");
export const isAdmin = windowLocationHref.includes("/admin/");
export const isMediaLibrary = windowLocationHref.includes("he=media+library");
export const isWindowedMode = urlParams.has("he") && !urlParams.has("sc_bw");
export const isMediaBrowser = windowLocationHref.includes("sitecore.shell.applications.media.mediabrowser");
export const isSourceBrowser = windowLocationHref.includes("sitecore.shell.applications.dialogs.selectrenderingdatasource");
export const isSelectRendering = windowLocationHref.includes("selectrendering");
export const isMediaFolder = windowLocationHref.includes("media%20folder.aspx");
export const isLockedItems = windowLocationHref.includes("lockeditems.aspx");
export const isMediaUpload = windowLocationHref.includes("/applications/dialogs/uploadmediadialog");
export const isUploadManager = windowLocationHref.includes("/uploadmanager/");
export const isPublishWindow = windowLocationHref.includes("/applications/publish.aspx");
export const isPublishDialog = windowLocationHref.includes("/publishing/publishdialog");
export const isExportSiteWizard = windowLocationHref.includes("exportsitewizard");
export const isInstallationWizard = windowLocationHref.includes("installationwizard");
export const isUploadPackage = windowLocationHref.includes("uploadpackage");
export const isSecurityWindow = windowLocationHref.includes("/applications/security/");
export const isEditUser = windowLocationHref.includes("security.edituser.aspx");
export const isSecurityEditor = windowLocationHref.includes("security%20editor.aspx");
export const isAccessViewer = windowLocationHref.includes("access%20viewer.asp");
export const isDomainManager = windowLocationHref.includes("domain%20manager.asp");
export const isRoleManager = windowLocationHref.includes("role%20manager.asp");
export const isChangePassword = windowLocationHref.includes("changepassword.aspx");
export const isUserManager = windowLocationHref.includes("user%20manager.aspx");
export const isContentEditor = document.querySelector("#scLanguage");
export const isExperienceEditor = windowLocationHref.includes("/applications/experienceeditor/");
export const isContentHome = windowLocationHref.includes("/content/");
export const isLoginPage = windowLocationHref.includes("sitecore/login");
export const isLaunchpad = windowLocationHref.includes("/applications/launchpad");
export const isPowerShellIse = windowLocationHref.includes("powershellise");
export const isPowerShellReports = windowLocationHref.includes("powershellreports");
export const isRecycleBin = windowLocationHref.includes("/archives/recycle%20bin.aspx");
export const isDesktop = windowLocationHref.includes("/shell/default.aspx");
export const isContentEditorApp = windowLocationHref.includes("/shell/applications/content-editor");
export const isRichTextEditor = windowLocationHref.includes("/controls/rich%20text%20editor/");
export const isHtmlEditor = windowLocationHref.includes(".edithtml.aspx");
export const isFieldEditor = windowLocationHref.includes("field%20editor.aspx");
export const isPreviewTab = windowLocationHref.includes("editors.preview.aspx");
export const isModalDialogs = windowLocationHref.includes("jquerymodaldialogs.html");
export const isTelerikUi = windowLocationHref.includes("telerik.web.ui");
export const isSecurityDetails = windowLocationHref.includes("securitydetails.aspx");
export const isEditorFolder = windowLocationHref.includes("editors.folder.aspx");
export const isRibbon = windowLocationHref.includes("/ribbon.aspx");
export const isDialogEE = windowLocationHref.includes("/experienceeditor/dialogs/");
export const isNavigationTree = windowLocationHref.includes("/experienceeditor/pages/navigationtreeview");
export const isInsertPage = windowLocationHref.includes("/dialogs/insertpage");
export const isDialog = windowLocationHref.includes("/dialogs/");
export const isUserOptions = windowLocationHref.includes("changeuseroptions");
export const isCreateUser = windowLocationHref.includes("createnewuser");
export const isPersonalization = windowLocationHref.includes("dialogs.personalization");
export const isRules = windowLocationHref.includes("rules.aspx");
export const isCss = windowLocationHref.includes(".css");
export const isSearch = windowLocationHref.includes("showresult.aspx");
export const isExperienceProfile = windowLocationHref.includes("/applications/experienceprofile/");
export const isWorkbox = windowLocationHref.includes("workbox");
export const scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput");
export const scUrlHash = window.location.hash.substr(1);
export const workboxLaunchpad = document.querySelector("a[title='workbox'i]");
export const workboxPage = "/sitecore/shell/Applications/Workbox/Default.aspx?he=Workbox&sc_bw=1";
export const hasRedirection = windowLocationHref.includes("&ro=");
export const hasRedirectionOther = windowLocationHref.includes("&sc_ce_uri=");
export const hasModePreview = windowLocationHref.includes("&mo=preview");
export const scContentTree = document.querySelector("#ContentTreeHolder");

export const svgAnimation = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 52 12" enable-background="new 0 0 0 0" xml:space="preserve">
  <circle fill="#fff" stroke="none" cx="6" cy="6" r="6" style="fill: var(--accent)">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>    
  </circle>
  <circle fill="#fff" stroke="none" cx="26" cy="6" r="6" style="fill: var(--accent)">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>       
  </circle>
  <circle fill="#fff" stroke="none" cx="46" cy="6" r="6" style="fill: var(--accent)">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>     
  </circle>
</svg>`;

export const svgAnimationCircle = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<circle cx="50" cy="50" fill="none" stroke="var(--accent)" stroke-width="3" r="30" stroke-dasharray="141.37166941154067 49.12388980384689" style="animation-play-state: running; animation-delay: 0s;">
  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" style="animation-play-state: running; animation-delay: 0s;"></animateTransform>
</circle>
</svg>`;

export const jsonData = JSON.parse(
  '[{"language":"Afrikaans","flag":"SOUTH_AFRICA"},{"language":"Arabic","flag":"SAUDI_ARABIA"},{"language":"Belarusian","flag":"BELARUS"},{"language":"Bulgarian","flag":"BULGARIA"},{"language":"Catalan","flag":""},{"language":"Czech","flag":"CZECH_REPUBLIC"},{"language":"Danish","flag":"DENMARK"},{"language":"German","flag":"GERMANY"},{"language":"Greek","flag":"GREECE"},{"language":"English","flag":"GREAT_BRITAIN"},{"language":"Spanish","flag":"SPAIN"},{"language":"Estonian","flag":"ESTONIA"},{"language":"Basque","flag":""},{"language":"Persian","flag":"IRAN"},{"language":"Finnish","flag":"FINLAND"},{"language":"Faroese","flag":""},{"language":"French","flag":"FRANCE"},{"language":"Galician","flag":""},{"language":"Gujarati","flag":"INDIA"},{"language":"Hebrew","flag":"ISRAEL"},{"language":"Hindi","flag":"INDIA"},{"language":"Croatian","flag":"CROATIA"},{"language":"Hungarian","flag":"HUNGARY"},{"language":"Armenian","flag":"ARMENIA"},{"language":"Indonesian","flag":"MAIN_COUNTRY"},{"language":"Icelandic","flag":"ICELAND"},{"language":"Italian","flag":"ITALY"},{"language":"Japanese","flag":"JAPAN"},{"language":"Georgian","flag":"GEORGIA"},{"language":"Kazakh","flag":"KAZAKHSTAN"},{"language":"Kannada","flag":"INDIA"},{"language":"Korean","flag":"SOUTH_KOREA"},{"language":"Kyrgyz","flag":"KYRGYZSTAN"},{"language":"Lithuanian","flag":"LITHUANIA"},{"language":"Latvian","flag":"LATVIA"},{"language":"Maori","flag":"NEW_ZEALAND"},{"language":"Macedonian","flag":"MACEDONIA"},{"language":"Mongolian","flag":"MONGOLIA"},{"language":"Marathi","flag":"INDIA"},{"language":"Malay","flag":"MALAYSIA"},{"language":"Maltese","flag":"MALTA"},{"language":"Norwegian Bokmål","flag":"NORWAY"},{"language":"Dutch","flag":"NETHERLANDS"},{"language":"Norwegian Nynorsk","flag":"NORWAY"},{"language":"Punjabi","flag":"INDIA"},{"language":"Polish","flag":"POLAND"},{"language":"Portuguese","flag":"PORTUGAL"},{"language":"Romanian","flag":"ROMANIA"},{"language":"Russian","flag":"RUSSIA"},{"language":"Sanskrit","flag":"INDIA"},{"language":"Sami, Northern","flag":""},{"language":"Slovak","flag":"SLOVAKIA"},{"language":"Slovenian","flag":"SLOVENIA"},{"language":"Albanian","flag":"ALBANIA"},{"language":"Swedish","flag":"SWEDEN"},{"language":"Kiswahili","flag":"KENYA"},{"language":"Tamil","flag":"INDIA"},{"language":"Telugu","flag":"INDIA"},{"language":"Thai","flag":"THAILAND"},{"language":"Setswana","flag":"SOUTH_AFRICA"},{"language":"Turkish","flag":"TURKEY"},{"language":"Tatar","flag":"RUSSIA"},{"language":"Ukrainian","flag":"UKRAINE"},{"language":"Urdu","flag":"PAKISTAN"},{"language":"Vietnamese","flag":"VIETNAM"},{"language":"isiXhosa","flag":"SOUTH_AFRICA"},{"language":"Chinese","flag":"CHINA"},{"language":"isiZulu","flag":"SOUTH_AFRICA"}]'
);
