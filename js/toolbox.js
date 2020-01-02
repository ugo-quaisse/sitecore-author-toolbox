/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */ 

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

var debug = false;

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
 * Fadein onload
 */
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href =  chrome.runtime.getURL("css/onload-min.css");
document.getElementsByTagName("head")[0].appendChild(link);


/*
 * Dect which URL/Frame is loading the script? (Languages, Favorites, etc...)
 */
if(debug) { console.info("Call URL: "+window.location); }

var isGalleryLanguage = window.location.href.includes('Gallery.Language');
var isGalleryFavorites = window.location.href.includes('Gallery.Favorites');
var isAdminCache = window.location.href.includes('/admin/cache.aspx');

if(isGalleryLanguage) {

  if(debug) { console.info("====================> LANGUAGES <===================="); }

  chrome.storage.sync.get(['feature_flags'], function(result) {

    if(result.feature_flags) {
      
    /*
     * Load Json data for languages
     */
    var jsonFile = chrome.runtime.getURL("data/languages.json");
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
                      temp = temp[0].replace(" ", "_");
                      temp = temp.toUpperCase();
                      tdlanguage = temp.replace("TRADITIONAL,_","");
                      tdlanguage = tdlanguage.replace("SIMPLIFIED,_","");

                      //Replace non-standard country name
                      tdlanguage = tdlanguage.replace("U.A.E.","UNITED_ARAB_EMIRATES");
                      tdlanguage = tdlanguage.replace("KOREA","SOUTH_KOREA");
                      tdlanguage = tdlanguage.replace("UNITED_STATES","USA");
                      tdlanguage = tdlanguage.replace("UNITED_KINGDOM","GREAT_BRITAIN");

                      //console.log(tdlanguage);

                    }
                    
                    //Now replace images src and add an image fallback if doesn't exist
                    tdimage[0].onerror = function() { this.src = '-/icon/Flags/32x32/flag_generic.png'; }
                    tdimage[0].src = "-/icon/Flags/32x32/flag_"+tdlanguage+".png";
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

 
} else if(isGalleryFavorites) {

  if(debug) { console.info("====================> FAVORITES <===================="); }

}


/*
 * Dark mode
 */
chrome.storage.sync.get(['feature_darkmode'], function(result) {

  if(result.feature_darkmode == undefined) { result.feature_darkmode = false; }

  if(result.feature_darkmode && window.location.pathname != "/sitecore/login" && window.location.pathname != "/sitecore/client/Applications/ExperienceEditor/Ribbon.aspx" && window.location.pathname != "/sitecore/admin/cache.aspx") {
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

    // chrome.browserAction.setBadgeText({text:'Dark'});
    // chrome.browserAction.setBadgeBackgroundColor({color:"#DC291E"});
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
  var jsonLanguages = chrome.runtime.getURL("data/languages.json");

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
  //Sitecore errors
  var scErrors = document.getElementsByClassName("scValidationMarkerIcon");
  //Sitecore Editor Frames
  let scEditorFrames = document.querySelector ( "#EditorFrames" );
  //Sitecore Search Panel
  let scSearchPanel = document.getElementById ( "SearchPanel" );
  //Sitecore Content Tree
  let scContentTree= document.getElementById ( "ContentTreeHolder" );

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
    var scUrl = window.location.origin + '/?sc_itemid=' + sitecoreItemID + '&sc_mode=normal&sc_lang=' + scLanguage + "&sc_site=" + sitecoreSite;

    //Sitecore language (text)
    temp = document.getElementsByClassName("scEditorHeaderVersionsLanguage");
    var scLanguageTxtLong = temp[0].getAttribute("title");
    var scLanguageTxtShort = stripHtml(temp[0].innerHTML);
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

      if(isNotRegion) {

        //Clean country name
        temp = scLanguageTxtShort.split(" (");
        if(temp[1] == undefined) { temp = temp[0]; } else { temp = temp[1]; }
        temp = temp.split(")");
        temp = temp[0].replace(" ", "_");
        temp = temp.toUpperCase();
        scFlag = temp.replace("TRADITIONAL,_","");
        scFlag = scFlag.replace("SIMPLIFIED,_","");

        if (debug) { console.log("Flag:" + scFlag); }

        //Replace non-standard country name
        scFlag = scFlag.replace("U.A.E.","UNITED_ARAB_EMIRATES");
        scFlag = scFlag.replace("KOREA","SOUTH_KOREA");
        scFlag = scFlag.replace("UNITED_STATES","USA");
        scFlag = scFlag.replace("UNITED_KINGDOM","GREAT_BRITAIN");


        //Insert Flag into Active Tab
        if(!document.getElementById("scFlag") && result.feature_flags && scFlag) {
          scActiveTab.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="-/icon/Flags/32x32/flag_' + scFlag +'.png" style="width: 20px; vertical-align: middle; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/32x32/flag_generic.png\';"/>' );
        }

        if(result.feature_flags && scFlag) {
          //Insert Flag into Sitecore Language selector
          scLanguageMenu.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="-/icon/Flags/32x32/flag_' + scFlag +'.png" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/32x32/flag_generic.png\';"/>' );
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
                            if (debug) { console.log("Flag:" + scFlag); }

                            //Insert Flag into Active Tab
                            if(!document.getElementById("scFlag") && result.feature_flags && scFlag) {
                              scActiveTab.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="-/icon/Flags/32x32/flag_' + scFlag +'.png" style="width: 20px; vertical-align: middle; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/32x32/flag_generic.png\';"/>' );
                            }

                            if(result.feature_flags && scFlag) {
                            //Insert Flag into Sitecore Language selector
                            scLanguageMenu.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="-/icon/Flags/32x32/flag_' + scFlag +'.png" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'-/icon/Flags/32x32/flag_generic.png\';"/>' );
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
    
  }


  /*
   * 3. Display Grouped Errors
   */
  chrome.storage.sync.get(['feature_errors'], function(result) {

    if(scErrors[0]!=undefined && result.feature_errors) {

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


      //Update on change
      var target = document.querySelector( ".scValidatorPanel" )
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

    if(result.feature_favorites == undefined || result.feature_favorites) {

      var scFavoritesIframe = document.getElementById("sitecorAuthorToolboxFav");

      //If already there
      if(scFavoritesIframe) { scFavoritesIframe.remove(); }
        
        //Prepare HTML
        // var scMyShortcut = '<div id="scFavorites" style="padding: 10px 20px;"><b>My favorite:</b> <a href="" onclick="javascript: return scForm.invoke(\'item:load(id=' + scShortcutItemId + ',language=' + scLanguage + ',version=1)\')">Home</a></div>';
        var scFavoritesUrl = '../default.aspx?xmlcontrol=Gallery.Favorites&id=' + sitecoreItemID + '&la=' + scLanguage + '&vs=1';      
        var scMyShortcut = '<iframe id="sitecorAuthorToolboxFav" class="sitecorAuthorToolboxFav" src="' + scFavoritesUrl + '" style="width:100%; height:125px; margin-top: 0px; resize: vertical;"></iframe>';

        //Insert HTML
        scContentTree.insertAdjacentHTML( 'afterend', scMyShortcut );
      }

  });

  if (debug === true) {
    console.info("Item ID: " + sitecoreItemID);
    console.info("Language: " + scLanguage);
    console.info("Version: na");
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

  //Sitecore Variables
  var temp = document.getElementsByClassName("scEditorHeaderQuickInfoInput");  
  var sitecoreItemID = temp[0].getAttribute("value");
  var scLanguage = document.getElementById("scLanguage").getAttribute("value").toLowerCase();
  
  //Set ItemID (Storage)
  chrome.storage.sync.set({"scItemID": sitecoreItemID}, function() {
    if(debug) { console.info(">> Store ItemID: " + sitecoreItemID); }
  });
  chrome.storage.sync.set({"scLanguage": scLanguage}, function() {
    if(debug) { console.info(">> Store Language: " + scLanguage); }
  });


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

  //Get itemID (Storage)
  chrome.storage.sync.get(['scItemID','feature_reloadnode'], function(result) {
    if (!chrome.runtime.error && result.scItemID != undefined) {
      if(result.scItemID && result.feature_reloadnode == true) {

        //Load node by code injection
        var actualCode = `scForm.invoke("item:load(id=` + result.scItemID + `,language=` + scLanguage + `,version=1)");`;
        var script = document.createElement('script');
        script.textContent = actualCode;
        (document.head||document.documentElement).appendChild(script);
        script.remove();

        if(debug) { console.info(">> User Preference -----> " + result.feature_reloadnode); }
        if(debug) { console.info(">> GoTo ItemID ----->  " + result.scItemID); }
      }
    }
  });

  _addEnvironmentLabel();
  elementObserver.observe(element, { attributes: !0 });
}

//On Publish done
var elementObserver2 = new MutationObserver(function(e) {
  e.forEach(function(e) {
    "attributes" == e.type && _addEnvironmentLabel();
  });

  chrome.storage.sync.get(['feature_notification'], function(result) {

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