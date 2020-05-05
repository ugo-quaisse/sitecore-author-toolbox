/**
 * Sitecore Author Toolbox
 * A Google Chrome Extension
 * - created by Ugo Quaisse -
 * https://uquaisse.io
 * ugo.quaisse@gmail.com
 */ 

/** 
 * To global.debug Chrome Storage Sync, clear from background.js by running in the console:
 * chrome.storage.sync.clear(function() { chrome.storage.sync.get(function(e){console.log(e)}) })
 */

(async () => {
  const src = chrome.extension.getURL('js/toolbox-min.js');
  const contentScript = await import(src);
  try {
  	contentScript.main();
  } catch(e) {
  	//e
  }
})();