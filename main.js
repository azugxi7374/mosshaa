
const [onOpenCvReady, opencvReady] = onloadWrapper()

const state = {
    image: null,
    canvas: {
        container: null,
        canvas: null
    },
    inputImg: null,
}

opencvReady.then(() => {

    console.log("opencv ready!");
});


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
    state.canvas = {
        container: document.getElementById('main-canvas-container'),
        canvas: document.getElementById('canvas'),
    }
    state.inputImg = document.getElementById('input-img')

    const canvasContainer = state.canvas.container
    const canvas = state.canvas.canvas;
    const ctx = canvas.getContext('2d');
    const inputImg = state.inputImg;

    for (const ev of ['mousemove'/*, 'touchmove'*/]) {
        canvas.addEventListener(ev, (e) => {
            const [x, y] = [e.offsetX, e.offsetY];
            const imgData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b, a] = imgData.data;
            renderColorInfo(r, g, b);
        })
    }




    function loadImage(loadedImage) {
        log("load")
        state.image = loadedImage;

        redrawMainCanvas();
        renderColorInfo(0, 0, 0);

        // clustering
        opencvReady.then(() => {
            function f() {
                console.log("clustering start");
                const { labels, centers } = kmeans(state.canvas.canvas, 5);
                console.log("clustering end");

                const labelsCount = centers.map(_ => 0);
                labels.forEach(l1 => l1.forEach(k => labelsCount[k]++));
                const labelsRate = labelsCount.map(v => v / (labels.length * labels[0].length));

                const dist = centers.map((rgb0, k) => [rgb0, labelsRate[k]]);
                window.g = { ...window.g, centers, dist }
                dist.sort((a, b) => b[1] - a[1]);
                renderColorDistBar(dist);
            }
            // TODO もっとマシな方法で非同期にする
            setTimeout(f, 1500)
        });
    }

    inputImg.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
                loadImage(image);
            }
        }
    });

    document.getElementById("input-btn-usesample").addEventListener('click', () => {
        const image = document.getElementById("img-sample1");
        image.onload = () => { loadImage(image) };
        // ↓loadedを再発行
        const src = image.src;
        image.src = "";
        image.src = src;
    });
    /*
    const iobs = new IntersectionObserver((entries, observer) => {
        redrawMainCanvas();
    }, { root: document.documentElement });
    iobs.observe(canvasContainer);
*/

    let cnt = 0;
    let _prevSize = {};
    // 他にいい方法がない
    setInterval(() => {
        const curSize = canvasContainer.getBoundingClientRect();
        if (_prevSize.width !== curSize.width || _prevSize.height !== curSize.height) {
            redrawMainCanvas()
            _prevSize = curSize;
        }
    });
    /*
    const mobs = new MutationObserver(() => {
        console.log(cnt);
        cnt++;
        const curSize = canvasContainer.getBoundingClientRect();
        if (_prevSize.width !== curSize.width || _prevSize.height !== curSize.height) {
            clearTimeout(_prevTimeoutID)
            _prevTimeoutID = setTimeout(() => {
                redrawMainCanvas()
            }, 500);
        }
        _prevSize = curSize;
    });
    mobs.observe(document.body, { attributes: true, subtree: true });
    */
}

document.addEventListener('DOMContentLoaded', main);