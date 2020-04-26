/**
 * Sitecore Author Toolbox
 * A Google Chrome Extension
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

/**
 * Modules
 */
import * as global from './modules/global.js';
import {preferesColorScheme, sitecoreItemJson, fetchTimeout, getScItemData, repositionElement, startDrag} from './modules/helpers.js';
import {showSnackbar} from './modules/snackbar.js';
import {checkWorkbox} from './modules/workbox.js';
import {checkUrlStatus} from './modules/url.js';
import {checkNotification, sendNotification} from './modules/notification.js';
import {cleanCountryName} from './modules/language.js';
import {sitecoreAuthorToolbox} from './modules/contenteditor.js';


/**
 * Debug URL
 */
global.debug ? console.info("%c " + window.location.href.replace("https://","").replace("http://","") + "", 'font-size:10px; background: #32ed74; color: black; border-radius:5px; padding 3px;') : false;


/*
 ************************
 * 1. Content Editor *
 ************************
 */
if(global.isSitecore && !global.isEditMode && !global.isLoginPage && !global.isCss && !global.isUploadManager) {

    global.debug ? console.info("%c ✏️ Sitecore detected ", 'font-size:14px; background: #f33d35; color: white; border-radius:5px; padding 3px;') : false;
    global.debug ? console.info('%c *** Loading *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;') : false;

    /*
    * Fadeout UI on load
    */
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href =  chrome.runtime.getURL("css/onload-min.css");
    document.getElementsByTagName("head")[0].appendChild(link);

    /*
    * Code injection for Translate mode
    */
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL("js/inject-min.js");
    (document.head||document.documentElement).appendChild(script);
    script.remove();
    
    /*
    * Extension ID
    */
    !global.isRichTextEditor ? document.querySelector('body').insertAdjacentHTML( 'beforeend', '<input type="hidden" class="extensionId" value="' + global.extensionId + '" />' ) : false;

    /*
    * Browser notification
    */
    checkNotification();

    /*
    * > Content Editor
    */
    if(global.isContentEditor || global.isLaunchpad) { 

    global.debug ? console.info('%c **** Content Editor / Launchpage **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    /*
     * Back/Previous buttons
     */
    window.onpopstate = function(event) {
        if(event.state && event.state.id!='') {
            //Store a local value to tell toolboxscript (l.2207) we are changing item from back/previous button, so no need to add #hash as it's already done by browser
            localStorage.setItem('scBackPrevious', true);
            //Open item
            var actualCode = `scForm.invoke("item:load(id=` + event.state.id + `,language=,version=1)");`;
            script = document.createElement('script');
            script.textContent = actualCode;
            (document.head||document.documentElement).appendChild(script);
            script.remove();
        }
    }


    /*
     * 17. Auto Dark Mode
     */
    chrome.storage.sync.get(['feature_darkmode','feature_darkmode_auto'], function(result) {
        if(result.feature_darkmode && result.feature_darkmode_auto) {
            const scheme = window.matchMedia("(prefers-color-scheme: dark)");
            scheme.addEventListener("change", () => {
                if(global.debug) { console.info('%c **** ' + preferesColorScheme() + ' mode ON **** ', 'font-size:14px; background: #333333; color: white; border-radius:5px; padding 3px;'); }
                //Save
                var actualCode = `scForm.invoke('contenteditor:save', event)`;
                script = document.createElement('script');
                script.textContent = actualCode;
                (document.head||document.documentElement).appendChild(script);
                script.remove();
                //reload UI
                setTimeout(function() {
                    window.location.reload();
                },500)
            });
        }
    });

    /*
     * 9. Resume from where you left
     */
    if(!global.hasRedirection && !global.hasRedirectionOther && !global.isLaunchpad) {

        chrome.storage.sync.get(['scData','feature_reloadnode'], function(result) {

            if(result.feature_reloadnode == undefined) { result.feature_reloadnode = true; }
            if (result.scData != undefined) { 
                
                //If Hash detected in the URL
                if(global.scUrlHash!="") {         
                    
                    result.scItemID = global.scUrlHash;
                    result.scVersion = 1;
                    result.scLanguage = "";
                    result.scSource = "Hash";
                
                } else {

                    //Get scData from storage
                    var scData = result.scData;
                    for(var domain in scData) {
                        if(scData.hasOwnProperty(domain) && domain == window.location.origin) {
                            result.scItemID = scData[domain].scItemID;
                            result.scLanguage = scData[domain].scLanguage;
                            result.scVersion = scData[domain].scVersion;
                            result.scSource = "Storage";
                        }
                    }

                }


                if(result.scItemID && result.feature_reloadnode == true) {
      
                    global.debug ? console.info("%c [Read " + result.scSource + "] Item : "+ result.scItemID + " ", 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;') : false;
                    global.debug ? console.info("%c [Read " + result.scSource + "] Language : "+ result.scLanguage + " ", 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;') : false;
                    global.debug ? console.info("%c [Read " + result.scSource + "] Version : "+ result.scVersion + " ", 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;') : false;
                    global.debug ? console.info('%c *** Redirection *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;') : false;
                    //If scItemID is not found, it will throw an error
                    var actualCode = `scForm.invoke("item:load(id=` + result.scItemID + `,language=` + result.scLanguage + `,version=` + result.scVersion + `)");`;
                    script = document.createElement('script');
                    script.textContent = actualCode;
                    (document.head||document.documentElement).appendChild(script);
                    script.remove();

                } else {
                    sitecoreAuthorToolbox();
                }

          } else {
            sitecoreAuthorToolbox();       
          }

        });

    }

    /*
     * > 7. Favorites bar
     */
    chrome.storage.sync.get(['feature_favorites'], function(result) {

    if(result.feature_favorites == undefined) { result.feature_favorites = true; }

    if(result.feature_favorites && !global.isPublishWindow && global.scContentTree) {

          var scFavoritesIframe = document.querySelector("#sitecorAuthorToolboxFav");

          //If already there
          if(scFavoritesIframe) { scFavoritesIframe.remove(); }
            
            //Prepare HTML
            var scFavoritesUrl = '../default.aspx?xmlcontrol=Gallery.Favorites&id=' + sitecoreItemID + '&la=en&vs=1';      
            var scMyShortcut = '<iframe id="sitecorAuthorToolboxFav" class="sitecorAuthorToolboxFav" src="' + scFavoritesUrl + '" style="width:100%; height:150px; margin-top: 0px; resize: vertical;"></iframe>';

            //Insert HTML
            global.scContentTree.insertAdjacentHTML( 'afterend', scMyShortcut );
      }

    });

    /*
     * > 14. Show Snackbar
     */
    if(!global.isLaunchpad) {

          chrome.storage.sync.get(['hideSnackbar'], function(result) {

            //Current version of the Snackbar
            let snackbarVersion = global.extensionVersion;
            if (!chrome.runtime.error && result.hideSnackbar != snackbarVersion) {
                showSnackbar(snackbarVersion);
            }
          });

    }

    /*
     * > 15. Workbox badge
     */
    chrome.storage.sync.get(['feature_workbox'], function(result) {
        result.feature_workbox == undefined ? result.feature_workbox = true : false;
        if (!chrome.runtime.error && result.feature_workbox == true) { 
            checkWorkbox();
        }
    });

  } //End CE

    /*
    * > 08. Dark mode
    */
    chrome.storage.sync.get(['feature_darkmode','feature_darkmode_auto'], function(result) {

    result.feature_darkmode == undefined ? result.feature_darkmode = false : false;
    if(result.feature_darkmode_auto == undefined) { result.feature_darkmode_auto = false; }

        var currentScheme = preferesColorScheme();

        if(result.feature_darkmode && !result.feature_darkmode_auto && !global.isTelerikUi && !global.isExperienceEditor && !global.isAdminCache && !global.isSecurityWindow && !global.isContentHome && !global.isLoginPage && !global.isEditMode && !global.isUserManager && !global.isRules && !global.isAdmin || result.feature_darkmode && result.feature_darkmode_auto && !global.isTelerikUi && !global.isExperienceEditor && !global.isAdminCache && !global.isSecurityWindow && !global.isContentHome && !global.isLoginPage && !global.isEditMode && !global.isUserManager && !global.isRules && !global.isAdmin && currentScheme == "dark") {

          var link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href =  chrome.runtime.getURL("css/dark/default-min.css");
          document.getElementsByTagName("head")[0].appendChild(link);

          link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href =  chrome.runtime.getURL("css/dark/ribbon-min.css");
          document.getElementsByTagName("head")[0].appendChild(link);

          link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href =  chrome.runtime.getURL("css/dark/contentmanager-min.css");
          document.getElementsByTagName("head")[0].appendChild(link);

          link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href =  chrome.runtime.getURL("css/dark/dialogs-min.css");
          document.getElementsByTagName("head")[0].appendChild(link);

          link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href =  chrome.runtime.getURL("css/dark/gallery-min.css");
          document.getElementsByTagName("head")[0].appendChild(link);

          link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href =  chrome.runtime.getURL("css/dark/speak-min.css");
          document.getElementsByTagName("head")[0].appendChild(link);

        }

  });

  /*
   * > Sitecore Pages
   */
  if(global.isDesktop && !global.isGalleryFavorites) {

    global.debug ? console.info('%c **** Desktop Shell **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    chrome.storage.sync.get(['feature_launchpad'], function(result) {
      
      if(result.feature_launchpad == undefined) { result.feature_launchpad = true; }

      if(result.feature_launchpad) {

        var html = '<a href="#" class="scStartMenuLeftOption" title="" onclick="window.location.href=\'' + global.launchpadPage + '?launchpad=true&url=' + global.windowLocationHref + '\'"><img src="' + global.launchpadIcon + '" class="scStartMenuLeftOptionIcon" alt="" border="0"><div class="scStartMenuLeftOptionDescription"><div class="scStartMenuLeftOptionDisplayName">' + global.launchpadGroupTitle + '</div><div class="scStartMenuLeftOptionTooltip">' + global.launchpadTitle + '</div></div></a>';
        
        // //Find last dom item
        var desktopOptionMenu = document.querySelectorAll('.scStartMenuLeftOption');
        // Loop and fin title = "Command line interface to manage content."
        for (let item of desktopOptionMenu) {
          if(item.getAttribute("title") == "Install and maintain apps.") {
            item.insertAdjacentHTML( 'afterend', html );
          }
        }

      }

    });

  } else if(global.isLaunchpad) {

    global.debug ? console.info('%c **** Launchpad **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    chrome.storage.sync.get(['feature_launchpad'], function(result) {

      result.feature_launchpad == undefined ? result.feature_launchpad = true : false;

      if(result.feature_launchpad) {

      //Find last dom item
      var launchpadCol = document.querySelectorAll('.last');

      //get popup url
      var html = '<div class="sc-launchpad-group"><header class="sc-launchpad-group-title">' + global.launchpadGroupTitle + '</header><div class="sc-launchpad-group-row"><a href="#" onclick="window.location.href=\'' + global.launchpadPage + '?launchpad=true&url=' + global.windowLocationHref + '\'" class="sc-launchpad-item" title="' + global.launchpadTitle + '"><span class="icon"><img src="' + global.launchpadIcon + '" width="48" height="48" alt="' + global.launchpadTitle + '"></span><span class="sc-launchpad-text">' + global.launchpadTitle + '</span></a></div></div>';

      //Insert into launchpad
      launchpadCol[0].insertAdjacentHTML( 'afterend', html );

      }

    });

  } else if(global.isAdminCache) {

    global.debug ? console.info('%c **** Admin Cache **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

  } 

/*
 * > Sitecore Iframes
 */

  if(global.isGalleryFavorites) {

    global.debug ? console.info('%c **** Favorites **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

  } else if(global.isModalDialogs) {

    global.debug ? console.info('%c **** Jquery Modal **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

  } else if(global.isSearch) {

    global.debug ? console.info('%c **** Internal Search **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    //Add listener on search result list
    var target = document.querySelector( "#results" );
    observer = new MutationObserver(function(mutations) {

      var resultsDiv = document.querySelector("#results");
      var BlogPostArea = resultsDiv.querySelectorAll(".BlogPostArea");

      for(var line of BlogPostArea) {

        var BlogPostFooter = line.querySelector(".BlogPostFooter");
        
        var getFullpath = line.querySelector(".BlogPostViews > a > img").getAttribute("title");
        getFullpath = getFullpath.split(" - ");
        getFullpath = getFullpath[1].toLowerCase();
        if(getFullpath.includes("/home/")) {
          getFullpath = getFullpath.split("/home/");
          getFullpath = "/"+getFullpath[1];
        }
        var getNumLanguages = line.querySelector(".BlogPostHeader > span").getAttribute("title");     

        //Inject HTML
        var html = '<div class="BlogPostExtra BlogPostContent" style="padding: 5px 0 0px 78px; color: #0769d6"><strong>Sitecore path:</strong> ' + getFullpath + ' <strong>Languages available:</strong> ' + getNumLanguages + '</div>';
        if(getFullpath) {
          BlogPostFooter.insertAdjacentHTML( 'afterend', html );
        }
        //TODO Buttons, open in CE and open in EE
      }

    });
        
    //Observer
    if(target) {
      config = { attributes: false, childList: true, characterData: false, subtree: false };
      observer.observe(target, config);
    }

  } else if(global.isFieldEditor) {

    if(global.debug) { console.info('%c **** Field editor Search **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;'); }

    chrome.storage.sync.get(['feature_charscount'], function(result) {

    if(result.feature_charscount == undefined) { result.feature_charscount = true; }

      if(result.feature_charscount) {

        /*
         * Add a characters count next to each input and textarea field
         */
        var scTextFields = document.querySelectorAll("input, textarea");
        var countHtml;
        var chars = 0;
        var charsText;

        //On load
        for(var field of scTextFields) {
          
          if(field.className == "scContentControl" || field.className == "scContentControlMemo") {
            
            field.setAttribute( 'style', 'padding-right: 70px !important' );
            field.parentElement.setAttribute( 'style', 'position:relative !important' );
            chars = field.value.length;
            if(chars > 1) { charsText = chars+" chars"; } else { charsText = chars+" char"; }
            countHtml = '<div id="chars_' + field.id + '" style="position: absolute; bottom: 1px; right: 1px; padding: 6px 10px; border-radius: 4px; line-height: 20px; opacity:0.5;">' + charsText + '</div>';
            //Add div
            field.insertAdjacentHTML( 'afterend', countHtml );

          }
        
        }

        //On keyup
        document.addEventListener('keyup', function (event) {

            if (event.target.localName == "input" || event.target.localName == "textarea") {
              
              chars = event.target.value.length;
              if(chars > 1) { charsText = chars+" chars"; } else { charsText = chars+" char"; }

              if(global.debug) { console.log('chars_'+event.target.id+" -> "+charsText); }

              if(document.querySelector('#chars_'+event.target.id)) {
                document.querySelector('#chars_'+event.target.id).innerText = charsText;
              }
            
            }

          }, false);

        }

    });

    /*
     * Enhanced Bucket List Select Box (multilist)
     */
    var scBucketListSelectedBox = document.querySelectorAll(".scBucketListSelectedBox, .scContentControlMultilistBox");
    var Section_Data = document.querySelector("#Section_Data");

    scBucketListSelectedBox[1] ? 
        scBucketListSelectedBox = scBucketListSelectedBox[1] : 
        scBucketListSelectedBox = scBucketListSelectedBox[0];

    if(scBucketListSelectedBox) {

      scBucketListSelectedBox.addEventListener("change", function() {

        var itemId = scBucketListSelectedBox.value;
        var itemName = scBucketListSelectedBox[scBucketListSelectedBox.selectedIndex].text;
        var scMessageEditText = '<a class="scMessageBarOption" href="' + window.location.origin + '/sitecore/shell/Applications/Content%20Editor.aspx#' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
        var scMessageExperienceText = '<a class="scMessageBarOption" href="' + window.location.origin + '/?sc_mode=edit&sc_itemid=' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
        var scMessageEdit = '<div id="Warnings" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + global.icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">' + itemName + '</div><span id="Information" class="scMessageBarText"><span class="scMessageBarOptionBullet">' + scMessageEditText + '</span> to edit this item in <b>Content Editor</b>.</span><span id="Information" class="scMessageBarText"><br /><span class="scMessageBarOptionBulletXP">' + scMessageExperienceText + '</span> to edit this page in <b>Experience Editor</b>.</span></div></div>';

        //Add hash to URL
        if(!document.querySelector(".scMessageBar")) {
          Section_Data.insertAdjacentHTML( 'beforebegin', scMessageEdit );
        } else {
          document.querySelector(".scMessageBarTitle").innerHTML = itemName;
          document.querySelector(".scMessageBarOptionBullet").innerHTML = scMessageEditText;
          document.querySelector(".scMessageBarOptionBulletXP").innerHTML = scMessageExperienceText;
        }
      });
    }

    chrome.storage.sync.get(['feature_errors'], function(result) {

      result.feature_errors == undefined ?
        result.feature_errors = true :
        false;

      //Variables
      var count = 0;
      var scErrors = document.getElementsByClassName("scValidationMarkerIcon");  
      var scEditorID = document.querySelector ("#MainPanel");

      if(result.feature_errors) {

        //Prepare HTML
        var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + global.icon + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">';

        for (let item of scErrors) {

            if( item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
              scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + '</li>';
              count++;
            }
        }
        scMessageErrors += '</ul></div></div>';
     
        //Insert message bar into Sitecore Content Editor
        if(count>0) {
          scEditorID.insertAdjacentHTML( 'beforebegin', scMessageErrors );
        }

        //Update on change/unblur
        var target = document.querySelector( ".scValidatorPanel" );
        var observer = new MutationObserver(function(mutations) {

          //Variables
          count = 0;

          //Prepare HTML
          var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + global.iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">'
          
          for (let item of scErrors) {

              if( item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
                scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + '</li>';
                count++;
              }
          }
          scMessageErrors += '</ul></div></div>';
            
          if(count>0) {
            //Insert message bar into Sitecore Content Editor
            scEditorID.insertAdjacentHTML( 'beforebegin', scMessageErrors );
          } else {
            //Delete all errors
            var element = document.getElementById("scMessageBarError");
            if(element) { element.parentNode.removeChild(element); }
            //document.querySelectorAll("#scCrossTabError").forEach(e => e.parentNode.removeChild(e));

          }

          global.debug ? console.log("!! Change !!") : false;

          //TODO: Show an alert when the popup is closed so the User knwo what to do
          // var saveButton = document.querySelector(".scButtonPrimary");
          // saveButton.onclick = function() { alert('blah'); };


        });
        
        //Observer
        if(target) {
          var config = { attributes: true, childList: true, characterData: true };
          observer.observe(target, config);
        }



      }
    });

  } else if(global.isMediaFolder) {

    global.debug ? console.info('%c **** Media Folder **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    chrome.storage.sync.get(['feature_dragdrop'], function(result) {
        
        result.feature_dragdrop == undefined ? result.feature_dragdrop = true : false;

        if(result.feature_dragdrop) {
            
            var scIframeSrc = window.location.href.split("id=%7B");
            scIframeSrc = scIframeSrc[1].split("%7B");
            scIframeSrc = scIframeSrc[0].split("%7D");
            var scMediaID = scIframeSrc[0];

            //Prepare HTML
            var scUploadMediaUrl = '/sitecore/client/Applications/Dialogs/UploadMediaDialog?ref=list&ro=sitecore://master/%7b' + scMediaID + '%7d%3flang%3den&fo=sitecore://master/%7b' + scMediaID + '%7d';

            // //Add button
            var scFolderButtons = document.querySelector(".scFolderButtons");
            //scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ')
            var scButtonHtml = '<a href="#" class="scButton" onclick="javascript:scSitecore.prototype.showModalDialog(\'' + scUploadMediaUrl + '\', \'\', \'\', null, null); false"><img src=" ' + global.launchpadIcon + ' " width="16" height="16" class="scIcon" alt="" border="0"><div class="scHeader">Upload files (Drag and Drop)</div></a>';

            // //Insert new button
            scFolderButtons.insertAdjacentHTML( 'afterbegin', scButtonHtml );

        }
    });

  } else if(global.isRichTextEditor || global.isHtmlEditor) {

    global.debug ? console.info('%c **** Rich text editor **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    chrome.storage.sync.get(['feature_rtecolor','feature_darkmode','feature_darkmode_auto'], function(result) {

    if(result.feature_rtecolor == undefined) { result.feature_rtecolor = true; }
    if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }
    if(result.feature_darkmode_auto == undefined) { result.feature_darkmode_auto = false; }

      if(result.feature_rtecolor) {

        var contentIframe;
        var darkModeTheme = "default" ;

        //Which HTML editor
        if(global.isRichTextEditor) {

          contentIframe = document.querySelector("#Editor_contentIframe");

        } else if (global.isHtmlEditor) {

          contentIframe = document.querySelector("#ctl00_ctl00_ctl05_Html");
        }
        
        if(contentIframe) {

          //RTE Tabs
          if(global.isRichTextEditor) {
            var designTab = document.querySelector("#Editor_contentIframe").contentWindow.document.body;
            var htmlTab = document.querySelector("#EditorContentHiddenTextarea");
            var reTextArea = document.querySelector(".reTextArea");
          }

            /*
            * Codemirror css
            */
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href =  chrome.runtime.getURL("css/codemirror.css");
            document.getElementsByTagName("head")[0].appendChild(link);

            //If dark mode ON
            var currentScheme = preferesColorScheme();

          if(result.feature_darkmode && !result.feature_darkmode_auto || result.feature_darkmode && result.feature_darkmode_auto && currentScheme == "dark") {
            
            darkModeTheme = "ayu-dark";

            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href =  chrome.runtime.getURL("css/dark/ayu-dark.css");
            document.getElementsByTagName("head")[0].appendChild(link);
          }

          //Extra variables
          if(global.isRichTextEditor) {
            reTextArea.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />' );
            reTextArea.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scEditor" value="richTextEditor" />' );
          } else if (global.isHtmlEditor) {
            contentIframe.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />' );
            contentIframe.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scEditor" value="htmlEditor" />' );
          }

          /*
           * Codemirror librairires
           */
          script = document.createElement('script');
          script.src = chrome.runtime.getURL("js/bundle-min.js");
          (document.head||document.documentElement).appendChild(script);
          script.remove();

        }

    }

    });

  } else if(global.isGalleryLanguage) {

    global.debug ? console.info('%c **** Languages menu **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    chrome.storage.sync.get(['feature_flags'], function(result) {

      if(result.feature_flags == undefined) { result.feature_flags = true; }

      if(result.feature_flags) {
        
      /*
       * Load Json data for languages
       */    
        var dom = document.querySelector("#Languages");
        var div = dom.querySelectorAll('.scMenuPanelItem,.scMenuPanelItemSelected')
        var isRegionFrame, td, tdlanguage, tdversion, tdimage, temp, key;
        var divcount = 0;
        var tdcount = 0;


        //Sort alphabetically or by version
        div = [].slice.call(div).sort(function (a, b) {
        return a.querySelector("table > tbody > tr > td > div > div:last-child").textContent > b.querySelector("table > tbody > tr > td > div > div:last-child").textContent ? -1 : 1;
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
                
                if(tdcount==0) {
                  
                  tdimage = item2.getElementsByTagName("img");
                
                } else {
                  
                  tdlanguage = item2.getElementsByTagName("b");
                  tdlanguage = tdlanguage[0].innerHTML;

                  tdversion = item2.getElementsByTagName("div");
                  tdversion = tdversion[2].innerHTML;
                  tdversion = tdversion.split(" ");

                  //Check version
                  if(tdversion[0]!="0") {
                    temp = item2.getElementsByTagName("div")
                    temp[2].setAttribute( 'style', 'background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important' );
                  }

                  isRegionFrame = tdlanguage.includes('(region)');

                  //Check country
                  if(isRegionFrame) {

                    //Clean country name
                    tdlanguage = tdlanguage.split(" (region");

                    for (key in global.jsonData) {
                      if (global.jsonData.hasOwnProperty(key)) {
                          if( tdlanguage[0].toUpperCase() == global.jsonData[key]["language"].toUpperCase()) {
                            
                            tdlanguage = global.jsonData[key]["flag"];

                          }
                      }
                    }

                  } else {

                    //Clean country name
                    tdlanguage = cleanCountryName(tdlanguage);

                  }
                  
                  //Now replace images src and add an image fallback if doesn't exist
                  tdlanguage = tdlanguage.toLowerCase();
                  tdimage[0].onerror = function() { this.src = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png"); }
                  tdimage[0].src = chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");
                }

                tdcount++;

              }

          divcount++;

          }

      }

    });

  } else if(global.isPublishDialog) {

    if(global.debug) { console.info('%c **** Publishing Window **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;'); }

    chrome.storage.sync.get(['feature_flags'], function(result) {

        result.feature_flags == undefined ? result.feature_flags = true : false;

        if(result.feature_flags) {
        
            //Listener ScrollablePanelLanguages
            target = document.querySelector("body");
            observer = new MutationObserver(function(mutations) {
                
                var temp, tdlanguage, key, scFlag;
                var label = document.querySelectorAll("div[data-sc-id=CheckBoxListLanguages] > table:last-child")[0];
                
                if(label != undefined && label.children[0].children.length > 1) {
                    //Loop
                    for(var tr of label.children[0].children) {
                        
                        for(var td of tr.children) {
                            tdlanguage = cleanCountryName(td.innerText.trim());

                            //Compare with Json data
                            for (key in global.jsonData) {
                                if (global.jsonData.hasOwnProperty(key) && tdlanguage == global.jsonData[key]["language"].toUpperCase()) { tdlanguage = global.jsonData[key]["flag"]; }
                            }

                            scFlag = tdlanguage.toLowerCase();
                            scFlag = chrome.runtime.getURL("images/Flags/16x16/flag_" + scFlag + ".png")


                            //Add Flag into label
                            if(td.querySelector("#scFlag") == null) {
                                td.querySelector("label > span").insertAdjacentHTML( 'beforebegin', ' <img id="scFlag" src="' + scFlag + '" style="display: inline; vertical-align: middle; padding-right: 2px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/16x16/flag_generic.png\';"/>' );
                            }
                        
                        }
                    }
                }
            });

            //Observer publish
            target ? observer.observe(target, { attributes: false, childList: true, characterData: false, subtree: true }) : false;

        }
    })
    
  } else if(global.isPublishWindow) {

    global.debug ? console.info('%c **** Publish / Rebuild **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    chrome.storage.sync.get(['feature_flags'], function(result) {

      result.feature_flags == undefined ? result.feature_flags = true : false;

      if(result.feature_flags) {
        
        var dom = document.querySelector("#Languages");
        var temp, tdlanguage, key, scFlag;
        var label = dom.getElementsByTagName('label') 

        /*
         * Load Json data for languages
         */
        for (let item of label) {

          temp = item.innerText;
          console.log(temp);

          //Clean country name
          tdlanguage = cleanCountryName(temp);

          //Compare with Json data
          for (key in global.jsonData) {
            if (global.jsonData.hasOwnProperty(key)) {
                if( tdlanguage == global.jsonData[key]["language"].toUpperCase()) {

                  tdlanguage = global.jsonData[key]["flag"];

                }
            }
          }

          scFlag = tdlanguage.toLowerCase();
          scFlag = chrome.runtime.getURL("images/Flags/16x16/flag_" + scFlag + ".png")

          //Add Flag into label
          item.insertAdjacentHTML( 'beforebegin', ' <img id="scFlag" src="' + scFlag + '" style="display: inline; vertical-align: middle; padding-right: 2px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/16x16/flag_generic.png\';"/>' );

        }

      }

    });

  }

  /*
   * > 09. Auto Expand (Inspired by https://github.com/alan-null/sc_ext)
   */
  chrome.storage.sync.get(['feature_autoexpand'], function(result) {

    if(result.feature_autoexpand == undefined) { result.feature_autoexpand = true; }
    
    if(result.feature_autoexpand) {

      //Content tree
      document.addEventListener('click', function (event) {

        //Chage EditorFrames opacity on load item
        if (event.target.offsetParent != null) {
            if(event.target.offsetParent.matches('.scContentTreeNodeNormal')) {
                document.querySelector("#EditorFrames").setAttribute("style","opacity:0.6");
                document.querySelector(".scContentTreeContainer").setAttribute("style","opacity:0.6");
                document.querySelector(".scEditorTabHeaderActive > span").innerText = "Loading";
                var timeout = setTimeout(function() {
                    document.querySelector("#EditorFrames").setAttribute("style","opacity:1");
                    document.querySelector(".scContentTreeContainer").setAttribute("style","opacity:1");
                }, 8000)
            }
        } 

        //Open tree -> Auto expand if 1 node
        if (!event.target.matches('.scContentTreeNodeGlyph')) return;
        let glyphId = event.target.id;

        setTimeout(function(){
          if(document && glyphId) {   
            let subTreeDiv = document.querySelector("#"+glyphId).nextSibling.nextSibling.nextSibling;
            if(subTreeDiv) {
              let newNodes = subTreeDiv.querySelectorAll(".scContentTreeNode");
              if(newNodes.length == 1) { newNodes[0].querySelector(".scContentTreeNodeGlyph").click(); }
            }
          }
        }, 200);

      }, false);


      //Security Editor 
      document.addEventListener('mousedown', function (event) {

        if (!event.target.matches('.glyph')) return;
        let glyphId = event.target.id;
        let glyphSrc = event.target.src;
        let isCollapsed = glyphSrc.includes("collapsed");


        setTimeout(function(){
          if(document && glyphId && isCollapsed) { 
            // console.log(event.target);  
            var subTreeDiv = document.querySelector("#"+glyphId).closest("ul").nextSibling
            // console.log(subTreeDiv);           
            if(subTreeDiv) {
              var nextGlyphId = subTreeDiv.querySelector('.glyph');
              // console.log(nextGlyphId);
              nextGlyphId.click();
            }
          }
        }, 200);

      }, false);

    }
  
  });

  /*
   * > 10. Publish notification
   */
  target = document.querySelector("#LastPage");
  observer = new MutationObserver(function(mutations) {

    chrome.storage.sync.get(['feature_notification'], function(result) {

      if(result.feature_notification == undefined) { result.feature_notification = true; }

      if(result.feature_notification) {
        
        //Variable
        target = document.querySelector("#LastPage");

        //Prepare notification
        var notificationSubTitle = target.querySelector(".sc-text-largevalue").innerHTML;
        var notificationBody = target.querySelector(".scFieldLabel").innerHTML;
        if(notificationBody == "Result:") { notificationBody = "Finished "+document.querySelector("#ResultText").value.split("Finished")[1]; }
        
        //Send notification
        sendNotification(notificationSubTitle,notificationBody);

        var parentSelector = parent.parent.document.querySelector("body");
        checkUrlStatus(parentSelector);

      }

    });

    global.debug ? console.info('%c *** Publish/Rebuild Done *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;') : false;
  }); //End publish

    //Observer publish
    if(target){
      observer.observe(target, { attributes: true });
    } 

  /*
   * > Update UI
   */  
  target = document.querySelector("#scLanguage");
  var observer = new MutationObserver(function(mutations) {

    global.debug ? console.info('%c *** Update UI *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;') : false;

    //Sitecore Variables
    var scQuickInfo = document.querySelector(".scEditorHeaderQuickInfoInput" );  

    /*
     * > 5. Open from CE ???? why we need that!!
     */
    if (scQuickInfo) {

        // Effect on CE
        // document.querySelector("#ContentEditor").setAttribute("style","opacity:0.2");
      
        var sitecoreItemID = scQuickInfo.getAttribute("value");
        var scLanguage = document.querySelector("#scLanguage").getAttribute("value").toLowerCase();

        var scEditorQuickInfo = document.querySelectorAll(".scEditorQuickInfo");
        var lastScEditorQuickInfo = scEditorQuickInfo[scEditorQuickInfo.length- 1];
        var countTab = scEditorQuickInfo.length;
        var scEditorTitle = document.getElementsByClassName("scEditorHeaderTitle");

        var tabSitecoreItemID = document.querySelectorAll(".scEditorHeaderQuickInfoInput");
        var lastTabSitecoreItemID = tabSitecoreItemID[tabSitecoreItemID.length- 2].getAttribute("value");

        var locaStorage = localStorage.getItem('scBackPrevious');

        //Add hash to URL
        if(!global.hasRedirection && !global.hasRedirectionOther) {
            if(locaStorage != "true") {
                var state = { 'sitecore': true, 'id': sitecoreItemID }
                history.pushState(state, undefined, "#"+sitecoreItemID);
            } else {
                localStorage.removeItem('scBackPrevious');
            }     
        }

      //Tabs opened?
      global.debug ? console.info('%c - Tabs opened: ' + countTab + ' ', 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;') : false;

      if(countTab >1 && !document.getElementById("showInContentTree"+(countTab)+"")) {
        //Add text after title
        var url = window.location.href;
        url = url.split("#");
        var javascript = 'scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ',language=' + scLanguage + ',version=1)");';
        var href = url[0]+'&reload#'+lastTabSitecoreItemID;
        scEditorTitle[countTab-1].insertAdjacentHTML( 'afterend', '[<a id="showInContentTree' + countTab + '" href="" onclick="javascript:window.location.href=\'' + href + '\'; return false;" />Show in content tree</a>]' );
      }

    }

    //Execute a bunch of actions everytime the UI is refreshed
    mutations.forEach(function(e) {
      "attributes" == e.type && sitecoreAuthorToolbox();
    });
  }); //En UI

    //Observer UI
    if(target){
      observer.observe(target, { attributes: true });
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
 ************************
 * 2. Experience Editor *
 ************************
 */
if(global.isEditMode && !global.isLoginPage || global.isPreviewMode && !global.isLoginPage) {

    global.debug ? console.info("%c 🎨 Experience Editor detected ", 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

    /*
    * Fadein onload
    */
    link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href =  chrome.runtime.getURL("css/onload-min.css");
    document.getElementsByTagName("head")[0].appendChild(link);

    /*
    * Tooltip styling
    */
    link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href =  chrome.runtime.getURL("css/tooltip-min.css");
    document.getElementsByTagName("head")[0].appendChild(link);

    /*
    * Extra client injection scripts
    */
    script = document.createElement('script');
    script.src = chrome.runtime.getURL("js/inject-min.js");
    (document.head||document.documentElement).appendChild(script);
    script.remove();

    /*
    * Store Item ID
    */
    var dataItemId = document.querySelector('[data-sc-itemid]');
    if(dataItemId) {

        //Set ItemID (Storage)
        var sitecoreItemID = decodeURI(dataItemId.getAttribute('data-sc-itemid'));
        var scLanguage = "en";
        var scVersion = 1;
        sitecoreItemJson(sitecoreItemID, scLanguage, scVersion);
        // chrome.storage.sync.set({"scItemID": sitecoreItemID}, function() {
        //     if(global.debug) { console.info("%c [Storage Set] Item : " + sitecoreItemID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
        // });

    }

    /**
    * Flags in language menu
    */
    if(global.isGalleryLanguageExpEd) {

    global.debug ? console.info('%c **** Languages **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;

        chrome.storage.sync.get(['feature_flags'], function(result) {

          if(result.feature_flags == undefined) { result.feature_flags = true; }

          if(result.feature_flags) {

            var isRegionFrame, td, tdDiv, tdlanguage, tdversion, tdimage, temp, key;
            var dom = document.querySelector('.sc-gallery-content');
            var div = dom.querySelectorAll('.sc-gallery-option-content,.sc-gallery-option-content-active');
            var divcount = 0;
            var tdcount = 0;

            //Sort alphabetically or by version
            div = [].slice.call(div).sort(function (a, b) {
            return a.querySelector("div > div:last-child > span").textContent > b.querySelector("div > div:last-child > span").textContent ? -1 : 1;
            //return a.textContent > b.textContent ? 1 : -1;
            });
            //Append dom
            div.forEach(function (language) {
            dom.appendChild(language);
            });

            for (let item of div) {
              
              tdDiv = item.closest('.sc-gallery-option-content,.sc-gallery-option-content-active');
              tdlanguage = item.querySelector('.sc-gallery-option-content-header > span').innerText;
              tdversion = item.querySelector('.sc-gallery-option-content-description > span');

              temp = tdversion.innerHTML.split(" ");
              //Check version
              if(temp[0]!="0") {
                tdversion.setAttribute( 'style', 'background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important' );
              }

              //Clean country name
              tdlanguage = cleanCountryName(tdlanguage);

              //Compare with Json data
              for (key in global.jsonData) {
                if (global.jsonData.hasOwnProperty(key)) {
                    if( tdlanguage == global.jsonData[key]["language"].toUpperCase()) {

                      tdlanguage = global.jsonData[key]["flag"];

                    }
                }
              }

              tdDiv.setAttribute( 'style', 'padding-left:48px; background-image: url(' + chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png") + '); background-repeat: no-repeat; background-position: 5px;' );

            }
          }

        });
    } 

    /**
    * Flags in Ribbon
    */
    if(global.isRibbon) {

    global.debug ? console.info('%c **** Ribbon **** ', 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;') : false;
    
        var scRibbonFlagIcons = document.querySelector( ".flag_generic_24" );
        var tdlanguage, temp, key;
    
        // for(var flag of scRibbonFlagIcons) {

            tdlanguage = scRibbonFlagIcons.nextSibling.innerText;
            //Clean country name
            tdlanguage = cleanCountryName(tdlanguage);

            //Compare with Json data
            for (key in global.jsonData) {
                if (global.jsonData.hasOwnProperty(key)) {
                    if( tdlanguage == global.jsonData[key]["language"].toUpperCase()) {
                  tdlanguage = global.jsonData[key]["flag"];
                    }
                }
            }

            scRibbonFlagIcons.setAttribute( 'style', 'background-image: url(' + chrome.runtime.getURL("images/Flags/24x24/flag_" + tdlanguage + ".png") + '); background-repeat: no-repeat; background-position: top left;' );

        // }
    }

    /**
    * Tooltip bar
    */
    target = document.querySelector( ".scChromeControls" );
    observer = new MutationObserver(function(mutations) {

    var scChromeToolbar = document.querySelectorAll( ".scChromeToolbar" );

        //Find scChromeCommand
        for(var controls of scChromeToolbar) {
              
          controls.setAttribute('style', 'margin-left:50px');
          var scChromeCommand = controls.querySelectorAll( ".scChromeCommand" );
          var scChromeText = controls.querySelector( ".scChromeText" );
          var scChromeCommandText = controls.querySelector( ".scChromeCommandText" );
          
          for(var command of scChromeCommand) {
            var title = command.getAttribute("title");          
            command.setAttribute('style', 'z-index:auto');
            
            if(title != null) {
              command.setAttribute('data-tooltip', title);
              command.classList.add("t-bottom");
              command.classList.add("t-sm");
              command.removeAttribute("title");
            }
          }
        }
    });

    //Observer
    if(target) {
        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
    }

    /*
    * Dark mode + Toggle Ribbon
    */
    var currentScheme = preferesColorScheme();

    chrome.storage.sync.get(['feature_darkmode','feature_darkmode_auto','feature_toggleribbon'], function(result) {

    //Variables
    var pagemodeEdit = document.querySelector(".pagemode-edit");
    if(!pagemodeEdit) { pagemodeEdit = document.querySelector(".on-page-editor"); }
    if(!pagemodeEdit) { pagemodeEdit = document.querySelector(".experience-editor"); }
    if(!pagemodeEdit) { pagemodeEdit = document.querySelector(".scWebEditRibbon"); }
    var isQuery = global.windowLocationHref.includes('?');
    var scCrossPiece = document.querySelector("#scCrossPiece");
    var ribbon = document.querySelector('#scWebEditRibbon');
    var scMessageBar = document.querySelector('.sc-messageBar');
    let tabColor;

    if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }
    if(result.feature_darkmode_auto == undefined) { result.feature_darkmode_auto = false; }
    if(result.feature_toggleribbon == undefined) { result.feature_toggleribbon = true; }


    if(result.feature_toggleribbon ) {      
        //Experience Editor Reset (container, hover styles..)
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href =  chrome.runtime.getURL("css/reset-min.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    if(result.feature_darkmode && !result.feature_darkmode_auto && global.isRibbon || result.feature_darkmode && !result.feature_darkmode_auto && global.isDialog || result.feature_darkmode && !result.feature_darkmode_auto && global.isInsertPage || result.feature_darkmode && result.feature_darkmode_auto && global.isRibbon && currentScheme == "dark" || result.feature_darkmode && result.feature_darkmode_auto && global.isDialog && currentScheme == "dark" || result.feature_darkmode && result.feature_darkmode_auto && global.isInsertPage && currentScheme == "dark" ) {

        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href =  chrome.runtime.getURL("css/dark/experience-min.css");
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    if(result.feature_darkmode && !result.feature_darkmode_auto || result.feature_darkmode && result.feature_darkmode_auto && currentScheme == "dark" ) {
      tabColor = "dark";
    }

    /*
     * Extra buttons
     */
    var target = document.body;
    var observer = new MutationObserver(function(mutations) {

      for(var mutation of mutations) {
        for(var addedNode of mutation.addedNodes) {
          if(addedNode.id == "scCrossPiece") {
            
            //Show/Hide button
            var html = '<div class="scExpTab '+ tabColor +'"><span class="tabHandle"></span><span class="tabText" onclick="toggleRibbon()">▲ Hide<span></div>';
            addedNode.insertAdjacentHTML( 'afterend', html );
            observer.disconnect();
            startDrag();

          }
        }
      }

    });
    
    //Observer
    if(result.feature_toggleribbon && target) {
      var config = { attributes: false, childList: true, characterData: false };
      observer.observe(target, config);
    }

    /*
     * Go to Normal mode
     */
    var linkNormalMode;

    if(global.isEditMode) {
        linkNormalMode = global.windowLocationHref.replace("sc_mode=edit","sc_mode=normal");
    } else if(global.isPreviewMode) {
        linkNormalMode = global.windowLocationHref.replace("sc_mode=preview","sc_mode=normal");
    } else {
        global.windowLocationHref.includes("?") ? linkNormalMode = global.windowLocationHref+"&sc_mode=normal" : linkNormalMode = global.windowLocationHref+"?sc_mode=normal";
    }

    if(result.feature_toggleribbon && !global.isRibbon) {
      var html = '<div class="scNormalModeTab '+ tabColor +'"><span class="t-right t-sm" data-tooltip="Open in Normal Mode"><a href="' + linkNormalMode + '"><img src="' + global.iconChrome + '"/></a></span></div>';
      pagemodeEdit ? pagemodeEdit.insertAdjacentHTML( 'afterend', html ) : false;
    }

    /*
     * Go to Content Editor
     */
    if(result.feature_toggleribbon && !global.isRibbon) {
      html = '<div class="scContentEditorTab '+ tabColor +'"><span class="t-right t-sm" data-tooltip="Open in Content Editor"><a href="' + window.location.origin + '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1"><img src="' + global.iconCE + '"/></a></span></div>';
      pagemodeEdit ? pagemodeEdit.insertAdjacentHTML( 'afterend', html ) : false;
    }

  });
  //}

}
