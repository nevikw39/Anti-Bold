(async function () {
    const match = new faceapi.FaceMatcher(new faceapi.LabeledFaceDescriptors("bold", (await faceapi.fetchJson(chrome.runtime.getURL("/bold.json"))).map(i => new Float32Array(i))), 0.55);
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(chrome.runtime.getURL("/models/")),
        faceapi.nets.faceLandmark68Net.loadFromUri(chrome.runtime.getURL("/models/")),
        faceapi.nets.ssdMobilenetv1.loadFromUri(chrome.runtime.getURL("/models/"))
    ]).then(async () => {
        console.log("    _          _   _       ____        _     _\n   / \\   _ __ | |_(_)     | __ )  ___ | | __| |\n  / _ \\ | '_ \\| __| |_____|  _ \\ / _ \\| |/ _` |\n / ___ \\| | | | |_| |_____| |_) | (_) | | (_| |\n/_/   \\_\\_| |_|\\__|_|     |____/ \\___/|_|\\__,_|");
        jQuery.noConflict();
        let mo = new MutationObserver(_ => {
            jQuery("img").each(async (_, i) => {
                const j = jQuery(i);
                if (j.data("Anti-Bold") != undefined)
                    return;
                if (i.complete && i.naturalHeight !== 0)
                    f(i);
            });
        });
        mo.observe(document, { subtree: true, childList: true, attributes: true });
    }).catch(err => console.log(err));
    async function f(x) {
        x.crossOrigin = "";
        const j = jQuery(x);
        j
            .data("Anti-Bold", true).wrap(`<div style="position: relative; display: block; margin: 0px auto;>`).css("margin-left", "0px").css("margin-right", "0px")
            .after(`<canvas style="position: absolute; top: 0px; left: 0px; width: ${j.width()}px; height: ${j.height()}px; padding-top: ${j.css("padding-top")}; margin-top: ${j.css("margin-top")};">`);
        const cv = x.nextSibling;
        const dts = await faceapi.detectAllFaces(await faceapi.fetchImage(x.src)).withFaceLandmarks().withFaceDescriptors();
        const size = { width: j.width(), height: j.height() };
        const rd = faceapi.resizeResults(dts, size);
        faceapi.matchDimensions(cv, size);
        faceapi.draw.drawDetections(cv, rd);
        dts.forEach(i => {
            const result = match.findBestMatch(i.descriptor);
            if (result.distance < 0.55) {
                const box = i.detection.box;
                const ctx = cv.getContext("2d");
                ctx.fillStyle = "#198964E0";
                ctx.fillRect(box.x, box.y, box.width, box.height);
            }
        });
    }
})();