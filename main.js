const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const [width, height] = [200, 200];
canvas.width = width;
canvas.height = height;

const img = document.getElementById('img');
img.addEventListener('load', function () {
    console.log("load")
    ctx.drawImage(img, 0, 0, width, height);

    for (const ev of ['mousemove'/*, 'touchmove'*/]) {
        console.log("ev")
        canvas.addEventListener(ev, (e) => { handler(e) })
    }
    // a();
}, false);

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
    //    drawLine(context, x, y, e.offsetX, e.offsetY);
}
function a() {
    const a = 2
    document.body.innerHTML = `<div>${a}</div>` + document.body.innerHTML
}
function toColorCode(r, g, b) {
    return "#" + [r, g, b].map((x) => (x + 256).toString(16).slice(1)).join("");
}

console.log("ok")
