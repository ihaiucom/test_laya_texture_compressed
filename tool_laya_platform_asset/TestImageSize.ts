import imageSize from 'image-size'
// import imageMagick from 'gm';
import fs from 'fs'
import gm from 'gm'

var t = Date.now();
console.time("imageSize")
imageSize('tool/a1.jpg', function (err, dimensions) {
    if (!dimensions) {
        console.error(err);
        return;
    }
    console.timeEnd("imageSize")
    console.log((Date.now() - t))
    console.log(dimensions.width, dimensions.height)
    console.log(dimensions)
})
