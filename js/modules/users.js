/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */
import * as global from "./global.js";
import { exeJsCode, calcMD5 } from "./helpers.js";

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
      `<ul class="scAccountMenu"> 
          <li onclick="javascript:return scForm.invoke('preferences:changeuserinformation', event)">My profile (` + accountUser + `)</li>
          <li onclick="javascript:return scForm.invoke('security:changepassword', event) ">Change Password</li>
          <li onclick="javascript:return scForm.invoke('preferences:changeregionalsettings', event)">Languages</li>
          <li onclick="javascript:return scForm.invoke('shell:useroptions', event)">Sitecore Options</li>
          <li onclick="window.open('` + global.launchpadPage + `')" >Sitecore Author Toolbox Options</li>
          
          <li id="scMenuListDarkMode" class="separator">Dark Mode</li>
          <li id="scMenuListExperimentalUi" >Experimental UI Mode</li>
          
          <li onclick="javascript:return scForm.invoke('contenteditor:close', event)">Log out</li>
        </ul>`;
    accountInformation.insertAdjacentHTML("afterbegin", htmlMenu);

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
        if (elem.target.id != "darkModeSwitch" && elem.target.id != "experimentalUiSwitch" && elem.target.id != "scSkip") {
          elem.target.id == "globalHeaderUserPortrait" ? document.querySelector(".scAccountMenu").classList.toggle("open") : document.querySelector(".scAccountMenu").classList.remove("open");
        }
      });
    }

    if (document.querySelector("#DesktopLinks")) {
      document.querySelector("#DesktopLinks").addEventListener("click", () => {
        document.querySelector(".scAccountMenu").classList.toggle("open");
      });
    }

    //Press escape
    document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        document.querySelector(".scAccountMenu").classList.remove("open");
      }
    });

    initDarkSwitch();
    initExperimentalSwitch();
  }
};

/**
 * Insert Dark Checkbox Switch into User Menu
 */
const initDarkSwitch = () => {
  //prettier-ignore
  let dark =
    `<span class="darkModeSwitch">    
      <input id="darkModeSwitch" class="scDarkModeCheckbox" value="darkmode" type="checkbox">
      <label id="scSkip" for="darkModeSwitch" class="scDarkModeCheckboxLabel"></label>
      <img class="darkModeIcon darkModeIconSun rise" src='` +
    global.iconSun +
    `' />
      <img class="darkModeIcon darkModeIconMoon set" src='` +
    global.iconMoon +
    `' />
    </span>`;
  let menu = document.querySelector("#scMenuListDarkMode");
  menu ? menu.insertAdjacentHTML("beforeend", dark) : false;

  //Listener on change
  let darkModeSwitch = document.querySelector("#darkModeSwitch");
  if (darkModeSwitch) {
    darkModeSwitch.addEventListener("change", () => {
      //Update main window
      darkModeSwitch.checked ? document.body.classList.add("satDark") : document.body.classList.remove("satDark");
      //Update all iframes
      document.querySelectorAll("iframe").forEach(function (iframe) {
        if (iframe.contentDocument.body) {
          darkModeSwitch.checked ? iframe.contentDocument.body.classList.add("satDark") : iframe.contentDocument.body.classList.remove("satDark");
          iframe.contentDocument.querySelectorAll("iframe").forEach(function (iframe) {
            darkModeSwitch.checked ? iframe.contentDocument.body.classList.add("satDark") : iframe.contentDocument.body.classList.remove("satDark");
          });
        }
      });
      //Update icons
      if (darkModeSwitch.checked === true) {
        document.querySelector(".darkModeIconSun").classList.remove("rise");
        document.querySelector(".darkModeIconSun").classList.add("set");
        document.querySelector(".darkModeIconMoon").classList.remove("set");
        document.querySelector(".darkModeIconMoon").classList.add("rise");
      } else {
        document.querySelector(".darkModeIconSun").classList.remove("set");
        document.querySelector(".darkModeIconSun").classList.add("rise");
        document.querySelector(".darkModeIconMoon").classList.remove("rise");
        document.querySelector(".darkModeIconMoon").classList.add("set");
      }
    });
  }
};

/**
 * Insert Experimental Checkbox Switch into User Menu
 */
const initExperimentalSwitch = () => {
  //prettier-ignore
  let dark = `<span class="experimentalUiSwitch">    
      <input id="experimentalUiSwitch" class="scExperimentalCheckbox" value="darkmode" type="checkbox">
      <label id="scSkip" for="experimentalUiSwitch" class="scExperimentalCheckboxLabel"></label>
      <div class="experimentalUiSwitchText">OFF</div>
    </span>`;
  let menu = document.querySelector("#scMenuListExperimentalUi");
  menu ? menu.insertAdjacentHTML("beforeend", dark) : false;

  //Listener on change
  let experimentalUiSwitch = document.querySelector("#experimentalUiSwitch");
  if (experimentalUiSwitch) {
    experimentalUiSwitch.addEventListener("change", () => {
      //Update main window
      experimentalUiSwitch.checked ? document.body.classList.add("satExperimentalUi") : document.body.classList.remove("satExperimentalUi");
      //Update all iframes
      document.querySelectorAll("iframe").forEach(function (iframe) {
        experimentalUiSwitch.checked ? iframe.contentDocument.body.classList.add("satExperimentalUi") : iframe.contentDocument.body.classList.remove("satDark");
        iframe.contentDocument.querySelectorAll("iframe").forEach(function (iframe) {
          experimentalUiSwitch.checked ? iframe.contentDocument.body.classList.add("satExperimentalUi") : iframe.contentDocument.body.classList.remove("satExperimentalUi");
        });
      });
      //Update icons
      if (experimentalUiSwitch.checked === true) {
        document.querySelector(".experimentalUiSwitchText").innerText = "ON";
        //Save as global
      } else {
        document.querySelector(".experimentalUiSwitchText").innerText = "OFF";
      }
      //Save in User's chrome storage
      chrome.storage.sync.set({
        feature_experimentalui: experimentalUiSwitch.checked,
        feature_cetabs: experimentalUiSwitch.checked,
      });
      //Reload view
      setTimeout(function () {
        location.reload();
      }, 100);
    });
  }
};
