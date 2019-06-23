(async function () {
    const match = new faceapi.FaceMatcher(new faceapi.LabeledFaceDescriptors("bold", (await faceapi.fetchJson(chrome.runtime.getURL("/bold.json"))).map(i => new Float32Array(i))), 0.55);
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(chrome.runtime.getURL("/models/")),
        faceapi.nets.faceLandmark68Net.loadFromUri(chrome.runtime.getURL("/models/")),
        faceapi.nets.ssdMobilenetv1.loadFromUri(chrome.runtime.getURL("/models/"))
    ]).then(async () => {
        console.log("%c    _          _   _       ____        _     _ \n   / \\   _ __ | |_(_)     | __ )  ___ | | __| |\n  / _ \\ | '_ \\| __| |_____|  _ \\ / _ \\| |/ _` |\n / ___ \\| | | | |_| |_____| |_) | (_) | | (_| |\n/_/   \\_\\_| |_|\\__|_|     |____/ \\___/|_|\\__,_|", "background-color: #198964; color: white; font-weight: bold; /* XD */");
        let mo = new MutationObserver(_ => {
            $("img").each(async (_, i) => {
                const j = $(i);
                if (j.data("Anti-Bold") !== undefined)
                    return;
                if (i.complete && i.naturalHeight !== 0)
                    f(i);
            });
        });
        mo.observe(document, { subtree: true, childList: true, attributes: true });
    }).catch(err => console.log(err));
    async function f(x) {
        document.body.style.cursor = "wait";
        const j = $(x);
        j.data("Anti-Bold", true).wrap(`<div style="position: relative; display: inline-block; width: ${j.width() + "px"}; height: ${j.height() + "px"}; margin: 0px auto;">`).css("margin-left", "0px").css("margin-right", "0px")
            .after(`<canvas style="position: absolute; top: 0px; left: 0px; padding-top: ${j.css("padding-top")}; margin-top: ${j.css("margin-top")};">`);
        const cv = x.nextSibling;
        const dts = await faceapi.detectAllFaces(await faceapi.fetchImage(x.src)).withFaceLandmarks().withFaceDescriptors();
        const size = { width: j.width(), height: j.height() };
        const rr = faceapi.resizeResults(dts, size);
        faceapi.matchDimensions(cv, size);
        // faceapi.draw.drawDetections(cv, rr);
        rr.forEach(i => {
            const result = match.findBestMatch(i.descriptor);
            j.data("Anti-Bold", j.data("Anti-Bold") + result.distance);
            console.debug(x, result.toString());
            if (result.label == "bold") {
                x.title = result.distance;
                const box = i.detection.box;
                const ctx = cv.getContext("2d");
                ctx.fillStyle = "#198964E0";
                ctx.fillRect(box.x, box.y, box.width, box.height);
            }
        });
        document.body.style.cursor = "default";
    }
})();