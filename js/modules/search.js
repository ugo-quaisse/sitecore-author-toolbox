/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from "./global.js";
import { exeJsCode } from "./helpers.js";
import { pathToBreadcrumb } from "./experimentalui.js";

export { initInstantSearch, instantSearch, enhancedSitecoreSearch, enhancedTreeSearch };

/**
 * Add Search box to Sitecore Header
 */
const initInstantSearch = (storage) => {
  storage.feature_instantsearch == undefined ? (storage.feature_instantsearch = true) : false;
  if (!global.isLaunchpad && storage.feature_instantsearch) {
    let globalHeader = document.querySelector(".sc-globalHeader");
    let html = '<input type="text" class="scInstantSearch scIgnoreModified" placeholder="Search for content or media" tabindex="1" accesskey="f">';
    let htmlResult = '<ul class="scInstantSearchResults"></ul>';
    globalHeader ? globalHeader.insertAdjacentHTML("afterbegin", htmlResult) : false;
    globalHeader ? globalHeader.insertAdjacentHTML("afterbegin", html) : false;
    globalHeader ? instantSearch() : false;
  }
};

/**
 * Setup and perform instant search
 */
const instantSearch = () => {
  // Variables
  const scInstantSearch = document.querySelector(".scInstantSearch");
  const divResults = document.querySelector(".scInstantSearchResults");
  let globalTimeout = null;

  if (scInstantSearch && divResults) {
    // On blur
    scInstantSearch.addEventListener("blur", () => {
      setTimeout(function () {
        if (document.activeElement.getAttribute("class")) {
          if (!document.activeElement.getAttribute("class").includes("scInstantRow")) {
            divResults.setAttribute("style", "opacity: 0; visibility: hidden; top: 38px;");
          }
        }
      }, 200);
    });

    // On focus
    scInstantSearch.addEventListener("focus", (event) => {
      const chars = event.target.value.length;
      chars >= 2 ? divResults.setAttribute("style", "opacity: 1; visibility: visible; top: 48px;") : false;
    });

    //Tab index
    divResults.addEventListener("keyup", (event) => {
      if (event.key === "ArrowUp") {
        document.activeElement.nextElementSibling ? document.activeElement.previousElementSibling.focus() : false;
      } else if (event.key === "ArrowDown") {
        document.activeElement.nextElementSibling ? document.activeElement.nextElementSibling.focus() : false;
      } else if (event.key === "Enter") {
        let ref = event.target != null ? event.target : event.srcElement;
        ref
          ? exeJsCode(
              `fadeEditorFrames(); setTimeout(function() { scForm.invoke("item:load(id=` + ref.getAttribute("data-scitem") + `,language=` + ref.getAttribute("data-language") + `,version=` + ref.getAttribute("data-version") + `)") }, 150)`
            )
          : false;
      } else if (event.key === "Escape") {
        divResults.setAttribute("style", "height:0px; opacity: 0; visibility: hidden; top: 43px;");
      }
    });

    //Document
    document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        divResults.setAttribute("style", "height:0px; opacity: 0; visibility: hidden; top: 43px;");
      }
    });

    //Key in search box
    scInstantSearch.addEventListener(
      "keydown",
      (event) => {
        // Stop if special key pressed
        let specialKey = false;
        event.key == "Alt" ? (specialKey = true) : false;
        event.key == "Meta" ? (specialKey = true) : false;
        event.key == "Control" ? (specialKey = true) : false;
        event.key == "Shift" ? (specialKey = true) : false;
        event.key == "CapsLock" ? (specialKey = true) : false;
        event.key == "ArrowDown" ? (specialKey = true) : false;
        event.key == "ArrowUp" ? (specialKey = true) : false;
        event.key == "Escape" ? (specialKey = true) : false;

        if (event.key === "ArrowDown") {
          divResults.querySelector(".scInstantRow").focus();
        }

        if (event.key === "Enter") {
          event.preventDefault();
        }

        const chars = event.target.value.length;
        globalTimeout != null ? clearTimeout(globalTimeout) : false;

        globalTimeout = setTimeout(function () {
          if (chars >= 2 && !specialKey) {
            globalTimeout = null;
            // Preload results
            divResults.setAttribute("style", "opacity: 1; visibility: visible; top: 48px;");
            //divResults.innerHTML = '<div class="scInstantSeachLoading"><img loading="lazy" class="pulseAnimate" src="' + global.iconInstantSearch + '" /><span class="textLoading"><span></div>'
            divResults.innerHTML = '<div class="preload">' + global.svgAnimation + '</div><span class="textLoading"><span>';
            document.querySelector(".scInstantSearchResults > .preload").setAttribute("style", "opacity:1 !important");

            if (divResults.querySelector(".textLoading")) {
              var loadingTimeout1 = setTimeout(function () {
                divResults.querySelector(".textLoading").innerText = "Sitecore is processing your request ...";
              }, 6000);

              var loadingTimeout2 = setTimeout(function () {
                divResults.querySelector(".textLoading").innerText = "... Hang tight, it takes a little longer than expected...";
              }, 11000);

              var loadingTimeout3 = setTimeout(function () {
                divResults.querySelector(".textLoading").innerText = "... server is warming up, bear with us :-)";
              }, 16000);
            }

            var ajax = new XMLHttpRequest();
            ajax.timeout = 20000;
            ajax.open("GET", "/sitecore/shell/applications/search/instant/instantsearch.aspx?q=" + event.target.value + "&v=1", true);
            ajax.onreadystatechange = function () {
              if (ajax.readyState === 4 && ajax.status == "200") {
                let category, title, href, img, text, scItem, scLanguage, scVersion, showCat;
                let html = "";
                let count = 0;
                const dom = new DOMParser().parseFromString(ajax.responseText, "text/html");
                const results = dom.querySelectorAll(".scSearchResultsTable > tbody > tr");

                for (const row of results) {
                  const td = row.querySelectorAll("td");

                  if (td.length == 2) {
                    showCat = true;
                    // console.log("NODE -----> "+td[0].innerText);

                    category = td[0].innerText;
                    title = td[1].querySelector("a").getAttribute("title");
                    href = td[1].querySelector("a").getAttribute("href");
                    img = td[1].querySelector("img").getAttribute("src");
                    text = td[1].innerText;
                    // console.log("-> "+text+" "+href+" "+title+" "+img);

                    if (text.toLowerCase() != "use classic search") {
                      // Get item language version
                      try {
                        scItem = "{" + href.split("/{")[1].split("}_")[0] + "}";
                        scLanguage = href.split("_qst_lang_eq_")[1].split("&ver_")[0];
                        scVersion = href.split("&ver_eq_")[1];
                      } catch (error) {
                        // error
                      }
                    }
                  } else {
                    showCat = false;

                    title = td[0].querySelector("a").getAttribute("title");
                    href = td[0].querySelector("a").getAttribute("href");
                    img = td[0].querySelector("img").getAttribute("src");
                    text = td[0].innerText;
                    // console.log("-> "+text+" "+href+" "+title+" "+img);

                    // Get item language version
                    try {
                      scItem = "{" + href.split("/{")[1].split("}_")[0] + "}";
                      scLanguage = href.split("_qst_lang_eq_")[1].split("&ver_")[0];
                      scVersion = href.split("&ver_eq_")[1];
                    } catch (error) {
                      // error
                    }
                  }

                  // Append
                  if (category.toLowerCase() == "content" || category.toLowerCase() == "media library" || category.toLowerCase() == "direct hit") {
                    showCat ? (html += "<h1>" + category + "</h1>") : false;
                    html +=
                      "<li onclick='fadeEditorFrames(); setTimeout(function() { scForm.invoke(\"item:load(id=" +
                      scItem +
                      ",language=" +
                      scLanguage +
                      ",version=" +
                      scVersion +
                      ')") }, 150)\' class="scInstantRow" tabindex="0" role="link" data-scitem="' +
                      scItem +
                      '" data-language="' +
                      scLanguage +
                      '" data-version="' +
                      scVersion +
                      '">';
                    html += '<h2 title="' + title + '">' + text + "</h2>";
                    html += '<p title="' + title + '"><img loading="lazy" src="' + img + '" onerror="this.onerror=null;this.src=\'' + global.iconInstantSearchGeneric + "';\"/> " + pathToBreadcrumb(title, ">", false) + "</p>";
                    html += "</li>";
                    count++;
                  }
                }

                count == 0 ? (html = '<div class="scInstantSeachLoading">No result for "<u>' + event.target.value + '</u>", try something else.</div>') : false;

                // Populate result
                divResults.innerHTML = "";
                divResults.insertAdjacentHTML("afterbegin", html);
              } else if (ajax.status == "500") {
                // Populate result
                divResults.innerHTML = "";
                divResults.insertAdjacentHTML("afterbegin", '<div class="scInstansSeachLoading">Sorry, your Sitecore instance is not compatible with this feature :-(</div>');
              } else if (ajax.status == "401") {
                // Populate result
                divResults.innerHTML = "";
                divResults.insertAdjacentHTML(
                  "afterbegin",
                  '<div class="scInstansSeachLoading">Your Sitecore session has expired, <a href="#" onclick="javascript:return scForm.postEvent(this,event,\'system:logout\');">clic here to reconnect</a>.</div>'
                );
              } else if (ajax.status == "0") {
                // Populate result
                divResults.innerHTML = "";
                divResults.insertAdjacentHTML("afterbegin", '<div class="scInstansSeachLoading"><img src="' + global.iconTimeout + '" width="display: block; margin: auto; width: 60px;" /> Sitecore timeout. Try again...</div>');
              }

              loadingTimeout1 != null ? clearTimeout(loadingTimeout1) : false;
              loadingTimeout2 != null ? clearTimeout(loadingTimeout2) : false;
              loadingTimeout3 != null ? clearTimeout(loadingTimeout3) : false;
            };
            ajax.send(null);
          }
        }, 750);
      },
      false
    );
  }
};

/**
 * Add new stuff to classic Sitecore Search results
 */
const enhancedSitecoreSearch = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true) {
    //Add listener on search result list
    var target = document.querySelector("#results");
    var observer = new MutationObserver(function () {
      var resultsDiv = document.querySelector("#results");
      var BlogPostArea = resultsDiv.querySelectorAll(".BlogPostArea");

      for (var line of BlogPostArea) {
        var BlogPostFooter = line.querySelector(".BlogPostFooter");

        var getFullpath = line.querySelector(".BlogPostViews > a > img").getAttribute("title");
        getFullpath = getFullpath.split(" - ");
        getFullpath = getFullpath[1].toLowerCase();
        if (getFullpath.includes("/home/")) {
          getFullpath = getFullpath.split("/home/");
          getFullpath = "/" + getFullpath[1];
        }
        var getNumLanguages = line.querySelector(".BlogPostHeader > span").getAttribute("title");

        //Inject HTML
        var html = '<div class="BlogPostExtra BlogPostContent" style="padding: 5px 0 0px 78px; color: #0769d6"><strong>Sitecore path:</strong> ' + getFullpath + " <strong>Languages available:</strong> " + getNumLanguages + "</div>";
        getFullpath ? BlogPostFooter.insertAdjacentHTML("afterend", html) : false;
        //TODO Buttons, open in CE and open in EE
      }
    });

    //Observer
    target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: false,
          subtree: false,
        })
      : false;
  }
};

/**
 * Add new stuff to classic Tree Search results
 */
const enhancedTreeSearch = (storage) => {
  storage.feature_contenteditor == undefined ? (storage.feature_contenteditor = true) : false;
  if (storage.feature_contenteditor == true) {
    let target = document.querySelector("#SearchResult");
    let observer = new MutationObserver(function () {
      var SearchResultHolder = document.querySelector("#SearchResult");
      var scSearchLink = SearchResultHolder.querySelectorAll(".scSearchLink");
      var scSearchListExtra = document.querySelector(".scSearchListExtra");

      for (var line of scSearchLink) {
        var getFullpath = line.getAttribute("title").toLowerCase();
        if (getFullpath.includes("/home/")) {
          getFullpath = getFullpath.split("/home/");
          getFullpath = "/" + getFullpath[1];
        }

        //Inject HTML
        var html = ' <span class="scSearchListExtra">' + getFullpath + "</span>";
        if (getFullpath && scSearchListExtra == null) {
          line.innerHTML += html;
        }
      }
    });

    //Observer
    target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: false,
          subtree: false,
        })
      : false;
  }
};
