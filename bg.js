chrome.runtime.onInstalled.addListener(_ => {
    chrome.storage.sync.set({ "fill": true });
    chrome.storage.sync.set({ "enable": true });
});