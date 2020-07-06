/**
 * Sitecore Author Toolbox
 * A Chrome/Edge Extension
 * by Ugo Quaisse
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 * Made with vanillaJS :-)
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

/**
 * Modules
 */
import * as global from './modules/global.js';
import * as local from './modules/local.js'; //This file is missing on Github, you should create yours with all your private local API keys
import { consoleLog, loadCssFile, loadJsFile, exeJsCode, preferesColorScheme, sitecoreItemJson, fetchTimeout, getScItemData, repositionElement, startDrag } from './modules/helpers.js';
import { showSnackbar } from './modules/snackbar.js';
import { checkWorkbox } from './modules/workbox.js';
import { checkUrlStatus } from './modules/url.js';
import { checkNotification, sendNotification } from './modules/notification.js';
import { cleanCountryName, findCountryName } from './modules/language.js';
import { sitecoreAuthorToolbox } from './modules/contenteditor.js';
import { getGravatar } from './modules/users.js';
import { instantSearch } from './modules/instantsearch.js';
import { insertModal, insertPanel } from './modules/menu.js';
import { insertSavebar, insertBreadcrumb, initInsertIcon, initGutter, getAccentColor, initColorPicker, initSitecoreMenu, initUserMenu } from './modules/experimentalui.js';

/**
 * Get all user's settings from storage
 */
chrome.storage.sync.get((storage) => {

    /**
     * Debug URL
     */
    consoleLog(window.location.href.replace("https://", "").replace("http://", ""), "green");

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
    if (global.isSitecore && !global.isEditMode && !global.isLoginPage && !global.isCss && !global.isUploadManager) {

        /**
         * Load extra JS and CSS
         */
        loadCssFile("css/onload-min.css");
        loadJsFile("js/inject.js");

        /**
         * Dark mode
         */
        storage.feature_darkmode == undefined ? storage.feature_darkmode = false : false;
        storage.feature_darkmode_auto == undefined ? storage.feature_darkmode_auto = false : false;
        storage.feature_experimentalui == undefined ? storage.feature_experimentalui = false : false;

        if (storage.feature_experimentalui != true) {
            if (storage.feature_darkmode && !storage.feature_darkmode_auto && !global.isTelerikUi && !global.isExperienceEditor && !global.isAdminCache && !global.isContentHome && !global.isLoginPage && !global.isEditMode && !global.isRules && !global.isAdmin || storage.feature_darkmode && storage.feature_darkmode_auto && !global.isTelerikUi && !global.isExperienceEditor && !global.isAdminCache && !global.isContentHome && !global.isLoginPage && !global.isEditMode && !global.isRules && !global.isAdmin && currentScheme == "dark") {

                darkMode = true;
                loadCssFile("css/dark/default-min.css");
                loadCssFile("css/dark/ribbon-min.css");
                loadCssFile("css/dark/contentmanager-min.css");
                loadCssFile("css/dark/dialogs-min.css");
                loadCssFile("css/dark/gallery-min.css");
                loadCssFile("css/dark/speak-min.css");

                navigator.platform.indexOf('Win') == 0 ? loadCssFile("css/dark/scrollbars-min.css") : false;

            }
        }

        /**
         * Browser notification
         */
        checkNotification();

        /**
         * Extension ID
         */
        //!global.isRichTextEditor ? document.querySelector('body').insertAdjacentHTML( 'beforeend', '<input type="hidden" class="extensionId" value="' + global.extensionId + '" />' ) : false;

        /**
         * Content Editor application
         */
        if (global.isContentEditor || global.isLaunchpad) {

            consoleLog("**** Content Editor / Launchpage ****", "yellow");

            /**
             * Experimental UI
             */
            storage.feature_experimentalui == undefined ? storage.feature_experimentalui = false : false;
            storage.feature_contrast_icons == undefined ? storage.feature_contrast_icons = true : false;


            if (!global.isLaunchpad && storage.feature_experimentalui) {

                //Variables
                let ScItem = getScItemData();

                //Load extra CSS
                loadCssFile("css/experimentalui-min.css");

                if (storage.feature_darkmode && !storage.feature_darkmode_auto && !global.isTelerikUi && !global.isExperienceEditor && !global.isAdminCache && !global.isContentHome && !global.isLoginPage && !global.isEditMode && !global.isRules && !global.isAdmin || storage.feature_darkmode && storage.feature_darkmode_auto && !global.isTelerikUi && !global.isExperienceEditor && !global.isAdminCache && !global.isContentHome && !global.isLoginPage && !global.isEditMode && !global.isRules && !global.isAdmin && currentScheme == "dark") {
                    //loadCssFile("css/dark/experimentalui-min.css")
                }

                //document.querySelector("#PublishChildren").checked = true;
                let svgAnimation = `<div id="svgAnimation">` + global.svgAnimation + `</div>`;
                document.querySelector("#EditorFrames") ? document.querySelector("#EditorFrames").insertAdjacentHTML('beforebegin', svgAnimation) : false;

                //Hide search
                let SearchPanel = document.querySelector("#SearchPanel")
                SearchPanel ? SearchPanel.innerHTML = "Content" : false;

                //Icon contrasted
                if (storage.feature_contrast_icons == false) {
                    document.documentElement.style.setProperty('--iconBrightness', 1);
                    document.documentElement.style.setProperty('--iconContrast', 1);
                }

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
                document.addEventListener('click', (event) => {

                    //Menus position
                    let topPos = document.querySelector("#EditorTabs").getBoundingClientRect().bottom;
                    let scPanel = document.querySelector("#scPanel");
                    let scLanguageIframe = document.querySelector("#scLanguageIframe");
                    let scVersionIframe = document.querySelector("#scVersionIframe");
                    scVersionIframe

                    //Panel position
                    scPanel.setAttribute("style", "top: " + topPos + "px !important");
                    scLanguageIframe.setAttribute("style", "top: " + topPos + "px !important");
                    scVersionIframe.setAttribute("style", "top: " + topPos + "px !important");

                    //Publish menu
                    if (document.querySelector(".scPublishMenu")) {
                        event.srcElement.id == "scPublishMenuMore" ?
                            document.querySelector(".scPublishMenu").classList.toggle("visible") :
                            document.querySelector(".scPublishMenu").classList.remove("visible");
                    }

                    //More menu
                    if (document.querySelector(".scMoreMenu")) {
                        event.srcElement.id == "scMoreButton" || event.path[1].id == "scMoreButton" ?
                            document.querySelector(".scMoreMenu").classList.toggle("visible") :
                            document.querySelector(".scMoreMenu").classList.remove("visible");
                    }

                    //More menu
                    event.srcElement.id == "scInfoButton" || event.path[1].id == "scInfoButton" || event.srcElement.id == "scPanel" || event.path[0].className == "content" ?
                        scPanel.classList.toggle("open") :
                        scPanel.classList.remove("open");

                    //Language menu
                    event.srcElement.id == "scLanguageButton" || event.path[1].id == "scLanguageButton" ?
                        scLanguageIframe.classList.toggle("open") :
                        scLanguageIframe.classList.remove("open");

                    //Version menu
                    event.srcElement.id == "scVersionButton" || event.path[1].id == "scVersionButton" ?
                        scVersionIframe.classList.toggle("open") :
                        scVersionIframe.classList.remove("open");

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
                        event.srcElement.className == "scOverlay" ? document.querySelector(".scOverlay").setAttribute('style', 'visibility: hidden') : false;
                        event.srcElement.className == "scOverlay" ? document.querySelector("#scModal").setAttribute('style', 'opacity:0; visibility: hidden; top: calc(50% - 550px/2 - 10px)') : false;
                    }

                });
            }

            /**
             * Instant Search
             */
            storage.feature_instantsearch == undefined ? storage.feature_instantsearch = true : false;

            if (!global.isLaunchpad && storage.feature_instantsearch) {

                let globalHeader = document.querySelector(".sc-globalHeader");
                let html = '<input type="text" class="scInstantSearch scIgnoreModified" placeholder="Search for content or media" tabindex="1" accesskey="f">';
                let htmlResult = '<ul class="scInstantSearchResults"></ul>';
                globalHeader ? globalHeader.insertAdjacentHTML('afterbegin', htmlResult) : false;
                globalHeader ? globalHeader.insertAdjacentHTML('afterbegin', html) : false;
                globalHeader ? instantSearch() : false;

            }

            /**
             * Back/Previous buttons
             */
            window.onpopstate = function(event) {

                if (event.state && event.state.id != '') {
                    //Store a local value to tell toolboxscript we are changing item from back/previous button, so no need to add #hash as it's already performed by the browser
                    localStorage.setItem('scBackPrevious', true);
                    exeJsCode(`scForm.invoke("item:load(id=` + event.state.id + `,language=` + event.state.language + `,version=` + event.state.version + `)");`);
                }

            }

            /**
             * Auto Dark Mode
             */
            if (storage.feature_darkmode && storage.feature_darkmode_auto) {

                const scheme = window.matchMedia("(prefers-color-scheme: dark)");
                scheme.addEventListener("change", () => {
                    exeJsCode(`scForm.invoke('contenteditor:save', event)`);
                    setTimeout(function() { window.location.reload() }, 500)
                });

            }


            /**
             * Resume from where you left
             */
            if (!global.hasRedirection && !global.hasRedirectionOther && !global.isLaunchpad) {

                storage.feature_reloadnode == undefined ? storage.feature_reloadnode = true : false;
                if (storage.scData != undefined) {

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
                            if (scData.hasOwnProperty(domain) && domain == window.location.origin) {
                                storage.scItemID = scData[domain].scItemID;
                                storage.scLanguage = scData[domain].scLanguage;
                                storage.scVersion = scData[domain].scVersion;
                                storage.scSource = "Storage";
                            }
                        }
                    }

                    //Security check
                    storage.scLanguage == undefined ? storage.scLanguage = "en" : false;

                    //Reload from where you left off
                    if (storage.scItemID && storage.feature_reloadnode == true) {
                        consoleLog("[Read " + storage.scSource + "] Item : " + storage.scItemID, "beige");
                        consoleLog("[Read " + storage.scSource + "] Language : " + storage.scLanguage, "beige");
                        consoleLog("[Read " + storage.scSource + "] Version : " + storage.scVersion, "beige");
                        consoleLog("*** Redirection ***", "yellow");
                        exeJsCode(`scForm.invoke("item:load(id=` + storage.scItemID + `,language=` + storage.scLanguage + `,version=` + storage.scVersion + `)");`);
                    }

                    sitecoreAuthorToolbox();

                } else {

                    sitecoreAuthorToolbox();
                }

            }

            /**
             * Favorites bar
             */
            storage.feature_favorites == undefined ? storage.feature_favorites = false : false;

            if (storage.feature_favorites && !global.isPublishWindow && global.scContentTree) {

                var scFavoritesIframe = document.querySelector("#sitecorAuthorToolboxFav");
                //If already there
                scFavoritesIframe ? scFavoritesIframe.remove() : false;

                //Get current scItem
                let ScItem = getScItemData();
                //Prepare HTML
                var scFavoritesUrl = '../default.aspx?xmlcontrol=Gallery.Favorites&id=' + ScItem.id + '&la=en&vs=1';
                var scMyShortcut = '<iframe loading="lazy" id="sitecorAuthorToolboxFav" class="sitecorAuthorToolboxFav" src="' + scFavoritesUrl + '" style="width:100%; height:150px; margin-top: 0px; resize: vertical;"></iframe>';

                //Insert HTML
                global.scContentTree.insertAdjacentHTML('afterend', scMyShortcut);
            }


            /**
             * Show Snackbar
             */
            if (!global.isLaunchpad) {

                //Current version of the Snackbar
                let snackbarVersion = global.extensionVersion;
                localStorage.getItem('sbDismiss') != snackbarVersion ? showSnackbar(snackbarVersion) : false;

            }

            /**
             * Workbox badge
             */
            storage.feature_workbox == undefined ? storage.feature_workbox = true : false;
            (!chrome.runtime.error && storage.feature_workbox == true) ? checkWorkbox(): false;

        }



        /*
         * Sitecore Pages
         */
        if (global.isDesktop && !global.isGalleryFavorites && !global.isXmlControl) {

            consoleLog("**** Desktop Shell ****", "orange");
            storage.feature_launchpad == undefined ? storage.feature_launchpad = true : false;

            if (storage.feature_experimentalui) {

                loadCssFile("css/experimentalui-min.css");
                initUserMenu();
                initColorPicker();
                initSitecoreMenu();

            }

            if (storage.feature_launchpad) {

                var html = '<a href="#" class="scStartMenuLeftOption" title="" onclick="window.location.href=\'' + global.launchpadPage + '?launchpad=true&url=' + global.windowLocationHref + '\'"><img loading="lazy" src="' + global.launchpadIcon + '" class="scStartMenuLeftOptionIcon" alt="" border="0"><div class="scStartMenuLeftOptionDescription"><div class="scStartMenuLeftOptionDisplayName">' + global.launchpadGroupTitle + '</div><div class="scStartMenuLeftOptionTooltip">' + global.launchpadTitle + '</div></div></a>';
                // //Find last dom item
                var desktopOptionMenu = document.querySelectorAll('.scStartMenuLeftOption');
                // Loop and fin title = "Command line interface to manage content."
                for (let item of desktopOptionMenu) {
                    item.getAttribute("title") == "Install and maintain apps." ? item.insertAdjacentHTML('afterend', html) : false;
                }

            }

        }

        if (global.isLaunchpad) {
            
            consoleLog("**** Launchpad ****", "orange");
            storage.feature_launchpad == undefined ? storage.feature_launchpad = true : false;
            storage.feature_launchpad_tiles == undefined ? storage.feature_launchpad_tiles = false : false;


            if (storage.feature_launchpad) {

                //Find last dom item
                var launchpadCol = document.querySelectorAll('.last');
                //get popup url
                html = '<div class="sc-launchpad-group"><header class="sc-launchpad-group-title">' + global.launchpadGroupTitle + '</header><div class="sc-launchpad-group-row"><a href="#" onclick="window.location.href=\'' + global.launchpadPage + '?launchpad=true&url=' + global.windowLocationHref + '\'" class="sc-launchpad-item" title="' + global.launchpadTitle + '"><span class="icon"><img loading="lazy" src="' + global.launchpadIcon + '" width="48" height="48" alt="' + global.launchpadTitle + '"></span><span class="sc-launchpad-text">' + global.launchpadTitle + '</span></a></div></div>';
                //Insert into launchpad
                launchpadCol[0].insertAdjacentHTML('afterend', html);

            }
            if (storage.feature_launchpad_tiles) {
                
                //Inject CSS
                if (storage.feature_darkmode && !storage.feature_darkmode_auto || storage.feature_darkmode && storage.feature_darkmode_auto && currentScheme == "dark") {
                    loadCssFile("css/dark/experimentalui-launchpad-min.css");
                } else {
                    loadCssFile("css/experimentalui-launchpad-min.css");
                }

            }

        }

        /*
         * Sitecore Iframes
         */
        if (global.isSearch) {

            consoleLog("**** Internal Search ****", "orange");

            //Add listener on search result list
            var target = document.querySelector("#results");
            var observer = new MutationObserver(function(mutations) {

                var resultsDiv = document.querySelector("#results");
                var BlogPostArea = resultsDiv.querySelectorAll(".BlogPostArea");

                for (var line of BlogPostArea) {

                    var BlogPostFooter = line.querySelector(".BlogPostFooter");

                    var getFullpath = line.querySelector(".BlogPostViews > a > img").getAttribute("title");
                    getFullpath = getFullpath.split(" - ");
                    getFullpath = getFullpath[1].toLowerCase();
                    if (getFullpath.includes("/home/")) {
                        getFullpath = getFullpath.split("/home/");
                        getFullpath = "/" + getFullpath[1];
                    }
                    var getNumLanguages = line.querySelector(".BlogPostHeader > span").getAttribute("title");

                    //Inject HTML
                    var html = '<div class="BlogPostExtra BlogPostContent" style="padding: 5px 0 0px 78px; color: #0769d6"><strong>Sitecore path:</strong> ' + getFullpath + ' <strong>Languages available:</strong> ' + getNumLanguages + '</div>';
                    getFullpath ? BlogPostFooter.insertAdjacentHTML('afterend', html) : false;
                    //TODO Buttons, open in CE and open in EE
                }

            });

            //Observer
            target ? observer.observe(target, { attributes: false, childList: true, characterData: false, subtree: false }) : false;

        }

        if (global.isFieldEditor) {

            consoleLog("**** Field editor ****", "orange");
            storage.feature_charscount == undefined ? storage.feature_charscount = true : false;

            if (storage.feature_charscount) {

                /*
                 * Add a characters count next to each input and textarea field
                 */
                var scTextFields = document.querySelectorAll("input, textarea");
                var countHtml;
                var chars = 0;
                var charsText;

                //On load
                for (var field of scTextFields) {

                    if (field.className == "scContentControl" || field.className == "scContentControlMemo") {

                        field.setAttribute('style', 'padding-right: 70px !important');
                        field.parentElement.setAttribute('style', 'position:relative !important');
                        chars = field.value.length;
                        if (chars > 1) { charsText = chars + " chars"; } else { charsText = chars + " char"; }
                        countHtml = '<div id="chars_' + field.id + '" style="position: absolute; bottom: 1px; right: 1px; padding: 6px 10px; border-radius: 4px; line-height: 20px; opacity:0.5;">' + charsText + '</div>';
                        field.insertAdjacentHTML('afterend', countHtml);

                    }

                }

                //On keyup
                document.addEventListener('keyup', function(event) {

                    if (event.target.localName == "input" || event.target.localName == "textarea") {

                        chars = event.target.value.length;
                        if (chars > 1) { charsText = chars + " chars"; } else { charsText = chars + " char"; }

                        if (document.querySelector('#chars_' + event.target.id)) {
                            document.querySelector('#chars_' + event.target.id).innerText = charsText;
                        }

                    }

                }, false);

            }

            /*
             * Enhanced Bucket List Select Box (multilist)
             */
            var scBucketListSelectedBox = document.querySelectorAll(".scBucketListSelectedBox, .scContentControlMultilistBox");
            var Section_Data = document.querySelector("#Section_Data");

            scBucketListSelectedBox[1] ?
                scBucketListSelectedBox = scBucketListSelectedBox[1] :
                scBucketListSelectedBox = scBucketListSelectedBox[0];

            if (scBucketListSelectedBox) {

                scBucketListSelectedBox.addEventListener("change", function() {

                    var itemId = scBucketListSelectedBox.value;
                    var itemName = scBucketListSelectedBox[scBucketListSelectedBox.selectedIndex].text;
                    var scMessageEditText = '<a class="scMessageBarOption" href="' + window.location.origin + '/sitecore/shell/Applications/Content%20Editor.aspx#' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
                    var scMessageExperienceText = '<a class="scMessageBarOption" href="' + window.location.origin + '/?sc_mode=edit&sc_itemid=' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
                    var scMessageEdit = '<div id="Warnings" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + global.icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">' + itemName + '</div><span id="Information" class="scMessageBarText"><span class="scMessageBarOptionBullet">' + scMessageEditText + '</span> to edit this item in <b>Content Editor</b>.</span><span id="Information" class="scMessageBarText"><br /><span class="scMessageBarOptionBulletXP">' + scMessageExperienceText + '</span> to edit this page in <b>Experience Editor</b>.</span></div></div>';

                    //Add hash to URL
                    if (!document.querySelector(".scMessageBar")) {
                        Section_Data.insertAdjacentHTML('beforebegin', scMessageEdit);
                    } else {
                        document.querySelector(".scMessageBarTitle").innerHTML = itemName;
                        document.querySelector(".scMessageBarOptionBullet").innerHTML = scMessageEditText;
                        document.querySelector(".scMessageBarOptionBulletXP").innerHTML = scMessageExperienceText;
                    }

                });
            }

            /**
             * Grouped errors
             */
            storage.feature_errors == undefined ? storage.feature_errors = true : false;

            //Variables
            var count = 0;
            var scErrors = document.getElementsByClassName("scValidationMarkerIcon");
            var scEditorID = document.querySelector("#MainPanel");

            if (storage.feature_errors) {

                //Prepare HTML
                var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + global.icon + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">';

                for (let item of scErrors) {

                    if (item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
                        scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + '</li>';
                        count++;
                    }
                }
                scMessageErrors += '</ul></div></div>';

                //Insert message bar into Sitecore Content Editor
                if (count > 0) {
                    scEditorID.insertAdjacentHTML('beforebegin', scMessageErrors);
                }

                //Update on change/unblur
                target = document.querySelector(".scValidatorPanel");
                observer = new MutationObserver(function(mutations) {

                    //Variables
                    count = 0;

                    //Prepare HTML
                    var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + global.iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">'

                    for (let item of scErrors) {

                        if (item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
                            scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + '</li>';
                            count++;
                        }
                    }
                    scMessageErrors += '</ul></div></div>';

                    if (count > 0) {
                        //Insert message bar into Sitecore Content Editor
                        scEditorID.insertAdjacentHTML('beforebegin', scMessageErrors);
                    } else {
                        //Delete all errors
                        var element = document.getElementById("scMessageBarError");
                        if (element) { element.parentNode.removeChild(element); }
                        //document.querySelectorAll("#scCrossTabError").forEach(e => e.parentNode.removeChild(e));
                    }

                });

                //Observer
                target ? observer.observe(target, { attributes: true, childList: true, characterData: true }) : false;
            }
        }


        if (global.isMediaFolder) {

            consoleLog("**** Media Folder ****", "orange");
            storage.feature_dragdrop == undefined ? storage.feature_dragdrop = true : false;

            if (storage.feature_experimentalui) {

                loadCssFile("css/experimentalui-min.css");

            }

            if (storage.feature_dragdrop) {

                var scIframeSrc = window.location.href.split("id=%7B");
                scIframeSrc = scIframeSrc[1].split("%7B");
                scIframeSrc = scIframeSrc[0].split("%7D");
                var scMediaID = scIframeSrc[0];

                //Prepare HTML
                var scUploadMediaUrl = '/sitecore/client/Applications/Dialogs/UploadMediaDialog?ref=list&ro=sitecore://master/%7b' + scMediaID + '%7d%3flang%3den&fo=sitecore://master/%7b' + scMediaID + '%7d';

                // //Add button
                var scFolderButtons = document.querySelector(".scFolderButtons");
                //scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ')
                var scButtonHtml = '<a href="#" class="scButton" onclick="javascript:scSitecore.prototype.showModalDialog(\'' + scUploadMediaUrl + '\', \'\', \'\', null, null); false"><img loading="lazy" src=" ' + global.launchpadIcon + ' " width="16" height="16" class="scIcon" alt="" border="0"><div class="scHeader">Upload files (Drag and Drop)</div></a>';

                // //Insert new button
                scFolderButtons.insertAdjacentHTML('afterbegin', scButtonHtml);

            }
        }

        if (global.isExperienceProfile) {

            consoleLog("**** Experience Profile ****", "orange");
            storage.feature_gravatarimage == undefined ? storage.feature_gravatarimage = true : false;

            if (storage.feature_gravatarimage) {

                //Listener 
                target = document.querySelector("body");
                observer = new MutationObserver(function(mutations) {

                    let InfoPhotoImage = document.querySelector("img[data-sc-id=InfoPhotoImage]");
                    let InfoEmailLink = document.querySelector("a[data-sc-id=InfoEmailLink]");

                    // InfoPhotoImage ? console.log(InfoPhotoImage.src) : false;
                    // InfoEmailLink ? console.log(InfoEmailLink.innerHTML) : false;

                    if (InfoPhotoImage && InfoEmailLink) {
                        if (InfoEmailLink.innerHTML.includes("@") && !InfoPhotoImage.src.includes("www.gravatar.com")) {
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
                target ? observer.observe(target, { attributes: false, childList: true, characterData: true, subtree: true }) : false;

            }
        }

        if (global.isRichTextEditor || global.isHtmlEditor) {

            consoleLog("**** Rich Text Editor ****", "orange");
            storage.feature_rtecolor == undefined ? storage.feature_rtecolor = true : false;
            storage.feature_darkmode == undefined ? storage.feature_darkmode = false : false;
            storage.feature_darkmode_auto == undefined ? storage.feature_darkmode_auto = false : false;

            if (storage.feature_rtecolor) {

                var contentIframe;
                var darkModeTheme = "default";

                //Which HTML editor
                if (global.isRichTextEditor) {

                    contentIframe = document.querySelector("#Editor_contentIframe");

                } else if (global.isHtmlEditor) {

                    contentIframe = document.querySelector("#ctl00_ctl00_ctl05_Html");
                }

                if (contentIframe) {

                    //RTE Tabs
                    if (global.isRichTextEditor) {
                        var designTab = document.querySelector("#Editor_contentIframe").contentWindow.document.body;
                        var htmlTab = document.querySelector("#EditorContentHiddenTextarea");
                        var reTextArea = document.querySelector(".reTextArea");
                    }

                    /*
                     * Codemirror css
                     */
                    loadCssFile("css/codemirror.css");

                    if (storage.feature_darkmode && !storage.feature_darkmode_auto || storage.feature_darkmode && storage.feature_darkmode_auto && currentScheme == "dark") {
                        darkModeTheme = "ayu-dark";
                        loadCssFile("css/dark/ayu-dark.css");
                    }

                    //Extra variables
                    if (global.isRichTextEditor) {
                        reTextArea.insertAdjacentHTML('afterend', '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />');
                        reTextArea.insertAdjacentHTML('afterend', '<input type="hidden" class="scEditor" value="richTextEditor" />');
                    } else if (global.isHtmlEditor) {
                        contentIframe.insertAdjacentHTML('afterend', '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />');
                        contentIframe.insertAdjacentHTML('afterend', '<input type="hidden" class="scEditor" value="htmlEditor" />');
                    }

                    /*
                     * Codemirror librairires
                     */
                    loadJsFile("js/bundle-min.js");

                }
            }
        }

        //Change logo href target on Desktop mode if
        if(global.isContentEditorApp && storage.feature_experimentalui || global.isContentEditorApp && storage.feature_instantsearch) {
            let globalLogo = document.querySelector("#globalLogo");
            globalLogo ? globalLogo.setAttribute('target', '_parent') : false;
        }

        if (global.isEditorFolder) {

            consoleLog("**** Editors folder ****", "orange");

            if (storage.feature_experimentalui) {
                loadCssFile("css/experimentalui-min.css");
                getAccentColor();
            }

        }

        if (global.isXmlControl && !global.isRichText) {

            consoleLog("**** XML Control (Window) ****", "orange");

            if (storage.feature_experimentalui) {
                loadCssFile("css/experimentalui-min.css");
                getAccentColor();
            }

        }

        if (global.isGalleryVersion) {

            consoleLog("**** Versions menu ****", "orange");

        }

        if (global.isGalleryLanguage) {

            consoleLog("**** Languages menu ****", "orange");
            storage.feature_flags == undefined ? storage.feature_flags = true : false;

            if (storage.feature_flags) {

                var dom = document.querySelector("#Languages");
                var div = dom.querySelectorAll('.scMenuPanelItem,.scMenuPanelItemSelected')
                var td, tdlanguage, tdversion, tdimage, temp, key;
                var divcount = 0;
                var tdcount = 0;

                //Sort alphabetically or by version
                div = [].slice.call(div).sort(function(a, b) {
                    return a.querySelector("table > tbody > tr > td > div > div:last-child").textContent > b.querySelector("table > tbody > tr > td > div > div:last-child").textContent ? -1 : 1;
                    //return a.textContent > b.textContent ? 1 : -1;
                });
                //Append dom
                div.forEach(function(language) {
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

                            //Check version
                            if (tdversion[0] != "0") {
                                temp = item2.getElementsByTagName("div")
                                temp[2].setAttribute('style', 'background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important');
                            }

                            tdlanguage = findCountryName(tdlanguage);
                            tdimage[0].onerror = function() { this.src = global.iconFlagGeneric }
                            tdimage[0].src = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");
                        }

                        tdcount++;

                    }
                    divcount++;

                }
            }
        }

        if (global.isPublishDialog) {

            consoleLog("**** Publishing window ****", "orange");
            storage.feature_flags == undefined ? storage.feature_flags = true : false;

            if (storage.feature_flags) {

                //Listener ScrollablePanelLanguages
                target = document.querySelector("body");
                observer = new MutationObserver(function(mutations) {

                    var temp, tdlanguage, key, scFlag;
                    var label = document.querySelectorAll("div[data-sc-id=CheckBoxListLanguages] > table:last-child")[0];

                    if (label != undefined && label.children[0].children.length > 1) {
                        //Loop
                        for (var tr of label.children[0].children) {

                            for (var td of tr.children) {

                                tdlanguage = findCountryName(td.innerText.trim());
                                if (td.querySelector("#scFlag") == null) {
                                    let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/16x16/flag_" + tdlanguage + ".png");
                                    td.querySelector("label > span").insertAdjacentHTML('beforebegin', ' <img loading="lazy" id="scFlag" src="' + flag + '" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px;" onerror="this.onerror=null;this.src=\'' + global.iconFlagGeneric + '\';"/>');
                                }

                            }
                        }
                    }
                });

                //Observer publish
                target ? observer.observe(target, { attributes: false, childList: true, characterData: false, subtree: true }) : false;
            }
        }

        if (global.isPublishWindow) {

            consoleLog("**** Publish / Rebuild / Package ****", "orange");
            storage.feature_flags == undefined ? storage.feature_flags = true : false;

            //Get ID of the item to be published
            let form = document.querySelector("form").getAttribute("action").split("id=");
            let publishedItemId = form[1].replace("%7B", "{").replace("%7D", "}");
            //fetch "sitecore/admin/dbbrowser.aspx?db=master&lang=en&id="+publishedItemId

            if (storage.feature_flags) {

                var scFlag;
                var label = document.querySelectorAll("#Languages > label");

                for (let item of label) {

                    tdlanguage = findCountryName(item.innerText.trim());
                    let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/16x16/flag_" + tdlanguage + ".png");
                    item.insertAdjacentHTML('beforebegin', ' <img loading="lazy" id="scFlag" src="' + flag + '" style="display: inline !important; vertical-align: middle; padding-right: 2px; width:16px" onerror="this.onerror=null;this.src=\'' + global.iconFlagGeneric + '\';"/>');

                }
            }
        }


        /**
         * Auto Expand (Inspired by https://github.com/alan-null/sc_ext)
         */
        storage.feature_autoexpand == undefined ? storage.feature_autoexpand = true : false;
        storage.feature_autoexpandcount == undefined ? storage.feature_autoexpandcount = false : false;

        if (storage.feature_autoexpand) {

            //Content tree
            document.addEventListener('click', function(event) {

                //Chage EditorFrames opacity on load item
                if (event.target.offsetParent != null) {
                    if (event.target.offsetParent.matches('.scContentTreeNodeNormal')) {
                        storage.feature_experimentalui ? document.querySelector("#svgAnimation").setAttribute("style", "opacity:1") : false;
                        storage.feature_experimentalui ? document.querySelector("#EditorFrames").setAttribute("style", "opacity:0") : document.querySelector("#EditorFrames").setAttribute("style", "opacity:0.5");
                        document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:0.5");
                        document.querySelector(".scEditorTabHeaderActive > span").innerText = global.tabLoadingTitle;

                        //Experimental mode
                        if (document.querySelector(".scPreviewButton")) {
                            document.querySelector(".scPreviewButton").innerText = global.tabLoadingTitle;
                            document.querySelector(".scPreviewButton").disabled = true;
                        }

                        var timeout = setTimeout(function() {
                            document.querySelector("#svgAnimation") ? document.querySelector("#svgAnimation").setAttribute("style", "opacity:0") : false;
                            document.querySelector("#EditorFrames").setAttribute("style", "opacity:1");
                            document.querySelector(".scContentTreeContainer").setAttribute("style", "opacity:1");
                        }, 8000)
                    }
                }

                //Content Tree
                if (event.target.matches('.scContentTreeNodeGlyph')) {

                    let glyphId = event.target.id;

                    setTimeout(function() {
                        if (document && glyphId) {
                            let subTreeDiv = document.querySelector("#" + glyphId).nextSibling.nextSibling.nextSibling
                            if (subTreeDiv) {
                                let newNodes = subTreeDiv.querySelectorAll(".scContentTreeNode");
                                newNodes.length == 1 ? newNodes[0].querySelector(".scContentTreeNodeGlyph").click() : false;

                                if (storage.feature_autoexpandcount) {
                                    let subTreeMain = document.querySelector("#" + glyphId).nextSibling.nextSibling;
                                    let subTreeMainImg = subTreeMain.querySelector(".scContentTreeNodeIcon");
                                    let subTreeMainText = subTreeMain.innerText;
                                    document.querySelectorAll(".scCountNodes").forEach(function(element) { element.setAttribute("style", "display:none") })
                                }

                            } else {

                                let subTreeMain = document.querySelector("#" + glyphId).nextSibling.nextSibling;
                                subTreeMain.querySelector(".scCountNodes") ? subTreeMain.querySelector(".scCountNodes").remove() : false;

                            }
                        }
                    }, 200);

                }

                //Media Upload
                if (event.target.matches('.dynatree-expander')) {

                    let glyphId = event.path[1];

                    setTimeout(function() {
                        if (document && glyphId) {
                            let subTreeDiv = glyphId.nextSibling
                            console.log(subTreeDiv);
                            if (subTreeDiv) {
                                let newNodes = subTreeDiv.querySelectorAll(".dynatree-has-children");
                                newNodes.length == 1 ? newNodes[0].querySelector(".dynatree-expander").click() : false;
                                console.log(newNodes);
                            }
                        }
                    }, 200);

                }

            }, false);

            //Security Editor 
            document.addEventListener('mousedown', function(event) {

                if (!event.target.matches('.glyph')) return;
                let glyphId = event.target.id;
                let glyphSrc = event.target.src;
                let isCollapsed = glyphSrc.includes("collapsed");


                setTimeout(function() {
                    if (document && glyphId && isCollapsed) {
                        var subTreeDiv = document.querySelector("#" + glyphId).closest("ul").nextSibling
                        if (subTreeDiv) {
                            var nextGlyphId = subTreeDiv.querySelector('.glyph');
                            nextGlyphId.click();
                        }
                    }
                }, 200);

            }, false);

        }

        /**
         * > 10. Publish notification
         */
        target = document.querySelector("#LastPage");
        observer = new MutationObserver(function(mutations) {

            storage.feature_notification == undefined ? storage.feature_notification = true : false;
            storage.feature_experimentalui == undefined ? storage.feature_experimentalui = false : false;

            if (storage.feature_notification) {

                //Variable
                target = document.querySelector("#LastPage");

                var notificationSubTitle = target.querySelector(".sc-text-largevalue").innerHTML;
                var notificationBody = target.querySelector(".scFieldLabel").innerHTML;
                if (notificationBody == "Result:") { notificationBody = "Finished " + document.querySelector("#ResultText").value.split("Finished")[1]; }

                //Send notification
                sendNotification(notificationSubTitle, notificationBody);

                //Is dark mode on?
                (storage.feature_darkmode && !storage.feature_darkmode_auto || storage.feature_darkmode && storage.feature_darkmode_auto && currentScheme == "dark") ? darkMode = true: false;

                //Update url Status
                var parentSelector = parent.parent.document.querySelector("body");
                if (storage.feature_experimentalui) {
                    checkUrlStatus(parentSelector, darkMode, true);
                } else {
                    checkUrlStatus(parentSelector, darkMode);
                }

            }
        });

        //Observer publish
        target ? observer.observe(target, { attributes: true }) : false;

        /**
         * Scroll content tree to active element
         */
        setTimeout(function() {
            let windowHeight = document.querySelector("body").getBoundingClientRect().height;
            let activeNodePos = document.querySelector(".scContentTreeNodeActive > span") ? document.querySelector(".scContentTreeNodeActive > span").getBoundingClientRect().top : false;
            let scrollOffset = activeNodePos > windowHeight ? activeNodePos - windowHeight + (windowHeight / 2) : 0;
            document.querySelector(".scContentTree") ? document.querySelector(".scContentTree").scrollTop = scrollOffset : false;
        }, 1000)

        /**
         * Update UI
         */
        target = document.querySelector("#scLanguage");
        observer = new MutationObserver(function(mutations) {

            consoleLog("*** Update UI ***", "yellow");

            //Sitecore Variables
            var scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput");

            /**
             * Update hash in URL, update pushsate history, update link if 2nd tab opened
             */
            if (scQuickInfo) {
                let ScItem = getScItemData();
                var sitecoreItemID = scQuickInfo.getAttribute("value");
                var scLanguage = document.querySelector("#scLanguage").getAttribute("value").toLowerCase();

                let scVersion = document.querySelector(".scEditorHeaderVersionsVersion > span");
                scVersion != null ? scVersion = scVersion.innerText : scVersion = 1;
                var scEditorQuickInfo = document.querySelectorAll(".scEditorQuickInfo");
                var lastScEditorQuickInfo = scEditorQuickInfo[scEditorQuickInfo.length - 1];
                var countTab = scEditorQuickInfo.length;
                var scEditorTitle = document.getElementsByClassName("scEditorHeaderTitle");

                var tabSitecoreItemID = document.querySelectorAll(".scEditorHeaderQuickInfoInput");
                var lastTabSitecoreItemID = tabSitecoreItemID[tabSitecoreItemID.length - 2].getAttribute("value");

                var locaStorage = localStorage.getItem('scBackPrevious');

                //Add hash to URL
                if (!global.hasRedirection && !global.hasRedirectionOther) {
                    if (locaStorage != "true") {
                        var state = { 'sitecore': true, 'id': sitecoreItemID, 'language': scLanguage, 'version': scVersion }
                        history.pushState(state, undefined, "#" + sitecoreItemID + "_" + scLanguage + "_" + scVersion);
                    } else {
                        localStorage.removeItem('scBackPrevious');
                    }
                }

                //Tabs opened?
                global.debug ? console.info('%c - Tabs opened: ' + countTab + ' ', 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;') : false;

                if (countTab > 1 && !document.getElementById("showInContentTree" + (countTab) + "")) {
                    //Add text after title
                    var url = window.location.href;
                    url = url.split("#");
                    var javascript = 'scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ',language=' + scLanguage + ',version=1)");';
                    var href = url[0] + '&reload#' + lastTabSitecoreItemID;
                    scEditorTitle[countTab - 1].insertAdjacentHTML('afterend', '[<a id="showInContentTree' + countTab + '" href="" onclick="javascript:window.location.href=\'' + href + '\'; return false;" />Show in content tree</a>]');
                }

            }

            //Execute a bunch of actions everytime the UI is refreshed
            mutations.forEach(function(e) {
                "attributes" == e.type && sitecoreAuthorToolbox();
            });
        });
        //Observer UI
        target ? observer.observe(target, { attributes: true }) : false;

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /*
     ************************
     * 2. Experience Editor *
     ************************
     */
    if (global.isEditMode && !global.isLoginPage || global.isPreviewMode && !global.isLoginPage) {

        consoleLog("Experience Editor detected", "red");
        /*
         * Load extra CSS
         */
        loadCssFile("css/onload-min.css");
        loadCssFile("css/tooltip-min.css");
        loadJsFile("js/inject.js");

        /*
         * Store Item ID
         */
        var dataItemId = document.querySelector('[data-sc-itemid]');
        if (dataItemId) {

            //Set ItemID (Storage)
            var sitecoreItemID = decodeURI(dataItemId.getAttribute('data-sc-itemid'));
            var scLanguage = "en";
            var scVersion = 1;
            sitecoreItemJson(sitecoreItemID, scLanguage, scVersion);

        }

        /**
         * Flags in language menu
         */
        if (global.isGalleryLanguageExpEd) {

            consoleLog("**** Languages menu ****", "yellow");
            storage.feature_flags == undefined ? storage.feature_flags = true : false;

            if (storage.feature_flags) {

                var tdDiv;
                dom = document.querySelector('.sc-gallery-content');
                div = dom.querySelectorAll('.sc-gallery-option-content,.sc-gallery-option-content-active');
                divcount = 0;
                tdcount = 0;

                //Sort alphabetically or by version
                div = [].slice.call(div).sort(function(a, b) {
                    return a.querySelector("div > div:last-child > span").textContent > b.querySelector("div > div:last-child > span").textContent ? -1 : 1;
                    //return a.textContent > b.textContent ? 1 : -1;
                });
                //Append dom
                div.forEach(function(language) {
                    dom.appendChild(language);
                });

                for (let item of div) {

                    tdDiv = item.closest('.sc-gallery-option-content,.sc-gallery-option-content-active');
                    tdlanguage = item.querySelector('.sc-gallery-option-content-header > span').innerText;
                    tdversion = item.querySelector('.sc-gallery-option-content-description > span');

                    //Check version
                    temp = tdversion.innerHTML.split(" ");
                    if (temp[0] != "0") {
                        tdversion.setAttribute('style', 'background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important');
                    }

                    tdlanguage = findCountryName(tdlanguage);
                    let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");
                    tdDiv.setAttribute('style', 'padding-left:48px; background-image: url(' + flag + '); background-repeat: no-repeat; background-position: 5px;');

                }
            }
        }

        /**
         * Flags in Ribbon
         */
        if (global.isRibbon) {

            consoleLog("**** Ribbon ****", "yellow");

            var scRibbonFlagIcons = document.querySelector(".flag_generic_24");

            tdlanguage = scRibbonFlagIcons.nextSibling.innerText;
            //Clean country name
            tdlanguage = cleanCountryName(tdlanguage);

            //Compare with Json data
            for (key in global.jsonData) {
                if (global.jsonData.hasOwnProperty(key)) {
                    if (tdlanguage == global.jsonData[key]["language"].toUpperCase()) {
                        tdlanguage = global.jsonData[key]["flag"];
                    }
                }
            }

            let flag = storage.feature_experimentalui ? chrome.runtime.getURL("images/Flags/svg/" + tdlanguage + ".svg") : chrome.runtime.getURL("images/Flags/24x24/flag_" + tdlanguage + ".png");
            scRibbonFlagIcons.setAttribute('style', 'background-image: url(' + flag + '); background-repeat: no-repeat; background-position: top left;');

        }

        /**
         * Tooltip bar
         */
        target = document.querySelector(".scChromeControls");
        observer = new MutationObserver(function(mutations) {

            var scChromeToolbar = document.querySelectorAll(".scChromeToolbar");

            //Find scChromeCommand
            for (var controls of scChromeToolbar) {

                controls.setAttribute('style', 'margin-left:50px');
                var scChromeCommand = controls.querySelectorAll(".scChromeCommand");
                var scChromeText = controls.querySelector(".scChromeText");
                var scChromeCommandText = controls.querySelector(".scChromeCommandText");

                for (var command of scChromeCommand) {
                    var title = command.getAttribute("title");
                    command.setAttribute('style', 'z-index:auto');

                    if (title != null) {
                        command.setAttribute('data-tooltip', title);
                        command.classList.add("t-bottom");
                        command.classList.add("t-md");
                        command.removeAttribute("title");
                    }
                }
            }
        });

        //Observer
        target ? observer.observe(target, { attributes: true, childList: true, characterData: true }) : false;

        /*
         * Dark mode + Toggle Ribbon
         */
        var pagemodeEdit = document.querySelector(".pagemode-edit");
        !pagemodeEdit ? pagemodeEdit = document.querySelector(".on-page-editor") : false;
        !pagemodeEdit ? pagemodeEdit = document.querySelector(".experience-editor") : false;
        !pagemodeEdit ? pagemodeEdit = document.querySelector(".scWebEditRibbon") : false;
        var isQuery = global.windowLocationHref.includes('?');
        var scCrossPiece = document.querySelector("#scCrossPiece");
        var ribbon = document.querySelector('#scWebEditRibbon');
        var scMessageBar = document.querySelector('.sc-messageBar');
        let tabColor;

        storage.feature_darkmode == undefined ? storage.feature_darkmode = false : false;
        storage.feature_darkmode_auto == undefined ? storage.feature_darkmode_auto = false : false;
        storage.feature_experienceeditor == undefined ? storage.feature_experienceeditor = true : false;

        if (storage.feature_experienceeditor) {
            //Experience Editor Reset (container, hover styles..)
            loadCssFile("css/reset-min.css");
        }

        if (storage.feature_darkmode && !storage.feature_darkmode_auto && global.isRibbon || storage.feature_darkmode && !storage.feature_darkmode_auto && global.isDialog || storage.feature_darkmode && !storage.feature_darkmode_auto && global.isInsertPage || storage.feature_darkmode && storage.feature_darkmode_auto && global.isRibbon && currentScheme == "dark" || storage.feature_darkmode && storage.feature_darkmode_auto && global.isDialog && currentScheme == "dark" || storage.feature_darkmode && storage.feature_darkmode_auto && global.isInsertPage && currentScheme == "dark") {
            //Experience Editor buttons
            loadCssFile("css/dark/experience-min.css");
        }

        if (storage.feature_darkmode && !storage.feature_darkmode_auto || storage.feature_darkmode && storage.feature_darkmode_auto && currentScheme == "dark") {
            tabColor = "dark";
        }

        /*
         * Extra buttons
         */
        target = document.body;
        observer = new MutationObserver(function(mutations) {

            for (var mutation of mutations) {
                for (var addedNode of mutation.addedNodes) {
                    if (addedNode.id == "scCrossPiece") {

                        //Show/Hide button
                        var html = '<div class="scExpTab ' + tabColor + '"><span class="tabHandle"></span><span class="tabText" onclick="toggleRibbon()">▲ Hide<span></div>';
                        addedNode.insertAdjacentHTML('afterend', html);
                        observer.disconnect();
                        startDrag();

                    }
                }
            }

        });

        //Observer
        (storage.feature_experienceeditor && target) ? observer.observe(target, { attributes: false, childList: true, characterData: false }): false;

        /*
         * Go to Normal mode
         */
        var linkNormalMode;

        if (global.isEditMode) {
            linkNormalMode = global.windowLocationHref.replace("sc_mode=edit", "sc_mode=normal");
        } else if (global.isPreviewMode) {
            linkNormalMode = global.windowLocationHref.replace("sc_mode=preview", "sc_mode=normal");
        } else {
            global.windowLocationHref.includes("?") ? linkNormalMode = global.windowLocationHref + "&sc_mode=normal" : linkNormalMode = global.windowLocationHref + "?sc_mode=normal";
        }

        if (storage.feature_experienceeditor && !global.isRibbon) {
            html = '<div class="scNormalModeTab ' + tabColor + '"><span class="t-right t-sm" data-tooltip="Open in Normal Mode"><a href="' + linkNormalMode + '"><img loading="lazy" src="' + global.iconChrome + '"/></a></span></div>';
            pagemodeEdit ? pagemodeEdit.insertAdjacentHTML('afterend', html) : false;
        }

        /*
         * Go to Content Editor
         */
        if (storage.feature_experienceeditor && !global.isRibbon) {
            html = '<div class="scContentEditorTab ' + tabColor + '"><span class="t-right t-sm" data-tooltip="Open in Content Editor"><a href="' + window.location.origin + '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1"><img loading="lazy" src="' + global.iconCE + '"/></a></span></div>';
            pagemodeEdit ? pagemodeEdit.insertAdjacentHTML('afterend', html) : false;
        }

    }

}); //End chrome.storage