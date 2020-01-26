/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */ 

 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

var debug = true;

 /*
  * Sitecore detection
  */
chrome.runtime.sendMessage({greeting: "sxa_site"}, function(response) {
	
	if(response.farewell != null ) {

		console.info("%c Sitecore website detected. ", 'background: green; color: white; display: block;');

		//if path /sitecore/
		// - launchpad icon
		// - Char counter
		// - Errors
		// - Languages
		// - Live URL
		// - 


		//if class experience editor
		// - Tooltip
		// - Css enhancements
		// 

	} else {

		console.info("%c Sitecore website not detected. ", 'background: red; color: white; display: block;');

	}

})