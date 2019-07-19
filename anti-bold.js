(async function () {
    chrome.runtime.onMessage.addListener(request => {
        if (request.hide) {
            $("canvas.anti-bold").hide();
            setTimeout(_ => {
                $("canvas.anti-bold").show();
                foo();
            }, 10000);
        }
    });
    let b = 0, n = 0;
    const model = chrome.runtime.getURL("/models/");
    const match = new faceapi.FaceMatcher([
        ...(await new Promise(rs => chrome.storage.local.get(["bold"], val => rs(val.bold)))).map(i => new faceapi.LabeledFaceDescriptors(`bold ${b++}`, [new Float32Array(i)])),
        ...(await new Promise(rs => chrome.storage.local.get(["non"], val => rs(val.non)))).map(i => new faceapi.LabeledFaceDescriptors(`non ${n++}`, [new Float32Array(i)]))
    ], 0.45);
    const settings = await new Promise(rs => chrome.storage.sync.get(["fill", "enable", "tiny"], val => rs(val)));
    const opt = settings.tiny ? new faceapi.TinyFaceDetectorOptions() : new faceapi.SsdMobilenetv1Options();
    if (!settings.enable)
        return;
    console.log("%c    _          _   _       ____        _     _ \n   / \\   _ __ | |_(_)     | __ )  ___ | | __| |\n  / _ \\ | '_ \\| __| |_____|  _ \\ / _ \\| |/ _` |\n / ___ \\| | | | |_| |_____| |_) | (_) | | (_| |\n/_/   \\_\\_| |_|\\__|_|     |____/ \\___/|_|\\__,_|", "background-color: #198964; color: white; font-weight: bold; /* XD */");
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(model),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(model),
        faceapi.nets.faceLandmark68Net.loadFromUri(model),
        faceapi.nets.ssdMobilenetv1.loadFromUri(model),
        faceapi.nets.tinyFaceDetector.loadFromUri(model)
    ]).then(_ => {
        foo();
        let mo = new MutationObserver(_ => foo());
        mo.observe(document, { subtree: true, childList: true });
    });
    function foo() {
        $("img").each(async (_, i) => {
            if (i.dataset.anti_bold != undefined)
                return;
            if (i.complete && i.naturalWidth)
                bar(i);
        });
    }
    async function bar(x) {
        document.body.style.cursor = "wait";
        const j = $(x);
        const size = { width: j.width(), height: j.height() };
        if (size.width <= 0 || size.height <= 0)
            return;
        const dts = await faceapi.detectAllFaces(await faceapi.fetchImage(x.src), opt).withFaceLandmarks(settings.tiny).withFaceDescriptors();
        const rr = faceapi.resizeResults(dts, size);
        x.dataset.anti_bold = "non";
        rr.forEach(i => {
            const result = match.findBestMatch(i.descriptor);
            if (result.label.slice(0, 4) == "bold") {
                console.debug(x, result.distance);
                if (!x.nextSibling || x.nextSibling.tagName != "CANVAS")
                    j.wrap(`<div style="position: relative; width: ${j.width() + "px"}; height: ${j.height() + "px"}; margin-top: ${j.css("margin-top")}; margin-left: ${j.css("margin-left")}; margin-right: ${j.css("margin-right")};">`)
                        .after(`<canvas class="anti-bold" style="position: absolute; top: 0px; left: 0px; margin-left: ${j.css("margin-left")}; margin-right: ${j.css("margin-right")};">`);
                x.dataset.anti_bold = result.toString();
                const cv = x.nextSibling;
                const box = i.detection.box;
                const ctx = cv.getContext("2d");
                faceapi.matchDimensions(cv, size);
                if (settings.fill) {
                    ctx.fillStyle = "#198964";
                    ctx.fillRect(box.x, box.y, box.width, box.height);
                }
                else {
                    ctx.lineWidth = 6.9;
                    ctx.strokeStyle = "#F0E87D";
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                }
            }
        });
        document.body.style.cursor = "default";
    }
})();