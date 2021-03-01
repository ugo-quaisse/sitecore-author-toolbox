/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */
/* eslint-disable object-property-newline */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-alert */
/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

/**
 * Load modules
 */
import { animateHeader, toggleFeature, chooseJson, addSite, addDomain } from "./modules/dom.js";
import { uploadJson, parseJsonSites } from "./modules/load.js";

/**
 * Main execution
 */
document.body.onload = function () {
  //Variables
  let url = new URL(window.location.href);
  let fromLaunchpad = url.searchParams.get("launchpad");
  let backUrl = url.searchParams.get("url");
  let configureDomains = url.searchParams.get("configure_domains");
  let ticking = false;

  //Extension version
  document.querySelector("#scVersion").innerHTML = chrome.runtime.getManifest().version;

  if (fromLaunchpad) {
    document.querySelector(".save_settings").innerHTML = "Save your preferences";
    document.querySelector("#scHeader").style.display = "inherit";
    document.querySelector("#scBack").href = backUrl ? backUrl : "#";
    document.querySelector("#banner").style.top = "50px";
    document.querySelector("#bannerTitle").style.opacity = "1";
    document.querySelector("#intro").style.marginTop = "50px";
  }

  if (configureDomains) {
    document.querySelector("#settings").click();
  }

  if (!fromLaunchpad) {
    /**
     * Header animation
     */
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          animateHeader(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Get features
   */
  chrome.storage.sync.get((storage) => {
    toggleFeature(storage.feature_urls, "#feature_urls", true);
    toggleFeature(storage.feature_urlstatus, "#feature_urlstatus", true);
    toggleFeature(storage.feature_flags, "#feature_flags", true);
    toggleFeature(storage.feature_errors, "#feature_errors", true);
    toggleFeature(storage.feature_notification, "#feature_notification", true);
    toggleFeature(storage.feature_darkmode, "#feature_darkmode", false);
    toggleFeature(storage.feature_darkmode_auto, "#feature_darkmode_auto", false);
    toggleFeature(storage.feature_favorites, "#feature_favorites", false);
    toggleFeature(storage.feature_reloadnode, "#feature_reloadnode", true);
    toggleFeature(storage.feature_launchpad, "#feature_launchpad", true);
    toggleFeature(storage.feature_launchpad_tiles, "#feature_launchpad_tiles", false);
    toggleFeature(storage.feature_rtl, "#feature_rtl", true);
    toggleFeature(storage.feature_charscount, "#feature_charscount", true);
    toggleFeature(storage.feature_autoexpand, "#feature_autoexpand", true);
    toggleFeature(storage.feature_quickinfoenhancement, "#feature_quickinfoenhancement", true);
    toggleFeature(storage.feature_translatemode, "#feature_translatemode", false);
    toggleFeature(storage.feature_contenteditor, "#feature_contenteditor", true);
    toggleFeature(storage.feature_experienceeditor, "#feature_experienceeditor", true);
    toggleFeature(storage.feature_cetabs, "#feature_cetabs", false);
    toggleFeature(storage.feature_rtecolor, "#feature_rtecolor", true);
    toggleFeature(storage.feature_messagebar, "#feature_messagebar", false);
    toggleFeature(storage.feature_workbox, "#feature_workbox", true);
    toggleFeature(storage.feature_contextmenu, "#feature_contextmenu", true);
    toggleFeature(storage.feature_gravatarimage, "#feature_gravatarimage", true);
    toggleFeature(storage.feature_lockeditems, "#feature_lockeditems", true);
    toggleFeature(storage.feature_helplink, "#feature_helplink", true);
    toggleFeature(storage.feature_reminder, "#feature_reminder", false);
    toggleFeature(storage.feature_instantsearch, "#feature_instantsearch", true);
    toggleFeature(storage.feature_experimentalui, "#feature_experimentalui", false);
    toggleFeature(storage.feature_material_icons, "#feature_material_icons", false);
    toggleFeature(storage.feature_medialist, "#feature_medialist", true);
    toggleFeature(storage.feature_mediacard, "#feature_mediacard", true);
    toggleFeature(storage.feature_medialibrary, "#feature_medialibrary", true);
  });
};

/**
 * Auto activation when needed
 */
document.querySelector("#feature_experimentalui").onclick = function () {
  if (document.querySelector("#feature_experimentalui").checked == true) {
    document.querySelector("#feature_cetabs").checked = true;
    document.querySelector("#feature_material_icons").checked = true;
  } else {
    document.querySelector("#feature_material_icons").checked = false;
  }
};

document.querySelector("#feature_darkmode").onclick = function () {
  if (document.querySelector("#feature_darkmode").checked == false) {
    document.querySelector("#feature_darkmode_auto").disabled = true;
    document.querySelector("#feature_darkmode_auto").checked = false;
  } else {
    document.querySelector("#feature_darkmode_auto").disabled = false;
    document.querySelector("#feature_darkmode_auto").checked = false;
  }
};

/**
 * Advanced settings panel (sites)
 */
document.querySelector("#settings").onclick = function () {
  document.querySelector("#main").setAttribute("style", "display:none");
  document.querySelector("#domains").setAttribute("style", "display:block");
  document.querySelector("#save").setAttribute("style", "display:none");
  document.querySelector(".addDomain").addEventListener("click", addDomain.bind("", "", undefined));
  document.querySelector(".importSites").addEventListener("change", uploadJson);
  document.querySelector(".importSitesVisible").addEventListener("click", chooseJson);
  //Generating list of sites
  chrome.storage.sync.get(["site_manager"], (storage) => {
    storage.site_manager ? parseJsonSites(storage.site_manager) : false;
  });

  //If a site is passed into the URL
  setTimeout(function () {
    let url = new URL(window.location.href);
    if (url.searchParams.get("site")) {
      let domain = new URL(url.searchParams.get("domain")).origin;
      let domainId = addDomain("", domain, true);
      addSite(domainId, url.searchParams.get("site"), "", "", true, url.searchParams.get("name"));
    }
  }, 500);
};

/**
 * Click to go back to main screen
 */
document.querySelector(".back").onclick = function (event) {
  event.preventDefault();
  let reload = false;

  // if (document.querySelector(".trackChanges").value == "1") {
  //   if (!confirm("Changes that you made may not be saved.\nContinue without saving?") == true) {
  //     reload = false;
  //   }
  // }
  if (reload) {
    document.querySelectorAll(".domain").forEach((div) => {
      div.remove();
    });

    var url = new URL(window.location.href);
    var configureDomains = url.searchParams.get("configure_domains");
    var backUrl = url.searchParams.get("url");
    if (configureDomains == "false") {
      window.open(backUrl + "&sc_bw=1");
      window.close();
    } else {
      document.querySelector("#main").setAttribute("style", "display:block");
      document.querySelector("#domains").setAttribute("style", "display:none");
      document.querySelector("#save").setAttribute("style", "display:block");
    }
  }
};

/**
 * Click to exports sites
 */
document.querySelector(".exportSites").onclick = function (event) {
  event.preventDefault();

  var json = {};
  var count = 0;
  var error = false;
  var domain, key, value, lang;

  document.querySelectorAll(".domain").forEach(function (url) {
    url.querySelectorAll(".site").forEach(function (site) {
      //variables
      domain = url.dataset.domain;
      key = site.querySelector("input[name='key']").value;
      value = site.querySelector("input[name='value']").value;
      lang = site.querySelector("input[name='lang']").value;
      error = false;
      //Lang check
      lang = lang == "" ? "" : lang.toLowerCase();
      //Sanity check
      if (key == "") {
        site.querySelector("input[name='key']").setAttribute("style", "border-color:red");
        site.querySelector("input[name='value']").setAttribute("style", "border-color:#ccc");
        error = true;
      } else if (value == "") {
        site.querySelector("input[name='key']").setAttribute("style", "border-color:#ccc");
        site.querySelector("input[name='value']").setAttribute("style", "border-color:red");
        error = true;
      } else {
        try {
          value = new URL(value).href;
          //Build object for this domain
          !json[domain] ? (json[domain] = {}) : false;
          //Add site to this domain
          json[domain][count] = { [key]: value, language: lang };
          count++;
          site.querySelector("input[name='key']").setAttribute("style", "border-color:#ccc");
          site.querySelector("input[name='value']").setAttribute("style", "border-color:#ccc");
        } catch (e) {
          site.querySelector("input[name='value']").setAttribute("style", "border-color:red");
          console.warn(value + " is not a valid URL");
          error = true;
        }
      }
    });
  });

  //formData = JSON.stringify(formData);
  if (error) {
    alert("You have some errors...");
  } else {
    console.log(JSON.stringify(json));
    let result = JSON.stringify(json, null, 2);
    let today = new Date().toISOString().slice(0, 10);
    // Save as file
    chrome.downloads.download({
      url: "data:application/json;base64," + btoa(result),
      filename: "sitecore_author_toolbox_sites_" + today + ".json",
    });
  }
};
/**
 * Click to save sites
 */
document.querySelector(".save_sites").onclick = function (event) {
  event.preventDefault();

  var json = {};
  var count = 0;
  var error = false;
  var domain, key, value, lang;

  document.querySelectorAll(".domain").forEach(function (url) {
    url.querySelectorAll(".site").forEach(function (site) {
      //variables
      domain = url.dataset.domain;
      key = site.querySelector("input[name='key']").value;
      value = site.querySelector("input[name='value']").value;
      lang = site.querySelector("input[name='lang']").value;
      //Lang check
      lang = lang == "" ? "" : lang.toLowerCase();
      //Sanity check
      if (key == "") {
        site.querySelector("input[name='key']").setAttribute("style", "border-color:red");
        site.querySelector("input[name='value']").setAttribute("style", "border-color:#ccc");
        error = true;
      } else if (value == "") {
        site.querySelector("input[name='key']").setAttribute("style", "border-color:#ccc");
        site.querySelector("input[name='value']").setAttribute("style", "border-color:red");
        error = true;
      } else {
        try {
          value = new URL(value).href;
          //Build object for this domain
          !json[domain] ? (json[domain] = {}) : false;
          //Add site to this domain
          json[domain][count] = { [key]: value, language: lang };
          count++;
          site.querySelector("input[name='key']").setAttribute("style", "border-color:#ccc");
          site.querySelector("input[name='value']").setAttribute("style", "border-color:#ccc");
        } catch (e) {
          site.querySelector("input[name='value']").setAttribute("style", "border-color:red");
          console.warn(value + " is not a valid URL");
          error = true;
        }
      }
    });
  });

  chrome.storage.sync.set({ site_manager: json }, function () {
    if (error) {
      alert("You have some errors...");
      document.querySelector(".save_sites").innerHTML = "Save your sites";
    } else {
      let params = new URLSearchParams(window.location.search);
      params.delete("site");
      params.delete("name");
      window.location.search = params;
      document.querySelector(".trackChanges").value = "0";
      document.querySelector("#sitesList").setAttribute("style", "opacity:0.3");
      document.querySelector(".save_sites").innerHTML = "Saving...";
      setTimeout(function () {
        document.querySelector(".save_sites").innerHTML = "OK!";
      }, 1000);
      setTimeout(function () {
        document.querySelector("#sitesList").setAttribute("style", "opacity:1");
        document.querySelector(".save_sites").innerHTML = "Save your sites";
        !window.location.search.includes("configure_domains") ? (window.location.search += "&configure_domains=true") : location.reload();
      }, 1500);
    }
  });
};

/**
 * Show hints
 */
document.querySelector(".show_hint").onclick = function () {
  document.querySelector("#hint").setAttribute("style", "display:inline-block");
};

/**
 * Show more options
 */
document.querySelector(".advanced_mode").onclick = function () {
  document.querySelectorAll(".lang_url").forEach(function (elem) {
    elem.setAttribute("style", "display:inline-block");
  });
  document.querySelector(".showAdvanced").value = 1;
  document.querySelector(".advanced_mode").setAttribute("style", "display:none");
  document.querySelector(".basic_mode").setAttribute("style", "display:block");
};

/**
 * Show less options
 */
document.querySelector(".basic_mode").onclick = function () {
  document.querySelectorAll(".lang_url").forEach(function (elem) {
    elem.setAttribute("style", "display:none");
  });
  document.querySelector(".showAdvanced").value = 0;
  document.querySelector(".basic_mode").setAttribute("style", "display:none");
  document.querySelector(".advanced_mode").setAttribute("style", "display:block");
};

/**
 * Click to save preferences
 */
document.querySelector(".save_settings").onclick = function (event) {
  event.preventDefault();

  let featuresEnabled = {
    feature_urls: document.querySelector("#feature_urls").checked,
    feature_flags: document.querySelector("#feature_flags").checked,
    feature_errors: document.querySelector("#feature_errors").checked,
    feature_notification: document.querySelector("#feature_notification").checked,
    feature_darkmode: document.querySelector("#feature_darkmode").checked,
    feature_darkmode_auto: document.querySelector("#feature_darkmode_auto").checked,
    feature_favorites: document.querySelector("#feature_favorites").checked,
    feature_reloadnode: document.querySelector("#feature_reloadnode").checked,
    feature_launchpad: document.querySelector("#feature_launchpad").checked,
    feature_launchpad_tiles: document.querySelector("#feature_launchpad_tiles").checked,
    feature_charscount: document.querySelector("#feature_charscount").checked,
    feature_autoexpand: document.querySelector("#feature_autoexpand").checked,
    feature_quickinfoenhancement: document.querySelector("#feature_quickinfoenhancement").checked,
    feature_translatemode: document.querySelector("#feature_translatemode").checked,
    feature_contenteditor: document.querySelector("#feature_contenteditor").checked,
    feature_experienceeditor: document.querySelector("#feature_experienceeditor").checked,
    feature_cetabs: document.querySelector("#feature_cetabs").checked,
    feature_rtecolor: document.querySelector("#feature_rtecolor").checked,
    feature_messagebar: document.querySelector("#feature_messagebar").checked,
    feature_workbox: document.querySelector("#feature_workbox").checked,
    feature_urlstatus: document.querySelector("#feature_urlstatus").checked,
    feature_contextmenu: document.querySelector("#feature_contextmenu").checked,
    feature_gravatarimage: document.querySelector("#feature_gravatarimage").checked,
    feature_lockeditems: document.querySelector("#feature_lockeditems").checked,
    feature_helplink: document.querySelector("#feature_helplink").checked,
    feature_reminder: document.querySelector("#feature_reminder").checked,
    feature_instantsearch: document.querySelector("#feature_instantsearch").checked,
    feature_experimentalui: document.querySelector("#feature_experimentalui").checked,
    feature_material_icons: document.querySelector("#feature_material_icons").checked,
    feature_medialist: document.querySelector("#feature_medialist").checked,
    feature_mediacard: document.querySelector("#feature_mediacard").checked,
    feature_medialibrary: document.querySelector("#feature_medialibrary").checked,
  };

  //Save data
  chrome.storage.sync.set(featuresEnabled, function () {
    console.log(featuresEnabled);
  });

  //Get URL parameters
  let url = new URL(window.location.href);
  let fromLaunchpad = url.searchParams.get("launchpad");
  let buttonLabel = "Save your preferences";

  //Reload sitecore
  if (!fromLaunchpad) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
      let code = "window.location.reload();";
      chrome.tabs.executeScript(arrayOfTabs[0].id, { code });
    });
    buttonLabel = "Save and reload Sitecore";
  }
  document.querySelector(".save_settings").innerHTML = "Saving...";
  setTimeout(function () {
    document.querySelector(".save_settings").innerHTML = "OK!";
  }, 1000);
  setTimeout(function () {
    document.querySelector(".save_settings").innerHTML = buttonLabel;
  }, 1500);
};

/**
 * Check if changes are not savec
 */
window.addEventListener("beforeunload", function (e) {
  // Cancel the event
  e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  // Chrome requires returnValue to be set
  if (document.querySelector(".trackChanges").value == "1") {
    e.returnValue = "";
  }
});
