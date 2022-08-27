function log(...data) {
    console.log(...data);
    const db = document.getElementById('debugbox');
    if (db) {
        db.innerText += `${data.join(" ")}\n`
    }
}

// return [resolver, promise]
function onloadWrapper() {
    let res;
    const p = new Promise((resolve, reject) => {
        res = resolve;
    });
    return [res, p]
}


function toColorCode(r, g, b) {
    return "#" + [r, g, b].map((x) => parseInt((x + 256)).toString(16).slice(1)).join("");
}

// https://lab.syncer.jp/Web/JavaScript/Snippet/67/
function hsv2rgb(h, s, v) {
    var h = h / 60;
    if (s == 0) return [v * 255, v * 255, v * 255];

    var rgb;
    var i = parseInt(h);
    var f = h - i;
    var v1 = v * (1 - s);
    var v2 = v * (1 - s * f);
    var v3 = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
        case 6:
            rgb = [v, v3, v1];
            break;

        case 1:
            rgb = [v2, v, v1];
            break;

        case 2:
            rgb = [v1, v, v3];
            break;

        case 3:
            rgb = [v1, v2, v];
            break;

        case 4:
            rgb = [v3, v1, v];
            break;

        case 5:
            rgb = [v, v1, v2];
            break;
    }

    return rgb.map(function (value) {
        return value * 255;
    });
}

function rgb2hsv(r, g, b) {
    var r = r / 255;
    var g = g / 255;
    var b = b / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var diff = max - min;

    var h = 0;

    switch (min) {
        case max:
            h = 0;
            break;

        case r:
            h = (60 * ((b - g) / diff)) + 180;
            break;

        case g:
            h = (60 * ((r - b) / diff)) + 300;
            break;

        case b:
            h = (60 * ((g - r) / diff)) + 60;
            break;
    }

    var s = max == 0 ? 0 : diff / max;
    var v = max;

    return [h, s, v];
}


