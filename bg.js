console.log("%c    _          _   _       ____        _     _ \n   / \\   _ __ | |_(_)     | __ )  ___ | | __| |\n  / _ \\ | '_ \\| __| |_____|  _ \\ / _ \\| |/ _` |\n / ___ \\| | | | |_| |_____| |_) | (_) | | (_| |\n/_/   \\_\\_| |_|\\__|_|     |____/ \\___/|_|\\__,_|", "background-color: #198964; color: white; font-weight: bold; /* XD */");
chrome.runtime.onInstalled.addListener(_ => chrome.storage.sync.get(["fill", "enable", "data_ver", "tiny"], val => {
    console.log("Extension is updated.");
    if (!Object.keys(val).length) {
        chrome.storage.sync.set({ "fill": true, "enable": true, "tiny": true });
        fetch("https://www.kevinweng.tk/ab/ver.json").then(r => r.json()).then(j => chrome.storage.sync.set({ "data_ver": j.data_ver, "version": j.version }));
        fetch("https://www.kevinweng.tk/ab/bold.json").then(r => r.json()).then(j => chrome.storage.local.set({ "bold": j }));
        fetch("https://www.kevinweng.tk/ab/non.json").then(r => r.json()).then(j => chrome.storage.local.set({ "non": j }));
    }
    chrome.browserAction.setBadgeText({ text: val.enable ? "" : "X" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#198964" });
    chrome.tabs.create({ url: "https://www.kevinweng.tk/ab/anti-bold.html#ver" });
}));
chrome.commands.onCommand.addListener(cmd => {
    if (cmd == "hide")
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => chrome.tabs.sendMessage(tabs[0].id, { hide: "hide" }))
});
chrome.runtime.onStartup.addListener(_ => fetch("https://www.kevinweng.tk/ab/ver.json", { cache: "no-cache" }).then(r => r.json()).then(async j => {
    chrome.storage.sync.set({ "version": j.version });
    if (await new Promise(rs => chrome.storage.sync.get(["data_ver"], val => rs(val.data_ver))) < j.data_ver) {
        console.log("Face desriptors are updated.");
        chrome.storage.sync.set({ "data_ver": j.data_ver });
        fetch("https://www.kevinweng.tk/ab/bold.json", { cache: "no-cache" }).then(r => r.json()).then(j => chrome.storage.local.set({ "bold": j }));
        fetch("https://www.kevinweng.tk/ab/non.json", { cache: "no-cache" }).then(r => r.json()).then(j => chrome.storage.local.set({ "non": j }));
    }
}));