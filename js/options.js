/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

document.body.onload = function() {

  //Extension version
  var manifestData = chrome.runtime.getManifest();
  document.getElementById("scVersion").innerHTML = manifestData.version;

  //Get URL parameters
  var url = new URL(window.location.href);
  var fromLaunchpad = url.searchParams.get("launchpad");
  var backUrl = url.searchParams.get("url");
  var configureDomains = url.searchParams.get("configure_domains");

  if(fromLaunchpad) {
    document.getElementById("set").innerHTML = "Save your preferences";
    document.getElementById("scHeader").style.display = "inherit";
    document.getElementById("scBack").href = backUrl;
    document.getElementById("banner").style.top = "50px";
    document.getElementById("bannerTitle").style.opacity = "1";
    document.getElementById("intro").style.marginTop = "50px";
    document.getElementById("video").style.display = "inherit";
  }

  if(configureDomains == "true") {
    document.querySelector("#settings").click();
    document.querySelector("#video").setAttribute("style","display:none");
  }

  //Generate domains
  chrome.storage.sync.get(['domain_manager'], function(result) {
    if (!chrome.runtime.error) {

      //Stored data
      if(result.domain_manager != undefined) {
        var domains = Object.keys(result.domain_manager);
      }


      //Generate HTML
      var html = "";
      var domain1, domain2 = "";

      for (var i = 0; i < 6; i++) {

        if(domains[i] != undefined) {
          domain1 = domains[i];
          domain2 = result.domain_manager[domain1];
        } else {
          domain1 = "";
          domain2 = "";
        }

        html += `<!-- loop start -->
              <div class="cm_url">
                <!-- <label for="cm[` + i + `]">CM<b>*</b>:</label> -->
                <input name="cm[` + i + `]" type="url" placeholder="CM URL" pattern="https?://.*" value="` + domain1 + `">
              </div>

              <div id="arrow">&nbsp;</div>

              <div class="cd_url">
                <!-- <label for="cd[` + i + `]">Live or CD<b>*</b>:</label> -->
                <input name="cd[` + i + `]" type="url" placeholder="CD or Live URL" pattern="https?://.*" value="` + domain2 + `">
              </div>
            
              <div id="clear"></div>
              <!-- loop end -->`;
      }
      document.querySelector("#load").innerHTML = html;

      }
  });

  //Urls
  chrome.storage.sync.get(['feature_urls'], function(result) {
    if (!chrome.runtime.error && result.feature_urls != undefined) {
      if(result.feature_urls) {
        document.getElementById("feature_urls").checked = true;
      }
    } else {
      document.getElementById("feature_urls").checked = true;
    }
  });
  //Flags
  chrome.storage.sync.get(['feature_flags'], function(result) {
    if (!chrome.runtime.error && result.feature_flags != undefined) {
      if(result.feature_flags) {
        document.getElementById("feature_flags").checked = true;
      }
    } else {
      document.getElementById("feature_flags").checked = true;
    }
  });
  //Errors
  chrome.storage.sync.get(['feature_errors'], function(result) {
    if (!chrome.runtime.error && result.feature_errors != undefined) {
      if(result.feature_errors) {
        document.getElementById("feature_errors").checked = true;
      }
    } else {
      document.getElementById("feature_errors").checked = true;
    }
  });
  //Drag and drop
  chrome.storage.sync.get(['feature_dragdrop'], function(result) {
    if (!chrome.runtime.error && result.feature_dragdrop != undefined) {
      if(result.feature_dragdrop) {
        document.getElementById("feature_dragdrop").checked = true;
      }
    } else {
      document.getElementById("feature_dragdrop").checked = true;
    }
  });
  //Notification
  chrome.storage.sync.get(['feature_notification'], function(result) {
    if (!chrome.runtime.error && result.feature_notification != undefined) {
      if(result.feature_notification) {
        document.getElementById("feature_notification").checked = true;
      }
    } else {
      document.getElementById("feature_notification").checked = true;
    }
  });
  //Dark Mode
  chrome.storage.sync.get(['feature_darkmode'], function(result) {
    if (!chrome.runtime.error && result.feature_darkmode != undefined) {
      if(result.feature_darkmode) {
        document.getElementById("feature_darkmode").checked = true;
        document.querySelector("#extensionOptions").classList.add("dark");
        document.querySelector("#save").classList.add("dark");
        document.querySelector("#footer").classList.add("dark");
      }
    } else {
      document.getElementById("feature_darkmode").checked = false;
      document.querySelector("#extensionOptions").classList.add("light");
      document.querySelector("#save").classList.add("light");
      document.querySelector("#footer").classList.add("light");
    }
  });
  //Favorites bar
  chrome.storage.sync.get(['feature_favorites'], function(result) {
    if (!chrome.runtime.error && result.feature_favorites != undefined) {
      if(result.feature_favorites) {
        document.getElementById("feature_favorites").checked = true;
      }
    } else {
      document.getElementById("feature_favorites").checked = true;
    }
  });
  //reload from where you left
  chrome.storage.sync.get(['feature_reloadnode'], function(result) {
    if (!chrome.runtime.error && result.feature_reloadnode != undefined) {
      if(result.feature_reloadnode) {
        document.getElementById("feature_reloadnode").checked = true;

      }
    } else {
      document.getElementById("feature_reloadnode").checked = true;
    }
  });
  //Launchpad icon
  chrome.storage.sync.get(['feature_launchpad'], function(result) {
    if (!chrome.runtime.error && result.feature_launchpad != undefined) {
      if(result.feature_launchpad) {
        document.getElementById("feature_launchpad").checked = true;
      }
    } else {
      document.getElementById("feature_launchpad").checked = true;
    }
  });
  //Right to left
  chrome.storage.sync.get(['feature_rtl'], function(result) {
    if (!chrome.runtime.error && result.feature_rtl != undefined) {
      if(result.feature_rtl) {
        document.getElementById("feature_rtl").checked = true;
      }
    } else {
      document.getElementById("feature_rtl").checked = true;
    }
  });
  //Character counter
  chrome.storage.sync.get(['feature_charscount'], function(result) {
    if (!chrome.runtime.error && result.feature_charscount != undefined) {
      if(result.feature_charscount) {
        document.getElementById("feature_charscount").checked = true;
      }
    } else {
      document.getElementById("feature_charscount").checked = true;
    }
  });
  //Auto Expand Tree
  chrome.storage.sync.get(['feature_autoexpand'], function(result) {
    if (!chrome.runtime.error && result.feature_autoexpand != undefined) {
      if(result.feature_autoexpand) {
        document.getElementById("feature_autoexpand").checked = true;
      }
    } else {
      document.getElementById("feature_autoexpand").checked = true;
    }
  });
  //Translation mode
  chrome.storage.sync.get(['feature_translatemode'], function(result) {
    if (!chrome.runtime.error && result.feature_translatemode != undefined) {
      if(result.feature_translatemode) {
        document.getElementById("feature_translatemode").checked = true;
      }
    } else {
      document.getElementById("feature_translatemode").checked = true;
    }
  });
  //EE toggle ribon button
  chrome.storage.sync.get(['feature_toggleribbon'], function(result) {
    if (!chrome.runtime.error && result.feature_toggleribbon != undefined) {
      if(result.feature_toggleribbon) {
        document.getElementById("feature_toggleribbon").checked = true;
      }
    } else {
      document.getElementById("feature_toggleribbon").checked = true;
    }
  });
  //CE tabs
  chrome.storage.sync.get(['feature_cetabs'], function(result) {
    if (!chrome.runtime.error && result.feature_cetabs != undefined) {
      if(result.feature_cetabs) {
        document.getElementById("feature_cetabs").checked = true;
      }
    } else {
      document.getElementById("feature_cetabs").checked = false;
    }
  });
  //RTE color
  chrome.storage.sync.get(['feature_rtecolor'], function(result) {
    if (!chrome.runtime.error && result.feature_rtecolor != undefined) {
      if(result.feature_rtecolor) {
        document.getElementById("feature_rtecolor").checked = true;
      }
    } else {
      document.getElementById("feature_rtecolor").checked = true;
    }
  }); 
  //Fancy message bar
  chrome.storage.sync.get(['feature_messagebar'], function(result) {
    if (!chrome.runtime.error && result.feature_messagebar != undefined) {
      if(result.feature_messagebar) {
        document.getElementById("feature_messagebar").checked = true;
      }
    } else {
      document.getElementById("feature_messagebar").checked = true;
    }
  });
  //Workflow notifications
  chrome.storage.sync.get(['feature_workbox'], function(result) {
    if (!chrome.runtime.error && result.feature_workbox != undefined) {
      if(result.feature_workbox) {
        document.getElementById("feature_workbox").checked = true;
      }
    } else {
      document.getElementById("feature_workbox").checked = true;
    }
  });
  //Live Urls Status
  chrome.storage.sync.get(['feature_urlstatus'], function(result) {
    if (!chrome.runtime.error && result.feature_urlstatus != undefined) {
      if(result.feature_urlstatus) {
        document.getElementById("feature_urlstatus").checked = true;
      }
    } else {
      document.getElementById("feature_urlstatus").checked = true;
    }
  });
  //Right click menu
  chrome.storage.sync.get(['feature_contextmenu'], function(result) {
    if (!chrome.runtime.error && result.feature_contextmenu != undefined) {
      if(result.feature_contextmenu) {
        document.getElementById("feature_contextmenu").checked = true;
      }
    } else {
      document.getElementById("feature_contextmenu").checked = true;
    }
  });
}

//Settings
document.querySelector("#settings").onclick = function() {
  document.querySelector("#main").setAttribute( 'style', 'display:none' );
  document.querySelector("#domains").setAttribute( 'style', 'display:block' );
  document.querySelector("#save").setAttribute( 'style', 'display:none' );
}

//Back to main
document.querySelector("#back").onclick = function() {
  var url = new URL(window.location.href);
  var configureDomains = url.searchParams.get("configure_domains");
  var backUrl = url.searchParams.get("url");

  if(configureDomains == "true") {
    window.open(backUrl);
    window.close();
  } else {
    document.querySelector("#main").setAttribute( 'style', 'display:block' );
    document.querySelector("#domains").setAttribute( 'style', 'display:none' );
    document.querySelector("#save").setAttribute( 'style', 'display:block' );
  }
}

//Save domains
document.querySelector("#set_domains").onclick = function(event) {

    event.preventDefault();

    //Parse form
    var domains = document.querySelectorAll("form#domains input");
    var count = 1;
    var domainId;
    var currentCM, currentCD;
    var jsonString = "{";
    var error = false;
    var empty = true;

    for(var domain of domains) {

      //Variable
      var url = "";

      //Reset CSS
      domain.setAttribute("style","");

      //Domain
      domainId = parseInt(domain.name.split("[")[1].replace("]",""));
      currentCM = document.querySelector("input[name='cm[" + domainId + "]']");
      currentCD = document.querySelector("input[name='cd[" + domainId + "]']");

      if(count%2 == 1) {
        //CM
        if(currentCM.value!="" && currentCD.value=="") {

          currentCD.setAttribute("style","border-color:red");
          alert("CD #" + parseInt(domainId+1) + " is missing");
          error = true;

        } else if(domain.value != "") {
          empty = false;
          try {
            url = new URL(domain.value);
          } catch (e) {
            currentCM.setAttribute("style","border-color:red");
            alert("CM #" + parseInt(domainId+1) + " is not a valid URL");
            error = true;
          }
        }

        if(url.origin != undefined) {
          currentCM.value = url.origin;
        }

      } else {
        //CD
        if(currentCM.value=="" && currentCD.value!="") {
          alert("CM #" + parseInt(domainId+1) + " is missing");
          error = true;
        } else if(domain.value != "") {
          empty = false;
          try {
            url = new URL(domain.value);
          } catch (e) {
            currentCD.setAttribute("style","border-color:red");
            alert("CD #" + parseInt(domainId+1) + " is not a valid URL");
            error = true;
          }
        }

        if(url.origin != undefined) {
          currentCD.value = url.origin;

          if(currentCM.value == currentCD.value) {
            alert("CM #" + parseInt(domainId+1) + " and CD #" + parseInt(domainId+1) + " are the exact same URL, please verify.");
            error = true;
          } else {
            //Add domain to JsonString
            // console.log(parseInt(domainId+1) + " ---> " +url.origin);
            jsonString += '"' + currentCM.value + '":"' + currentCD.value + '",';

          }
        }

      }
      count++;

    }
    //End for

    //Create Json object for storage
    jsonString += "}";
    jsonString = jsonString.replace(",}", "}").replace("{}", undefined);
    //console.log(error);

    if(jsonString!="undefined") {
      var json = JSON.parse(jsonString);
      console.log(json);
    }

    if(empty == true) {
      json = "";
    }

    if(error == false) {
      chrome.storage.sync.set({"domain_manager": json}, function() {
        document.querySelector("#set_domains").innerHTML = "Saving...";
        setTimeout(function(){ document.querySelector("#set_domains").innerHTML = "OK!"; }, 1000);
        setTimeout(function(){ document.querySelector("#set_domains").innerHTML = "Save your domains"; }, 1500);
        console.info('--> Domain manager: Saved!');
      });
    }

}

//Save preferences
document.querySelector("#set").onclick = function(event) {

  event.preventDefault();

  //URLs
  chrome.storage.sync.set({"feature_urls": document.getElementById('feature_urls').checked}, function() {
    console.info('--> Urls: ' + document.getElementById('feature_urls').checked);
  });
  //Flags
  chrome.storage.sync.set({"feature_flags": document.getElementById('feature_flags').checked}, function() {
    console.info('--> Flags: ' + document.getElementById('feature_flags').checked);
  });
  //Errors
  chrome.storage.sync.set({"feature_errors": document.getElementById('feature_errors').checked}, function() {
    console.info('--> Errors: ' + document.getElementById('feature_errors').checked);
  });
  //Drag and Drop
  chrome.storage.sync.set({"feature_dragdrop": document.getElementById('feature_dragdrop').checked}, function() {
    console.info('--> Drag and drop: ' + document.getElementById('feature_dragdrop').checked);
  });
  //Notificattion
  chrome.storage.sync.set({"feature_notification": document.getElementById('feature_notification').checked}, function() {
    console.info('--> Notifications: ' + document.getElementById('feature_notification').checked);
  });
  //Dark mode
  chrome.storage.sync.set({"feature_darkmode": document.getElementById('feature_darkmode').checked}, function() {
    console.info('--> Dark mode:' + document.getElementById('feature_darkmode').checked);
      if(document.getElementById('feature_darkmode').checked) {
        document.querySelector("#extensionOptions").classList.remove("light");
        document.querySelector("#extensionOptions").classList.add("dark");
        document.querySelector("#save").classList.remove("light");
        document.querySelector("#save").classList.add("dark");
        document.querySelector("#footer").classList.remove("light");
        document.querySelector("#footer").classList.add("dark");
      } else {
        document.querySelector("#extensionOptions").classList.remove("dark");
        document.querySelector("#extensionOptions").classList.add("light");
        document.querySelector("#save").classList.remove("dark");
        document.querySelector("#save").classList.add("light");
        document.querySelector("#footer").classList.remove("dark");
        document.querySelector("#footer").classList.add("light");
      }
  });
  //Favorites
  chrome.storage.sync.set({"feature_favorites": document.getElementById('feature_favorites').checked}, function() {
    console.info('--> Favorites: ' + document.getElementById('feature_favorites').checked);
  });
  //Reload from where you left
  chrome.storage.sync.set({"feature_reloadnode": document.getElementById('feature_reloadnode').checked}, function() {
    console.info('--> Reload: ' + document.getElementById('feature_reloadnode').checked);
  });
  //Launchpad
  chrome.storage.sync.set({"feature_launchpad": document.getElementById('feature_launchpad').checked}, function() {
    console.info('--> Launchpad: ' + document.getElementById('feature_launchpad').checked);
  });
  //RTL
  chrome.storage.sync.set({"feature_rtl": document.getElementById('feature_rtl').checked}, function() {
    console.info('--> RTL: ' + document.getElementById('feature_rtl').checked);
  });
  //Chars count
  chrome.storage.sync.set({"feature_charscount": document.getElementById('feature_charscount').checked}, function() {
    console.info('--> Character counter: ' + document.getElementById('feature_charscount').checked);
  });
  //Auto Expand
  chrome.storage.sync.set({"feature_autoexpand": document.getElementById('feature_autoexpand').checked}, function() {
    console.info('--> Auto Expand: ' + document.getElementById('feature_autoexpand').checked);
  });
  //Translation mode
  chrome.storage.sync.set({"feature_translatemode": document.getElementById('feature_translatemode').checked}, function() {
    console.info('--> Translation Mode: ' + document.getElementById('feature_translatemode').checked);
  });
  //Toggle Ribbon
  chrome.storage.sync.set({"feature_toggleribbon": document.getElementById('feature_toggleribbon').checked}, function() {
    console.info('--> Toggle Button: ' + document.getElementById('feature_toggleribbon').checked);
  });
  //CE Tabs
  chrome.storage.sync.set({"feature_cetabs": document.getElementById('feature_cetabs').checked}, function() {
    console.info('--> CE Tabs: ' + document.getElementById('feature_cetabs').checked);
  });
  //RTE Color
  chrome.storage.sync.set({"feature_rtecolor": document.getElementById('feature_rtecolor').checked}, function() {
    console.info('--> RTE Color: ' + document.getElementById('feature_rtecolor').checked);
  });
  //Fancy message bar 
  chrome.storage.sync.set({"feature_messagebar": document.getElementById('feature_messagebar').checked}, function() {
    console.info('--> Fancy message bar: ' + document.getElementById('feature_messagebar').checked);
  });
  //Workflow notifications
  chrome.storage.sync.set({"feature_workbox": document.getElementById('feature_workbox').checked}, function() {
    console.info('--> Workflow notifications: ' + document.getElementById('feature_workbox').checked);
  });
  //Live URL Status
  chrome.storage.sync.set({"feature_urlstatus": document.getElementById('feature_urlstatus').checked}, function() {
    console.info('--> Live Urls Status: ' + document.getElementById('feature_urlstatus').checked);
  });
   //Live URL Status
  chrome.storage.sync.set({"feature_contextmenu": document.getElementById('feature_contextmenu').checked}, function() {
    console.info('--> Right click menu: ' + document.getElementById('feature_contextmenu').checked);
  });


  //Get URL parameters
  var url = new URL(window.location.href);
  var fromLaunchpad = url.searchParams.get("launchpad");
  console.log("Launchpad: "+fromLaunchpad);

  //Reload sitecore
  if(!fromLaunchpad) {

    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
      var code = 'window.location.reload();';
      chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
      document.querySelector("#set").innerHTML = "Saving...";
      setTimeout(function(){ document.querySelector("#set").innerHTML = "Save and reload sitecore"; }, 1000);
    });
  } else {
    document.querySelector("#set").innerHTML = "Saving...";
    setTimeout(function(){ document.querySelector("#set").innerHTML = "OK!"; }, 1000);
    setTimeout(function(){ document.querySelector("#set").innerHTML = "Save your preferences"; }, 1500);
  }

}


let last_known_scroll_position = 0;
let ticking = false;

function doSomething(scroll_pos) {
  var element = document.getElementById("banner");
  if(scroll_pos >= 90) {
    element.classList.add("animate");
  } else {
    element.classList.remove("animate");
  }
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;
  
  //Get URL parameters
  var url = new URL(window.location.href);
  var fromLaunchpad = url.searchParams.get("launchpad");

  if (!ticking && !fromLaunchpad) {
    window.requestAnimationFrame(function() {

      doSomething(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});