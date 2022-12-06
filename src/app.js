/**
 * Sitecore Author Toolbox
 * A Chrome/Edge Extension
 * by Ugo Quaisse
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */
(async () => {
  const contentScript = await import(chrome.runtime.getURL("src/toolbox.js"));
  try {
    contentScript.main();
  } catch (e) {
    //e
  }
})();
