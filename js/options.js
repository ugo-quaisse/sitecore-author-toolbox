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

  if(fromLaunchpad) {
    document.getElementById("set").innerHTML = "Save your preferences";
    document.getElementById("scHeader").style.display = "inherit";
    document.getElementById("scBack").href = backUrl;
    document.getElementById("banner").style.top = "50px";
    document.getElementById("bannerTitle").style.opacity = "1";
    document.getElementById("intro").style.marginTop = "50px";
    document.getElementById("video").style.display = "inherit";
  }

  //Generate domains
  var html = "";
  for (var i = 1; i <= 6; i++) {
    console.log(html);
    html += `<!-- loop start -->
        <p>Domain #` + i + `</p>
          <div class="cd_url">
            <label for="cd_` + i + `">Live website<b>*</b>:</label>
            <input name="cd_` + i + `" type="url" placeholder="https://example.com" pattern="https?://.*" required>
          </div>
          <div class="cm_url">
          <label for="cm_` + i + `">Content manager<b>*</b>:</label>
            <input name="cm_` + i + `" type="url" placeholder="https://example.com" pattern="https?://.*" required>
           </div>
        
          <div id="clear"></div>
          <!-- loop end -->`;
  }
  document.getElementById("load").innerHTML = html;

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
        var element = document.getElementById("extensionOptions");
        element.classList.add("dark");
      }
    } else {
      document.getElementById("feature_darkmode").checked = false;
      element = document.getElementById("extensionOptions");
      element.classList.add("light");
    }
    console.log("load"+result.feature_darkmode);
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
      document.getElementById("feature_cetabs").checked = true;
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
  
  //Context menu
  // chrome.storage.sync.get(['feature_contextmenu'], function(result) {
  //   if (!chrome.runtime.error && result.feature_reloadnode != undefined) {
  //     if(result.feature_reloadnode) {
  //       document.getElementById("contextmenu_true").checked = true;
  //     } else {
  //       document.getElementById("contextmenu_false").checked = true;
  //     }
  //   } else {
  //     document.getElementById("contextmenu_false").checked = true;
  //   }
  // });
}

document.getElementById("settings").onclick = function() {
  document.querySelector("#main").setAttribute( 'style', 'display:none' );
  document.querySelector("#domains").setAttribute( 'style', 'display:block' );
}

document.getElementById("back").onclick = function() {
  document.querySelector("#main").setAttribute( 'style', 'display:block' );
  document.querySelector("#domains").setAttribute( 'style', 'display:none' );
}

document.getElementById("set").onclick = function() {
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
        var element = document.getElementById("extensionOptions");
        element.classList.remove("light");
        element.classList.add("dark");
      } else {
        element = document.getElementById("extensionOptions");
        element.classList.remove("dark");
        element.classList.add("light");
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

  //Get URL parameters
  var url = new URL(window.location.href);
  var fromLaunchpad = url.searchParams.get("launchpad");
  console.log("Launchpad: "+fromLaunchpad);

  //Reload sitecore
  if(!fromLaunchpad) {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
      var code = 'window.location.reload();';
      chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
      document.getElementById("set").innerHTML = "Saving...";
      setTimeout(function(){ document.getElementById("set").innerHTML = "Save and reload sitecore"; }, 1000);
    });
  } else {
    document.getElementById("set").innerHTML = "Saving...";
    setTimeout(function(){ document.getElementById("set").innerHTML = "Save your preferences"; }, 1000);
  }

  //Reload parent
  //window.opener.location.reload();

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