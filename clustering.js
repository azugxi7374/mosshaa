function kmeans(imgElement, clusterCount) {
    let mat = cv.imread(imgElement);

    // resize
    /*
    const _size = mat.rows * mat.cols;
    if (_size > 300 * 300) {
        const scale = ((300 * 300) / _size) ** (1 / 2);

        const dst = new cv.Mat();
        const dsize = new cv.Size(mat.rows * scale, mat.cols * scale);
        cv.resize(mat, dst, dsize, 0, 0, cv.INTER_AREA);
        mat.delete();
        mat = dst;
    }
*/

    // sampleをとる
    let sample = new cv.Mat(mat.rows * mat.cols, 3, cv.CV_32F);
    for (var y = 0; y < mat.rows; y++)
        for (var x = 0; x < mat.cols; x++)
            for (var z = 0; z < 3; z++)
                sample.floatPtr(y + x * mat.rows)[z] = mat.ucharPtr(y, x)[z];

    var labels = new cv.Mat();
    var attempts = 5;
    var centers = new cv.Mat();
    var crite = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10000, 0.0001);
    // var criteria = [1, 10, 0.0001];

    ///////////////////
    cv.kmeans(sample, clusterCount, labels, crite, attempts, cv.KMEANS_RANDOM_CENTERS, centers);
    ///////////////

    const _labels = (new Array(mat.cols)).fill(0).map(i => (new Array(mat.row)).fill(0))
    const _centers = (new Array(clusterCount)).fill(0).map((_, i) => ([0, 1, 2].map(k => centers.floatAt(i, k))))

    for (var y = 0; y < mat.rows; y++)
        for (var x = 0; x < mat.cols; x++) {
            _labels[x][y] = labels.intAt(y + x * mat.rows, 0);
        }
    mat.delete();
    labels.delete();
    centers.delete();
    return { labels: _labels, centers: _centers };
}
