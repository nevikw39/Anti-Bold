(async function () {
    console.log("%c    _          _   _       ____        _     _ \n   / \\   _ __ | |_(_)     | __ )  ___ | | __| |\n  / _ \\ | '_ \\| __| |_____|  _ \\ / _ \\| |/ _` |\n / ___ \\| | | | |_| |_____| |_) | (_) | | (_| |\n/_/   \\_\\_| |_|\\__|_|     |____/ \\___/|_|\\__,_|", "background-color: #198964; color: white; font-weight: bold; /* XD */");
    if (!await new Promise(rs => chrome.storage.sync.get(["enable"], val => rs(val.enable))))
        return;
    const fill = await new Promise(rs => chrome.storage.sync.get(["fill"], val => rs(val.fill)));
    const match = new faceapi.FaceMatcher(new faceapi.LabeledFaceDescriptors("bold", (await faceapi.fetchJson(chrome.runtime.getURL("/bold.json"))).map(i => new Float32Array(i))), 0.55);
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(chrome.runtime.getURL("/models/")),
        faceapi.nets.faceLandmark68Net.loadFromUri(chrome.runtime.getURL("/models/")),
        faceapi.nets.ssdMobilenetv1.loadFromUri(chrome.runtime.getURL("/models/"))
    ]).then(async () => {
        let mo = new MutationObserver(_ => {
            $("img").each(async (_, i) => {
                const j = $(i);
                if (j.data("Anti-Bold") !== undefined)
                    return;
                if (i.complete && i.naturalWidth && i.width && i.height)
                    f(i);
            });
        });
        mo.observe(document, { subtree: true, childList: true, attributes: true });
    }).catch(err => console.log(err));
    async function f(x) {
        document.body.style.cursor = "wait";
        if (!x.width || !x.height)
            return;
        const j = $(x);
        const dts = await faceapi.detectAllFaces(await faceapi.fetchImage(x.src)).withFaceLandmarks().withFaceDescriptors();
        const size = { width: j.width(), height: j.height() };
        const rr = faceapi.resizeResults(dts, size);
        j.data("Anti-Bold", false);
        rr.forEach(i => {
            const result = match.findBestMatch(i.descriptor);
            console.debug(x, result.toString());
            if (result.label == "bold") {
                if (!j.data("Anti-Bold"))
                    j.wrap(`<div style="position: relative; display: inline-block; width: ${j.width() + "px"}; height: ${j.height() + "px"}; margin: 0px auto;">`).css("margin-left", "0px").css("margin-right", "0px")
                        .after(`<canvas class="anti-bold" style="position: absolute; top: 0px; left: 0px; padding-top: ${j.css("padding-top")}; margin-top: ${j.css("margin-top")};">`);
                const cv = x.nextSibling;
                const box = i.detection.box;
                const ctx = cv.getContext("2d");
                faceapi.matchDimensions(cv, size);
                if (fill) {
                    ctx.fillStyle = "#198964";
                    ctx.fillRect(box.x, box.y, box.width, box.height);
                }
                else {
                    ctx.lineWidth = 6.9;
                    ctx.strokeStyle = "#F0E87D";
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                }
                j.data("Anti-Bold", true);
            }
        });
        document.body.style.cursor = "default";
    }
})();