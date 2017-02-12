'use strict';

var nodesRemoved = 0;

function removeNode(node) {
    ++nodesRemoved;
    chrome.runtime.sendMessage({text: nodesRemoved.toString()});
    node.parentNode.removeChild(node);
}

function hasAddedNodes(mutation) {
    return mutation.type === 'childList' &&
           mutation.addedNodes &&
           mutation.addedNodes.length;
}

function handleMutation(mutation) {
    if (!hasAddedNodes(mutation)) {
        return;
    }
    var nodeCount = mutation.addedNodes.length;
    while(nodeCount--) {
        var node = mutation.addedNodes[nodeCount];
        if (node.tagName && node.tagName.toUpperCase() === 'IFRAME') {
            removeNode(node);
        }
    }
}

function handleMutationList(mutations) {
    mutations.forEach(handleMutation);
}

function removeStaticIframes() {
    var elements = document.getElementsByTagName('IFRAME');
    while(elements.length > 0) {
        var node = elements[0];
        removeNode(node);
    }
}

function observeAndRemoveDynamicallyAddedIframes() {
    var target = document.querySelector('body');
    var observer = new MutationObserver(handleMutationList);
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);
}

function init() {
    console.log('init');
    var hostname = window.location.hostname;
    chrome.storage.sync.get(hostname, function (data) {
        if (data[hostname]) {
            return;
        }
        observeAndRemoveDynamicallyAddedIframes();
        removeStaticIframes();
    });
}

init();
