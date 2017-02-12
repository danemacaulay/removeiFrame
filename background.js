chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: 'toggleDomain.js'});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.browserAction.setBadgeText(request);
});
