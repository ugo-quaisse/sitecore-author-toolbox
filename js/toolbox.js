/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

var debug = true;

/*
 * Helper functions
 */
function stripHtml(html){
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

function sendNotification(scTitle, scBody) {
  new Notification(scTitle, {
      body: scBody,
      icon: chrome.runtime.getURL("images/icon.png")
  });
}

/*
 * Code injection for multilist in a Bucket (BETA)
 */
var script = document.createElement('script');
script.src = chrome.runtime.getURL("js/BucketList.js");
(document.head||document.documentElement).appendChild(script);
script.remove();

/*
 * Fadein onload
 */
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href =  chrome.runtime.getURL("css/onload-min.css");
document.getElementsByTagName("head")[0].appendChild(link);

/*
 * Dectect which URL/Frame is loading the script? (Languages, Favorites, etc...)
 */
if(debug) { console.info("***** URL loaded ***** "+window.location); }

var isGalleryLanguage = window.location.href.includes('Gallery.Language');
var isGalleryLanguageExpEd = window.location.href.includes('SelectLanguageGallery');
var isGalleryFavorites = window.location.href.includes('Gallery.Favorites');
var isAdminCache = window.location.href.includes('/admin/cache.aspx');
var isMediaBrowser = window.location.href.includes('Sitecore.Shell.Applications.Media.MediaBrowser');
var isPublishWindow = window.location.href.includes('/shell/Applications/Publish.aspx');
var isSecurityWindow = window.location.href.includes('/shell/Applications/Security/');
var isExperienceEditor = window.location.href.includes('/Applications/ExperienceEditor/');
var isContentHome = window.location.href.includes('/content/home');
var isLoginPage = window.location.href.includes('sitecore/login');
var isLaunchpad = window.location.href.includes('/client/Applications/Launchpad');
var isDesktop = window.location.href.includes('/shell/default.aspx');
var isRichTextEditor = window.location.href.includes('/Controls/Rich%20Text%20Editor/');
var isFieldEditor = window.location.href.includes('field%20editor.aspx');
var isModalDialogs = window.location.href.includes('JqueryModalDialogs');
//var isEditMode = document.querySelector(".pagemode-edit");
var isEditMode = window.location.href.includes('sc_mode=edit');

var launchpadPage = chrome.runtime.getURL("options.html");
var launchpadIcon = chrome.runtime.getURL("images/icon.png");
var launchpadGroupTitle = "Sitecore Author Toolbox";
var launchpadTitle = "Options";
var launchpadUrl = window.location.href;

if(isDesktop) {

  if(debug) { console.info("====================> DESKTOP <===================="); }

  var html = '<a href="#" class="scStartMenuLeftOption" title="" onclick="window.location.href=\'' + launchpadPage + '?launchpad=true&url=' + launchpadUrl + '\'"><img src="' + launchpadIcon + '" class="scStartMenuLeftOptionIcon" alt="" border="0"><div class="scStartMenuLeftOptionDescription"><div class="scStartMenuLeftOptionDisplayName">' + launchpadGroupTitle + '</div><div class="scStartMenuLeftOptionTooltip">' + launchpadTitle + '</div></div></a>';
  
  // //Find last dom item
  var desktopOptionMenu = document.querySelectorAll('.scStartMenuLeftOption');
  // Loop and fin title = "Command line interface to manage content."
  for (let item of desktopOptionMenu) {
    if(item.getAttribute("title") == "Install and maintain apps.") {
      item.insertAdjacentHTML( 'afterend', html );
    }
  }

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

}

if(isEditMode) {

  if(debug) { console.info("====================> EDIT MODE <===================="); }

  //Listenner
  var target = document.querySelector( ".scChromeControls" );
  var observer = new MutationObserver(function(mutations) {

    //Loop .scChromeToolbar
    var scChromeToolbar = document.querySelectorAll( ".scChromeToolbar" );

    //Find scChromeCommand
    for(var controls of scChromeToolbar) {
          controls.setAttribute('style', 'margin-left:50px');
          //Get buttons
          var scChromeCommand = controls.querySelectorAll( ".scChromeCommand" );
          for(var command of scChromeCommand) {
            var title = command.getAttribute("title");          
            command.setAttribute('style', 'z-index:auto');
            
            if(title != null) {
              //Add data
              command.setAttribute('data-tooltip', title);
              //Add classes
              command.classList.add("t-bottom");
              command.classList.add("t-sm");
              //Remove title
              command.removeAttribute("title");
            }
          }
    }

  });
  var config = { attributes: true, childList: true, characterData: true };
  observer.observe(target, config);


} else if(isFieldEditor) {

  if(debug) { console.info("====================> FIELD EDITOR <===================="); }

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
        }

        if(debug) { console.log("!! Change !!"); }

        //TODO: Show an alert when the popup is closed so the User knwo what to do
        // var saveButton = document.querySelector(".scButtonPrimary");
        // saveButton.onclick = function() { alert('blah'); };


      });
      // configuration of the observer:
      var config = { attributes: true, childList: true, characterData: true };
      // pass in the target node, as well as the observer options
      observer.observe(target, config);



    }
  });


} else if(isGalleryLanguage) {

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
                
                //console.log("---> LANGUAGE DIV #"+divcount);
                tdcount = 0;
                td = item.getElementsByTagName("td");
                
                for (let item2 of td) {      
                  
                  if(tdcount==0) {
                    
                    tdimage = item2.getElementsByTagName("img");
                    //console.log(tdimage);
                  
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
                              //console.log(tdlanguage);

                            }
                        }
                      }

                    } else {

                      //Clean country name
                      temp = tdlanguage.split(" (");
                      if(temp[1] == undefined) { temp = temp[0]; } else { temp = temp[1]; }
                      temp = temp.split(")");
                      temp = temp[0].split(" :");
                      if(temp[0].includes(', ')) { temp = temp[0].split(", "); temp[0] = temp[1]; temp[0] = temp[0].replace(" ", "_"); }
                      temp = temp[0].replace(" ", "_");
                      temp = temp.toUpperCase();
                      tdlanguage = temp.replace("TRADITIONAL,_","");
                      tdlanguage = tdlanguage.replace("SIMPLIFIED,_","");

                      //Replace non-standard country name
                      tdlanguage = tdlanguage.replace("U.A.E.","UNITED_ARAB_EMIRATES");
                      tdlanguage = tdlanguage.replace("KOREA","SOUTH_KOREA");
                      tdlanguage = tdlanguage.replace("UNITED_STATES","USA");
                      tdlanguage = tdlanguage.replace("UNITED_KINGDOM","GREAT_BRITAIN");
                      tdlanguage = tdlanguage.replace("ENGLISH","GREAT_BRITAIN");
                      
                      //console.log(tdlanguage);

                    }
                    
                    //Now replace images src and add an image fallback if doesn't exist
                    tdlanguage = tdlanguage.toLowerCase();
                    tdimage[0].onerror = function() { this.src = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png"); }
                    tdimage[0].src = chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");
                    //console.log(tdlanguage);
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

 
} else if(isGalleryLanguageExpEd) {
  
  if(debug) { console.info("====================> LANGUAGES IN EXPERIENCE EDITOR <===================="); }

  chrome.storage.sync.get(['feature_flags'], function(result) {

    if(result.feature_flags == undefined) { result.feature_flags = true; }

    if(result.feature_flags) {
      console.log("GO");
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
            tdlanguage = item.querySelector('.sc-gallery-option-content-header > span');
            tdversion = item.querySelector('.sc-gallery-option-content-description > span');

            temp = tdversion.innerHTML.split(" ");
            //Check version
            if(temp[0]!="0") {
              tdversion.setAttribute( 'style', 'background-color: yellow; display: initial; padding: 0px 3px; color: #000000 !important' );
            }

            //Clean country name
            temp = tdlanguage.innerHTML.split(" :");
            temp = temp[0].split(" (");
            if(temp[1] == undefined) { temp = temp[0]; } else { temp = temp[1]; }
            temp = temp.split(")");
            if(temp[0].includes(', ')) { temp = temp[0].split(", "); temp[0] = temp[1]; temp[0] = temp[0].replace(" ", "_"); }
            temp = temp[0].replace(" ", "_");
            temp = temp.toUpperCase();
            tdlanguage = temp.replace("TRADITIONAL,_","");
            tdlanguage = tdlanguage.replace("SIMPLIFIED,_","");

            //Replace non-standard country name
            tdlanguage = tdlanguage.replace("U.A.E.","UNITED_ARAB_EMIRATES");
            tdlanguage = tdlanguage.replace("KOREA","SOUTH_KOREA");
            tdlanguage = tdlanguage.replace("UNITED_STATES","USA");
            tdlanguage = tdlanguage.replace("UNITED_KINGDOM","GREAT_BRITAIN");
            tdlanguage = tdlanguage.replace("ENGLISH","GREAT_BRITAIN");

            //Compare with Json data
            for (key in jsonData) {
              if (jsonData.hasOwnProperty(key)) {
                  if( tdlanguage == jsonData[key]["language"].toUpperCase()) {

                    tdlanguage = jsonData[key]["flag"];

                  }
              }
            }

            console.log(tdlanguage);

            //Now replace images src and add an image fallback if doesn't exist
            //tdlanguage = tdlanguage.toLowerCase();
            //tdimage[0].onerror = function() { this.src = chrome.runtime.getURL("images/Flags/32x32/flag_generic.png"); }
            //tdimage[0].src = chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png");

            tdDiv.setAttribute( 'style', 'padding-left:48px; background-image: url(' + chrome.runtime.getURL("images/Flags/32x32/flag_" + tdlanguage + ".png") + '); background-repeat: no-repeat; background-position: 5px;' );

            //console.log(tdlanguage);
            //console.log(tdversion);
          }

        }
      }
      rawFile.send(null);
    }

  });


} else if(isPublishWindow) {

  if(debug) { console.info("====================> PUBLISH WINDOW <===================="); }

    var dom = document.getElementById("Languages");
    var label = dom.getElementsByTagName('label');

    for (let item of label) {

      //Add Flag into label
      //item.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="-/icon/Flags/16x16/flag_CHINA.png" style="display: inline; vertical-align: text-bottom; padding-right: 2px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/16x16/flag_generic.png\';"/>' );

    }


} else if(isGalleryFavorites) {

  if(debug) { console.info("====================> FAVORITES <===================="); }

} else if(isMediaBrowser) {

  if(debug) { console.info("====================> MEDIA BROWSER <===================="); }

} else if(isAdminCache) {

  if(debug) { console.info("====================> ADMIN CACHE <===================="); }

}

/*
 * Dark mode
 */
chrome.storage.sync.get(['feature_darkmode'], function(result) {

  if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }

  if(result.feature_darkmode && !isExperienceEditor && !isAdminCache && !isSecurityWindow && !isContentHome && !isLoginPage && !isEditMode) {

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
 * Extension main execution code
 */
function _addEnvironmentLabel() {

  //App settings 
  var count = 0;
  var icon = chrome.runtime.getURL("images/rocket.png");
  var iconError = chrome.runtime.getURL("images/error.png");
  var iconEdit = chrome.runtime.getURL("images/edit.png");
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
  //Sitecore Active Tab
  let scActiveTab = document.querySelector ( ".scEditorTabHeaderActive" );
  //Sitecore Normal Tab
  let scNormalTab = document.querySelectorAll ( ".scRibbonEditorTabNormal" );
  //Sitecore errors
  var scErrors = document.getElementsByClassName("scValidationMarkerIcon");
  //Sitecore Editor Frames
  let scEditorFrames = document.querySelector ( "#EditorFrames" );
  //Sitecore Editor Sections
  let scEditorSections = document.querySelector ( ".scEditorSections" );
  //Sitecore Search Panel
  let scSearchPanel = document.getElementById ( "SearchPanel" );
  //Sitecore Content Tree
  let scContentTree= document.getElementById ( "ContentTreeHolder" );

  //Language name in menu
  var scEditorHeaderVersionsLanguage = document.getElementsByClassName("scEditorHeaderVersionsLanguage");
  if(scEditorHeaderVersionsLanguage[0]) {
    var scLanguageTxtLong = scEditorHeaderVersionsLanguage[0].getAttribute("title");
    var scLanguageTxtShort = stripHtml(scEditorHeaderVersionsLanguage[0].innerHTML);
  }

  if (scQuickInfo) {

    /*
    * 1. Display URLs
    */

    //Sitecore item properties
    var temp = document.getElementsByClassName("scEditorHeaderQuickInfoInput");  
    var sitecoreItemID = temp[0].getAttribute("value");
    var sitecoreItemPath = temp[1].getAttribute("value");
    var sitecoreItemPathOriginal = sitecoreItemPath;
    var sitecoreData = false;
    sitecoreItemPath = sitecoreItemPath.split("/Home/");
    var sitecoreSite = sitecoreItemPath[0];
    sitecoreSite = sitecoreSite.split("/");
    sitecoreSite = sitecoreSite.slice(-1)[0]

    //Check if item is data source
    temp = sitecoreItemPathOriginal.split("/");
    if(temp[temp.length-1] == 'Data'){
      sitecoreData = true;
    }

    //Sitecore variable
    var scLanguage = document.getElementById("scLanguage").getAttribute("value").toLowerCase();
    var scUrl = window.location.origin + '/?sc_itemid=' + sitecoreItemID + '&sc_mode=normal&sc_lang=' + scLanguage;

    //Sitecore language (text)
    var isNotRegion = scLanguageTxtShort.includes('(');
    var scFlag;  

    //Generating Live URLs
    if (sitecoreItemPath[1]!=undefined) {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/" + sitecoreItemPath[1]+ "?sc_site=" + sitecoreSite + "&sc_mode=normal").toLowerCase();
    } else {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/?sc_site=" + sitecoreSite).toLowerCase();
    }

    //Check if item under data source (=component)
    var isDataSource = sitecoreItemPath.includes('/data/');

    if(!sitecoreData && sitecoreItemPath != encodeURI(window.location.origin + "/" + scLanguage + "/"+ "?sc_site=" + sitecoreSite).toLowerCase() && !isDataSource) {

      
      chrome.storage.sync.get(['feature_urls'], function(result) {

      if(result.feature_urls == undefined) { result.feature_urls = true; }
        
        //If not added yet
        if(!document.getElementById("scMessageBarUrl") && result.feature_urls) {
          //Prepare HTML (scInformation scWarning scError)
          var scMessage = '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Sitecore Live URL</div><div class="scMessageBarText">If you want to preview this page in <b>' + scLanguageTxtLong + '</b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="' + sitecoreItemPath + '" target="_blank" class="scMessageBarOption">Open this link</a> or try <a href="' + scUrl + '" target="_blank" class="scMessageBarOption">this alternative link</a></li></ul></div></div>'

          //Insert message bar into Sitecore Content Editor
          scEditorID.insertAdjacentHTML( 'afterend', scMessage );
        }

      });

    }

    if(isDataSource) {

      sitecoreItemPath = sitecoreItemPath.split("/data/");

      
      chrome.storage.sync.get(['feature_urls'], function(result) {

        if(result.feature_urls == undefined) { result.feature_urls = true; }

        //If not added yet
        if(!document.getElementById("scMessageBarInfo") && result.feature_urls) {
          //Prepare HTML (scInformation scWarning scError scOrange scGray scGreen)
          var scMessage = '<div id="scMessageBarInfo" class="scMessageBar scInformation"><div class="scMessageBarIcon" style="background-image:url(' + iconEdit + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">You are editing a data source...</div><div class="scMessageBarText">To see it, you need to add/edit it to your page via the</b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="' + sitecoreItemPath[0] + '?sc_mode=edit" target="_blank" class="scMessageBarOption">Experience Editor</a></li></ul></div></div>'

          //Insert message bar into Sitecore Content Editor
          scEditorID.insertAdjacentHTML( 'afterend', scMessage );
        }

      });

    }


    /*
     * 2. Insert Flag
     */

    chrome.storage.sync.get(['feature_flags'], function(result) {

      if(result.feature_flags == undefined) { result.feature_flags = true; }

      if(isNotRegion) {

        //Clean country name
        temp = scLanguageTxtShort.split(" (");
        if(temp[1] == undefined) { temp = temp[0]; } else { temp = temp[1]; }
        temp = temp.split(")");
        temp = temp[0].split(" :");
        if(temp[0].includes(', ')) { temp = temp[0].split(", "); temp[0] = temp[1]; temp[0] = temp[0].replace(" ", "_"); }
        temp = temp[0].replace(" ", "_");
        temp = temp.toUpperCase();
        scFlag = temp.replace("TRADITIONAL,_","");
        scFlag = scFlag.replace("SIMPLIFIED,_","");

        //Replace non-standard country name
        scFlag = scFlag.replace("U.A.E.","UNITED_ARAB_EMIRATES");
        scFlag = scFlag.replace("KOREA","SOUTH_KOREA");
        scFlag = scFlag.replace("UNITED_STATES","USA");
        scFlag = scFlag.replace("UNITED_KINGDOM","GREAT_BRITAIN");
        scFlag = scFlag.replace("ENGLISH","GREAT_BRITAIN");

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
                      if (data.hasOwnProperty(key)) {
                          if( scLanguageTxtShort.toUpperCase() == data[key]["language"].toUpperCase()) {
                            
                            scFlag = data[key]["flag"];
                            scFlag = scFlag.toLowerCase();
                            scFlag = chrome.runtime.getURL("images/Flags/32x32/flag_" + scFlag + ".png")


                            if (debug) { console.log("Flag:" + scFlag); }

                            //Insert Flag into Active Tab
                            if(!document.getElementById("scFlag") && result.feature_flags && scFlag) {
                              scActiveTab.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="' + scFlag +'" style="width: 20px; vertical-align: middle; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + iconFlagGeneric + '\';"/>' );
                            }

                            if(!document.getElementById("scFlagMenu") && result.feature_flags && scFlag) {
                            //Insert Flag into Sitecore Language selector
                            scLanguageMenu.insertAdjacentHTML( 'afterbegin', '<img id="scFlagMenu" src="' + scFlag +'" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + iconFlagGeneric + '\';"/>' );
                            }
                          }
                          //console.log(key + " = " + data[key]["language"] + " : " + data[key]["flag"]);
                      }
                  } 

              }
          }
          rawFile.send(null);
        }

      }      


    });
    
  } else {

    /*
     * If Title bar and Quick info section disabled scEditorSections
     */
    if(!document.getElementById("scMessageBarUrl") && scEditorSections) {
      //Prepare HTML (scInformation scWarning scError)
      var scMessage = '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Oh snap! 😭😭😭</div><div class="scMessageBarText">To fully enjoy Sitecore Author Toolbox, please enable <b>Title bar</b> and <b>Quick info section</b> under <b>Application Options</b>.</div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="" onclick="javascript:return scForm.postEvent(this,event,\'shell:useroptions\')" class="scMessageBarOption">Open Application Options</a>.</li></ul></div></div>'

      //Insert message bar into Sitecore Content Editor
      scEditorSections.insertAdjacentHTML( 'afterbegin', scMessage );
    }

  }

  /*
   * Right to left editor mode
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

        if(debug) { console.log("RTE:" + scFlag); }
      } else {
        //LTR
        link.href =  chrome.runtime.getURL("css/ltr-min.css");
       
        iframes = document.getElementsByClassName('scContentControlHtml');
        for (let iframe of iframes) {
          iframe.onload= function() { iframe.contentWindow.document.getElementById('ContentWrapper').style.direction = "LTR"; };
        }

        if(debug) { console.log("LTR:" + scFlag); }
      }
      document.getElementsByTagName("head")[0].appendChild(link);
    }

  });

  /*
   * 3. Display Grouped Errors
   */
  chrome.storage.sync.get(['feature_errors'], function(result) {

    if(result.feature_errors == undefined) { result.feature_errors = true; }

    if(scErrors[0]!=undefined && result.feature_errors) {
      
      count = 0;

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
        }

        if(debug) { console.log("Changement: "+document.getElementsByClassName("scValidatorPanel")); }


      });
      // configuration of the observer:
      var config = { attributes: true, childList: true, characterData: true };
      // pass in the target node, as well as the observer options
      observer.observe(target, config);

    }

  });


  /*
   * 4. Add native Drag and Drop
   */
  //Iframe variables
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
          var scMediaID = scIframeSrc[0];

          //Prepare HTML
          var scUploadMediaUrl = '/sitecore/client/Applications/Dialogs/UploadMediaDialog?fo=sitecore://master/{' + scMediaID + '}';
          var scUploadMedia = '<iframe id="sitecorAuthorToolbox" class="sitecorAuthorToolbox" src="' + scUploadMediaUrl + '" style="width:100%; height:500px; margin-top: -60px; resize: vertical;"></iframe>';
          scIframeMedia.setAttribute("style", "margin-top: -30px;");
          
          //Check if Drag and Drop IFrame already exists in DOM
          var scUploadDragDrop = document.getElementById("sitecorAuthorToolbox");
          if(scUploadDragDrop){
            //Delete existing Drag and Drop iFrame
            scUploadDragDrop.remove();
            if(debug) { console.info("Remove iFrame from DOM"); }
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
          if(debug) { console.info("Remove iFrame from DOM (no folder)"); }
        }

      }

    });

  }


  /*
   * 5. Desktop notificaitons (Publish)
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
   * 6. My Shortcut
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

  if (debug === true) {
    console.info("Item ID: " + sitecoreItemID);
    console.info("Language: " + scLanguage);
    console.info("Version: TODO");
  }

}
//End


/*
 * Chrome extention and JS Observers
 */
//On change
var MutationObserver = window.MutationObserver;

var elementObserver = new MutationObserver(function(e) {
  if(debug) { console.info('**Update UI**'); }

  /*
   * Open in Content Tree link (Beta)
   */
  
  var scQuickInfo = document.querySelector ( ".scEditorHeaderQuickInfoInput" );

  if (scQuickInfo) {

    var sitecoreItemID = scQuickInfo.getAttribute("value");
    var scLanguage = document.getElementById("scLanguage").getAttribute("value").toLowerCase();
    var scEditorQuickInfo = document.querySelectorAll(".scEditorQuickInfo");
    var lastScEditorQuickInfo = scEditorQuickInfo[scEditorQuickInfo.length- 1];
    var countTab = scEditorQuickInfo.length;
    var scEditorTitle = document.getElementsByClassName("scEditorHeaderTitle");

    var tabSitecoreItemID = document.querySelectorAll(".scEditorHeaderQuickInfoInput");
    var lastTabSitecoreItemID = tabSitecoreItemID[tabSitecoreItemID.length- 2].getAttribute("value");

    //Add hash to URL
    window.location.hash = sitecoreItemID;

    if(debug) { console.log("Number of tabs "+countTab); }

    if(countTab >1 && !document.getElementById("showInContentTree"+(countTab)+"")) {
      //Add text after title
      var javascript = 'scForm.invoke("item:load(id=' + lastTabSitecoreItemID + ',language=' + scLanguage + ',version=1)"); setTimeout(function(){ (location.reload(); }, 3000);';
      scEditorTitle[countTab-1].insertAdjacentHTML( 'afterend', '[<a id="showInContentTree' + countTab + '" href="" onclick="' + javascript + '" />Show in content tree</a>]' );
    }
          
    //Set ItemID (Storage)
    chrome.storage.sync.set({"scItemID": sitecoreItemID}, function() {
      if(debug) { console.info(">> Store ItemID: " + sitecoreItemID); }
    });
    chrome.storage.sync.set({"scLanguage": scLanguage}, function() {
      if(debug) { console.info(">> Store Language: " + scLanguage); }
    });

  }


  e.forEach(function(e) {
    "attributes" == e.type && _addEnvironmentLabel();
  });
});

//Reload
var element = document.getElementById("scLanguage");

if(element){
  if(debug) { console.info('**Reload**'); }

  //Sitecore Variables
  var scLanguage = element.getAttribute("value").toLowerCase();
  var hash = window.location.hash.substr(1);

  //Cookies (sxa_site?)
  //ToDO from background script


  if(hash!="") {

    /*
     * Resume from hash value
     */
    //Load node by code injection {681D640C-C820-483A-9249-3637312CD415}
    var actualCode = `scForm.invoke("item:load(id=` + hash + `,language=` + scLanguage + `,version=1)");`;
    script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();

    if(debug) { console.info(">> Hash ----->  " + hash); }

  } else {

    /*
     * Resume from where you left
     */
    chrome.storage.sync.get(['scItemID','feature_reloadnode'], function(result) {

      if (!chrome.runtime.error && result.scItemID != undefined) {

        if(result.feature_reloadnode == undefined) { result.feature_reloadnode = true; }

        if(result.scItemID && result.feature_reloadnode == true) {

          //Load node by code injection {681D640C-C820-483A-9249-3637312CD415}
          var actualCode = `scForm.invoke("item:load(id=` + result.scItemID + `,language=` + scLanguage + `,version=1)");`;
          var script = document.createElement('script');
          script.textContent = actualCode;
          (document.head||document.documentElement).appendChild(script);
          script.remove();

          if(debug) { console.info(">> Resume from where you left ----->  " + result.scItemID); }
        }
      }

    });

  }

  _addEnvironmentLabel();
  elementObserver.observe(element, { attributes: !0 });
}

//On Publish done
var elementObserver2 = new MutationObserver(function(e) {
  e.forEach(function(e) {
    "attributes" == e.type && _addEnvironmentLabel();
  });

  chrome.storage.sync.get(['feature_notification'], function(result) {

    if(result.feature_notification == undefined) { result.feature_notification = true; }

    if(result.feature_notification) {
      var notificationTitle = element2.getElementsByClassName("DialogHeader").item(0).innerHTML;
      var notificationSubTitle = element2.getElementsByClassName("sc-text-largevalue").item(0).innerHTML;
      var notificationBody = element2.getElementsByClassName("scFieldLabel").item(0).innerHTML
      sendNotification(notificationSubTitle,notificationBody);
    }

  });

  if(debug) { console.info('**Publish Done**'); }
   
});

//On open Publish window
var element2 = document.getElementById("LastPage");

if(element2){
  if(debug) { console.info('**Open dialog**'); }
  _addEnvironmentLabel();
  elementObserver2.observe(element2, { attributes: !0 });
}