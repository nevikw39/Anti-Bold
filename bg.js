chrome.runtime.onInstalled.addListener(_ => chrome.storage.sync.get(["fill", "enable"], val => {
    if (val.fill == undefined || val.enable == undefined) {
        chrome.storage.sync.set({ "fill": true });
        chrome.storage.sync.set({ "enable": true });
        fetch("https://www.kevinweng.tk/ab/bold.json").then(r => r.json()).then(j => chrome.storage.local.set({ "bold": j }));
        fetch("https://www.kevinweng.tk/ab/non.json").then(r => r.json()).then(j => chrome.storage.local.set({ "non": j }));
        chrome.browserAction.setBadgeBackgroundColor({ color: "#198964" });
    }
    chrome.tabs.create({ url: "https://www.kevinweng.tk/ab/anti-bold.html#ver" });
}));
chrome.commands.onCommand.addListener(cmd => {
    if (cmd == "hide")
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => chrome.tabs.sendMessage(tabs[0].id, { hide: "hide" }))
});
chrome.runtime.onStartup.addListener(_ => {
    fetch("https://www.kevinweng.tk/ab/bold.json", { cache: "no-cache" }).then(r => r.json()).then(j => chrome.storage.local.set({ "bold": j }));
    fetch("https://www.kevinweng.tk/ab/non.json", { cache: "no-cache" }).then(r => r.json()).then(j => chrome.storage.local.set({ "non": j }));
});