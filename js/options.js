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
  document.querySelector("#" + site).remove();
};

/**
 * Prepend input fields to add a site
 */
const addSite = (domain, path, cd) => {
  let countSites = document.querySelectorAll(".site").length + 1;
  //prettier-ignore
  let html = `
  <div class="site" id="site_` + countSites + `">
  <div class="cm_url">
    <input name="key" type="url" placeholder="Sitecore path to /home" value="${path}">
  </div>
  <div id="arrow">&nbsp;</div>
  <div class="cd_url">
    <input name="value" type="url" placeholder="CD URL" pattern="https?://.*" value="${cd}">
  </div> 
  <div class="delete deleteSite_` + countSites + `" >&nbsp;</div>
  </div>`;
  document.querySelector("#" + domain + " > .addSite").insertAdjacentHTML("beforebegin", html);
  //Click event
  document.querySelector(".deleteSite_" + countSites).addEventListener("click", deleteSite.bind("", "site_" + countSites, "", ""));
};

/**
 * Prepend input fields to add a domain (deprecated)
 */
const addDomain = (text) => {
  let isExisting = false;
  let url = prompt("Please enter a domain URL", text);
  if (url !== null) {
    try {
      //Verify if URL is well formatted
      let newUrl = new URL(url);
      //Get number of domainsand increment
      let countDomains = document.querySelectorAll(".domain").length + 1;
      //Check if domains already exists
      document.querySelectorAll(".domain").forEach((elem) => {
        if (newUrl.origin == elem.dataset.domain) {
          alert("This domain already exist.");
          isExisting = true;
        }
      });

      if (isExisting == false) {
        //prettier-ignore
        let html = `
        <div class="domain" id="domain_` + countDomains + `" data-domain="` + newUrl.origin + `">
          <h3>` + countDomains + ` - ` + newUrl.origin + `</h3>
          <div class="addSite addSite_` + countDomains + `">Add sites</div>
        </div>`;
        document.querySelector(".addDomain").insertAdjacentHTML("beforebegin", html);
        //Click event
        document.querySelector(".addSite_" + countDomains).addEventListener("click", addSite.bind("", "domain_" + countDomains, "", ""));
        addSite("domain_" + countDomains, "", "");
      }
    } catch (error) {
      alert("Your domain is not a valid URL, please try again");
      addDomain(url);
    }
  }
};

/**
 * Update features checkbox in option list view
 */
const toggleFeature = (featureStorage, featureId, defautlState = true) => {
  console.log("Storage " + featureId + " -> ", featureStorage);
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

  /**
   * Header animation
   */
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
 * Click to add/remove domains and sites
 */
document.querySelector("#settings").onclick = function () {
  document.querySelector("#main").setAttribute("style", "display:none");
  document.querySelector("#domains").setAttribute("style", "display:block");
  document.querySelector("#save").setAttribute("style", "display:none");
};

/**
 * Click to go back to main screen
 */
document.querySelector("#back").onclick = function () {
  event.preventDefault();

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
 * Generate list when editing sites
 */
chrome.storage.sync.get(["site_manager"], function (result) {
  //Add button and heading
  // document.querySelector("#sitesList").insertAdjacentHTML("afterbegin", `<div id="addSite">Add sites</div>`);
  document.querySelector("#sitesList").insertAdjacentHTML("afterend", `<div class="addDomain">Add a new domain</div>`);
  document.querySelector(".addDomain").addEventListener("click", addDomain.bind("", ""));

  // document.querySelector("#addSite").addEventListener("click", addSite.bind("", "", ""));
  if (result.site_manager != undefined) {
    //Loop to generate sites
    for (let [path, cd] of Object.entries(result.site_manager)) {
      addSite(path, cd);
    }
  }
});

/**
 * Click to save domains/sites
 */
document.querySelector("#set_domains").onclick = function (event) {
  event.preventDefault();

  //Variables
  // var count = 1;
  // var domainId;
  // var currentCM, currentCD;
  // var jsonString = "{";
  // var error = false;
  // var empty = true;

  var formData = {};

  //Sites
  let sites = document.querySelectorAll("form#domains #sitesList input");

  for (var i = 0; i < sites.length; i++) {
    if (i % 2 == 0) {
      if (sites[i].value) {
        formData[sites[i].value] = sites[i + 1].value;
      }
    }
  }
  //formData = JSON.stringify(formData);
  console.log(formData);

  // //Parse form
  // var domains = document.querySelectorAll("form#domains #domainsList input");

  // for (var domain of domains) {
  //   //Variable
  //   var url = "";

  //   //Reset CSS
  //   domain.setAttribute("style", "");

  //   //Domain
  //   domainId = parseInt(domain.name.split("[")[1].replace("]", ""));
  //   currentCM = document.querySelector("input[name='cm[" + domainId + "]']");
  //   currentCD = document.querySelector("input[name='cd[" + domainId + "]']");

  //   if (count % 2 == 1) {
  //     //CM
  //     if (currentCM.value != "" && currentCD.value == "") {
  //       currentCD.setAttribute("style", "border-color:red");
  //       alert("CD #" + parseInt(domainId + 1) + " is missing");
  //       error = true;
  //     } else if (domain.value != "") {
  //       empty = false;
  //       try {
  //         url = new URL(domain.value);
  //       } catch (e) {
  //         currentCM.setAttribute("style", "border-color:red");
  //         alert("CM #" + parseInt(domainId + 1) + " is not a valid URL");
  //         error = true;
  //       }
  //     }

  //     if (url.origin != undefined) {
  //       currentCM.value = url.origin;
  //     }
  //   } else {
  //     //CD
  //     if (currentCM.value == "" && currentCD.value != "") {
  //       alert("CM #" + parseInt(domainId + 1) + " is missing");
  //       error = true;
  //     } else if (domain.value != "") {
  //       empty = false;
  //       try {
  //         url = new URL(domain.value);
  //       } catch (e) {
  //         currentCD.setAttribute("style", "border-color:red");
  //         alert("CD #" + parseInt(domainId + 1) + " is not a valid URL");
  //         error = true;
  //       }
  //     }

  //     if (url.origin != undefined) {
  //       currentCD.value = url.origin;
  //       let cmUrl = new URL(currentCM.value);
  //       let cdUrl = new URL(currentCD.value);

  //       if (cmUrl.protocol == "https:" && cdUrl.protocol == "http:") {
  //         alert("Warning!\nLive status might not work as expected. You will probably face a mixed-content issue as your CM and CD are using a different protocol (https vs http) \n\n" + cmUrl.origin + "\n" + cdUrl.origin);
  //         error = true;
  //       } else {
  //         //Add domain to JsonString
  //         // console.log(parseInt(domainId+1) + " ---> " +url.origin);
  //         jsonString += '"' + currentCM.value + '":"' + currentCD.value + '",';
  //       }
  //     }
  //   }
  //   count++;
  // }
  //End for

  //Create Json object for storage
  // jsonString += "}";
  // jsonString = jsonString.replace(",}", "}").replace("{}", undefined);
  // //console.log(error);

  // if (jsonString != "undefined") {
  //   var json = JSON.parse(jsonString);
  //   console.log(json);
  // }

  // if (empty == true) {
  //   json = "";
  // }

  // if (error == false) {
  //   chrome.storage.sync.set({ domain_manager: json }, function () {
  //     document.querySelector("#set_domains").innerHTML = "Saving...";
  //     setTimeout(function () {
  //       document.querySelector("#set_domains").innerHTML = "OK!";
  //     }, 1000);
  //     setTimeout(function () {
  //       document.querySelector("#set_domains").innerHTML = "Save your sites";
  //     }, 1500);
  //   });
  // }
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
