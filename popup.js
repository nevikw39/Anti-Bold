chrome.storage.sync.get(["enable", "fill"], val => {
    $("#fill").attr("checked", val.fill);
    $("#fillLB").text(val.fill ? "屁眼韓黑模式" : "理性含份模式");
    $("#enable").attr("checked", val.enable);
    $("#enableLB").text(val.enable ? "啟用" : "禁用");
});
$("#fill").change(e => {
    chrome.storage.sync.set({ "fill": e.target.checked });
    $("#fillLB").text(e.target.checked ? "屁眼韓黑模式" : "理性含份模式");
});
$("#enable").change(e => {
    chrome.storage.sync.set({ "enable": e.target.checked });
    $("#enableLB").text(e.target.checked ? "啟用" : "禁用");
    $("#fill").attr("disabled", !e.target.checked);
});