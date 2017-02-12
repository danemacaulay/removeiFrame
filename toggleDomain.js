'use strict';

function saveChanges() {
    var hostname = window.location.hostname;
    chrome.storage.sync.get(hostname, function (data) {
        data[hostname] = !data[hostname];
        chrome.storage.sync.set(data);
    });
}

saveChanges();