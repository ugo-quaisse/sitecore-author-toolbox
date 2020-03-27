/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

var debug = false;

/*
 * Helper functions
 */
function stripHtml(html){

    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

function sendNotification(scTitle, scBody) {
  //Show notification
  new Notification(scTitle, {
      body: scBody,
      icon: chrome.runtime.getURL("images/icon.png")
  });
  //Play sound
  var sound = new Audio(chrome.runtime.getURL("audio/notification.mp3"));
  sound.play();
}

function repositionElement(event) {
  this.style.left = initX + event.clientX - mousePressX + 'px';
}

function startDrag() {
  var contextmenu = document.querySelector('.scExpTab');
  if(contextmenu) {
    contextmenu.addEventListener('mousedown', function(event) {

      initX = this.offsetLeft;
      mousePressX = event.clientX;

      this.addEventListener('mousemove', repositionElement, false);

      window.addEventListener('mouseup', function() {
        contextmenu.removeEventListener('mousemove', repositionElement, false);
      }, false);

    }, false);
  }
}

function cleanCountryName(name) {

  var temp = name;
  var language;

  //If language name includes ":"
  if(temp!='' && temp.includes(' :')) { temp = temp.split(" :"); temp = temp[0]; }
  temp = temp.split(" (");
  if(temp[1] == undefined) { temp = temp[0]; } else { temp = temp[1]; }
  temp = temp.split(")");
  if(temp[0].includes(', ')) { temp = temp[0].split(", "); temp[0] = temp[1]; temp[0] = temp[0].replace(" ", "_"); }
  temp = temp[0].replace(" ", "_");
  temp = temp.toUpperCase();
  language = temp.replace("TRADITIONAL,_","");
  language = language.replace("SIMPLIFIED,_","");
  //Replace non-standard country name
  language = language.replace("U.A.E.","UNITED_ARAB_EMIRATES");
  language = language.replace("KOREA","SOUTH_KOREA");
  language = language.replace("UNITED_STATES","USA");
  language = language.replace("UNITED_KINGDOM","GREAT_BRITAIN");
  language = language.replace("ENGLISH","GREAT_BRITAIN");
  return language;
}

function sitecoreAuthorToolbox() {

  //App settings 
  var count = 0;
  var icon = chrome.runtime.getURL("images/rocket.svg");
  var iconLock = chrome.runtime.getURL("images/lock.svg");
  var iconError = chrome.runtime.getURL("images/error.png");
  var iconEdit = chrome.runtime.getURL("images/edit.pmg");
  var iconTranslate = chrome.runtime.getURL("images/translate.pmg");
  var iconFlagGeneric = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png");
  var jsonLanguages = chrome.runtime.getURL("data/languages.json");
  let rteLanguages = ["ARABIC", "HEBREW", "PERSIAN", "URDU", "SINDHI"];

  //Sitecore item title bar
  let scEditorID = document.querySelector ( ".scEditorHeader" );
  //Sitecore item title
  let scEditorTitle = document.querySelector ( ".scEditorHeaderTitle" );
  //Sitecore Quick Info table
  var scEditorQuickInfo = document.getElementsByClassName("scEditorQuickInfo");
  //Sitecore Quick Info section
  let scQuickInfo = document.querySelector ( ".scEditorHeaderQuickInfoInput" );
  //Sitecore Language Menu
  let scLanguageMenu = document.querySelector ( ".scEditorHeaderVersionsLanguage" );
  //Sitecore url Version
  let scItemVersion = document.querySelector ( ".scEditorHeaderVersionsVersion > span" );
  if(scItemVersion) { scItemVersion = scItemVersion.innerText; }
  //Sitecore item Hash
  let scUrlHash = window.location.hash;
  //Sitecore Active Tab
  let scActiveTab = document.querySelector ( ".scEditorTabHeaderActive" );
  //Sitecore Normal Tab
  let scNormalTab = document.querySelectorAll ( ".scRibbonEditorTabNormal" );
  //Sitecore errors
  var scErrors = document.getElementsByClassName("scValidationMarkerIcon");
  //Sitecore validation
  var scValidation = document.getElementsByClassName("scValidationResult");
  //Sitecore Editor Frames
  let scEditorFrames = document.querySelector ( "#EditorFrames" );
  //Sitecore Editor Sections
  let scEditorSections = document.querySelector ( ".scEditorSections" );
  //Sitecore Search Panel
  let scSearchPanel = document.getElementById ( "SearchPanel" );
  //Sitecore Content Tree
  let scContentTree= document.getElementById ( "ContentTreeHolder" );
  //Translation Mode
  let isTranslateMode = false;
  //User Name
  let userName = document.querySelector(".sc-accountInformation").querySelectorAll("li")[1].innerText.trim();

  //Language name in menu
  var scEditorHeaderVersionsLanguage = document.getElementsByClassName("scEditorHeaderVersionsLanguage");
  if(scEditorHeaderVersionsLanguage[0]) {
    var scLanguageTxtLong = scEditorHeaderVersionsLanguage[0].getAttribute("title");
    var scLanguageTxtShort = stripHtml(scEditorHeaderVersionsLanguage[0].innerHTML);
  }



  if (!scQuickInfo) {

    /*
     * 0. Fallback (no Quicl Info)
     */
    if(!document.getElementById("scMessageBarUrl") && scEditorSections) {
      
      var scMessage = '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Oh snap! 😭😭😭</div><div class="scMessageBarText">To fully enjoy Sitecore Author Toolbox, please enable <b>Title bar</b> and <b>Quick info section</b> under <b>Application Options</b>.</div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="" onclick="javascript:return scForm.postEvent(this,event,\'shell:useroptions\')" class="scMessageBarOption">Open Application Options</a>.</li></ul></div></div>'
      scEditorSections.insertAdjacentHTML( 'afterbegin', scMessage );

    }

  } else {

    /*
    * 1. Live URLs
    */

    //Sitecore properties from Quick Info
    var temp = document.getElementsByClassName("scEditorHeaderQuickInfoInput");  
    var sitecoreItemID = temp[0].getAttribute("value");
    var sitecoreItemPath = temp[1].getAttribute("value").toLowerCase();
    var sitecoreItemPathOriginal = sitecoreItemPath.toLowerCase();
    sitecoreItemPath = sitecoreItemPath.split("/home/");
    var sitecoreSite = sitecoreItemPath[0];
    sitecoreSite = sitecoreSite.split("/");
    sitecoreSite = sitecoreSite.slice(-1)[0].toLowerCase();
    var isData = sitecoreItemPathOriginal.includes('/data/');
    var isMarketingControlPanel = sitecoreItemPathOriginal.includes('/marketing control panel/');
    var isTemplate = sitecoreItemPathOriginal.includes('/sitecore/templates');
    var isSystem = sitecoreItemPathOriginal.includes('/sitecore/system');
    var isLayout = sitecoreItemPathOriginal.includes('/sitecore/layout');
    var isForms = sitecoreItemPathOriginal.includes('/sitecore/forms');
    var isPresentation = sitecoreItemPathOriginal.includes('/presentation');
    var isContent = sitecoreItemPathOriginal.includes('/sitecore/content');

    //Sitecore variables
    var scLanguage = document.getElementById("scLanguage").getAttribute("value").toLowerCase();
    var scUrl = window.location.origin + '/?sc_itemid=' + sitecoreItemID + '&sc_mode=normal&sc_lang=' + scLanguage + '&sc_version=' +scItemVersion;
    var isNotRegion = scLanguageTxtShort.includes('(');
    var scFlag;  

    //Generating Live URLs (xxxsxa_sitexxx will be replace later by active site)
    if (sitecoreItemPath[1]!=undefined) {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/" + sitecoreItemPath[1]+ "?sc_site=xxxsxa_sitexxx&sc_mode=normal").toLowerCase();   
    } else {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/?sc_site=xxxsxa_sitexxx").toLowerCase(); 
    }

    //Excluding home and data
    if(sitecoreSite!="home" && isContent && !isData) {

      //Get user preference
      chrome.storage.sync.get(['feature_urls'], function(result) {

      if(result.feature_urls == undefined) { result.feature_urls = true; }
        
        //If not added yet
        if(!document.getElementById("scMessageBarUrl") && result.feature_urls) {

          //Get cookie sxa_site
          chrome.runtime.sendMessage({greeting: "sxa_site"}, function(response) {

          //Is website in cookie different than quick info
          if(response.farewell != null) {
            var site_quickinfo = sitecoreSite.toLowerCase();
            var site_cookie = response.farewell.toLowerCase();
            var isSameSite = site_cookie.includes(site_quickinfo);         
            if(debug) { console.log("%c - QuickInfo ("+site_quickinfo+") VS Cookie ("+site_cookie+") = "+isSameSite+" ", 'font-size:12px; background: #e3658e; color: black; border-radius:5px; padding 3px;'); }
          }

            if(response.farewell != null && isSameSite) {

              sitecoreItemPath = sitecoreItemPath.replace("xxxsxa_sitexxx", response.farewell);

            } else {

              sitecoreItemPath = sitecoreItemPath.replace("xxxsxa_sitexxx", sitecoreSite);

            }

            //Prepare HTML (scInformation scWarning scError)
            var scMessage = '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Sitecore Live URL</div><div class="scMessageBarText">If you want to preview this page in <b>' + scLanguageTxtLong + '</b> (version ' + scItemVersion + ')</div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="' + sitecoreItemPath + '" target="_blank" class="scMessageBarOption">Open this link</a> or try <a href="' + scUrl + '" target="_blank" class="scMessageBarOption">this alternative link</a></li></ul></div></div>'

            //Insert message bar into Sitecore Content Editor
            scEditorID.insertAdjacentHTML( 'afterend', scMessage );

          });

        }

      });

    } else if(isData) {
      
      chrome.storage.sync.get(['feature_urls'], function(result) {

        if(result.feature_urls == undefined) { result.feature_urls = true; }

        //If not added yet
        if(!document.getElementById("scMessageBarInfo") && result.feature_urls) {
          
          var scMessage = '<div id="scMessageBarInfo" class="scMessageBar scInformation"><div class="scMessageBarIcon" style="background-image:url(' + iconEdit + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">You are editing a data source...</div><div class="scMessageBarText">To see it, you need to add/edit it to your page via the</b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><span class="scMessageBarOption">Presentation Details</span> or <span class="scMessageBarOption">Experience Editor</span></li></ul></div></div>'
          //scEditorID.insertAdjacentHTML( 'afterend', scMessage );

        }

      });

    }
    
  }

  /*
   * 2. Insert Flag (Active Tab)
   */
  chrome.storage.sync.get(['feature_flags'], function(result) {

    if(result.feature_flags == undefined) { result.feature_flags = true; }

    //Version number
    var scEditorHeaderVersionsVersion = document.querySelector(".scEditorHeaderVersionsVersion");
    var scVersionTitle = scEditorHeaderVersionsVersion.getAttribute("title");
    scEditorHeaderVersionsVersion.querySelector("span").innerText = scVersionTitle.replace("."," ▾");

    if(isNotRegion) {

      //Clean country name
      scFlag = cleanCountryName(scLanguageTxtShort);

      //Flag images
      scFlag = scFlag.toLowerCase();
      scFlag = chrome.runtime.getURL("images/Flags/32x32/flag_" + scFlag + ".png");

      //Insert Flag into Active Tab
      if(!document.getElementById("scFlag") && result.feature_flags && scFlag) {
        scActiveTab.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="' + scFlag +'" style="width: 20px; vertical-align: middle; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + iconFlagGeneric + '\';"/>' );
      }

      if(!document.getElementById("scFlagMenu") && result.feature_flags && scFlag) {
        //Insert Flag into Sitecore Language selector
        scLanguageMenu.insertAdjacentHTML( 'afterbegin', '<img id="scFlagMenu" src="' + scFlag +'" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + iconFlagGeneric + '\';"/>' );
      }

    } else {

      if(result.feature_flags) {
        //External JSON
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", jsonLanguages, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {

                var data = JSON.parse(rawFile.responseText);
                var key;

                for (key in data) {
                    if (data.hasOwnProperty(key) && scLanguageTxtShort) {
                        if( scLanguageTxtShort.toUpperCase() == data[key]["language"].toUpperCase()) {
                          
                          scFlag = data[key]["flag"];
                          scFlag = scFlag.toLowerCase();
                          scFlag = chrome.runtime.getURL("images/Flags/32x32/flag_" + scFlag + ".png")

                          //Insert Flag into Active Tab
                          if(!document.getElementById("scFlag") && result.feature_flags && scFlag) {
                            scActiveTab.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="' + scFlag +'" style="width: 20px; vertical-align: middle; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + iconFlagGeneric + '\';"/>' );
                          }

                          //Insert Flag into Sitecore Language selector
                          if(!document.getElementById("scFlagMenu") && result.feature_flags && scFlag) {
                            scLanguageMenu.insertAdjacentHTML( 'afterbegin', '<img id="scFlagMenu" src="' + scFlag +'" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + iconFlagGeneric + '\';"/>' );
                          }
                        }

                    }
                } 

            }
        }
        rawFile.send(null);
      }

    }      


  });

  /*
   * 3. Right to left editor mode
   */
  chrome.storage.sync.get(['feature_rtl'], function(result) {

    if(result.feature_rtl == undefined) { result.feature_rtl = true; }

    if(result.feature_rtl && scLanguageTxtShort) {
      //Get active language
      temp = scLanguageTxtShort.split(" (");
      scFlag = temp[0].toUpperCase();
      var iframes;

      //Inject css stylesheet
      link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";

      if(rteLanguages.includes(scFlag)) {
        //RTE
        link.href =  chrome.runtime.getURL("css/rtl-min.css");

        iframes = document.getElementsByClassName('scContentControlHtml');
        for (let iframe of iframes) {
          iframe.onload= function() { iframe.contentWindow.document.getElementById('ContentWrapper').style.direction = "RTL"; };
        }

      } else {
        //LTR
        link.href =  chrome.runtime.getURL("css/ltr-min.css");
       
        iframes = document.getElementsByClassName('scContentControlHtml');
        for (let iframe of iframes) {
          iframe.onload= function() { iframe.contentWindow.document.getElementById('ContentWrapper').style.direction = "LTR"; };
        }

      }
      document.getElementsByTagName("head")[0].appendChild(link);
    }

  });

  /*
   * 4. Dynamic Errors
   */
  chrome.storage.sync.get(['feature_errors'], function(result) {

    if(result.feature_errors == undefined) { result.feature_errors = true; }

    if(result.feature_errors) {
      
      count = 0;

      //Prepare HTML
      var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">';

      for (let item of scErrors) {

          var previousSibling = item.previousSibling;
          if(previousSibling) {
            var fieldId = previousSibling.closest("div").getAttribute("id").replace("ValidationMarker","");
            var sectionTitle = document.querySelector("#"+fieldId).closest("table").closest("td").closest("table").previousSibling.innerText;
            var sectionId = document.querySelector("#"+fieldId).closest("table").closest("td").closest("table").previousSibling.getAttribute("id");
            var tabElem = document.querySelectorAll('[data-id="' + sectionId + '"]');
            //toggleSection(' + tabElem + ',\'' + sectionTitle+ '\')

            if( item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
              scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + '</li>';
              count++;
            }
          }
      }
      scMessageErrors += '</ul></div></div>';
   
      //Insert message bar into Sitecore Content Editor
      if(count>0) {
        scEditorID.insertAdjacentHTML( 'afterend', scMessageErrors );
      }


      //Update on change/unblur
      var target = document.querySelector( ".scValidatorPanel" );
      var observer = new MutationObserver(function(mutations) {

        count = 0;

        //Prepare HTML
        var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">'
        
        for (let item of scErrors) {

            if( item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
              scMessageErrors += '<li class="scMessageBarOptionBullet" onclick="' + item.getAttribute("onclick") + '" style="cursor:pointer;">' + item.getAttribute("title") + '</li>';
              count++;
            }
        }
        scMessageErrors += '</ul></div></div>';
          
        if(count>0) {
          //Insert message bar into Sitecore Content Editor
          scEditorID.insertAdjacentHTML( 'afterend', scMessageErrors );
        } else {
          //Delete all errors
          var element = document.getElementById("scMessageBarError");
          if(element) { element.parentNode.removeChild(element); }
          //document.querySelectorAll("#scCrossTabError").forEach(e => e.parentNode.removeChild(e));
        }

        if(debug) { console.log("Changement: "+document.getElementsByClassName("scValidatorPanel")); }


      });

      if(target) {
        //Observer
        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(target, config);
      }

    }

  });


  /*
   * 5. Add native Drag and Drop
   */
  var scIframe = document.getElementById('EditorFrames');
  
  if(scIframe) {
    
    scIframe = scIframe.getElementsByTagName('iframe');

    //Loop all iframes and excludes existing sitecorAuthorToolbox .getAttribute("class")
    var scIframeSrc;
    var scIframeMedia;
    var isMediaFolder;

    count = 0;

    for (let item2 of scIframe) {
      scIframeSrc = scIframe[count].src;
      scIframeMedia = scIframe[count];
      isMediaFolder = scIframeSrc.includes('/Media/');
      count++;
      if (isMediaFolder) {
        if(debug) { console.info("SRC of MEDIA IFRAME "+count+" - "+scIframeSrc); }
        break;
      }
    }


    chrome.storage.sync.get(['feature_dragdrop'], function(result) {
      
      if(result.feature_dragdrop == undefined) { result.feature_dragdrop = true; }

      if(isMediaFolder && result.feature_dragdrop) {
        scIframeMedia.onload = function() {

          //Variables
          scIframeSrc = scIframeSrc.split("id=%7B");
          scIframeSrc = scIframeSrc[1].split("%7B");
          scIframeSrc = scIframeSrc[0].split("%7D");
          var scMediaID = scIframeSrc[0];

          if(debug) { console.info(scMediaID); }

          //Prepare HTML
          var scUploadMediaUrl = '/sitecore/client/Applications/Dialogs/UploadMediaDialog?ref=list&ro=sitecore://master/%7b' + scMediaID + '%7d%3flang%3den&fo=sitecore://master/%7b' + scMediaID + '%7d';
          var scUploadMedia = '<iframe id="sitecorAuthorToolbox" class="sitecorAuthorToolbox" src="' + scUploadMediaUrl + '" style="width:100%; height:500px; margin-top: -60px; resize: vertical;"></iframe>';
          scIframeMedia.setAttribute("style", "margin-top: -30px;");
          
          //Check if Drag and Drop IFrame already exists in DOM
          var scUploadDragDrop = document.getElementById("sitecorAuthorToolbox");
          if(scUploadDragDrop){
            //Delete existing Drag and Drop iFrame
            scUploadDragDrop.remove();
          }    
          
          //Insert new button
          scEditorFrames.insertAdjacentHTML( 'afterbegin', scUploadMedia );
      
        }
      } else {
        
        //Remove iFrame Drang Drop if not on a Media Folder
        var scUploadDragDrop = document.getElementById("sitecorAuthorToolbox");
        if(scUploadDragDrop) {
          //Delete existing Drag and Drop iFrame
          scUploadDragDrop.remove();
        }

      }

      //Listener on tabs to check if we are in
      // var target = document.querySelector( "#EditorTabs" );
      // var observer = new MutationObserver(function(mutations) {

      //   console.log("mutations->");
      //   console.log(mutations);

      // });
      
      // //Observer
      // if(target) {
      //   var config = { attributes: false, childList: true, characterData: true };
      //   observer.observe(target, config);
      //   console.log("MEDiA OBSERVER START");
      //   console.log(target);
      // }

    });

  }

  /*
   * 6. Desktop notifications (Publish)
   */
  if (!window.Notification) {
      console.info('Browser does not support notifications.');
  } else {
      // check if permission is already granted
      if (Notification.permission === 'granted') {
          // show notification here
      } else {
          // request permission from user
          Notification.requestPermission().then(function(p) {
             if(p === 'granted') {
                 // show notification here
             } else {
                 console.info('User blocked notifications.');
             }
          }).catch(function(err) {
              console.warn(err);
          });
      }
  }

  /*
   * 7. Favorites bar
   */
  chrome.storage.sync.get(['feature_favorites'], function(result) {

    if(result.feature_favorites == undefined) { result.feature_favorites = true; }

    if(result.feature_favorites && !isPublishWindow && scContentTree) {

      var scFavoritesIframe = document.getElementById("sitecorAuthorToolboxFav");

      //If already there
      if(scFavoritesIframe) { scFavoritesIframe.remove(); }
        
        //Prepare HTML
        // var scMyShortcut = '<div id="scFavorites" style="padding: 10px 20px;"><b>My favorite:</b> <a href="" onclick="javascript: return scForm.invoke(\'item:load(id=' + scShortcutItemId + ',language=' + scLanguage + ',version=1)\')">Home</a></div>';
        var scFavoritesUrl = '../default.aspx?xmlcontrol=Gallery.Favorites&id=' + sitecoreItemID + '&la=' + scLanguage + '&vs=1';      
        var scMyShortcut = '<iframe id="sitecorAuthorToolboxFav" class="sitecorAuthorToolboxFav" src="' + scFavoritesUrl + '" style="width:100%; height:150px; margin-top: 0px; resize: vertical;"></iframe>';

        //Insert HTML
        scContentTree.insertAdjacentHTML( 'afterend', scMyShortcut );
      }

  });

  /*
   * 8. Character counter
   */

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

        //Listener
        document.addEventListener('keyup', function (event) {

            if (event.target.localName == "input" || event.target.localName == "textarea") {
              
              chars = event.target.value.length;
              if(chars > 1) { charsText = chars+" chars"; } else { charsText = chars+" char"; }

              if(debug) { console.log('Input text: '+event.target.id+" -> "+charsText); }

              if(document.querySelector('#chars_'+event.target.id)) {
                document.querySelector('#chars_'+event.target.id).innerText = charsText;
              }
            
            }

          }, false);

        }

    });

  /*
   * 9. Translate Mode
   */ 
   chrome.storage.sync.get(['feature_translatemode'], function(result) {

    if(result.feature_translatemode == undefined) { result.feature_translatemode = true; }

      if(result.feature_translatemode) {

        var scEditorPanel = document.querySelector(".scEditorPanel");
        var scEditorSectionPanel = document.querySelectorAll(".scEditorSectionPanel .scEditorSectionPanelCell")[1];
        var scTextFields = scEditorPanel.querySelectorAll("input, textarea, select");
        count = 0;

        //Detect if Translate Mode is on
        if(scEditorSectionPanel) {
          if(scEditorSectionPanel.querySelector(".scEditorFieldMarkerInputCell > table > tbody") != null) {
            isTranslateMode = true;
          }
        }
        
        if(isTranslateMode) {

          for(var field of scTextFields) {

            if(field.className == "scContentControl" || field.className == "scContentControlMemo" || field.className == "scContentControlImage" || field.className.includes("scCombobox") && !field.className.includes("scComboboxEdit")) {

              tdMiddle = null;

              if(count%2 == 0) {
                //Left
                var fieldLeft = field;
                var fieldLeftLang = field.getAttribute("onfocus");
                fieldLeftLang = fieldLeftLang.split("lang=");
                fieldLeftLang = fieldLeftLang[1].split("&");
                fieldLeftLang = fieldLeftLang[0].toUpperCase();

              } else {
                //Right
                var fieldRight = field;
                var fieldRightLang = field.getAttribute("onfocus");
                fieldRightLang = fieldRightLang.split("lang=");
                fieldRightLang = fieldRightLang[1].split("&");
                fieldRightLang = fieldRightLang[0].toUpperCase();

                //Find closest TD
                var tr = field.closest("td").parentNode;
                var td = tr.querySelectorAll("td");
                var tdMiddle = td[1];

                //Add images
                if(tdMiddle != null) {
                  tdMiddle.innerHTML = '<a class="scTranslateRTL" href="javascript:copyTranslate(\'' + fieldLeft.id + '\',\'' + fieldRight.id + '\',\'RTL\');" title="Copy ' + fieldRightLang + ' to ' + fieldLeftLang + '"><img src="' + chrome.runtime.getURL("images/navigate_left.png") + '" style="padding: 0px 2px 0px 0px; vertical-align: bottom; width: 20px;" alt="Copy"></a>';
                }
                
              }

              //Counter increment
              count++;

            }

          }

          //Add message bar
          //if(fieldLeftLang != fieldRightLang) {
          if(!document.getElementById("scMessageBarTranslation")) {
            scMessage = '<div id="scMessageBarTranslation" class="scMessageBar scInformation"><div class="scMessageBarIcon" style="background-image:url(' + iconTranslate + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Translation Mode (' + fieldRightLang + ' to ' + fieldLeftLang + ')</div><div class="scMessageBarText">You are translating content. If you want, you can directly </b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><span class="scMessageBarOption" onclick="javascript:copyTranslateAll();" style="cursor:pointer">Copy existing content into '+scLanguageTxtShort+' version</span></li> or <li class="scMessageBarOptionBullet"><span class="scMessageBarOption" style="cursor:pointer !important;" onclick="window.open(\'https://translate.google.com/#view=home&op=translate&sl=' + fieldRightLang.toLowerCase() + '&tl=' + fieldLeftLang.toLowerCase() + '&text=Hello Sitecore\');">Use Google Translate</span></li></ul></div></div>';
            scEditorID.insertAdjacentHTML( 'afterend', scMessage );
          }
          //}

        }

      }
    });

    /*
     * 10. Content Editor Tabs
     */
    chrome.storage.sync.get(['feature_cetabs'], function(result) {

    if(result.feature_cetabs == undefined) { result.feature_cetabs = false; }

      if(result.feature_cetabs) {

        var scEditorTabs = document.querySelector("#scEditorTabs");
        var scEditorHeader = document.querySelector(".scEditorHeader");
        var scMessageBar = document.querySelectorAll(".scMessageBar");
        scMessageBar = scMessageBar[scMessageBar.length-1];
        var scEditorSectionCaption = document.querySelectorAll(".scEditorSectionCaptionCollapsed, .scEditorSectionCaptionExpanded");
        var sectionActiveCount = 0;

        if(scEditorTabs) {
          scEditorTabs.remove();
        }

        scEditorTabs = '<div id="scEditorTabs"><ul>';

        for(var section of scEditorSectionCaption) {

          var sectionTitle = section.innerText;
          var sectionId = section.getAttribute("id");
          var sectionClass = section.getAttribute("class");
          var sectionSelected = "";
          var sectionPanelDisplay = "";
          var sectionError = 0;
          var sectionErrorHtml = "";

          //Detect active panel
          if(sectionClass == "scEditorSectionCaptionExpanded" && sectionActiveCount == 0) {
            sectionSelected = "scEditorTabSelected";
            sectionPanelDisplay = "table";
            sectionActiveCount++;
          } else {
            sectionSelected = "";
            sectionPanelDisplay = "none";
          }

          //Hide the accordion section
          section.setAttribute( 'style', 'display: none !important' );

          //Detect next scEditorSectionPanel
          var scEditorSectionPanel = section.nextSibling;
          scEditorSectionPanel.setAttribute( 'style', 'display: ' + sectionPanelDisplay + ' !important' );

          //How many errors in this section
          sectionError = scEditorSectionPanel.querySelectorAll(".scEditorFieldMarkerBarCellRed").length;
          if(sectionError > 0) { sectionErrorHtml = "<span id='scCrossTabError'>🛑 </span>"; }

          //Add close/hide button on each tabs, on click all tabs with the current Title will be hidden in Sitecore
          //To revert back to original state, a pinned tab will be shown to display them again

          //Add tabs to document
          scEditorTabs += '<li class="scEditorTabEmpty"></li>';
          scEditorTabs += '<li data-id="' + sectionId + '" class="scEditorTab ' + sectionSelected + '" onclick="toggleSection(this,\'' + sectionTitle+ '\');">' + sectionErrorHtml + sectionTitle+ '<span class="scEditorTabClose" onclick="hideTab(\'' + sectionTitle + '\',\'' + extensionId + '\')">❎</span></li>';

          //Add trigger on grouped error message click to open tab
          //var sectionTitle = document.querySelector("#FIELD47775058").closest("table").closest("td").closest("table").previousSibling.innerText
          //toggleSection(this,\'' + sectionTitle+ '\');



        }

        scEditorTabs += '<li class="scEditorTabEmpty"></li></ul></div>';

        //Add tabs to Content Editor
        if(scMessageBar) {
          scMessageBar.insertAdjacentHTML( 'afterend', scEditorTabs );
        } else {
          scEditorHeader.insertAdjacentHTML( 'afterend', scEditorTabs );
        }


        if(sectionActiveCount == 0) {
          var tab = document.querySelector(".scEditorTab");          
          var tabId = tab.dataset.id;
          var tabSection = document.querySelector("#"+tabId);
          tabSection.classList.remove("scEditorSectionCaptionCollapsed");
          tabSection.classList.add("scEditorSectionCaptionExpanded");
          var tabSectionPanel = tabSection.nextSibling;

          tab.classList.add("scEditorTabSelected");
          tabSectionPanel.setAttribute( 'style', 'display: table !important' );
        }

      }
    });


    /*
     * 11. Search enhancements
     */
    //Add listener on search result list
    target = document.querySelector( "#SearchResult" );
    observer = new MutationObserver(function(mutations) {

      console.log(mutations);
      

      var SearchResultHolder = document.querySelector("#SearchResult");
      var scSearchLink = SearchResultHolder.querySelectorAll(".scSearchLink");
      var scSearchListExtra = document.querySelector(".scSearchListExtra");
      console.log("EXTRA");
      console.log(scSearchListExtra);

      for(var line of scSearchLink) {
        
        var getFullpath = line.getAttribute("title").toLowerCase();
        if(getFullpath.includes("/home/")) {
          getFullpath = getFullpath.split("/home/");
          getFullpath = "/"+getFullpath[1];
        } 


        //Inject HTML
        var html = ' <span class="scSearchListExtra">' + getFullpath + '</span>';
        if(getFullpath && scSearchListExtra == null) {
          line.innerHTML += html;
        }
   
      }

    });
        
    //Observer
    if(target) {
      config = { attributes: false, childList: true, characterData: false, subtree: false };
      observer.observe(target, config);
    }

    /*
     * 12. Locked Item
     */
     setTimeout(function() {
        
        var isItemLocked = document.querySelector(".scRibbon").innerHTML.includes('Check this item in.');

        if(isItemLocked) {
          //Prepare HTML (scInformation scWarning scError)
          scMessage = '<div id="scMessageBarUrl" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + iconLock + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">You have locked this item.</div><div class="scMessageBarText">Nobody is able to edit it until you unlock it.</div><ul class="scMessageBarOptions"><li class="scMessageBarOptionBullet"><a href="#" onclick="javascript:return scForm.postEvent(this,event,\'item:checkin\')" class="scMessageBarOption">Unlock this item</a></li></ul></div></div>'
          
          //Insert message bar into Sitecore Content Editor
          scEditorID.insertAdjacentHTML( 'afterend', scMessage );
         }

     }, 500);


    //Add listener on scBucketListBox + scBucketListSelectedBox TODO
    // target = document.querySelector( ".scBucketListBox" );
    // observer = new MutationObserver(function(mutations) {

    //   console.log(mutations);

    // });
          
    // //Observer options
    // if(target) {
    //   config = { attributes: false, childList: true, characterData: false, subtree: false };
    //   observer.observe(target, config);
    //   console.log(target);
    // }


    /*
     * Debug info
     */
    if (debug === true) {

      console.info("%c - Sitecore Item: " + sitecoreItemID + " ", 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;');
      console.info("%c - Sitecore Language: " + scLanguage + " ", 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;');
      console.info("%c - Sitecore Version: "+ scItemVersion + " ", 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;');
      console.info("%c - Translation Mode: "+ isTranslateMode + " ", 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;');
    
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Dectect which URL/Frame is loading the script? (Languages, Favorites, etc...)
 */

if(debug) {
  console.info("%c *********************************** Url Loaded *********************************** ", 'font-size:14px; background: #32ed74; color: black; border-radius:5px; padding 3px;');
  console.info("%c "+window.location.href,'font-size:8px');
}

//Variables
var initX, initY, mousePressX;
var windowLocationHref = window.location.href.toLowerCase();
var isSitecore = window.location.pathname.includes('/sitecore/');
var isPreviewMode = document.querySelector(".pagemode-preview");
if(!isPreviewMode) { isPreviewMode = windowLocationHref.includes('sc_mode=preview'); }
var isEditMode = document.querySelector(".pagemode-edit");
if(!isEditMode) { isEditMode = windowLocationHref.includes('sc_mode=edit'); }
if(!isEditMode) { isEditMode = windowLocationHref.includes('/experienceeditor/'); }
var isGalleryLanguage = windowLocationHref.includes('gallery.language');
var isGalleryLanguageExpEd = windowLocationHref.includes('selectlanguagegallery');
var isGalleryFavorites = windowLocationHref.includes('gallery.favorites');
var isGalleryVersions = windowLocationHref.includes('gallery.versions');
var isAdminCache = windowLocationHref.includes('/admin/cache.aspx');
var isAdmin = windowLocationHref.includes('/admin/');
var isMediaBrowser = windowLocationHref.includes('sitecore.shell.applications.media.mediabrowser');
var isPublishWindow = windowLocationHref.includes('/shell/applications/publish.aspx');
var isSecurityWindow = windowLocationHref.includes('/shell/applications/security/');
var isExperienceEditor = windowLocationHref.includes('/applications/experienceeditor/');
var isContentHome = windowLocationHref.includes('/content/');
var isLoginPage = windowLocationHref.includes('sitecore/login');
var isLaunchpad = windowLocationHref.includes('/client/applications/launchpad');
var isDesktop = windowLocationHref.includes('/shell/default.aspx');
var isRichTextEditor = windowLocationHref.includes('/controls/rich%20text%20editor/');
var isHtmlEditor = windowLocationHref.includes('.edithtml.aspx');
var isFieldEditor = windowLocationHref.includes('field%20editor.aspx');
var isModalDialogs = windowLocationHref.includes('jquerymodaldialogs.html');
var isSecurityDetails = windowLocationHref.includes('securitydetails.aspx');
var isEditorFolder = windowLocationHref.includes('editors.folder.aspx');
var isRibbon = windowLocationHref.includes('/ribbon.aspx');
var isDialog = windowLocationHref.includes('experienceeditor/dialogs/confirm/');
var isInsertPage = windowLocationHref.includes('/dialogs/insertpage/');
var isCreateUser = windowLocationHref.includes('createnewuser');
var isUserManager = windowLocationHref.includes('user%20manager.aspx');
var isPersonalization = windowLocationHref.includes('dialogs.personalization');
var isRules = windowLocationHref.includes('rules.aspx');
var isCss = windowLocationHref.includes('.css');
var isSearch = windowLocationHref.includes('showresult.aspx');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
 ************************
 * 1. Content Editor *
 ************************
 */
if(isSitecore && !isEditMode && !isLoginPage && !isCss) {

  if(debug) { console.info("%c ✏️ Sitecore detected ", 'font-size:14px; background: #f33d35; color: white; border-radius:5px; padding 3px;'); }

  var script, link;

  /*
  * Code injection for multilist in a Bucket (BETA)
  */
  // script = document.createElement('script');
  // script.src = chrome.runtime.getURL("js/BucketList-min.js");
  // (document.head||document.documentElement).appendChild(script);
  // script.remove();

  //Add listener on scBucketListBox + scBucketListSelectedBox
  // target = document.querySelector( ".scBucketListBox" );
  // observer = new MutationObserver(function(mutations) {

  //   console.log(mutations);

  // });
        
  // //Observer options
  // if(target) {
  //   config = { attributes: false, childList: true, characterData: false, subtree: false };
  //   observer.observe(target, config);
  //   console.log(target);
  // }

  /*
  * Code injection for Translate mode
  */
  script = document.createElement('script');
  script.src = chrome.runtime.getURL("js/inject-min.js");
  (document.head||document.documentElement).appendChild(script);
  script.remove();

  /*
  * Fadein onload
  */
  link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href =  chrome.runtime.getURL("css/onload-min.css");
  document.getElementsByTagName("head")[0].appendChild(link);

  //Launchpad icon variables
  var launchpadPage = chrome.runtime.getURL("options.html");
  var launchpadIcon = chrome.runtime.getURL("images/icon.png");
  var launchpadGroupTitle = "Sitecore Author Toolbox";
  var launchpadTitle = "Options";
  var launchpadUrl = windowLocationHref;
  
  if(isDesktop) {

    if(debug) { console.info("====================> DESKTOP SHELL <===================="); }

    chrome.storage.sync.get(['feature_launchpad'], function(result) {
      
      if(result.feature_launchpad == undefined) { result.feature_launchpad = true; }

      if(result.feature_launchpad) {

        var html = '<a href="#" class="scStartMenuLeftOption" title="" onclick="window.location.href=\'' + launchpadPage + '?launchpad=true&url=' + launchpadUrl + '\'"><img src="' + launchpadIcon + '" class="scStartMenuLeftOptionIcon" alt="" border="0"><div class="scStartMenuLeftOptionDescription"><div class="scStartMenuLeftOptionDisplayName">' + launchpadGroupTitle + '</div><div class="scStartMenuLeftOptionTooltip">' + launchpadTitle + '</div></div></a>';
        
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

  } else if(isLaunchpad) {

    if(debug) { console.info("====================> LAUNCHPAD <===================="); }

    chrome.storage.sync.get(['feature_launchpad'], function(result) {

      if(result.feature_launchpad == undefined) { result.feature_launchpad = true; }

      if(result.feature_launchpad) {

      //Find last dom item
      var launchpadCol = document.querySelectorAll('.last');

      //get popup url
      var html = '<div class="sc-launchpad-group"><header class="sc-launchpad-group-title">' + launchpadGroupTitle + '</header><div class="sc-launchpad-group-row"><a href="#" onclick="window.location.href=\'' + launchpadPage + '?launchpad=true&url=' + launchpadUrl + '\'" class="sc-launchpad-item" title="' + launchpadTitle + '"><span class="icon"><img src="' + launchpadIcon + '" width="48" height="48" alt="' + launchpadTitle + '"></span><span class="sc-launchpad-text">' + launchpadTitle + '</span></a></div></div>';

      //Insert into launchpad
      launchpadCol[0].insertAdjacentHTML( 'afterend', html );

      }

    });

  } else if(isAdminCache) {

    if(debug) { console.info("====================> ADMIN CACHE <===================="); }

    // link = document.createElement("link");
    // link.type = "text/css";
    // link.rel = "stylesheet";
    // link.href =  chrome.runtime.getURL("css/tabulator_semantic-ui-min.css");
    // document.getElementsByTagName("head")[0].appendChild(link);

    // script = document.createElement('script');
    // script.src = chrome.runtime.getURL("js/tabulator-min.js");
    // (document.head||document.documentElement).appendChild(script);
    // script.remove();

    // script = document.createElement('script');
    // script.src = chrome.runtime.getURL("js/cache.js");
    // (document.head||document.documentElement).appendChild(script);
    // script.remove();

  }

  if(isSearch) {

    if(debug) { console.info("====================> INTERNAL SEARCH <===================="); }

    //Add listener on search result list
    target = document.querySelector( "#results" );
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
        var html = '<div class="BlogPostExtra BlogPostContent" style="padding: 5px 0 0px 78px; color: #4d82b8"><strong>Sitecore path:</strong> ' + getFullpath + ' <strong>Languages available:</strong> ' + getNumLanguages + '</div>';
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





  }


  if(isFieldEditor) {

    if(debug) { console.info("====================> FIELD EDITOR <===================="); }


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

              if(debug) { console.log('chars_'+event.target.id+" -> "+charsText); }

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

    if(scBucketListSelectedBox[1]) {
      scBucketListSelectedBox = scBucketListSelectedBox[1];
    } else {
      scBucketListSelectedBox = scBucketListSelectedBox[0];
    }

    if(scBucketListSelectedBox) {

      scBucketListSelectedBox.addEventListener("change", function() {

        var itemId = scBucketListSelectedBox.value;
        var itemName = scBucketListSelectedBox[scBucketListSelectedBox.selectedIndex].text;
        var iconError = chrome.runtime.getURL("images/rocket.png");
        var scMessageEditText = '<a class="scMessageBarOption" href="' + window.location.origin + '/sitecore/shell/Applications/Content%20Editor.aspx#' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
        var scMessageExperienceText = '<a class="scMessageBarOption" href="' + window.location.origin + '/?sc_mode=edit&sc_itemid=' + itemId + '" target="_blank"><u>Click here ⧉</u></a> ';
        var scMessageEdit = '<div id="Warnings" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + iconError + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">' + itemName + '</div><span id="Information" class="scMessageBarText"><span class="scMessageBarOptionBullet">' + scMessageEditText + '</span> to edit this item in <b>Content Editor</b>.</span><span id="Information" class="scMessageBarText"><br /><span class="scMessageBarOptionBulletXP">' + scMessageExperienceText + '</span> to edit this page in <b>Experience Editor</b>.</span></div></div>';

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

      if(result.feature_errors == undefined) { result.feature_errors = true; }

      //Variables
      var count = 0;
      var scErrors = document.getElementsByClassName("scValidationMarkerIcon");  
      var scEditorID = document.querySelector ("#MainPanel");
      var iconError = chrome.runtime.getURL("images/error.png");

      if(result.feature_errors) {

        //Prepare HTML
        var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">';

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
          var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">'
          
          for (let item of scErrors) {

              if( item.getAttribute("src") != '/sitecore/shell/themes/standard/images/bullet_square_yellow.png') {
                //If tabs, add a second event
                console.log(item);
                //var sectionTitle = document.querySelector("#FIELD47775058").closest("table").closest("td").closest("table").previousSibling.innerText
                //toggleSection(this,\'' + sectionTitle+ '\');
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

          if(debug) { console.log("!! Change !!"); }

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


  }

  if(isRichTextEditor || isHtmlEditor) {

    if(debug) { console.info("====================> RTE / HTML EDITOR <===================="); }

    chrome.storage.sync.get(['feature_rtecolor','feature_darkmode'], function(result) {

    if(result.feature_rtecolor == undefined) { result.feature_rtecolor = true; }
    if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }

      if(result.feature_rtecolor) {

        var contentIframe;
        var darkModeTheme = "default" ;

        //Which HTML editor
        if(isRichTextEditor) {

          contentIframe = document.querySelector("#Editor_contentIframe");

        } else if (isHtmlEditor) {

          contentIframe = document.querySelector("#ctl00_ctl00_ctl05_Html");
        }
        
        if(contentIframe) {

          //RTE Tabs
          if(isRichTextEditor) {
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
          if(result.feature_darkmode) {
            
            darkModeTheme = "ayu-dark";

            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href =  chrome.runtime.getURL("css/dark/ayu-dark.css");
            document.getElementsByTagName("head")[0].appendChild(link);
          }

          //Extra variables
          if(isRichTextEditor) {
            reTextArea.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />' );
            reTextArea.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scEditor" value="richTextEditor" />' );
          } else if (isHtmlEditor) {
            contentIframe.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scDarkMode" value="' + darkModeTheme + '" />' );
            contentIframe.insertAdjacentHTML( 'afterend', '<input type="hidden" class="scEditor" value="htmlEditor" />' );
          }

          /*
           * Codemirror librairires
           */
          script = document.createElement('script');
          script.src = chrome.runtime.getURL("js/bundle.js");
          (document.head||document.documentElement).appendChild(script);
          script.remove();

        }

    }

    });


  }

  if(isGalleryLanguage) {

    if(debug) { console.info("====================> LANGUAGES <===================="); }

    chrome.storage.sync.get(['feature_flags'], function(result) {

      if(result.feature_flags == undefined) { result.feature_flags = true; }

      if(result.feature_flags) {
        
      /*
       * Load Json data for languages
       */
      var rawFile = new XMLHttpRequest();
      var jsonData;
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", chrome.runtime.getURL("data/languages.json"), true);
      rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4 && rawFile.status == "200") {
             
              jsonData = JSON.parse(rawFile.responseText);
              //console.info("JSON "+jsonData);

              //Loop the languages table
              var isRegionFrame;
              var dom = document.getElementById("Languages");
              var div = dom.querySelectorAll('.scMenuPanelItem,.scMenuPanelItemSelected')
              var td;
              var divcount = 0;
              var tdcount = 0;
              var tdlanguage;
              var tdversion;
              var tdimage;
              var temp;
              var key;

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

                        for (key in jsonData) {
                          if (jsonData.hasOwnProperty(key)) {
                              if( tdlanguage[0].toUpperCase() == jsonData[key]["language"].toUpperCase()) {
                                
                                tdlanguage = jsonData[key]["flag"];

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
      }
      rawFile.send(null);

      }

    });

   
  } else if(isPublishWindow) {

    if(debug) { console.info("====================> PUBLISH WINDOW <===================="); } 

    chrome.storage.sync.get(['feature_flags'], function(result) {

      if(result.feature_flags == undefined) { result.feature_flags = true; }

      if(result.feature_flags) {
      
        var dom = document.getElementById("Languages");
        var label = dom.getElementsByTagName('label');
        var temp;
        var tdlanguage;
        var key;
        var scFlag;

        /*
         * Load Json data for languages
         */
        var rawFile = new XMLHttpRequest();
        var jsonData;
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", chrome.runtime.getURL("data/languages.json"), true);
        rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4 && rawFile.status == "200") {
            
            jsonData = JSON.parse(rawFile.responseText);

            for (let item of label) {

              temp = item.innerText;

              //Clean country name
              tdlanguage = cleanCountryName(temp);

              //Compare with Json data
              for (key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    if( tdlanguage == jsonData[key]["language"].toUpperCase()) {

                      tdlanguage = jsonData[key]["flag"];

                    }
                }
              }

              scFlag = tdlanguage.toLowerCase();
              scFlag = chrome.runtime.getURL("images/Flags/16x16/flag_" + scFlag + ".png")

              //Add Flag into label
              item.insertAdjacentHTML( 'beforebegin', ' <img id="scFlag" src="' + scFlag + '" style="display: inline; vertical-align: middle; padding-right: 2px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/16x16/flag_generic.png\';"/>' );

            }


          }
        }
        rawFile.send(null);

      }

    });

  }

  /*
   * Dark mode
   */
  //@media (prefers-color-scheme: dark) {
  chrome.storage.sync.get(['feature_darkmode'], function(result) {

    if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }

    if(result.feature_darkmode && !isExperienceEditor && !isAdminCache && !isSecurityWindow && !isContentHome && !isLoginPage && !isEditMode && !isUserManager && !isRules && !isAdmin) {

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
  //}

  /*
   * Auto Expand Tree (Inspired by https://github.com/alan-null/sc_ext)
   */
  chrome.storage.sync.get(['feature_autoexpand'], function(result) {

    if(result.feature_autoexpand == undefined) { result.feature_autoexpand = true; }
    
    if(result.feature_autoexpand) {

      //Content tree
      document.addEventListener('click', function (event) {

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
   * Chrome extention and JS Observers
   */

  //On change
  var MutationObserver = window.MutationObserver;

  var elementObserver = new MutationObserver(function(e) {

    if(debug) { console.info('%c *** Update UI *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;'); }

    /*
     * Open in Content Tree link (Beta)
     */  
    var scQuickInfo = document.querySelector ( ".scEditorHeaderQuickInfoInput" );

    if (scQuickInfo) {

      var windowLocationHref = window.location.href.toLowerCase();
      var sitecoreItemID = scQuickInfo.getAttribute("value");
      var scLanguage = document.getElementById("scLanguage").getAttribute("value").toLowerCase();
      
      if(document.querySelector ( ".scEditorHeaderVersionsVersion > span" )) {
        var scVersion = document.querySelector ( ".scEditorHeaderVersionsVersion > span" ).innerText;
      }

      var scEditorQuickInfo = document.querySelectorAll(".scEditorQuickInfo");
      var lastScEditorQuickInfo = scEditorQuickInfo[scEditorQuickInfo.length- 1];
      var countTab = scEditorQuickInfo.length;
      var scEditorTitle = document.getElementsByClassName("scEditorHeaderTitle");

      var tabSitecoreItemID = document.querySelectorAll(".scEditorHeaderQuickInfoInput");
      var lastTabSitecoreItemID = tabSitecoreItemID[tabSitecoreItemID.length- 2].getAttribute("value");

      var hasRedirection = windowLocationHref.includes("&ro=");
      var hasRedirectionOther = windowLocationHref.includes("&sc_ce_uri=");

      //Add hash to URL
      if(!hasRedirection && !hasRedirectionOther) {
        window.location.hash = sitecoreItemID;
      }

      if(debug) { console.info('%c - Tabs opened: ' + countTab + ' ', 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;'); }


      if(countTab >1 && !document.getElementById("showInContentTree"+(countTab)+"")) {
        //Add text after title
        var url = window.location.href;
        url = url.split("#");
        var javascript = 'scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ',language=' + scLanguage + ',version=1)");';
        var href = url[0]+'&reload#'+lastTabSitecoreItemID;
        scEditorTitle[countTab-1].insertAdjacentHTML( 'afterend', '[<a id="showInContentTree' + countTab + '" href="" onclick="javascript:window.location.href=\'' + href + '\'; return false;" />Show in content tree</a>]' );
      }
            
      //Set ItemID (Storage)
      chrome.storage.sync.set({"scItemID": sitecoreItemID}, function() {
        if(debug) { console.info("%c [Storage Set] Item : " + sitecoreItemID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
      });
      chrome.storage.sync.set({"scLanguage": scLanguage}, function() {
        if(debug) { console.info("%c [Storage Set] Language : " + scLanguage + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
      });
      chrome.storage.sync.set({"scVersion": scVersion}, function() {
        if(debug) { console.info("%c [Storage Set] Version : " + scVersion + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
      });

      //Reload language
      //scForm.invoke("item:load(id={93C2EE9B-9574-4B40-BC0D-6CFEE5104335},language=ja-JP,version=0)")

    }


    e.forEach(function(e) {
      "attributes" == e.type && sitecoreAuthorToolbox();
    });
  });

  //Reload
  var element = document.getElementById("scLanguage");

  if(element){
    
    if(debug) { console.info('%c *** Reload *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;'); }

    //Sitecore Variables
    windowLocationHref = window.location.href.toLowerCase();
    var scLanguage = element.getAttribute("value").toLowerCase();
    var hash = window.location.hash.substr(1);
    var hasRedirection = windowLocationHref.includes("&ro=");
    var hasRedirectionOther = windowLocationHref.includes("&sc_ce_uri=");

    //Extension ID
    var extensionId = chrome.runtime.getURL("something");
    extensionId = extensionId.split("chrome-extension://");
    extensionId = extensionId[1].split("/something");
    extensionId = extensionId[0];

    document.querySelector('body').insertAdjacentHTML( 'beforeend', '<input type="hidden" class="extensionId" value="' + extensionId + '" />' );


    /*
     * 14. Show informative Snackbar
     */
    var snackbarVersion = 2;
    var snackbarHtml = "Tab sections option is enabled. If you want to switch back to normal mode, clic Edit button.";

    chrome.storage.sync.get(['hideSnackbar','feature_cetabs'], function(result) {

      if (!chrome.runtime.error && result.hideSnackbar != snackbarVersion && result.feature_cetabs != false) {

        // console.log("Show Snackbar "+snackbarVersion);

        //Show Snackbar
        var html='<div class="snackbar"> ' + snackbarHtml + ' <button onclick="window.open(\' ' + launchpadPage + '?launchpad=true&url= ' + windowLocationHref + ' &tabs=0 \');">EDIT</button><button id="sbDismiss">DISMISS</button></div>';
        document.querySelector('body').insertAdjacentHTML( 'beforeend', html );


          //Add listener on click #sbDismiss
          document.querySelector("#sbDismiss").addEventListener("click", function(){     
            chrome.runtime.sendMessage({greeting: "hide_snackbar", version: snackbarVersion}, function(response) {
              if(response.farewell != null) {
                console.log(response);
                document.querySelector('.snackbar').setAttribute('style','display: none');

                //For debugging, You can  clean up this storage value by running this command in the console
                //chrome.storage.sync.remove("hideSnackbar", function() { chrome.storage.sync.get(function(e){console.log(e)}) });
              }
            });
          });
      }

    });


    if(!hasRedirection && !hasRedirectionOther) {

        /*
         * 9. Resume from where you left or from hash value
         */
        chrome.storage.sync.get(['scItemID','scLanguage','scVersion','feature_reloadnode'], function(result) {
          
          if (!chrome.runtime.error && result.scItemID != undefined) {

            if(result.feature_reloadnode == undefined) { result.feature_reloadnode = true; }

            if(hash!="") {

              //TODO: bug if stored version if > 1 and reloaded page with hash version 1
              if(result.scItemID!=hash) {
                result.scVersion = 1;
              }

              result.scItemID = hash;
              if(debug) { console.info('%c - Sitecore Hash : '+ hash + ' ', 'font-size:12px; background: #7b3090; color: white; border-radius:5px; padding 3px;'); }

            }

            if(result.scItemID && result.feature_reloadnode == true) {

              var actualCode = `scForm.invoke("item:load(id=` + result.scItemID + `,language=` + result.scLanguage + `,version=` + result.scVersion + `)");`;
              script = document.createElement('script');
              script.textContent = actualCode;
              (document.head||document.documentElement).appendChild(script);
              script.remove();

              if(debug) { console.info("%c [Storage Get] Item : "+ result.scItemID + " ", 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
              if(debug) { console.info("%c [Storage Get] Language : "+ result.scLanguage + " ", 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
              if(debug) { console.info("%c [Storage Get] Version : "+ result.scVersion + " ", 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }

            }

          }

        });

    }

    sitecoreAuthorToolbox();

    elementObserver.observe(element, { attributes: !0 });

  }

  /*
   * 10. Publish notification
   */
  var elementObserver2 = new MutationObserver(function(e) {

    chrome.storage.sync.get(['feature_notification'], function(result) {

      if(result.feature_notification == undefined) { result.feature_notification = true; }

      if(result.feature_notification) {
        var notificationTitle = element2.getElementsByClassName("DialogHeader").item(0).innerHTML;
        var notificationSubTitle = element2.getElementsByClassName("sc-text-largevalue").item(0).innerHTML;
        var notificationBody = element2.getElementsByClassName("scFieldLabel").item(0).innerHTML
        sendNotification(notificationSubTitle,notificationBody);
      }

    });

    if(debug) { console.info('%c *** Publish Done *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;'); }
     
  });

  //On open Publish window
  var element2 = document.getElementById("LastPage");

  if(element2){
    
    if(debug) { console.info('%c *** Open Dialog *** ', 'font-size:14px; background: #ffce42; color: black; border-radius:5px; padding 3px;'); }
    //sitecoreAuthorToolbox();
    elementObserver2.observe(element2, { attributes: !0 });

  }


}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
 ************************
 * 2. Experience Editor *
 ************************
 */
if(isEditMode && !isLoginPage || isPreviewMode && !isLoginPage) {

  if(debug) { console.info("%c 🎨 Experience Editor detected ", 'font-size:14px; background: #f16100; color: black; border-radius:5px; padding 3px;'); }


  /*
   * Fadein onload
   */
  link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href =  chrome.runtime.getURL("css/onload-min.css");
  document.getElementsByTagName("head")[0].appendChild(link);

  /*
   * Experience Editor Reset
   */
  link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href =  chrome.runtime.getURL("css/reset-min.css");
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
   * Code injection for Translate mode
   */
  script = document.createElement('script');
  script.src = chrome.runtime.getURL("js/inject-min.js");
  (document.head||document.documentElement).appendChild(script);
  script.remove();

  /**
   * Flags in language menu
   */
  if(isGalleryLanguageExpEd) {
    
    if(debug) { console.info("====================> LANGUAGES IN EXPERIENCE EDITOR <===================="); }

    chrome.storage.sync.get(['feature_flags'], function(result) {

      if(result.feature_flags == undefined) { result.feature_flags = true; }

      if(result.feature_flags) {

        /*
         * Load Json data for languages
         */
        var rawFile = new XMLHttpRequest();
        var jsonData;
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", chrome.runtime.getURL("data/languages.json"), true);
        rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4 && rawFile.status == "200") {

            jsonData = JSON.parse(rawFile.responseText);
            //console.info("JSON "+jsonData);

            //Loop the languages table
            var isRegionFrame;
            var dom = document.querySelector('.sc-gallery-content');
            var div = dom.querySelectorAll('.sc-gallery-option-content,.sc-gallery-option-content-active');
            var td;
            var divcount = 0;
            var tdcount = 0;
            var tdDiv;
            var tdlanguage;
            var tdversion;
            var tdimage;
            var temp;
            var key;

            //Loop results, extract divs infos
            //sc-gallery-option-content-header > span (country)
            //sc-gallery-option-content-description > span (version)

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
              for (key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    if( tdlanguage == jsonData[key]["language"].toUpperCase()) {

                      tdlanguage = jsonData[key]["flag"];

                    }
                }
              }

              tdDiv.setAttribute( 'style', 'padding-left:48px; background-image: url(' + chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png") + '); background-repeat: no-repeat; background-position: 5px;' );

            }

          }
        }
        rawFile.send(null);
      }



    });


  } 

  /**
   * Flags in Ribbon
   */
  if(isRibbon) {

    if(debug) { console.info("====================> RIBBON <===================="); }
    
    var scRibbonFlagIcons = document.querySelectorAll( ".flag_generic_24" );
    var tdlanguage;
    var temp;
    var key;
    
    /*
     * Load Json data for languages
     */
    var rawFile = new XMLHttpRequest();
    var jsonData;
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", chrome.runtime.getURL("data/languages.json"), true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {

        jsonData = JSON.parse(rawFile.responseText);


        //loop and check language
        for(var flag of scRibbonFlagIcons) {

          tdlanguage = flag.nextSibling.innerText;

          //Clean country name
          tdlanguage = cleanCountryName(tdlanguage);

          //Compare with Json data
          for (key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                if( tdlanguage == jsonData[key]["language"].toUpperCase()) {

                  tdlanguage = jsonData[key]["flag"];

                }
            }
          }

          flag.setAttribute( 'style', 'background-image: url(' + chrome.runtime.getURL("images/Flags/24x24/flag_" + tdlanguage + ".png") + '); background-repeat: no-repeat; background-position: top left;' );

        }

      }
    }
    rawFile.send(null);

    //Store Sitecore Item ID
    var dataItemId = document.querySelector('[data-sc-itemid]');
   
    if(dataItemId) {

      var sitecoreItemID = decodeURI(dataItemId.getAttribute('data-sc-itemid'));
      //Set ItemID (Storage)
      chrome.storage.sync.set({"scItemID": sitecoreItemID}, function() {
        if(debug) { console.info("%c [Storage Set] Item : " + sitecoreItemID + ' ', 'font-size:12px; background: #cdc4ba; color: black; border-radius:5px; padding 3px;'); }
      });

    }

  }

  /**
   * Tooltip bar
   */  
  var observer = new MutationObserver(function(mutations) {

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

  var target = document.querySelector( ".scChromeControls" );

  //Observer
  if(target) {
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
  }

  /*
   * Dark mode + Toggle Ribbon
   */
  //@media (prefers-color-scheme: dark) {
  chrome.storage.sync.get(['feature_darkmode','feature_toggleribbon'], function(result) {

    //Variables
    var pagemodeEdit = document.querySelector(".pagemode-edit");
    if(!pagemodeEdit) { pagemodeEdit = document.querySelector(".on-page-editor"); }
    if(!pagemodeEdit) { pagemodeEdit = document.querySelector(".experience-editor"); }
    windowLocationHref = window.location.href.toLowerCase();
    var isQuery = windowLocationHref.includes('?');
    var isEditMode = windowLocationHref.includes('sc_mode=edit');
    var isPreviewMode = windowLocationHref.includes('sc_mode=preview');
    var scCrossPiece = document.querySelector("#scCrossPiece");
    var ribbon = document.querySelector('#scWebEditRibbon');
    var scMessageBar = document.querySelector('.sc-messageBar');
    let tabColor;

    if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }
    if(result.feature_toggleribbon == undefined) { result.feature_toggleribbon = true; }

    if(result.feature_darkmode && isRibbon || result.feature_darkmode && isDialog || result.feature_darkmode && isInsertPage) {

      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href =  chrome.runtime.getURL("css/dark/experience-min.css");
      document.getElementsByTagName("head")[0].appendChild(link);

    }

    if(result.feature_darkmode) {
      tabColor = "dark";
    }

    /*
     * Show/Hide EE ribbon
     */

    //TODO: calculate the height of NotificationBar and apply a negative topOffeset to the scExpTab

    var observer = new MutationObserver(function(mutations) {

      for(var mutation of mutations) {
        for(var addedNode of mutation.addedNodes) {
          if(addedNode.id == "scCrossPiece") {
            var html = '<div class="scExpTab '+ tabColor +'"><span class="tabHandle"></span><span class="tabText" onclick="toggleRibbon()">▲ Hide<span></div>';
            addedNode.insertAdjacentHTML( 'afterend', html );
            observer.disconnect();
            startDrag();
          }
        }
      }

    });
    var target = document.body;

    //Observer
    if(result.feature_toggleribbon && target) {
      var config = { attributes: false, childList: true, characterData: false };
      observer.observe(target, config);
    }

    /*
     * Close Edit Mode button
     */
    var iconEE =  chrome.runtime.getURL("images/sat.png");

    if(isEditMode) {
      windowLocationHref = windowLocationHref.replace("sc_mode=edit","sc_mode=normal");
    } else if(isPreviewMode) {
      windowLocationHref = windowLocationHref.replace("sc_mode=preview","sc_mode=normal");
    } else if(isQuery) {
      windowLocationHref = windowLocationHref+"&sc_mode=normal";
    } else {
      windowLocationHref = windowLocationHref+"?sc_mode=normal";
    }

    if(result.feature_toggleribbon && !isRibbon) {
      var html = '<div class="scNormalModeTab '+ tabColor +'"><span class="t-right t-sm" data-tooltip="Open in Normal Mode"><a href="' + windowLocationHref + '"><img src="' + iconEE + '"/></a></span></div>';
      pagemodeEdit.insertAdjacentHTML( 'afterend', html );
    }

    /*
     * Go to Content Editor
     */
    var iconCE =  chrome.runtime.getURL("images/ce.png");

    if(result.feature_toggleribbon && !isRibbon) {
      html = '<div class="scContentEditorTab '+ tabColor +'"><span class="t-right t-sm" data-tooltip="Open in Content Editor"><a href="' + window.location.origin + '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1"><img src="' + iconCE + '"/></a></span></div>';
      pagemodeEdit.insertAdjacentHTML( 'afterend', html );
    }

  });
  //}

}

