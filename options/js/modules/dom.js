/* eslint-disable require-unicode-regexp */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable max-params */
/* eslint-disable no-alert */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

export { animateHeader, toggleFeature, chooseJson, addSite, addDomain };

/**
 * Banner animation
 */
const animateHeader = (scroll_pos) => {
  if (scroll_pos >= 90) {
    document.querySelector("#banner").classList.add("animate");
  } else {
    document.querySelector("#banner").classList.remove("animate");
  }
};

/**
 * Track changes
 */
const trackChanges = (isImport = true) => {
  !isImport ? (document.querySelector(".save_sites").innerHTML = document.querySelector(".save_sites").innerHTML.replace("*", "") + "*") : false;
  !isImport ? (document.querySelector(".trackChanges").value = "0") : false;
};

/**
 * Update features checkbox in option list view
 */
const toggleFeature = (featureStorage, featureId, defautlState = true) => {
  if (featureStorage != undefined) {
    featureStorage ? (document.querySelector(featureId).checked = true) : false;
  } else {
    document.querySelector(featureId).checked = defautlState;
  }
};

/**
 * Select file
 */
const chooseJson = () => {
  document.querySelector(".importSites").click();
};

/**
 * Prepend input fields to add a site
 */
const deleteSite = (site) => {
  //   if (confirm("Are you sure you want to delete this site?") == true) {
  document.querySelector("#" + site) ? document.querySelector("#" + site).remove() : false;
  trackChanges(false);
  //   }
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
    url = prompt("Please add a new domain:\nIt should be your Sitecore CM server URL.", text);
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
        <legend><span class="domainDisplay">${newUrl.origin}</span> <div class="edit editDomain_${countDomains}"></div></legend>
        <fieldset class="domain" id="domain_${countDomains}" data-domain="${newUrl.origin}">
        <div class="addSite addSite_${countDomains}">+ ADD A SITE</div>
        </fieldset>`;
        document.querySelector("#sitesList").insertAdjacentHTML("beforeend", html);
        trackChanges(isImport);
        //Click events
        document.querySelector(".addSite_" + countDomains).addEventListener("click", addSite.bind("", "domain_" + countDomains, "", "", "", true, true, false));
        document.querySelector(".editDomain_" + countDomains).addEventListener("click", editDomain.bind("", "domain_" + countDomains));
        tocreate === undefined ? addSite("domain_" + countDomains, "", "", "", true) : false;
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
 * PEdit a domain URL
 */
const editDomain = (domainId) => {
  let domain = document.querySelector("#" + domainId).dataset.domain;
  let url = prompt("Edit this domain URL (CM server):", domain);
  let isExisting = false;

  if (url !== null) {
    try {
      //Verify if URL is well formatted
      let newUrl = new URL(url);
      //Check if domains already exists
      document.querySelectorAll(".domain").forEach((elem) => {
        if (newUrl.origin == elem.dataset.domain) {
          alert("This domain already exist.");
          isExisting = true;
        }
      });
      if (isExisting == false) {
        document.querySelector("#" + domainId).dataset.domain = newUrl;
        document.querySelector("#" + domainId + " > h3 > .domainDisplay").innerHTML = newUrl;
        trackChanges(false);
      }
    } catch (e) {
      alert("Your domain is not a valid URL, please try again");
    }
  }
};

/**
 * Prepend input fields to add a site
 */
const addSite = (domain, path, cd, lang = "", embedding = true, displayName = true, autoadd = false, name = "", isImport = "") => {
  let isExisting = false;

  //Check if sites already exists
  document.querySelectorAll("#" + domain + " input[name='key']").forEach((elem) => {
    let elemLang = elem.parentElement.parentElement.querySelector(".lang_url > input") ? elem.parentElement.parentElement.querySelector(".lang_url > input").value.toLowerCase() : "";
    let setLang = lang ? lang.toString().toLowerCase() : lang;
    if (path == elem.value && setLang == elemLang) {
      !isImport ? alert(`This site "` + elem.value + `"already exist.`) : false;
      isExisting = true;
      console.log("Site already exists", elem.value + " " + elemLang);
    }
  });

  if (isExisting == false) {
    let countSites = document.querySelectorAll(".site").length + 1;
    let showAdvanced = document.querySelector(".showAdvanced").value == 1 ? "display:inline-block" : "display:none";
    let languageEmbedding = embedding ? "checked" : "";
    let languageDisplayName = displayName ? "checked" : "";
    //prettier-ignore
    let html = `
    <div class="site" id="site_${countSites}">
        <div class="cm_url">
            <label for="sitePath">Sitecore site path</label>
            <input id="sitePath" name="key" type="text" placeholder="e.g /sitecore/content/home" value="${decodeURI(path)}">
        </div>
        <div class="arrow">➝</div>
        <div class="cd_url">
            <label for="siteUrl">Site URL</label>
            <input id="siteUrl" name="value" type="url" placeholder="e.g https://..." pattern="https?://.*" value="${decodeURI(cd)}"> 
        </div>
        <div class="lang_url" style="${showAdvanced}" title="Whether or not you want to bind this URL to a specific language version. (if empty, applies to all languages)">
            <label for="langUrl">Language</label>
            <input id="langUrl" name="lang" type="url" placeholder="e.g fr-FR" value="${decodeURI(lang)}"> 
        </div>
        <div class="embedding_url" style="${showAdvanced}" title="Whether or not you want to add language code in the URL">
            <label for="langUrl">Embedding</label>
            <input id="embeddingUrl_${countSites}" name="embedding" class="scCheckbox" type="checkbox" ${languageEmbedding} />
            <label for="embeddingUrl_${countSites}" class="scLabel"></label>
        </div>
        <div class="displayName_url" style="${showAdvanced}" title="Whether or not you want to use Display Name instead of Item Name in your URL">
            <label for="langUrl">Display name</label>
            <input id="displayNameUrl_${countSites}" name="displayName" class="scCheckbox" type="checkbox" ${languageDisplayName} />
            <label for="displayNameUrl_${countSites}" class="scLabel"></label>
        </div>
        <div class="delete deleteSite_${countSites}" title="Delete this site">✕ Delete</div>
    </div>`;
    document.querySelector("#" + domain + " > .addSite").insertAdjacentHTML("beforebegin", html);
    trackChanges(isImport);
    //style
    autoadd ? document.querySelector("#site_" + countSites + " input[name='value']").setAttribute("style", "border-color:#6fdd60") : false;
    //Prompt for URL
    if (autoadd) {
      let tmp = prompt("New site (" + name + "): enter CD/live URL of this site:");
      if (tmp !== null) {
        document.querySelector("#site_" + countSites + " input[name='value']").value = tmp;
      } else {
        window.location.href = window.location.href.replace(/(&site=)[^&]+/, "");
      }
    }

    //Click event
    document.querySelector(".deleteSite_" + countSites).addEventListener("click", deleteSite.bind("", "site_" + countSites, "", ""));
  }
};
