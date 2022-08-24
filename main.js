function checkReload() {
    const searchmap = Object.fromEntries(document.location.search.slice(1).split("&").map(a => a.split("=")));

    const t = searchmap._ || 0
    const now = Date.now();
    if (now - t > 10 * 1000) {
        document.location.search = `?_=${now}`
    }
}

function main() {
    checkReload();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const [width, height] = [200, 200];
    canvas.width = width;
    canvas.height = height;

    const inputImg = document.getElementById('input-img')
    inputImg.addEventListener('change', (e) => {
        const image = new Image();

        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            image.src = reader.result;
        }

        image.onload = () => {
            log("load")
            ctx.drawImage(image, 0, 0, width, height);

            for (const ev of ['mousemove'/*, 'touchmove'*/]) {
                log("ev")
                canvas.addEventListener(ev, (e) => { handler(e) })
            }
            // a();
        }
    });

    function handler(e) {
        const [x, y] = [e.offsetX, e.offsetY];
        const imgData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imgData.data;
        // console.log({x,y,r,g,b,a})
        const cs = document.querySelector('.color-square');
        const ct = document.querySelector('.color-text');
        const clrcd = toColorCode(r, g, b);
        cs.style = `background-color:${clrcd}`;
        ct.innerText = clrcd;
        createColorCircle(100, r, g, b)
        //    drawLine(context, x, y, e.offsetX, e.offsetY);
    }
}

function createColorCircle(size, r, g, b) {
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

document.addEventListener('DOMContentLoaded', main);