document.body.onload=function(){var e=chrome.runtime.getManifest();document.getElementById("scVersion").innerHTML=e.version;var t=new URL(window.location.href),n=t.searchParams.get("launchpad"),o=t.searchParams.get("url");n&&(document.getElementById("set").innerHTML="Save your preferences",document.getElementById("scHeader").style.display="inherit",document.getElementById("scBack").href=o,document.getElementById("banner").style.top="50px",document.getElementById("bannerTitle").style.opacity="1",document.getElementById("intro").style.marginTop="50px",document.getElementById("video").style.display="inherit");for(var r="",c=1;c<=6;c++)console.log(r),r+="\x3c!-- loop start --\x3e\n        <p>Domain #"+c+'</p>\n          <div class="cd_url">\n            <label for="cd_'+c+'">Live website<b>*</b>:</label>\n            <input name="cd_'+c+'" type="url" placeholder="https://example.com" pattern="https?://.*" required>\n          </div>\n          <div class="cm_url">\n          <label for="cm_'+c+'">Content manager<b>*</b>:</label>\n            <input name="cm_'+c+'" type="url" placeholder="https://example.com" pattern="https?://.*" required>\n           </div>\n        \n          <div id="clear"></div>\n          \x3c!-- loop end --\x3e';document.getElementById("load").innerHTML=r,chrome.storage.sync.get(["feature_urls"],(function(e){chrome.runtime.error||null==e.feature_urls?document.getElementById("feature_urls").checked=!0:e.feature_urls&&(document.getElementById("feature_urls").checked=!0)})),chrome.storage.sync.get(["feature_flags"],(function(e){chrome.runtime.error||null==e.feature_flags?document.getElementById("feature_flags").checked=!0:e.feature_flags&&(document.getElementById("feature_flags").checked=!0)})),chrome.storage.sync.get(["feature_errors"],(function(e){chrome.runtime.error||null==e.feature_errors?document.getElementById("feature_errors").checked=!0:e.feature_errors&&(document.getElementById("feature_errors").checked=!0)})),chrome.storage.sync.get(["feature_dragdrop"],(function(e){chrome.runtime.error||null==e.feature_dragdrop?document.getElementById("feature_dragdrop").checked=!0:e.feature_dragdrop&&(document.getElementById("feature_dragdrop").checked=!0)})),chrome.storage.sync.get(["feature_notification"],(function(e){chrome.runtime.error||null==e.feature_notification?document.getElementById("feature_notification").checked=!0:e.feature_notification&&(document.getElementById("feature_notification").checked=!0)})),chrome.storage.sync.get(["feature_darkmode"],(function(e){if(chrome.runtime.error||null==e.feature_darkmode)document.getElementById("feature_darkmode").checked=!1,(t=document.getElementById("extensionOptions")).classList.add("light");else if(e.feature_darkmode){document.getElementById("feature_darkmode").checked=!0;var t=document.getElementById("extensionOptions");t.classList.add("dark")}console.log("load"+e.feature_darkmode)})),chrome.storage.sync.get(["feature_favorites"],(function(e){chrome.runtime.error||null==e.feature_favorites?document.getElementById("feature_favorites").checked=!0:e.feature_favorites&&(document.getElementById("feature_favorites").checked=!0)})),chrome.storage.sync.get(["feature_reloadnode"],(function(e){chrome.runtime.error||null==e.feature_reloadnode?document.getElementById("feature_reloadnode").checked=!0:e.feature_reloadnode&&(document.getElementById("feature_reloadnode").checked=!0)})),chrome.storage.sync.get(["feature_launchpad"],(function(e){chrome.runtime.error||null==e.feature_launchpad?document.getElementById("feature_launchpad").checked=!0:e.feature_launchpad&&(document.getElementById("feature_launchpad").checked=!0)})),chrome.storage.sync.get(["feature_rtl"],(function(e){chrome.runtime.error||null==e.feature_rtl?document.getElementById("feature_rtl").checked=!0:e.feature_rtl&&(document.getElementById("feature_rtl").checked=!0)})),chrome.storage.sync.get(["feature_charscount"],(function(e){chrome.runtime.error||null==e.feature_charscount?document.getElementById("feature_charscount").checked=!0:e.feature_charscount&&(document.getElementById("feature_charscount").checked=!0)})),chrome.storage.sync.get(["feature_autoexpand"],(function(e){chrome.runtime.error||null==e.feature_autoexpand?document.getElementById("feature_autoexpand").checked=!0:e.feature_autoexpand&&(document.getElementById("feature_autoexpand").checked=!0)})),chrome.storage.sync.get(["feature_translatemode"],(function(e){chrome.runtime.error||null==e.feature_translatemode?document.getElementById("feature_translatemode").checked=!0:e.feature_translatemode&&(document.getElementById("feature_translatemode").checked=!0)})),chrome.storage.sync.get(["feature_toggleribbon"],(function(e){chrome.runtime.error||null==e.feature_toggleribbon?document.getElementById("feature_toggleribbon").checked=!0:e.feature_toggleribbon&&(document.getElementById("feature_toggleribbon").checked=!0)})),chrome.storage.sync.get(["feature_cetabs"],(function(e){chrome.runtime.error||null==e.feature_cetabs?document.getElementById("feature_cetabs").checked=!0:e.feature_cetabs&&(document.getElementById("feature_cetabs").checked=!0)}))},document.getElementById("settings").onclick=function(){document.querySelector("#main").setAttribute("style","display:none"),document.querySelector("#domains").setAttribute("style","display:block")},document.getElementById("back").onclick=function(){document.querySelector("#main").setAttribute("style","display:block"),document.querySelector("#domains").setAttribute("style","display:none")},document.getElementById("set").onclick=function(){chrome.storage.sync.set({feature_urls:document.getElementById("feature_urls").checked},(function(){console.info("--\x3e Urls: "+document.getElementById("feature_urls").checked)})),chrome.storage.sync.set({feature_flags:document.getElementById("feature_flags").checked},(function(){console.info("--\x3e Flags: "+document.getElementById("feature_flags").checked)})),chrome.storage.sync.set({feature_errors:document.getElementById("feature_errors").checked},(function(){console.info("--\x3e Errors: "+document.getElementById("feature_errors").checked)})),chrome.storage.sync.set({feature_dragdrop:document.getElementById("feature_dragdrop").checked},(function(){console.info("--\x3e Drag and drop: "+document.getElementById("feature_dragdrop").checked)})),chrome.storage.sync.set({feature_notification:document.getElementById("feature_notification").checked},(function(){console.info("--\x3e Notifications: "+document.getElementById("feature_notification").checked)})),chrome.storage.sync.set({feature_darkmode:document.getElementById("feature_darkmode").checked},(function(){if(console.info("--\x3e Dark mode:"+document.getElementById("feature_darkmode").checked),document.getElementById("feature_darkmode").checked){var e=document.getElementById("extensionOptions");e.classList.remove("light"),e.classList.add("dark")}else(e=document.getElementById("extensionOptions")).classList.remove("dark"),e.classList.add("light")})),chrome.storage.sync.set({feature_favorites:document.getElementById("feature_favorites").checked},(function(){console.info("--\x3e Favorites: "+document.getElementById("feature_favorites").checked)})),chrome.storage.sync.set({feature_reloadnode:document.getElementById("feature_reloadnode").checked},(function(){console.info("--\x3e Reload: "+document.getElementById("feature_reloadnode").checked)})),chrome.storage.sync.set({feature_launchpad:document.getElementById("feature_launchpad").checked},(function(){console.info("--\x3e Launchpad: "+document.getElementById("feature_launchpad").checked)})),chrome.storage.sync.set({feature_rtl:document.getElementById("feature_rtl").checked},(function(){console.info("--\x3e RTL: "+document.getElementById("feature_rtl").checked)})),chrome.storage.sync.set({feature_charscount:document.getElementById("feature_charscount").checked},(function(){console.info("--\x3e Character counter: "+document.getElementById("feature_charscount").checked)})),chrome.storage.sync.set({feature_autoexpand:document.getElementById("feature_autoexpand").checked},(function(){console.info("--\x3e Auto Expand: "+document.getElementById("feature_autoexpand").checked)})),chrome.storage.sync.set({feature_translatemode:document.getElementById("feature_translatemode").checked},(function(){console.info("--\x3e Translation Mode: "+document.getElementById("feature_translatemode").checked)})),chrome.storage.sync.set({feature_toggleribbon:document.getElementById("feature_toggleribbon").checked},(function(){console.info("--\x3e Toggle Button: "+document.getElementById("feature_toggleribbon").checked)})),chrome.storage.sync.set({feature_cetabs:document.getElementById("feature_cetabs").checked},(function(){console.info("--\x3e CE Tabs: "+document.getElementById("feature_cetabs").checked)}));var e=new URL(window.location.href).searchParams.get("launchpad");console.log("Launchpad: "+e),e?(document.getElementById("set").innerHTML="Saving...",setTimeout((function(){document.getElementById("set").innerHTML="Save your preferences"}),1e3)):chrome.tabs.query({active:!0,currentWindow:!0},(function(e){chrome.tabs.executeScript(e[0].id,{code:"window.location.reload();"}),document.getElementById("set").innerHTML="Saving...",setTimeout((function(){document.getElementById("set").innerHTML="Save and reload sitecore"}),1e3)}))};let last_known_scroll_position=0,ticking=!1;function doSomething(e){var t=document.getElementById("banner");e>=90?t.classList.add("animate"):t.classList.remove("animate")}window.addEventListener("scroll",(function(e){last_known_scroll_position=window.scrollY;var t=new URL(window.location.href).searchParams.get("launchpad");ticking||t||(window.requestAnimationFrame((function(){doSomething(last_known_scroll_position),ticking=!1})),ticking=!0)}));