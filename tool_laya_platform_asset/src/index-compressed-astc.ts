import { EnumAstcBlockSize } from "./EnumAstcBlockSize";
import { EnumAstcMode } from "./EnumAstcMode";
import { EnumAstcSpeed } from "./EnumAstcSpeed";
import { EnumExt } from "./EnumExt";
import { ImageCompressedUtils, ImageFile } from "./ImageCompressedUtils";
import { Tool } from "./Tool";

var commander = require('commander');
commander
    .version('1.0.0', '-v, --version')

    .usage(`
tool-laya-platform compressed astc <inputTexturePath> <outputTexturePath> [model] [blocksize] [speed]

Example

tool-laya-platform compressed astc -i ./test/platform_asset/default_high -o ./test/platform_asset/astc_high -m 'cl' -b '8x8' s 'medium'


ts-node ./src/index.ts compressed astc -i ./test/platform_asset/default_high -o ./test/platform_asset/astc_high -m 'cl' -b '8x8' -s 'medium'

    `)

    .option("-m, --model [model]", "默认 -cl，可选-cl、-cs、-ch、-cH")
    .option("-b, --blocksize [blocksize]", "默认 8x8，可选4、6、8、10、12")
    .option("-s, --speed [speed]", "默认 -medium，可选-veryfast、-fast、-medium、-thorough、-exhaustive")
    .option("-i, --inputTexturePath <inputTexturePath>", "原图目录")
    .option("-o, --outputTexturePath <outputTexturePath>", "输出图片目录")
    .parse(process.argv);

console.log("index-compressed-astc.ts");

Tool.__Init__();
const options = commander.opts();
console.log(options);

let model = options.model !== undefined ? "-" + options.model : EnumAstcMode.cl;
let blocksize = options.blocksize !== undefined ? options.blocksize : EnumAstcBlockSize.size_8x8;
let speed = options.speed !== undefined ? "-" + options.speed : EnumAstcSpeed.medium;
let inputTexturePath = options.inputTexturePath;
let outputTexturePath = options.outputTexturePath;

console.log("model:", model);
console.log("blocksize:", blocksize);
console.log("speed:", speed);
console.log("inputTexturePath:", inputTexturePath);
console.log("outputTexturePath:", outputTexturePath);


async function ImageCompressedDirSync(srcPath: string, destPath: string, isIgnoreHide = true) {
    console.log("收集图片文件列表中...");
    let list: ImageFile[] = [];
    list = ImageCompressedUtils.FindImageDir(list, srcPath, destPath, EnumExt.astc);
    let count = list.length;

    for (let i = 0; i < count; i++) {
        let item = list[i];
        if (i % 10 == 0) {
            await ImageCompressedSync(item.srcPath, item.destPath);
        }
        else {
            ImageCompressedSync(item.srcPath, item.destPath);
        }
        console.log(`处理 ${Math.floor(((i + 1) / count) * 100)}% (${i + 1}/${count})`);
    }
}


async function ImageCompressedSync(srcPath: string, destPath: string) {
    Tool.Image2AstcSync(srcPath, destPath, <EnumAstcMode>model, blocksize, <EnumAstcSpeed>speed)
}

ImageCompressedDirSync(inputTexturePath, outputTexturePath);