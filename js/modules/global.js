/* eslint-disable require-unicode-regexp */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import { isFileExists } from "./helpers.js";

/**
 * Global variables declaration
 */
export const timeoutAsync = 4000;
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
export const iconExperienceEditor = chrome.runtime.getURL("images/pencil.png");
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
export const iconCog = chrome.runtime.getURL("images/cog.svg");
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
export const iconAzure = chrome.runtime.getURL("images/azure.svg");
export const iconZendesk = chrome.runtime.getURL("images/zendesk.svg");
export const iconConfluence = chrome.runtime.getURL("images/confluence.svg");
export const iconFlagGeneric = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png");
export const iconBell = chrome.runtime.getURL("images/bell.svg");
export const iconUpload = chrome.runtime.getURL("images/upload.svg");
export const iconDrop = chrome.runtime.getURL("images/drop.svg");
export const iconPublish = chrome.runtime.getURL("images/publish.svg");
export const iconAdd = chrome.runtime.getURL("images/add.svg");
export const iconAddDark = chrome.runtime.getURL("images/add-dark.svg");
export const iconTree = chrome.runtime.getURL("images/tree.svg");
export const iconPencil = chrome.runtime.getURL("images/pencil.svg");
export const iconDownArrow = chrome.runtime.getURL("images/down-arrow.svg");
export const iconExternalLink = chrome.runtime.getURL("images/external-link.svg");
export const iconWindowClose = chrome.runtime.getURL("images/window_close.svg");
export const iconWindowMax = chrome.runtime.getURL("images/window_max.svg");
export const iconWindowMin = chrome.runtime.getURL("images/window_min.svg");
export const urlLoader = chrome.runtime.getURL("images/ajax-loader.gif");
export const urlLoaderiFrame = chrome.runtime.getURL("images/ajax-loader-iframe.gif");
export const iconSpinner = chrome.runtime.getURL("images/sc-spinner.svg");
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
export const bgPreview = chrome.runtime.getURL("images/bg_preview.jpg");

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
export const isEEPreview = windowLocationHref.includes("sat_ee_preview=true");
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
export const isPublishDashboard = windowLocationHref.includes("/publishing/dashboard");
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
export const isHorizon = windowLocationHref.includes("/composer/pages/");
export const isHorizonFieldBuilder = windowLocationHref.includes("/content/fieldbuilder/");
export const isHorizonExplorer = windowLocationHref.includes("/content/explorer/");
export const isWorkbox = windowLocationHref.includes("workbox");
export const scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput");
export const scUrlHash = window.location.hash.substr(1);
export const workboxLaunchpad = document.querySelector("a[title='workbox'i]");
export const workboxPage = "/sitecore/shell/Applications/Workbox/Default.aspx?he=Workbox&sc_bw=1";
export const hasRedirection = windowLocationHref.includes("&ro=");
export const hasRedirectionOther = windowLocationHref.includes("&sc_ce_uri=");
export const hasModePreview = windowLocationHref.includes("&mo=preview");
export const scContentTree = document.querySelector("#ContentTreeHolder");
export const notifyIconError = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M16 2.66675C13.3629 2.66675 10.785 3.44873 8.59239 4.91382C6.39974 6.37891 4.69077 8.46129 3.6816 10.8976C2.67243 13.334 2.40839 16.0149 2.92286 18.6013C3.43733 21.1877 4.70721 23.5635 6.57191 25.4282C8.43661 27.2929 10.8124 28.5627 13.3988 29.0772C15.9852 29.5917 18.6661 29.3276 21.1024 28.3185C23.5388 27.3093 25.6212 25.6003 27.0863 23.4077C28.5513 21.215 29.3333 18.6372 29.3333 16.0001C29.3333 14.2491 28.9885 12.5153 28.3184 10.8976C27.6483 9.27996 26.6662 7.81011 25.4281 6.57199C24.19 5.33388 22.7201 4.35175 21.1024 3.68169C19.4848 3.01162 17.751 2.66675 16 2.66675ZM16 26.6667C13.171 26.6667 10.4579 25.5429 8.45752 23.5426C6.45714 21.5422 5.33333 18.8291 5.33333 16.0001C5.33038 13.6312 6.12402 11.3301 7.58666 9.46675L22.5333 24.4134C20.6699 25.8761 18.3689 26.6697 16 26.6667ZM24.4133 22.5334L9.46666 7.58675C11.3301 6.1241 13.6311 5.33047 16 5.33341C18.829 5.33341 21.5421 6.45722 23.5425 8.45761C25.5429 10.458 26.6667 13.1711 26.6667 16.0001C26.6696 18.369 25.876 20.67 24.4133 22.5334Z"></path></svg>`;
export const notifyIconWarning = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M16 14.6667C15.6464 14.6667 15.3072 14.8072 15.0572 15.0573C14.8071 15.3073 14.6667 15.6465 14.6667 16.0001V21.3334C14.6667 21.687 14.8071 22.0262 15.0572 22.2762C15.3072 22.5263 15.6464 22.6667 16 22.6667C16.3536 22.6667 16.6928 22.5263 16.9428 22.2762C17.1929 22.0262 17.3333 21.687 17.3333 21.3334V16.0001C17.3333 15.6465 17.1929 15.3073 16.9428 15.0573C16.6928 14.8072 16.3536 14.6667 16 14.6667ZM16.5067 9.44008C16.182 9.30672 15.8179 9.30672 15.4933 9.44008C15.3297 9.50354 15.1801 9.59869 15.0533 9.72008C14.9356 9.84968 14.8409 9.9985 14.7733 10.1601C14.6987 10.3183 14.6622 10.4918 14.6667 10.6667C14.6656 10.8422 14.6993 11.0162 14.7656 11.1786C14.832 11.3411 14.9298 11.4888 15.0533 11.6134C15.1829 11.7312 15.3317 11.8259 15.4933 11.8934C15.6953 11.9764 15.9146 12.0085 16.1319 11.9869C16.3492 11.9653 16.5579 11.8906 16.7396 11.7695C16.9213 11.6484 17.0705 11.4845 17.174 11.2922C17.2775 11.0999 17.3322 10.8851 17.3333 10.6667C17.3284 10.3137 17.1903 9.97559 16.9467 9.72008C16.8199 9.59869 16.6703 9.50354 16.5067 9.44008ZM16 2.66675C13.3629 2.66675 10.785 3.44873 8.59239 4.91382C6.39974 6.37891 4.69077 8.46129 3.6816 10.8976C2.67243 13.334 2.40839 16.0149 2.92286 18.6013C3.43733 21.1877 4.70721 23.5635 6.57191 25.4282C8.43661 27.2929 10.8124 28.5627 13.3988 29.0772C15.9852 29.5917 18.6661 29.3276 21.1024 28.3185C23.5388 27.3093 25.6212 25.6003 27.0863 23.4077C28.5513 21.215 29.3333 18.6372 29.3333 16.0001C29.3333 14.2491 28.9885 12.5153 28.3184 10.8976C27.6483 9.27996 26.6662 7.81011 25.4281 6.57199C24.19 5.33388 22.7201 4.35175 21.1024 3.68169C19.4848 3.01162 17.751 2.66675 16 2.66675ZM16 26.6667C13.8903 26.6667 11.828 26.0412 10.0739 24.8691C8.31979 23.697 6.95262 22.0311 6.14528 20.082C5.33795 18.133 5.12671 15.9882 5.53829 13.9191C5.94986 11.85 6.96576 9.94937 8.45752 8.45761C9.94928 6.96585 11.8499 5.94995 13.919 5.53837C15.9882 5.1268 18.1329 5.33803 20.082 6.14537C22.031 6.9527 23.6969 8.31987 24.869 10.074C26.0411 11.8281 26.6667 13.8904 26.6667 16.0001C26.6667 18.8291 25.5429 21.5422 23.5425 23.5426C21.5421 25.5429 18.829 26.6667 16 26.6667Z"></path></svg>`;
export const notifyIconSuccess = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19.6267 11.7201L13.9067 17.4534L11.7067 15.2534C11.5871 15.1138 11.44 15.0005 11.2746 14.9204C11.1092 14.8404 10.929 14.7954 10.7454 14.7884C10.5618 14.7813 10.3787 14.8122 10.2076 14.8792C10.0365 14.9463 9.88107 15.0479 9.75113 15.1779C9.62119 15.3078 9.51951 15.4632 9.45248 15.6343C9.38545 15.8054 9.35451 15.9885 9.3616 16.1722C9.36869 16.3558 9.41366 16.536 9.4937 16.7014C9.57373 16.8668 9.68709 17.0139 9.82666 17.1334L12.96 20.2801C13.0846 20.4037 13.2323 20.5014 13.3948 20.5678C13.5572 20.6341 13.7312 20.6678 13.9067 20.6667C14.2564 20.6653 14.5916 20.5264 14.84 20.2801L21.5067 13.6134C21.6316 13.4895 21.7308 13.342 21.7985 13.1795C21.8662 13.017 21.9011 12.8428 21.9011 12.6667C21.9011 12.4907 21.8662 12.3165 21.7985 12.154C21.7308 11.9915 21.6316 11.844 21.5067 11.7201C21.2568 11.4717 20.9189 11.3324 20.5667 11.3324C20.2144 11.3324 19.8765 11.4717 19.6267 11.7201ZM16 2.66675C13.3629 2.66675 10.785 3.44873 8.59239 4.91382C6.39974 6.37891 4.69077 8.46129 3.6816 10.8976C2.67243 13.334 2.40839 16.0149 2.92286 18.6013C3.43733 21.1877 4.70721 23.5635 6.57191 25.4282C8.43661 27.2929 10.8124 28.5627 13.3988 29.0772C15.9852 29.5917 18.6661 29.3276 21.1024 28.3185C23.5388 27.3093 25.6212 25.6003 27.0863 23.4077C28.5513 21.215 29.3333 18.6372 29.3333 16.0001C29.3333 14.2491 28.9885 12.5153 28.3184 10.8976C27.6483 9.27996 26.6662 7.81011 25.4281 6.57199C24.19 5.33388 22.7201 4.35175 21.1024 3.68169C19.4848 3.01162 17.751 2.66675 16 2.66675ZM16 26.6667C13.8903 26.6667 11.828 26.0412 10.0739 24.8691C8.31979 23.697 6.95262 22.0311 6.14528 20.082C5.33795 18.133 5.12671 15.9882 5.53829 13.9191C5.94986 11.85 6.96576 9.94937 8.45752 8.45761C9.94928 6.96585 11.8499 5.94995 13.919 5.53837C15.9882 5.1268 18.1329 5.33803 20.082 6.14537C22.031 6.9527 23.6969 8.31987 24.869 10.074C26.0411 11.8281 26.6667 13.8904 26.6667 16.0001C26.6667 18.8291 25.5429 21.5422 23.5425 23.5426C21.5421 25.5429 18.829 26.6667 16 26.6667Z"></path></svg>`;

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
