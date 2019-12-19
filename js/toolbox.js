/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

//User preferences
var debug = false;
var feature_urls = true;
var feature_flags = true;
var feature_errors = true;
var feature_dragdrop = true;
var feature_notification = true;


//Helper functions
function stripHtml(html){
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

function sendNotification(scTitle, scBody) {
  var notify = new Notification(scTitle, {
      body: scBody,
      icon: chrome.runtime.getURL("images/icon.png"),
  });
}

//Read preferences
chrome.storage.sync.get(['debug'], function(result) {
  if (!chrome.runtime.error && result.debug != undefined) {
      //console.info("debug: "+result.debug);
      debug = result.debug;
  }
});

chrome.storage.sync.get(['feature_urls'], function(result) {
  if (!chrome.runtime.error && result.feature_urls != undefined) {
      //console.info("feature_urls: "+result.feature_urls);
      feature_urls = result.feature_urls;
  }
});

chrome.storage.sync.get(['feature_flags'], function(result) {
  if (!chrome.runtime.error && result.feature_flags != undefined) {
      //console.info("feature_flags: "+result.feature_flags);
      feature_flags = result.feature_flags;
  }
});

chrome.storage.sync.get(['feature_errors'], function(result) {
  if (!chrome.runtime.error && result.feature_errors != undefined) {
      //console.info("feature_errors: "+result.feature_errors);
      feature_errors = result.feature_errors;
  }
});

chrome.storage.sync.get(['feature_dragdrop'], function(result) {
  if (!chrome.runtime.error && result.feature_dragdrop != undefined) {
      //console.info("Preference: "+result.feature_dragdrop);
      feature_dragdrop = result.feature_dragdrop;
  }
});

chrome.storage.sync.get(['feature_notification'], function(result) {
  if (!chrome.runtime.error && result.feature_notification != undefined) {
      //console.info("feature_notification: "+result.feature_notification);
      feature_notification = result.feature_notification;
  }
});

/*
 * Pace progress bar
 */
// paceOptions = {
//   elements: false,
//   restartOnRequestAfter: false,
//   restartOnPushState: false
// }

//Sitecore UI Fixes
//document.querySelector ( ".scWebEditContentEditorButton" ).parentNode.style.zIndex = 10;

/*
 * Extension main execution code
 */
function _addEnvironmentLabel() {

  //App settings 
  var count = 0;
  var icon = chrome.runtime.getURL("images/rocket.png");
  var iconError = chrome.runtime.getURL("images/error.png");
  var iconEdit = chrome.runtime.getURL("images/edit.png");
  var flagsPath = chrome.runtime.getURL("images/flags/");

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

    //Display name

    //Check if item is data source
    var temp = sitecoreItemPathOriginal.split("/");
    if(temp[temp.length-1] == 'Data'){
      var sitecoreData = true;
    }

    //Sitecore variable
    var scLanguage = document.getElementById("scLanguage").getAttribute("value").toLowerCase();
    var scUrl = window.location.origin + '/?sc_itemid=' + sitecoreItemID + '&sc_mode=normal&sc_lang=' + scLanguage + "&sc_site=" + sitecoreSite;

    //Sitecore language (text)
    var temp = document.getElementsByClassName("scEditorHeaderVersionsLanguage");
    var scLanguageTxtLong = temp[0].getAttribute("title");
    var scLanguageTxtShort = stripHtml(temp[0].innerHTML);

    //Generating Live URLs
    if (sitecoreItemPath[1]!=undefined) {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/" + sitecoreItemPath[1]+ "?sc_site=" + sitecoreSite + "&sc_mode_normal").toLowerCase();
    } else {
      sitecoreItemPath = encodeURI(window.location.origin + "/" + scLanguage + "/?sc_site=" + sitecoreSite).toLowerCase();
    }

    //Check if item under data source (=component)
    var isDataSource = sitecoreItemPath.includes('/data/');

    if(!sitecoreData && sitecoreItemPath != encodeURI(window.location.origin + "/" + scLanguage + "/"+ "?sc_site=" + sitecoreSite).toLowerCase() && !isDataSource) {

      //If not added yet
      if(!document.getElementById("scMessageBarUrl") && feature_urls) {
        //Prepare HTML (scInformation scWarning scError)
        var scMessage = '<div id="scMessageBarUrl" class="scMessageBar scWarning"><div class="scMessageBarIcon" style="background-image:url(' + icon + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">Sitecore Live URL</div><div class="scMessageBarText">If you want to preview this page in <b>' + scLanguageTxtLong + '</b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="' + sitecoreItemPath + '" target="_blank" class="scMessageBarOption">Open this link</a> or try <a href="' + scUrl + '" target="_blank" class="scMessageBarOption">this alternative link</a></li></ul></div></div>'

        //Insert message bar into Sitecore Content Editor
        scEditorID.insertAdjacentHTML( 'afterend', scMessage );
      }

    }

    if(isDataSource) {

      sitecoreItemPath = sitecoreItemPath.split("/data/");

      //If not added yet
      if(!document.getElementById("scMessageBarInfo") && feature_urls) {
        //Prepare HTML (scInformation scWarning scError scOrange scGray scGreen)
        var scMessage = '<div id="scMessageBarInfo" class="scMessageBar scInformation"><div class="scMessageBarIcon" style="background-image:url(' + iconEdit + ')"></div><div class="scMessageBarTextContainer"><div class="scMessageBarTitle">You are editing a data source...</div><div class="scMessageBarText">To see it, you need to add/edit it to your page via the</b></div><ul class="scMessageBarOptions" style="margin:0px"><li class="scMessageBarOptionBullet"><a href="' + sitecoreItemPath[0] + '?sc_mode=edit" target="_blank" class="scMessageBarOption">Experience Editor</a> or <a href="" class="scMessageBarOption" onclick="javascript:return scForm.invoke(\'item:setlayoutdetails\', event)">Presentation details<a></li></ul></div></div>'

        //Insert message bar into Sitecore Content Editor
        scEditorID.insertAdjacentHTML( 'afterend', scMessage );
      }

    }


    /*
     * 2. Insert Flag
     */

    //If flags not yet injected in DOM
    if(!document.getElementById("scFlag") && feature_flags) {
      scActiveTab.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="' + flagsPath + scLanguage +'.png" style="width: 20px; vertical-align: middle; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + flagsPath + 'missing.png\';" />' );
    }

    if(feature_flags) {
    //Insert Flags into Sitecore Language selector
    scLanguageMenu.insertAdjacentHTML( 'afterbegin', '<img id="scFlag" src="' + flagsPath + scLanguage +'.png" style="width: 15px; vertical-align: sub; padding: 0px 5px 0px 0px;" onerror="this.onerror=null;this.src=\'' + flagsPath + 'missing.png\';" />' );
    }
    
  };


  /*
   * 3. Display Grouped Errors
   */

  if(scErrors[0]!=undefined && feature_errors) {

    //Prepare HTML
    var scMessageErrors = '<div id="scMessageBarError" class="scMessageBar scError"><div class="scMessageBarIcon" style="background-image:url(' + iconError + ')"></div><div class="scMessageBarTextContainer"><ul class="scMessageBarOptions" style="margin:0px">'
    
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

  }


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
        //console.log("SRC of MEDIA IFRAME "+count+" - "+scIframeSrc);
        break;
      }
    }

    if(isMediaFolder && feature_dragdrop) {
      scIframeMedia.onload = function() {

        //Variables
        scIframeSrc = scIframeSrc.split("id=%7B");
        scIframeSrc = scIframeSrc[1].split("%7B");
        var scMediaID = scIframeSrc[0];

        //Prepare HTML
        var scUploadMediaUrl = '/sitecore/client/Applications/Dialogs/UploadMediaDialog?fo=sitecore://master/{' + scMediaID + '}';
        var scUploadMedia = '<iframe id="sitecorAuthorToolbox" class="sitecorAuthorToolbox" src="' + scUploadMediaUrl + '" style="width:100%; height:500px; margin-top: -60px;"></iframe>';
        scIframeMedia.setAttribute("style", "margin-top: -60px;");
        
        //Check if Drag and Drop IFrame already exists in DOM
        var scUploadDragDrop = document.getElementById("sitecorAuthorToolbox");
        if(scUploadDragDrop){
          //Delete existing Drag and Drop iFrame
          scUploadDragDrop.remove();
          if(debug) { console.log("Remove iFrame from DOM"); }
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
        if(debug) { console.log("Remove iFrame from DOM (no folder)"); }
      }

    }
  }

  if (debug === true) {
    console.log("Media folder:" + isMediaFolder);
    console.info("Active language: " + scLanguage);
  }


  /*
   * 5. Desktop notificaitons on Publish end
   */
  if (!window.Notification) {
      console.log('Browser does not support notifications.');
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
                 console.log('User blocked notifications.');
             }
          }).catch(function(err) {
              console.error(err);
          });
      }
  }

}
//End



/*
 * Chrome extention and JS Observers
 */

//On change
var MutationObserver = window.MutationObserver;

var elementObserver = new MutationObserver(function(e) {
  if(debug) { console.info('Change'); }
  e.forEach(function(e) {
    "attributes" == e.type && _addEnvironmentLabel();
  });
});

//On first load
var element = document.getElementById("scLanguage");

if(element){
  if(debug) { console.info('First load'); }
  _addEnvironmentLabel();
  elementObserver.observe(element, { attributes: !0 });
}

//On Publish done
var elementObserver2 = new MutationObserver(function(e) {
  e.forEach(function(e) {
    "attributes" == e.type && _addEnvironmentLabel();
  });

  if(feature_notification) {
    var notificationTitle = element2.getElementsByClassName("DialogHeader").item(0).innerHTML;
    var notificationSubTitle = element2.getElementsByClassName("sc-text-largevalue").item(0).innerHTML;
    var notificationBody = element2.getElementsByClassName("scFieldLabel").item(0).innerHTML
    sendNotification(notificationSubTitle,notificationBody);
  }
  if(debug) { console.info('Publish Done'); }
   
});

//On open Publish window
var element2 = document.getElementById("LastPage");

if(element2){
  if(debug) { console.info('Open publish'); }
  _addEnvironmentLabel();
  elementObserver2.observe(element2, { attributes: !0 });
}