/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */
/* eslint-disable object-property-newline */
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
import { animateHeader, chooseJson, addSite, addDomain } from "./modules/dom.js";
import { getFeatures, uploadJson, parseJsonSites } from "./modules/load.js";
import { saveSettings, saveSites, exportSites } from "./modules/save.js";

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

  //Get active features
  getFeatures();

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
};

/**
 * Event listenners
 */

//Auto activations
document.querySelector("#feature_experimentalui").onclick = function () {
  if (document.querySelector("#feature_experimentalui").checked == true) {
    document.querySelector("#feature_cetabs").checked = true;
    document.querySelector("#feature_material_icons").checked = true;
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

//Advanced settings
document.querySelector("#settings").onclick = function () {
  document.querySelector("#main").setAttribute("style", "display:none");
  document.querySelector("#domains").setAttribute("style", "display:block");
  document.querySelector("#save").setAttribute("style", "display:none");
  document.querySelector(".addDomain").addEventListener("click", addDomain.bind("", "", undefined));
  document.querySelector(".importSites").addEventListener("change", uploadJson);
  document.querySelector(".importSitesVisible").addEventListener("click", chooseJson);
  //Get status of advanced mode
  let advancedMode = localStorage.getItem("scAdvancedMode");
  advancedMode == "true" ? document.querySelector(".advanced_mode").click() : document.querySelector(".basic_mode").click();
  //Generating list of sites
  chrome.storage.sync.get(["site_manager"], (storage) => {
    storage.site_manager ? parseJsonSites(storage.site_manager) : false;
  });

  setTimeout(function () {
    let url = new URL(window.location.href);
    if (url.searchParams.get("site")) {
      let domain = new URL(url.searchParams.get("domain")).origin;
      let domainId = addDomain("", domain, true);
      addSite(domainId, url.searchParams.get("site"), "", "", true, false, true, url.searchParams.get("name"));
    }
  }, 500);
};

//Back button
document.querySelector(".back").onclick = function (event) {
  event.preventDefault();
  document.querySelectorAll(".domain, #sitesList > legend").forEach((div) => {
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
};

//Export sites
document.querySelector(".exportSites").onclick = function (event) {
  event.preventDefault();
  exportSites();
};

//Save sites
document.querySelector(".save_sites").onclick = function (event) {
  event.preventDefault();
  saveSites();
};

//Show hints
document.querySelector(".show_hint").onclick = function () {
  document.querySelector("#hint").setAttribute("style", "display:inline-block");
};

//Show advanced mode
document.querySelector(".advanced_mode").onclick = function () {
  document.querySelectorAll(".lang_url, .embedding_url, .displayName_url").forEach(function (elem) {
    elem.setAttribute("style", "display:inline-block");
  });
  localStorage.setItem("scAdvancedMode", true);
  document.querySelector(".showAdvanced").value = 1;
  document.querySelector(".advanced_mode").setAttribute("style", "display:none");
  document.querySelector(".basic_mode").setAttribute("style", "display:block");
};

//Show basic mode
document.querySelector(".basic_mode").onclick = function () {
  document.querySelectorAll(".lang_url, .embedding_url, .displayName_url").forEach(function (elem) {
    elem.setAttribute("style", "display:none");
  });
  localStorage.setItem("scAdvancedMode", false);
  document.querySelector(".showAdvanced").value = 0;
  document.querySelector(".basic_mode").setAttribute("style", "display:none");
  document.querySelector(".advanced_mode").setAttribute("style", "display:block");
};

//Save settings
document.querySelector(".save_settings").onclick = function (event) {
  event.preventDefault();
  saveSettings();

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
