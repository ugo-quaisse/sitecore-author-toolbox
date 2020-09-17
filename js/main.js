/**
 * Sitecore Author Toolbox
 * A Chrome/Edge Extension
 * by Ugo Quaisse
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */
if (!window.location.href.toLowerCase().includes("jquerymodaldialogs.html")) {
  (async () => {
    const contentScript = await import(chrome.extension.getURL("js/toolbox.js"));
    try {
      contentScript.main();
    } catch (e) {
      //e
    }
  })();
}
