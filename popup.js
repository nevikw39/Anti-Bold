chrome.storage.sync.get(["enable", "fill"], val => {
    $("#fill").attr("checked", val.fill);
    $("#fillLB").text(val.fill ? "僻眼韓黑模式" : "理性含奮模式");
    $("#enable").attr("checked", val.enable);
    $("#enableLB").text(val.enable ? "啟用" : "停用");
});
$("#fill").change(e => {
    chrome.storage.sync.set({ "fill": e.target.checked });
    $("#fillLB").text(e.target.checked ? "僻眼韓黑模式" : "理性含奮模式");
});
$("#enable").change(e => {
    chrome.storage.sync.set({ "enable": e.target.checked });
    chrome.browserAction.setBadgeText({ text: e.target.checked ? "" : "X" });
    $("#enableLB").text(e.target.checked ? "啟用" : "停用");
    $("#fill").attr("disabled", !e.target.checked);
});
$("#btn").click(_ => chrome.tabs.query({ active: true, currentWindow: true }, tabs => chrome.tabs.sendMessage(tabs[0].id, { hide: "hide" })));