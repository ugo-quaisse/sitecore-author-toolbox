/*
 * Quick Edit Module by Subramanian Ramanathan(Subbu)
 * quickedit.js
 */

export { showContextMenu, contextMenuClickHandler, launchEditUrl }; 

/**
 * Menu on right click
 */
const showContextMenu = (tab) => {
    if (tab.url != undefined) {
        var url = tab.url.split("?");
        url = url[0];

        var isSitecore = url.includes("/sitecore/");
        var isUrl = url.includes("http");
        var isEditMode = tab.url.includes("sc_mode=edit");
        var isPreviewMode = tab.url.includes("sc_mode=preview");
        var isViewSource = url.includes("view-source:");

        //Tab URL
        chrome.contextMenus.removeAll(function () {
            if (isUrl && !isViewSource && !isSitecore && !isEditMode && !isPreviewMode) {
                chrome.contextMenus.create(
                    {
                        title: "✏️ Edit in Experience Editor",
                        contexts: ["page"],
                        id: "editInExperienceEditor",
                    },
                    () => chrome.runtime.lastError
                );
                chrome.contextMenus.create(
                    {
                        title: "📑 Edit in Content Editor",
                        contexts: ["page"],
                        id: "editInContentEditor",
                    },
                    () => chrome.runtime.lastError
                );
                chrome.contextMenus.create(
                    {
                        title: "🚀 Edit in Horizon",
                        contexts: ["page"],
                        id: "editInHorizon",
                    },
                    () => chrome.runtime.lastError
                );
                chrome.contextMenus.create(
                    {
                        title: "🏁 View Page Insights",
                        contexts: ["page"],
                        id: "viewPageInsights",
                    },
                    () => chrome.runtime.lastError
                );
                chrome.contextMenus.create(
                    {
                        title: "🖥️ Preview in Simulator",
                        contexts: ["page"],
                        id: "previewInSimulator",
                    },
                    () => chrome.runtime.lastError
                );
                chrome.contextMenus.create(
                    {
                        title: "🗔  Open in Preview Mode",
                        contexts: ["page"],
                        id: "openInPreview",
                    },
                    () => chrome.runtime.lastError
                );
            }
        });
    }
}

/**
 * Action on right-click
 */
const contextMenuClickHandler = (info, tabInfo) => {
    launchEditUrl(info.menuItemId, tabInfo);
}

const launchEditUrl = (action, tabInfo) => {
    if (tabInfo) {
        chrome.storage.sync.get(["site_manager"], async (storage) => {
            var cdUrl = new URL(tabInfo.url);
            var siteInfo = getSiteInfo(storage.site_manager, cdUrl.origin);
            var cmUrl = siteInfo.cmUrl;
            if (cmUrl) {
                switch (action) {
                    case "editInExperienceEditor":
                        var experienceEditorUrl = getEditUrl(cmUrl, cdUrl.pathname, siteInfo.siteName);
                        openInNewTab(experienceEditorUrl);
                        break;
                    case "editInContentEditor":
                        var associatedItem = await getAssociatedItemInfo(cmUrl, cdUrl.pathname, siteInfo.siteName);
                        if(associatedItem){
                            var contentEditorUrl = `${cmUrl}/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo={${associatedItem.id}}&la=${associatedItem.language}`;
                            openInNewTab(contentEditorUrl);
                        }
                        break;
                    case "editInHorizon":
                        var horizonAppUrl = await getHorizonAppUrl(cmUrl);
                        if(horizonAppUrl) {
                            var associatedItem = await getAssociatedItemInfo(cmUrl, cdUrl.pathname, siteInfo.siteName);
                            var horizonEditorUrl = `${horizonAppUrl}/editor?sc_itemid=${associatedItem.id}&sc_lang=${associatedItem.language}&sc_site=${associatedItem.site}`;
                            openInNewTab(horizonEditorUrl);
                        }
                        break;
                    case "viewPageInsights":
                        var horizonAppUrl = await getHorizonAppUrl(cmUrl);
                        if(horizonAppUrl) {
                            var associatedItem = await getAssociatedItemInfo(cmUrl, cdUrl.pathname, siteInfo.siteName);
                            var pageInsightsUrl = `${horizonAppUrl}/insights?sc_itemid=${associatedItem.id}&sc_lang=${associatedItem.language}&sc_site=${associatedItem.site}`;
                            openInNewTab(pageInsightsUrl);
                        }
                        break;
                    case "previewInSimulator":
                        var horizonAppUrl = await getHorizonAppUrl(cmUrl);
                        if(horizonAppUrl) {
                            var associatedItem = await getAssociatedItemInfo(cmUrl, cdUrl.pathname, siteInfo.siteName);
                            var simulatorUrl = `${new URL(horizonAppUrl).origin}/composer/simulator?sc_itemid=${associatedItem.id}&sc_lang=${associatedItem.language}&sc_site=${associatedItem.site}`;
                            openInNewTab(simulatorUrl);
                        }
                        break;
                    case "openInPreview":
                        var previewUrl = getPreviewUrl(cmUrl, cdUrl.pathname, siteInfo.siteName);
                        openInNewTab(previewUrl);
                        break;
                }
            }
            else{
                if(confirm('CM Site is not configured for this site. \nDo you wish to configure it now?')){
                    const optionsPageUrl = chrome.runtime.getURL(`options/options.html?configure_domains=true&siteUrl=${cdUrl.origin}`)
                    window.open(optionsPageUrl);
                }
            }
        });
    }
}

const getSiteInfo = (sitesInfo, cdUrl) => {
    for (var [cmUrl, sites] of Object.entries(sitesInfo)) {
        for (var [id, siteInfo] of Object.entries(sites)) {
            var siteUrl = Object.entries(siteInfo)[0][1];
            if (cdUrl.replace(/\/$/, "") === siteUrl.replace(/\/$/, ""))
                return {
                    cmUrl : cmUrl,
                    siteName: siteInfo.siteName
                };
        }
    }
}

const getAssociatedItemInfo = async (cmOrigin, path, siteName) => {
    var previewUrl = getPreviewUrl(cmOrigin, path, siteName);
    var timerId = setTimeout(function() { 
        alert("Redirecting, Please Wait..."); 
    }, 3000);
    var htmlDocument = await fetchHTML(previewUrl);
    clearTimeout(timerId);
    if(htmlDocument){
        var itemInfo = {
            id: parseGuid(htmlDocument.getElementById("scItemID")?.value),
            language: htmlDocument.getElementById("scLanguage")?.value,
            site: htmlDocument.getElementById("scSite")?.value
        }
        return itemInfo
    }
}

const getHorizonAppUrl = async (cmOrigin) => {
    const launchPadUrl = `${cmOrigin}/sitecore/shell/sitecore/client/Applications/Launchpad`;
    var htmlDocument = await fetchHTML(launchPadUrl);
    if(htmlDocument){
        var horizonTile = htmlDocument.querySelectorAll('a[title="Horizon"]');
        if(horizonTile.length > 0)
            return horizonTile[0].href;
        else
            alert('Horizon not configured for this domain');
    }
}

const fetchHTML = async (url) => {
    const response = await fetch(url, { redirect: 'manual'});
    if(response.status == 200){
        const responseText = await response.text(); 
        var parser = new DOMParser();
        return parser.parseFromString(responseText, 'text/html');
    }
    else{
        openInNewTab(`${new URL(url).origin}/sitecore/login`);
    }
}

const getPreviewUrl = (cmOrigin, path, siteName) => {
    return `${cmOrigin}${path}?sc_mode=preview${siteName ? ("&sc_site=" + siteName) : ''}`;
}

const getEditUrl = (cmOrigin, path, siteName) => {
    return `${cmOrigin}${path}?sc_mode=edit${siteName ? ("&sc_site=" + siteName) : ''}`;
}

const openInNewTab = (url) => {
    if (url) chrome.tabs.create({ url: url });
}

const parseGuid = (guid) => {
    return guid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/,"$1-$2-$3-$4-$5");
}
