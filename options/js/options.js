/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-console */
/* eslint-disable object-property-newline */
/* eslint-disable space-before-function-paren */
/* eslint-disable array-element-newline */
/* eslint-disable require-jsdoc */
/* eslint-disable radix */
/* eslint-disable no-alert */
/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

/**
 * Banner animation
 */
// eslint-disable-next-line func-style
function animateHeader(scroll_pos) {
  if (scroll_pos >= 90) {
    document.querySelector("#banner").classList.add("animate");
  } else {
    document.querySelector("#banner").classList.remove("animate");
  }
}

/**
 * Prepend input fields to add a site
 */
const deleteSite = (site) => {
  if (confirm("Are you sure you want to delete this site?") == true) {
    document.querySelector("#" + site).remove();
  }
};

const onReaderLoad = (event) => {
  console.log(event.target.result);
  var json = JSON.parse(event.target.result);
  console.log(json);
  parseJsonSites(json);
};

/**
 * Upload a json file
 */
const uploadJson = (event) => {
  if (document.querySelector(".importSites").files[0].type != "application/json") {
    alert("Your file is not a valid Json format");
  } else {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
    setTimeout(() => {
      document.querySelector("#set_domains").click();
    }, 200);
  }
};

/**
 * Select file
 */
const chooseJson = () => {
  document.querySelector(".importSites").click();
};

/**
 * Parse a json and create html
 */
const parseJsonSites = (json) => {
  console.log(json);
  for (var [domain, values] of Object.entries(json)) {
    let domainId = addDomain("", domain, true);
    for (var [id, site] of Object.entries(values)) {
      addSite(domainId, Object.entries(site)[0][0], Object.entries(site)[0][1], false, "", true);
    }
  }
};

/**
 * Prepend input fields to add a site
 */
// eslint-disable-next-line max-params
const addSite = (domain, path, cd, autoadd = false, name = "", isImport = "") => {
  let isExisting = false;

  //Check if sites already exists
  document.querySelectorAll("#" + domain + " input[name='key']").forEach((elem) => {
    if (path == elem.value) {
      !isImport ? alert(`This site "` + elem.value + `"already exist.`) : false;
      isExisting = true;
      console.log("Site already exists", elem.value);
    }
  });

  if (isExisting == false) {
    let countSites = document.querySelectorAll(".site").length + 1;
    //prettier-ignore
    let html = `
  <div class="site" id="site_` + countSites + `">
  <div class="cm_url">
    <input name="key" type="text" placeholder="Sitecore path to /home" value="${decodeURI(path)}">
  </div>
  <div id="arrow">&nbsp;</div>
  <div class="cd_url">
    <input name="value" type="url" placeholder="CD URL" pattern="https?://.*" value="${decodeURI(cd)}">
  </div> 
  <div class="delete deleteSite_` + countSites + `" >&nbsp;</div>
  </div>`;
    document.querySelector("#" + domain + " > .addSite").insertAdjacentHTML("beforebegin", html);
    //style
    autoadd ? document.querySelector("#site_" + countSites + " input[name='value']").setAttribute("style", "border-color:#6fdd60") : false;
    //Prompt for URL
    autoadd ? (document.querySelector("#site_" + countSites + " input[name='value']").value = prompt("Please enter CD/live URL of your " + name + " site")) : false;
    //Click event
    document.querySelector(".deleteSite_" + countSites).addEventListener("click", deleteSite.bind("", "site_" + countSites, "", ""));
  }
};

/**
 * Prepend input fields to add a domain (deprecated)
 */
// eslint-disable-next-line consistent-return
const addDomain = (text = "", tocreate = undefined, isImport = false) => {
  let isExisting = false;
  let url;
  let returnId;

  if (tocreate === undefined) {
    url = prompt("Please enter a domain URL", text);
  } else {
    url = tocreate;
  }

  if (url !== null) {
    try {
      //Verify if URL is well formatted
      let newUrl = new URL(url);
      //Get number of domains
      let countDomains = document.querySelectorAll(".domain").length;
      //Check if domains already exists
      document.querySelectorAll(".domain").forEach((elem) => {
        if (newUrl.origin == elem.dataset.domain) {
          !isImport ? alert("This domain already exist.") : false;
          returnId = elem.id;
          isExisting = true;
          console.log("Domain already exists", returnId);
        }
      });

      if (isExisting == false) {
        countDomains++;
        //prettier-ignore
        let html = `
        <div class="domain" id="domain_` + countDomains + `" data-domain="` + newUrl.origin + `">
          <h3>` + countDomains + ` - ` + newUrl.origin + `</h3>
          <div class="addSite addSite_` + countDomains + `">ADD A SITE</div>
        </div>`;
        document.querySelector("#sitesList").insertAdjacentHTML("beforeend", html);
        //Click event
        document.querySelector(".addSite_" + countDomains).addEventListener("click", addSite.bind("", "domain_" + countDomains, "", "", false));
        tocreate === undefined ? addSite("domain_" + countDomains, "", "") : false;
        returnId = `domain_` + countDomains;
      }
    } catch (error) {
      alert("Your domain is not a valid URL, please try again");
      addDomain(url);
    }
  }

  return returnId;
};

/**
 * Update features checkbox in option list view
 */
const toggleFeature = (featureStorage, featureId, defautlState = true) => {
  //console.log("Storage " + featureId + " -> ", featureStorage);
  if (featureStorage != undefined) {
    featureStorage ? (document.querySelector(featureId).checked = true) : false;
  } else {
    document.querySelector(featureId).checked = defautlState;
  }
};

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

  setTimeout(function () {
    //Variables
    let url = new URL(window.location.href);
    let newSite = url.searchParams.get("site");
    let backUrl = url.searchParams.get("url");
    let nameSite = url.searchParams.get("name");
    let isDomainExists = false;

    if (newSite) {
      let domain = new URL(backUrl).origin;
      //Find the domain in DOM
      document.querySelectorAll(".domain").forEach((div) => {
        if (div.dataset.domain == domain) {
          addSite(div.id, newSite, "", true, nameSite);
          isDomainExists = true;
        }
      });
      //If does not exists, add it
      if (!isDomainExists) {
        let domainId = addDomain("", domain);
        addSite(domainId, newSite, "", true);
      }
      //Add new site and highlight in green the missing part
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
