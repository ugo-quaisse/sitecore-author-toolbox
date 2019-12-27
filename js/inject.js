// const actualCode = 'console.info("Capture loaded");';

//https://www.moesif.com/blog/technical/apirequest/How-We-Captured-AJAX-Requests-with-a-Chrome-Extension/
//https://dzone.com/articles/how-we-captured-ajax-api-requests-from-arbitrary-w
//chrome.tabs.executeScript(tabId, {code: actualCode, runAt: 'document_end'}, cb);

// var s = document.createElement('script');
// s.textContent = '(' + fn_code + ')();';
// (document.head||document.documentElement).appendChild(s);
// s.parentNode.removeChild(s);

/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

chrome.extension.sendMessage({}, function(response) {
	//go
});