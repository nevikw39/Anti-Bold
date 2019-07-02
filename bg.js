chrome.runtime.onInstalled.addListener(_ => {
    chrome.storage.sync.set({ "fill": true });
    chrome.storage.sync.set({ "enable": true });
});
chrome.commands.onCommand.addListener(cmd => {
    if (cmd == "hide")
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => chrome.tabs.sendMessage(tabs[0].id, { hide: "hide" }))
});