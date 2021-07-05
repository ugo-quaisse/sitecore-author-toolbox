/* eslint-disable newline-per-chained-call */
/* eslint-disable object-property-newline */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable array-element-newline */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

export { saveSettings, saveSites, exportSites };

/**
 * Save sites in storage
 */
const saveSites = () => {
  var json = {};
  var count = 0;
  var error = false;
  var domain, key, value, lang, siteName, embedding, display;

  document.querySelectorAll(".domain").forEach(function (url) {
    url.querySelectorAll(".site").forEach(function (site) {
      //variables
      domain = url.dataset.domain;
      key = site.querySelector("input[name='key']").value;
      value = site.querySelector("input[name='value']").value;
      lang = site.querySelector("input[name='lang']").value;
      siteName = site.querySelector("input[name='siteName']").value;
      embedding = site.querySelector("input[name='embedding']").checked;
      display = site.querySelector("input[name='displayName']").checked;
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
          json[domain][count] = { [key]: value, language: lang, siteName: siteName, languageEmbedding: embedding, useDisplayName: display };
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

  if (error) {
    alert("You have some errors...");
    document.querySelector(".save_sites").innerHTML = "Save your sites";
  } else {
    chrome.storage.sync.set({ site_manager: json }, saveRedirect);
    chrome.storage.local.set({ site_manager: json }, saveRedirect);
  }
};

/**
 * Export sites in a json
 */
const exportSites = () => {
  var json = {};
  var count = 0;
  var error = false;
  var domain, key, value, lang, siteName, embedding, display;

  document.querySelectorAll(".domain").forEach(function (url) {
    url.querySelectorAll(".site").forEach(function (site) {
      //variables
      domain = url.dataset.domain;
      key = site.querySelector("input[name='key']").value;
      value = site.querySelector("input[name='value']").value;
      lang = site.querySelector("input[name='lang']").value;
      siteName = site.querySelector("input[name='siteName']").value;
      embedding = site.querySelector("input[name='embedding']").checked;
      display = site.querySelector("input[name='displayName']").checked;
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
          json[domain][count] = { [key]: value, language: lang, siteName: siteName, languageEmbedding: embedding, useDisplayName: display };
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
 * Save extension settings
 */
const saveSettings = () => {
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
    feature_editcommands: document.querySelector("#feature_editcommands").checked,
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
};

/**
 * Redirection after saving sites
 */
const saveRedirect = () => {
  let params = new URLSearchParams(window.location.search);
  params.delete("site");
  params.delete("name");
  params.delete("domain");
  window.history.replaceState({}, "", `${window.location.pathname}?${params}${window.location.hash}`);
  document.querySelector("#sitesList").setAttribute("style", "opacity:0.3");
  document.querySelector(".save_sites").innerHTML = "Saving...";
  setTimeout(function () {
    document.querySelector(".save_sites").innerHTML = "Saved!";
  }, 1000);
  setTimeout(function () {
    document.querySelector("#sitesList").setAttribute("style", "opacity:1");
    document.querySelector(".save_sites").innerHTML = "Save your sites";
    !window.location.search.includes("configure_domains") ? (window.location.search += "&configure_domains=true") : location.reload();
  }, 1500);
};
