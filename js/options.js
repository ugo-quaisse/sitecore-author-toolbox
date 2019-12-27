/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */
 
document.body.onload = function() {
  //Debug
  chrome.storage.sync.get(['debug'], function(result) {
    if (!chrome.runtime.error && result.debug != undefined) {
      if(result.debug) {
        document.getElementById("debug_true").checked = true;
      } else {
        document.getElementById("debug_false").checked = true;
      }
    } else {
      document.getElementById("debug_false").checked = true;
    }
  });
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
      document.getElementById("darkmode_true").checked = true;
    }
  });
}

document.getElementById("set").onclick = function() {
  console.info('test');
  //Debug
  var value_debug =document.querySelector('input[name="debug"]:checked').value;
  value_debug = (value_debug == 'true');
  chrome.storage.sync.set({"debug": value_debug}, function() {
    console.log('Debug is set to ' + value_debug);
  });
  //URLs
  var value_urls =document.querySelector('input[name="feature_urls"]:checked').value;
  value_urls = (value_urls == 'true');
  chrome.storage.sync.set({"feature_urls": value_urls}, function() {
    console.log('Urls are set to ' + value_urls);
  });
  //Flags
  var value_flags =document.querySelector('input[name="feature_flags"]:checked').value;
  value_flags = (value_flags == 'true');
  chrome.storage.sync.set({"feature_flags": value_flags}, function() {
    console.log('Flags are set to ' + value_flags);
  });
  //Errors
  var value_errors =document.querySelector('input[name="feature_errors"]:checked').value;
  value_errors = (value_errors == 'true');
  chrome.storage.sync.set({"feature_errors": value_errors}, function() {
    console.log('Errors are set to ' + value_errors);
  });
  //Drag and Drop
  var value_dragdrop =document.querySelector('input[name="feature_dragdrop"]:checked').value;
  value_dragdrop = (value_dragdrop == 'true');
  chrome.storage.sync.set({"feature_dragdrop": value_dragdrop}, function() {
    console.log('Drag and drop is set to ' + value_dragdrop);
  });
  //Notificattion
  var value_notification =document.querySelector('input[name="feature_notification"]:checked').value;
  value_notification = (value_notification == 'true');
  chrome.storage.sync.set({"feature_notification": value_notification}, function() {
    console.log('Notifications are set to ' + value_notification);
  });
  //Dark mode
  var value_darkmode =document.querySelector('input[name="feature_darkmode"]:checked').value;
  value_darkmode = (value_darkmode == 'true');
  chrome.storage.sync.set({"feature_darkmode": value_darkmode}, function() {
    console.log('Dark mode set to ' + value_darkmode);
  });
  document.getElementById("message").innerHTML = "Please reload the page to see your changes!";
}