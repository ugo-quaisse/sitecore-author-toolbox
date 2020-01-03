/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */
 
document.body.onload = function() {
  //Urls
  chrome.storage.sync.get(['feature_urls'], function(result) {
    if (!chrome.runtime.error && result.feature_urls != undefined) {
      if(result.feature_urls) {
        document.getElementById("urls_true").checked = true;
      } else {
        document.getElementById("urls_false").checked = true;
      }
    } else {
      document.getElementById("urls_true").checked = true;
    }
  });
  //Flags
  chrome.storage.sync.get(['feature_flags'], function(result) {
    if (!chrome.runtime.error && result.feature_flags != undefined) {
      if(result.feature_flags) {
        document.getElementById("flags_true").checked = true;
      } else {
        document.getElementById("flags_false").checked = true;
      }
    } else {
      document.getElementById("flags_true").checked = true;
    }
  });
  //Errors
  chrome.storage.sync.get(['feature_errors'], function(result) {
    if (!chrome.runtime.error && result.feature_errors != undefined) {
      if(result.feature_errors) {
        document.getElementById("errors_true").checked = true;
      } else {
        document.getElementById("errors_false").checked = true;
      }
    } else {
      document.getElementById("errors_true").checked = true;
    }
  });
  //Drag and drop
  chrome.storage.sync.get(['feature_dragdrop'], function(result) {
    if (!chrome.runtime.error && result.feature_dragdrop != undefined) {
      if(result.feature_dragdrop) {
        document.getElementById("dragdrop_true").checked = true;
      } else {
        document.getElementById("dragdrop_false").checked = true;
      }
    } else {
      document.getElementById("dragdrop_true").checked = true;
    }
  });
  //Notification
  chrome.storage.sync.get(['feature_notification'], function(result) {
    if (!chrome.runtime.error && result.feature_notification != undefined) {
      if(result.feature_notification) {
        document.getElementById("notification_true").checked = true;
      } else {
        document.getElementById("notification_false").checked = true;
      }
    } else {
      document.getElementById("notification_true").checked = true;
    }
  });
  //Dark Mode
  chrome.storage.sync.get(['feature_darkmode'], function(result) {
    if (!chrome.runtime.error && result.feature_darkmode != undefined) {
      if(result.feature_darkmode) {
        document.getElementById("darkmode_true").checked = true;
      } else {
        document.getElementById("darkmode_false").checked = true;
      }
    } else {
      document.getElementById("darkmode_false").checked = true;
    }
  });
  //Favorites bar
  chrome.storage.sync.get(['feature_favorites'], function(result) {
    if (!chrome.runtime.error && result.feature_favorites != undefined) {
      if(result.feature_favorites) {
        document.getElementById("favorites_true").checked = true;
      } else {
        document.getElementById("favorites_false").checked = true;
      }
    } else {
      document.getElementById("favorites_true").checked = true;
    }
  });
  //reload from where you left
  chrome.storage.sync.get(['feature_reloadnode'], function(result) {
    if (!chrome.runtime.error && result.feature_reloadnode != undefined) {
      if(result.feature_reloadnode) {
        document.getElementById("reloadnode_true").checked = true;
      } else {
        document.getElementById("reloadnode_false").checked = true;
      }
    } else {
      document.getElementById("reloadnode_true").checked = true;
    }
  });
  //reload from where you left
  chrome.storage.sync.get(['feature_contextmenu'], function(result) {
    if (!chrome.runtime.error && result.feature_reloadnode != undefined) {
      if(result.feature_reloadnode) {
        document.getElementById("contextmenu_true").checked = true;
      } else {
        document.getElementById("contextmenu_false").checked = true;
      }
    } else {
      document.getElementById("contextmenu_false").checked = true;
    }
  });
}

document.getElementById("set").onclick = function() {
  //URLs
  var value_urls =document.querySelector('input[name="feature_urls"]:checked').value;
  value_urls = (value_urls == 'true');
  chrome.storage.sync.set({"feature_urls": value_urls}, function() {
    console.info('Urls are set to ' + value_urls);
  });
  //Flags
  var value_flags =document.querySelector('input[name="feature_flags"]:checked').value;
  value_flags = (value_flags == 'true');
  chrome.storage.sync.set({"feature_flags": value_flags}, function() {
    console.info('Flags are set to ' + value_flags);
  });
  //Errors
  var value_errors =document.querySelector('input[name="feature_errors"]:checked').value;
  value_errors = (value_errors == 'true');
  chrome.storage.sync.set({"feature_errors": value_errors}, function() {
    console.info('Errors are set to ' + value_errors);
  });
  //Drag and Drop
  var value_dragdrop =document.querySelector('input[name="feature_dragdrop"]:checked').value;
  value_dragdrop = (value_dragdrop == 'true');
  chrome.storage.sync.set({"feature_dragdrop": value_dragdrop}, function() {
    console.info('Drag and drop is set to ' + value_dragdrop);
  });
  //Notificattion
  var value_notification =document.querySelector('input[name="feature_notification"]:checked').value;
  value_notification = (value_notification == 'true');
  chrome.storage.sync.set({"feature_notification": value_notification}, function() {
    console.info('Notifications are set to ' + value_notification);
  });
  //Dark mode
  var value_darkmode =document.querySelector('input[name="feature_darkmode"]:checked').value;
  value_darkmode = (value_darkmode == 'true');
  chrome.storage.sync.set({"feature_darkmode": value_darkmode}, function() {
    console.info('Dark mode set to ' + value_darkmode);
  });
  //Favorites
  var value_favorites =document.querySelector('input[name="feature_favorites"]:checked').value;
  value_favorites = (value_favorites == 'true');
  chrome.storage.sync.set({"feature_favorites": value_favorites}, function() {
    console.info('Favorites bar set to ' + value_favorites);
  });
  //Reload from where you left
  var value_reloadnode =document.querySelector('input[name="feature_reloadnode"]:checked').value;
  value_reloadnode = (value_reloadnode == 'true');
  chrome.storage.sync.set({"feature_reloadnode": value_reloadnode}, function() {
    console.info('Reload from where you left set to ' + value_reloadnode);
  });
  //Context menu: edit in Experience Editor
  // var value_contextmenu =document.querySelector('input[name="feature_contextmenu"]:checked').value;
  // value_contextmenu = (value_contextmenu == 'true');
  // chrome.storage.sync.set({"feature_contextmenu": value_contextmenu}, function() {
  //   console.info('Context menu set to ' + value_contextmenu);
  // });

  //Reload sitecore
  chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
    var code = 'window.location.reload();';
    chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
  });

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

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});