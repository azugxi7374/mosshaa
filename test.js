// サンプルをクリックして、色彩タブを開く
function test1() {
    document.getElementById('input-btn-usesample').dispatchEvent(new Event('click'));
    document.getElementById('tab-color').dispatchEvent(new Event('click'))
}

const testKeys = {
    1: test1,
}
document.addEventListener('keypress', (e) => {
    if (testKeys[e.key]) {
        testKeys[e.key]();
        console.log("run test", testKeys[e.key].name);
    }
});