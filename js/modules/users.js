/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";
import { exeJsCode, calcMD5, currentColorScheme } from "./helpers.js";

export { getGravatar, initGravatarImage, initUserMenu };

/**
 * Get Gravatar image from an email
 */
const getGravatar = (email, size = "170", type = "robohash") => {
  //Type = [ 404 | mp | identicon | monsterid | wavatar | retro | robohash | blank ]
  var md5 = calcMD5(email);
  var link = "https://www.gravatar.com/avatar/" + md5 + "?s=" + size + "&d=" + type;

  return link;
};

/**
 * Add Gravatar Image to Experience Profile
 */
const initGravatarImage = (storage) => {
  storage.feature_gravatarimage == undefined ? (storage.feature_gravatarimage = true) : false;

  if (storage.feature_gravatarimage) {
    //Listener
    let target = document.querySelector("body");
    let observer = new MutationObserver(function () {
      let InfoPhotoImage = document.querySelector("img[data-sc-id=InfoPhotoImage]");
      let InfoEmailLink = document.querySelector("a[data-sc-id=InfoEmailLink]");

      // InfoPhotoImage ? console.log(InfoPhotoImage.src) : false;
      // InfoEmailLink ? console.log(InfoEmailLink.innerHTML) : false;

      if (InfoPhotoImage && InfoEmailLink) {
        if (InfoEmailLink.innerHTML.includes("@") && !InfoPhotoImage.src.includes("www.gravatar.com")) {
          InfoPhotoImage.src = getGravatar(InfoEmailLink.innerHTML, 170);

          //Add https://www.fullcontact.com/developer-portal/ api to get more information
          // fetch('https://api.fullcontact.com/v3/person.enrich', {
          //   method: 'POST',
          //   headers: {
          //     "Authorization": "Bearer " + local.fullcontactApiKey
          //   },
          //   body: JSON.stringify({
          //     "email": "ugo.quaisse@gmail.com"
          //     })
          // })
          // .then(res => res)
          // .then(res => console.log(res));

          observer.disconnect();
        }
      }
    });

    //Observer publish
    target
      ? observer.observe(target, {
          attributes: false,
          childList: true,
          characterData: true,
          subtree: true,
        })
      : false;
  }
};

/**
 * Attach Dropdown User Menu to the profil image
 */
const initUserMenu = (storage) => {
  let accountInformation = document.querySelector(".sc-accountInformation");
  let scGlobalHeader = document.querySelector(".sc-globalHeader-loginInfo");
  let startButton = document.querySelector(".sc-globalHeader-startButton");

  if (accountInformation) {
    let accountUser = accountInformation.querySelectorAll("li")[1].innerText.trim();

    if (storage.feature_experimentalui) {
      //Add app name
      let htmlApp = `<div class="sc-globalheader-appName" onclick="javascript:return scForm.invoke('contenteditor:home', event)">Content Editor</div>`;
      startButton ? startButton.insertAdjacentHTML("afterend", htmlApp) : false;

      //Add Notification and arrow icons
      let dialogParamsLarge = "center:yes; help:no; resizable:yes; scroll:yes; status:no; dialogMinHeight:200; dialogMinWidth:300; dialogWidth:1100; dialogHeight:700; header:";

      //prettier-ignore
      let htmlIcon =
        `<span class="t-bottom t-sm" data-tooltip="Workbox notification"><img loading="lazy" id="scNotificationBell" onclick="javascript:scSitecore.prototype.showModalDialog('` + global.workboxPage.replace("&sc_bw=1", "&sc_bw=0") + `', '', '` + dialogParamsLarge + `Workbox', null, null); false" src="` + global.iconBell + `" class="scIconMenu" accesskey="w" /></span>
       <span class="t-bottom t-sm" data-tooltip="Toggle ribbon"><img loading="lazy" id="scSitecoreMenu" onclick="showSitecoreMenu()" src="` + global.iconDownArrow + `" class="scIconMenu" accesskey="a" /></span>`;
      accountInformation.insertAdjacentHTML("afterbegin", htmlIcon);

      //Add new Avatar icon
      accountInformation.querySelector("li").remove();
      accountInformation.querySelector("li").innerHTML = accountInformation.querySelector("li > img").outerHTML;
      accountInformation.querySelector("li > img").setAttribute("id", "globalHeaderUserPortrait");
    }

    // <li onclick="javascript:return scForm.invoke('system:showlicenses', event)">Licences</li>
    // <li onclick="javascript:return scForm.invoke('system:showabout', event)">Licence details</li>
    //<li onclick="javascript:return scForm.invoke('item:myitems', event)">My locked items</li>

    //prettier-ignore
    let htmlMenu =
      `<div class="scAccountMenu">
        <div class="scAccountMenuWrapper">
        <div class="scAccountColumn scAccountGroup1">
          <ul> 
            <li onclick="javascript:return scForm.invoke('preferences:changeuserinformation', event)">My profile (` + accountUser + `)</li>
            <li onclick="javascript:return scForm.invoke('security:changepassword', event) ">Change Password</li>
            <li onclick="javascript:return scForm.invoke('preferences:changeregionalsettings', event)">Languages</li>
            <li onclick="javascript:return scForm.invoke('shell:useroptions', event)">Sitecore Options</li>
          
            <li onclick="javascript:goToSubmenu(1)" id="scSkip" class="separator opensubmenu">Dark Mode <span id="scSkip" class="darkMenuHint">Light</span></li>
            <li onclick="javascript:goToSubmenu(2)" id="scSkip" class="opensubmenu">Theme <span id="scSkip" class="themeMenuHint">Classic</span></li> 
            <li onclick="window.open('` + global.launchpadPage + `')">Extension Options</li>

            <li onclick="javascript:return scForm.invoke('contenteditor:close', event)">Log out</li>
          </ul>
        </div>

        <div class="scAccountSub">
          <div class="scAccountColumn scAccountGroup2">
            <ul>
              <li onclick="javascript:goToSubmenu(0)" id="scSkip" class="backsubmenu">Dark Mode</li>
              <li>Light <input type="radio" id="darkmodeRadio" name="darkMode" value="light" checked></li>
              <li>Dark <input type="radio" id="darkmodeRadio" name="darkMode" value="dark"></li>
              <li>Automatic <input type="radio" id="darkmodeRadio" name="darkMode" value="auto"></li>
            </ul>
          </div>
          <div class="scAccountColumn scAccountGroup2">
            <ul>
              <li onclick="javascript:goToSubmenu(0)" id="scSkip" class="backsubmenu">Theme</li>
              <li>Classic <input type="radio" id="interfaceRadio" name="interface" value="classic" checked></li>
              <li>Experimental UI <input type="radio" id="interfaceRadio" name="interface" value="experimental"></li>
            </ul>
          </div>
        </div>
        </div>
      </div>`;
    scGlobalHeader.insertAdjacentHTML("afterbegin", htmlMenu);

    //Resize menu
    let height = document.querySelectorAll(".scAccountMenu > .scAccountMenuWrapper > .scAccountColumn > ul")[0].offsetHeight;
    document.querySelector(".scAccountMenu").setAttribute("style", "height:" + height + "px");

    //Listeners
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "Shift") {
        exeJsCode(`showSitecoreMenu()`);
        event.preventDefault();
        event.stopPropagation();
      }
    });

    //Events
    if (document.querySelector(".scAccountMenu")) {
      document.addEventListener("click", (elem) => {
        if (elem.target.id != "darkModeSwitch" && elem.target.id != "experimentalUiSwitch" && elem.target.id != "scSkip" && elem.target.id != "darkmodeRadio" && elem.target.id != "interfaceRadio") {
          elem.target.id == "globalHeaderUserPortrait" ? document.querySelector(".scAccountMenu").classList.toggle("open") : document.querySelector(".scAccountMenu").classList.remove("open");
        }
      });
    }

    if (document.querySelector("#DesktopLinks")) {
      document.querySelector("#DesktopLinks").addEventListener("click", () => {
        document.querySelector(".scAccountMenu").classList.remove("open");
      });
    }

    //Press escape
    document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        document.querySelector(".scAccountMenu").classList.remove("open");
      }
    });

    initDarkSwitchEvents();
    initInterfaceEvents();
  }
};

/**
 * Init Dark Radio Switch events
 */
const initDarkSwitchEvents = () => {
  document.querySelectorAll("#darkmodeRadio").forEach(function (radio) {
    radio.onclick = function () {
      if (radio.value == "dark" || (radio.value == "auto" && currentColorScheme() == "dark")) {
        //main
        document.body.classList.add("satDark");
        //iframes
        document.querySelectorAll("iframe").forEach(function (iframe) {
          if (iframe.contentDocument.body) {
            iframe.contentDocument.body.classList.add("satDark");
            iframe.contentDocument.querySelectorAll("iframe").forEach(function (iframe) {
              iframe.contentDocument.body.classList.add("satDark");
            });
          }
        });
        //hint
        radio.value == "auto" ? (document.querySelector(".darkMenuHint").innerText = "Auto") : (document.querySelector(".darkMenuHint").innerText = "On");
        //Storage
        chrome.storage.sync.set({
          feature_darkmode: true,
          feature_darkmode_auto: radio.value == "auto",
        });
      } else if (radio.value == "light") {
        //main
        document.body.classList.remove("satDark");
        //iframes
        document.querySelectorAll("iframe").forEach(function (iframe) {
          if (iframe.contentDocument.body) {
            iframe.contentDocument.body.classList.remove("satDark");
            iframe.contentDocument.querySelectorAll("iframe").forEach(function (iframe) {
              iframe.contentDocument.body.classList.remove("satDark");
            });
          }
        });
        //hint
        document.querySelector(".darkMenuHint").innerText = "Light";
        //Storage
        chrome.storage.sync.set({
          feature_darkmode: false,
          feature_darkmode_auto: false,
        });
      }
    };
  });
};

/**
 * Init Interface Switch events
 */
const initInterfaceEvents = () => {
  document.querySelectorAll("#interfaceRadio").forEach(function (radio) {
    radio.onclick = function () {
      if (radio.value == "classic") {
        //main
        document.body.classList.remove("satExperimentalUi");
        //iframes
        document.querySelectorAll("iframe").forEach(function (iframe) {
          if (iframe.contentDocument.body) {
            iframe.contentDocument.body.classList.remove("satExperimentalUi");
            iframe.contentDocument.querySelectorAll("iframe").forEach(function (iframe) {
              iframe.contentDocument.body.classList.remove("satExperimentalUi");
            });
          }
        });
        //hint
        document.querySelector(".themeMenuHint").innerText = "Classic";
        //Storage
        chrome.storage.sync.set({
          feature_experimentalui: false,
          feature_cetabs: false,
        });
      } else if (radio.value == "experimental") {
        //main
        document.body.classList.add("satExperimentalUi");
        //iframes
        document.querySelectorAll("iframe").forEach(function (iframe) {
          if (iframe.contentDocument.body) {
            iframe.contentDocument.body.classList.add("satExperimentalUi");
            iframe.contentDocument.querySelectorAll("iframe").forEach(function (iframe) {
              iframe.contentDocument.body.classList.add("satExperimentalUi");
            });
          }
        });
        //hint
        document.querySelector(".themeMenuHint").innerText = "Experimental UI";
        //Storage
        chrome.storage.sync.set({
          feature_experimentalui: true,
          feature_cetabs: true,
        });
      }
      //Reload view
      setTimeout(function () {
        location.reload();
      }, 10);
    };
  });
};
