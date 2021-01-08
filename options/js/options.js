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
    document.querySelector("#set").innerHTML = "Save your preferences";
    document.querySelector("#scHeader").style.display = "inherit";
    document.querySelector("#scBack").href = backUrl;
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
    toggleFeature(storage.feature_darkmode_auto, "#feature_darkmode_auto", true);
    toggleFeature(storage.feature_favorites, "#feature_favorites", false);
    toggleFeature(storage.feature_reloadnode, "#feature_reloadnode", true);
    toggleFeature(storage.feature_launchpad, "#feature_launchpad", true);
    toggleFeature(storage.feature_launchpad_tiles, "#feature_launchpad_tiles", false);
    toggleFeature(storage.feature_rtl, "#feature_rtl", true);
    toggleFeature(storage.feature_charscount, "#feature_charscount", true);
    toggleFeature(storage.feature_autoexpand, "#feature_autoexpand", true);
    toggleFeature(storage.feature_translatemode, "#feature_translatemode", false);
    toggleFeature(storage.feature_contenteditor, "#feature_contenteditor", true);
    toggleFeature(storage.feature_experienceeditor, "#feature_experienceeditor", true);
    toggleFeature(storage.feature_cetabs, "#feature_cetabs", false);
    toggleFeature(storage.feature_rtecolor, "#feature_rtecolor", true);
    toggleFeature(storage.feature_messagebar, "#feature_messagebar", false);
    toggleFeature(storage.feature_workbox, "#feature_workbox", true);
    toggleFeature(storage.feature_contextmenu, "#feature_contextmenu", true);
    toggleFeature(storage.feature_gravatarimage, "#feature_gravatarimage", true);
    toggleFeature(storage.feature_helplink, "#feature_helplink", true);
    toggleFeature(storage.feature_instantsearch, "#feature_instantsearch", true);
    toggleFeature(storage.feature_experimentalui, "#feature_experimentalui", false);
    toggleFeature(storage.feature_contrast_icons, "#feature_contrast_icons", false);
  });
};

/**
 * Auto activation when needed
 */
document.querySelector("#feature_experimentalui").onclick = function () {
  if (document.querySelector("#feature_experimentalui").checked == true) {
    document.querySelector("#feature_cetabs").checked = true;
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
    parseJsonSites(storage.site_manager);
  });

  //If a site is passed into the URL
  setTimeout(function () {
    let url = new URL(window.location.href);
    if (url.searchParams.get("site")) {
      let domain = new URL(url.searchParams.get("url")).origin;
      let domainId = addDomain("", domain, true);
      addSite(domainId, url.searchParams.get("site"), "", true, url.searchParams.get("name"));
    }
  }, 500);
};

/**
 * Click to go back to main screen
 */
document.querySelector("#back").onclick = function (event) {
  event.preventDefault();

  document.querySelectorAll(".domain").forEach((div) => {
    div.remove();
  });

  var url = new URL(window.location.href);
  var configureDomains = url.searchParams.get("configure_domains");
  var backUrl = url.searchParams.get("url");

  if (configureDomains == "true") {
    window.open(backUrl + "&sc_bw=1");
    window.close();
  } else {
    document.querySelector("#main").setAttribute("style", "display:block");
    document.querySelector("#domains").setAttribute("style", "display:none");
    document.querySelector("#save").setAttribute("style", "display:block");
  }
};

/**
 * Click to exports domains/sites
 */
document.querySelector(".exportSites").onclick = function (event) {
  event.preventDefault();

  var json = {};
  var count = 0;
  var error = false;
  var domain, key, value;

  document.querySelectorAll(".domain").forEach(function (url) {
    url.querySelectorAll(".site").forEach(function (site) {
      //variables
      domain = url.dataset.domain;
      key = site.querySelector("input[name='key']").value;
      value = site.querySelector("input[name='value']").value;
      error = false;
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
          json[domain][count] = { [key]: value };
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
 * Click to save domains/sites
 */
document.querySelector("#set_domains").onclick = function (event) {
  event.preventDefault();

  var json = {};
  var count = 0;
  var error = false;
  var domain, key, value;

  document.querySelectorAll(".domain").forEach(function (url) {
    url.querySelectorAll(".site").forEach(function (site) {
      //variables
      domain = url.dataset.domain;
      key = site.querySelector("input[name='key']").value;
      value = site.querySelector("input[name='value']").value;
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
          json[domain][count] = { [key]: value };
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
      document.querySelector("#set_domains").innerHTML = "Save your sites";
    } else {
      document.querySelector("#sitesList").setAttribute("style", "opacity:0.3");
      document.querySelector("#set_domains").innerHTML = "Saving...";
      setTimeout(function () {
        document.querySelector("#set_domains").innerHTML = "OK!";
      }, 1000);
      setTimeout(function () {
        document.querySelector("#sitesList").setAttribute("style", "opacity:1");
        document.querySelector("#set_domains").innerHTML = "Save your sites";
        // location.reload();
      }, 1500);
    }
  });
};

/**
 * Click to save preferences
 */
document.querySelector("#set").onclick = function (event) {
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
    feature_helplink: document.querySelector("#feature_helplink").checked,
    feature_instantsearch: document.querySelector("#feature_instantsearch").checked,
    feature_experimentalui: document.querySelector("#feature_experimentalui").checked,
    feature_contrast_icons: document.querySelector("#feature_contrast_icons").checked,
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
  document.querySelector("#set").innerHTML = "Saving...";
  setTimeout(function () {
    document.querySelector("#set").innerHTML = "OK!";
  }, 1000);
  setTimeout(function () {
    document.querySelector("#set").innerHTML = buttonLabel;
  }, 1500);
};
