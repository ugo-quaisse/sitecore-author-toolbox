function scSaveAnimation(e){var t=document.createElement("div");if(t.id="saveAnimation",document.body.appendChild(t),setTimeout((function(){t.remove()}),2e3),document.querySelector(".scSaveButton")){let e=document.querySelector(".saveMessage");document.querySelector(".scSaveButton").innerText="Saving...",document.querySelector(".scSaveButton").setAttribute("disabled",!0),setTimeout((function(){e.classList.add("visible")}),500),setTimeout((function(){document.querySelector(".scSaveButton").innerText="Save",document.querySelector(".scSaveButton").removeAttribute("disabled"),e.classList.remove("visible")}),2e3)}}const copyTranslate=(e,t)=>{var o=document.querySelector("#"+e),i=document.querySelector("#"+t);o.value=i.value},copyTranslateAll=()=>{var e=document.querySelectorAll(".scTranslateRTL");for(var t of e)t.click()},toggleRibbon=()=>{var e=document.querySelector("#scCrossPiece"),t=document.querySelector("#scWebEditRibbon"),o=document.querySelector(".scExpTab").querySelector(".tabText");"display:none !important"!=t.getAttribute("style")?(e.setAttribute("style","height:0px !important"),t.setAttribute("style","display:none !important"),o.innerText="▼ Show"):(e.setAttribute("style","height:300px !important"),t.setAttribute("style","display:block !important"),o.innerText="▲ Hide")},toggleSection=(e,t,o=!1,i=!1)=>{var c="true"==i,r=document.querySelectorAll(".scEditorTab"),s=document.querySelector("#scSections");for(var n of(s.value=encodeURI(t+"=0"),r)){var l=n.dataset.id,a=document.querySelector("#"+l),u=a.nextSibling;if(n!=e)n.classList.remove("scEditorTabSelected"),u.setAttribute("style","display: none !important"),a.classList.add("scEditorSectionCaptionCollapsed"),a.classList.remove("scEditorSectionCaptionExpanded"),s.value+=encodeURI("&"+n.innerText+"=1");else if(n.classList.add("scEditorTabSelected"),u.setAttribute("style","display: table !important"),a.classList.remove("scEditorSectionCaptionCollapsed"),a.classList.add("scEditorSectionCaptionExpanded"),c){let e=document.querySelector("#scEditorTabs").getBoundingClientRect(),t=e.left,o=e.right,i=e.width/2+t,c=n.getBoundingClientRect(),r=document.querySelector("#scEditorTabs > ul"),s=r.currentStyle||window.getComputedStyle(r);s=parseFloat(s.marginLeft.replace("px",""));let l=r.getBoundingClientRect(),a=r.scrollWidth,u=Math.round(s+(i-c.left)),d=Math.round(l.left+a+(i-c.left));d<o&&(u=Math.round(u+(o-d))),u>0&&(u=0),r.setAttribute("style","margin-left: "+u+"px")}}},togglePip=e=>{try{e!==document.pictureInPictureElement?e.requestPictureInPicture():document.exitPictureInPicture()}catch(e){}},toggleMediaIframe=e=>{scSitecore.prototype.showModalDialog(e,"","dialogWidth:1200px;dialogHeight:700px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no","","")},fadeEditorFrames=()=>{document.querySelector(".scInstantSearchResults").setAttribute("style","height:0px; opacity: 0; visibility: hidden; top: 43px;"),document.querySelector("#EditorFrames").setAttribute("style","opacity:0.6"),document.querySelector(".scContentTreeContainer").setAttribute("style","opacity:0.6"),document.querySelector(".scEditorTabHeaderActive > span").innerText="Loading...";setTimeout((function(){document.querySelector("#EditorFrames").setAttribute("style","opacity:1"),document.querySelector(".scContentTreeContainer").setAttribute("style","opacity:1")}),8e3)},insertPage=(e,t)=>{document.querySelector(".scOverlay").setAttribute("style","visibility:visible"),document.querySelector("#scModal").setAttribute("data-scItem",e),document.querySelector("#scModal").setAttribute("data-scItemName",t),null!=t&&(document.querySelector("#scModal > .header > .title").innerHTML="Insert"),document.querySelector("#scModal").setAttribute("style","opacity:1; visibility:visible; top: calc(50% - 550px/2)"),document.querySelector("#scModal > .main").innerHTML="",document.querySelector("#scModal > .preload").setAttribute("style","opacity:1")},insertPageClose=()=>{setTimeout((function(){document.querySelector(".scOverlay").setAttribute("style","visibility:hidden"),document.querySelector("#scModal").setAttribute("style","opacity:0; visibility:hidden; top: calc(50% - 550px/2 - 20px)")}),10)},showSitecoreMenu=()=>{let e=document.querySelector(".scDockTop");e.classList.toggle("showSitecoreMenu"),document.querySelector("#scSitecoreMenu").classList.toggle("scSitecoreMenu"),e.classList.contains("showSitecoreMenu")?localStorage.setItem("scSitecoreMenu",!0):localStorage.setItem("scSitecoreMenu",!1)},showLanguageMenu=()=>{console.log("Languages")};