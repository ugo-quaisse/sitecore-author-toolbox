import * as global from "./global.js";
import { loadCssFile } from "./helpers.js";

export { currentColorScheme, initDarkMode, initDarkModeEditor, detectSwitchDarkMode };

/**
 * Get active OS color Scheme
 */
const currentColorScheme = () => {
  let color = "light";
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    color = "dark";
  } else {
    color = "light";
  }

  return color;
};

/**
 * Is Dark Mode
 */
// eslint-disable-next-line consistent-return
const initDarkMode = (storage) => {
  if ((storage.feature_darkmode && !storage.feature_darkmode_auto) || (storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "dark")) {
    document.body && !global.isPreviewMode ? document.body.classList.add("satDark") : false;
    if (storage.feature_darkmode_auto && document.querySelector(".darkmodeRadio[value='auto']")) {
      document.querySelector(".darkmodeRadio[value='auto']").checked = true;
      document.querySelector(".darkmodeRadio[value='auto']").dispatchEvent(new Event("click"));
    } else if (document.querySelector(".darkmodeRadio[value='dark']")) {
      document.querySelector(".darkmodeRadio[value='dark']").checked = true;
      document.querySelector(".darkmodeRadio[value='dark']").dispatchEvent(new Event("click"));
    }

    //Add correct bg color for jquerymodal window
    try {
      window.frameElement.parentNode.querySelector(".ui-dialog-titlebar").style.backgroundColor = "#111";
      // eslint-disable-next-line no-catch-shadow
    } catch (e) {
      //Error
    }
    //Add custom csss for scrollbar on windows
    navigator.platform.indexOf("Win") == 0 ? loadCssFile("css/dark/scrollbars.min.css") : false;
    //Set new background color
    document.documentElement.style.setProperty("--background", "#000");
  } else if (storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "light") {
    document.body ? document.body.classList.remove("satDark") : false;
    if (storage.feature_darkmode_auto && document.querySelector(".darkmodeRadio[value='auto']")) {
      document.querySelector(".darkmodeRadio[value='auto']").checked = true;
      document.querySelector(".darkmodeRadio[value='auto']").dispatchEvent(new Event("click"));
    }
    //Set new background color
    document.documentElement.style.setProperty("--background", "#fff");
  }
};

/**
 * Is Dark Mode for Editor
 */
// eslint-disable-next-line consistent-return
const initDarkModeEditor = (storage) => {
  let darkModeTheme = "default";
  if ((storage.feature_darkmode && !storage.feature_darkmode_auto) || (storage.feature_darkmode && storage.feature_darkmode_auto && currentColorScheme() == "dark")) {
    darkModeTheme = "ayu-dark";
    loadCssFile("css/dark/ayu-dark.css");
  }

  return darkModeTheme;
};

/**
 * Detect when system switch theme
 */
const detectSwitchDarkMode = (storage) => {
  if (storage.feature_darkmode && storage.feature_darkmode_auto) {
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", () => {
      if (document.querySelector(".darkmodeRadio")) {
        scheme.matches ? document.body.classList.add("satDark") : document.body.classList.remove("satDark");
        //trigger an event
        document.querySelector(".darkmodeRadio[value='auto']").dispatchEvent(new Event("click"));
      } else {
        scheme.matches ? document.body.classList.add("satDark") : document.body.classList.remove("satDark");
      }
    });
  }
};
