/**
 * Sitecore Author Toolbox
 * A Google Chrome Extension
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

/**
 * Global variables declaration
 */
export const debug = false;
export const extensionVersion = chrome.runtime.getManifest().version;
export const extensionId = chrome.runtime.getURL("something").split("chrome-extension://")[1].split("/something")[0];
export const icon = chrome.runtime.getURL("images/rocket.svg");
export const iconLock = chrome.runtime.getURL("images/lock.svg");
export const iconWorkflow = chrome.runtime.getURL("images/workflow.svg");
export const iconPublish = chrome.runtime.getURL("images/publish.svg");
export const iconUnicorn = chrome.runtime.getURL("images/unicorn.svg");
export const iconUser = chrome.runtime.getURL("images/user.svg");
export const iconError = chrome.runtime.getURL("images/error.svg");
export const iconEdit = chrome.runtime.getURL("images/edit.svg");
export const iconMedia = chrome.runtime.getURL("images/media.svg");
export const iconTranslate = chrome.runtime.getURL("images/translate.svg");
export const iconVersion = chrome.runtime.getURL("images/version.svg");
export const iconFlagGeneric = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png");
export const urlLoader = chrome.runtime.getURL("images/ajax-loader.gif");
export const dotGreen = chrome.runtime.getURL("images/dot_green.svg");
export const dotRed = chrome.runtime.getURL("images/dot_red.svg");
export const iconChrome =  chrome.runtime.getURL("images/chrome.png");
export const iconEE =  chrome.runtime.getURL("images/sat.png");
export const iconCE =  chrome.runtime.getURL("images/ce.png");
export const rteLanguages = ["ARABIC", "HEBREW", "PERSIAN", "URDU", "SINDHI"];
export const windowLocationHref = window.location.href.toLowerCase();
export const queryString = window.location.search.toLowerCase();
export const urlParams = new URLSearchParams(queryString);
export const launchpadPage = chrome.runtime.getURL("options.html");
export const launchpadIcon = chrome.runtime.getURL("images/icon.png");
export const launchpadGroupTitle = "Sitecore Author Toolbox";
export const launchpadTitle = "Options";

export let timeout;
export let isSitecore = windowLocationHref.includes('/sitecore/');
export let isPreviewMode = document.querySelector(".pagemode-preview");
!isPreviewMode ? isPreviewMode = windowLocationHref.includes('sc_mode=preview') : false;
export let isEditMode = document.querySelector(".pagemode-edit");
!isEditMode ? isEditMode = windowLocationHref.includes('sc_mode=edit') : false;
!isEditMode ? isEditMode = windowLocationHref.includes('/experienceeditor/') : false;
export let scDatabase = urlParams.get('sc_content');
export let isGalleryLanguage = windowLocationHref.includes('gallery.language');
export let isGalleryLanguageExpEd = windowLocationHref.includes('selectlanguagegallery');
export let isGalleryFavorites = windowLocationHref.includes('gallery.favorites');
export let isGalleryVersions = windowLocationHref.includes('gallery.versions');
export let isAdminCache = windowLocationHref.includes('/admin/cache.aspx');
export let isAdmin = windowLocationHref.includes('/admin/');
export let isMediaBrowser = windowLocationHref.includes('sitecore.shell.applications.media.mediabrowser');
export let isMediaFolder = windowLocationHref.includes('media%20folder.aspx');
export let isUploadManager = windowLocationHref.includes('/uploadmanager/');
export let isPublishWindow = windowLocationHref.includes('/shell/applications/publish.aspx');
export let isPublishDialog = windowLocationHref.includes('/publishing/publishdialog');
export let isSecurityWindow = windowLocationHref.includes('/shell/applications/security/');
export let isContentEditor = document.querySelector("#scLanguage");
export let isExperienceEditor = windowLocationHref.includes('/applications/experienceeditor/');
export let isContentHome = windowLocationHref.includes('/content/');
export let isLoginPage = windowLocationHref.includes('sitecore/login');
export let isLaunchpad = windowLocationHref.includes('/client/applications/launchpad');
export let isDesktop = windowLocationHref.includes('/shell/default.aspx');
export let isRichTextEditor = windowLocationHref.includes('/controls/rich%20text%20editor/');
export let isHtmlEditor = windowLocationHref.includes('.edithtml.aspx');
export let isFieldEditor = windowLocationHref.includes('field%20editor.aspx');
export let isModalDialogs = windowLocationHref.includes('jquerymodaldialogs.html');
export let isTelerikUi = windowLocationHref.includes('telerik.web.ui');
export let isSecurityDetails = windowLocationHref.includes('securitydetails.aspx');
export let isEditorFolder = windowLocationHref.includes('editors.folder.aspx');
export let isRibbon = windowLocationHref.includes('/ribbon.aspx');
export let isDialog = windowLocationHref.includes('experienceeditor/dialogs/confirm/');
export let isInsertPage = windowLocationHref.includes('/dialogs/insertpage/');
export let isCreateUser = windowLocationHref.includes('createnewuser');
export let isUserManager = windowLocationHref.includes('user%20manager.aspx');
export let isPersonalization = windowLocationHref.includes('dialogs.personalization');
export let isRules = windowLocationHref.includes('rules.aspx');
export let isCss = windowLocationHref.includes('.css');
export let isSearch = windowLocationHref.includes('showresult.aspx');
export let scQuickInfo = document.querySelector ( ".scEditorHeaderQuickInfoInput" );
export let scUrlHash = window.location.hash.substr(1);
export let workboxLaunchpad = document.querySelector("a[title='Workbox']");
export let workboxPage = "/sitecore/shell/Applications/Workbox/Default.aspx?he=Workbox&sc_bw=1";
export let hasRedirection = windowLocationHref.includes("&ro=");
export let hasRedirectionOther = windowLocationHref.includes("&sc_ce_uri=");
export let scContentTree= document.querySelector ( "#ContentTreeHolder" );

export const jsonData= JSON.parse('[{"language":"Afrikaans","flag":"SOUTH_AFRICA"},{"language":"Arabic","flag":"SAUDI_ARABIA"},{"language":"Belarusian","flag":"BELARUS"},{"language":"Bulgarian","flag":"BULGARIA"},{"language":"Catalan","flag":""},{"language":"Czech","flag":"CZECH_REPUBLIC"},{"language":"Danish","flag":"DENMARK"},{"language":"German","flag":"GERMANY"},{"language":"Greek","flag":"GREECE"},{"language":"English","flag":"GREAT_BRITAIN"},{"language":"Spanish","flag":"SPAIN"},{"language":"Estonian","flag":"ESTONIA"},{"language":"Basque","flag":""},{"language":"Persian","flag":"IRAN"},{"language":"Finnish","flag":"FINLAND"},{"language":"Faroese","flag":""},{"language":"French","flag":"FRANCE"},{"language":"Galician","flag":""},{"language":"Gujarati","flag":"INDIA"},{"language":"Hebrew","flag":"ISRAEL"},{"language":"Hindi","flag":"INDIA"},{"language":"Croatian","flag":"CROATIA"},{"language":"Hungarian","flag":"HUNGARY"},{"language":"Armenian","flag":"ARMENIA"},{"language":"Indonesian","flag":"MAIN_COUNTRY"},{"language":"Icelandic","flag":"ICELAND"},{"language":"Italian","flag":"ITALY"},{"language":"Japanese","flag":"JAPAN"},{"language":"Georgian","flag":"GEORGIA"},{"language":"Kazakh","flag":"KAZAKHSTAN"},{"language":"Kannada","flag":"INDIA"},{"language":"Korean","flag":"SOUTH_KOREA"},{"language":"Kyrgyz","flag":"KYRGYZSTAN"},{"language":"Lithuanian","flag":"LITHUANIA"},{"language":"Latvian","flag":"LATVIA"},{"language":"Maori","flag":"NEW_ZEALAND"},{"language":"Macedonian","flag":"MACEDONIA"},{"language":"Mongolian","flag":"MONGOLIA"},{"language":"Marathi","flag":"INDIA"},{"language":"Malay","flag":"MALAYSIA"},{"language":"Maltese","flag":"MALTA"},{"language":"Norwegian Bokmål","flag":"NORWAY"},{"language":"Dutch","flag":"NETHERLANDS"},{"language":"Norwegian Nynorsk","flag":"NORWAY"},{"language":"Punjabi","flag":"INDIA"},{"language":"Polish","flag":"POLAND"},{"language":"Portuguese","flag":"PORTUGAL"},{"language":"Romanian","flag":"ROMANIA"},{"language":"Russian","flag":"RUSSIA"},{"language":"Sanskrit","flag":"INDIA"},{"language":"Sami, Northern","flag":""},{"language":"Slovak","flag":"SLOVAKIA"},{"language":"Slovenian","flag":"SLOVENIA"},{"language":"Albanian","flag":"ALBANIA"},{"language":"Swedish","flag":"SWEDEN"},{"language":"Kiswahili","flag":"KENYA"},{"language":"Tamil","flag":"INDIA"},{"language":"Telugu","flag":"INDIA"},{"language":"Thai","flag":"THAILAND"},{"language":"Setswana","flag":"SOUTH_AFRICA"},{"language":"Turkish","flag":"TURKEY"},{"language":"Tatar","flag":"RUSSIA"},{"language":"Ukrainian","flag":"UKRAINE"},{"language":"Urdu","flag":"PAKISTAN"},{"language":"Vietnamese","flag":"VIETNAM"},{"language":"isiXhosa","flag":"SOUTH_AFRICA"},{"language":"Chinese","flag":"CHINA"},{"language":"isiZulu","flag":"SOUTH_AFRICA"}]');
