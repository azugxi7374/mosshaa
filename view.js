function redrawMainCanvas() {
    const image = state.image;
    const { container: ctn, canvas } = state.canvas || {};

    if (image && ctn && canvas) {
        const cw = ctn.clientWidth;
        const ch = ctn.clientHeight;
        const iw = image.width;
        const ih = image.height;
        const ctx = canvas.getContext('2d');
        const p = 10;

        let scale = (cw - p) / iw;
        if (ih * scale > ch - p) {
            scale = (ch - p) / ih;
        }
        const h = ih * scale;
        const w = iw * scale;
        canvas.height = h;
        canvas.width = w;
        // console.log("redrawMainCanvas", cw, ch, iw, ih, scale, w, h)
        ctx.drawImage(image, 0, 0, w, h);
    } else {
        // TODO
    }
}

function renderColorCircle(size, r, g, b) {
    const clrc = document.getElementById('color-circle');
    clrc.width = size; clrc.height = size;
    const ctx = clrc.getContext('2d');

    const r1 = size / 2
    const r2 = r1 * 3 / 4
    const sr = r2 / 1.41

    const x0 = size / 2
    const y0 = size / 2

    const N = 36
    for (let i = 0; i < N; i++) {
        const region = new Path2D();

        const [_r, _g, _b] = hsv2rgb(360 * i / N, 1, 1);
        // console.log({ i }, { r, g, b }, [360 * i / N, 1, 1])

        ctx.fillStyle = toColorCode(_r, _g, _b);

        let moved = false;

        const dr12 = [r1, r1, r2, r2];
        const di = [i - 0.5, i + 0.5, i + 0.5, i - 0.5];

        [0, 1, 2, 3].map(ii => {
            const theta = Math.PI * 5 / 6 - Math.PI * 2 / N * di[ii];
            return [dr12[ii] * Math.cos(theta), dr12[ii] * Math.sin(theta)]
        }).forEach(([_x, _y]) => {
            const xx = x0 + _x;
            const yy = y0 - _y;
            if (!moved) {
                region.moveTo(xx, yy);
                moved = true;
            } else {
                region.lineTo(xx, yy);
            }
        });
        region.closePath();
        ctx.fill(region);
    }

    const [h, s, v] = rgb2hsv(r, g, b);
    const M = 20;
    for (let i = 0; i < M; i++) {
        for (let jj = 0; jj < M; jj++) {
            const xx = x0 - sr + (sr * 2) * i / M;
            const yy = y0 - sr + (sr * 2) * (M - 1 - jj) / M;
            const [rr, gg, bb] = hsv2rgb(h, i / M, jj / M)
            ctx.fillStyle = toColorCode(rr, gg, bb);
            ctx.fillRect(xx, yy, sr * 2 / M, sr * 2 / M);
        }
    }

    const markerSize = 4;
    // hue
    function markHUE() {
        const angle = Math.PI * 5 / 6 - Math.PI * 2 * h / 360;
        const rr = (r1 + r2) / 2;
        const xx = x0 + rr * Math.cos(angle);
        const yy = y0 - rr * Math.sin(angle);
        ctx.fillStyle = "white";
        ctx.fillRect(xx - markerSize / 2, yy - markerSize / 2, markerSize, markerSize);
    }
    markHUE();
    // s,v
    function markSV() {
        const xx = x0 - sr + (2 * sr * s);
        const yy = y0 - sr + (2 * sr * (1 - v));
        ctx.fillStyle = "white";
        ctx.fillRect(xx - markerSize / 2, yy - markerSize / 2, markerSize, markerSize);
    }
    markSV();
    log({ size, r1, r2, sr, x0, y0 });
    log({ r, g, b, h, s, v });
}

function renderColorInfo(r, g, b) {
    const cs = document.querySelector('.color-square');
    const ct = document.querySelector('.color-text');
    const clrcd = toColorCode(r, g, b);
    cs.style = `background-color:${clrcd}`;
    ct.innerText = clrcd;
    renderColorCircle(100, r, g, b)
    //    drawLine(context, x, y, e.offsetX, e.offsetY);
}