import { EnumAstcBlockSize } from "./EnumAstcBlockSize";
import { EnumAstcMode } from "./EnumAstcMode";
import { EnumAstcSpeed } from "./EnumAstcSpeed";
import { EnumDdsCompression } from "./EnumDdsCompression";
import { EnumExt } from "./EnumExt";
import { ImageCompressedUtils, ImageFile } from "./ImageCompressedUtils";
import { Tool } from "./Tool";

var commander = require('commander');
commander
    .version('1.0.0', '-v, --version')

    .usage(`
tool-laya-platform compressed dds <inputTexturePath> <outputTexturePath> [compression]

Example

tool-laya-platform compressed dds -i ./test/platform_asset/default_high -o ./test/platform_asset/dds_high -c 'dxt5'


ts-node ./src/index.ts compressed dds -i ./test/platform_asset/default_high -o ./test/platform_asset/dds_high -c 'dxt5'

    `)

    .option("-c, --compression [compression]", "默认 dxt5，可选dxt1、dxt5")
    .option("-i, --inputTexturePath <inputTexturePath>", "原图目录")
    .option("-o, --outputTexturePath <outputTexturePath>", "输出图片目录")
    .parse(process.argv);

console.log("index-compressed-astc.ts");

Tool.__Init__();
const options = commander.opts();
console.log(options);

let compression = options.compression !== undefined ? "-" + options.compression : EnumDdsCompression.dxt5;
let inputTexturePath = options.inputTexturePath;
let outputTexturePath = options.outputTexturePath;
console.log("compression:", compression);
console.log("inputTexturePath:", inputTexturePath);
console.log("outputTexturePath:", outputTexturePath);


async function ImageCompressedDirSync(srcPath: string, destPath: string, isIgnoreHide = true) {
    console.log("收集图片文件列表中...");
    let list: ImageFile[] = [];
    list = ImageCompressedUtils.FindImageDir(list, srcPath, destPath, EnumExt.dds);
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
    Tool.Image2DdsSync(srcPath, destPath, <EnumDdsCompression>compression)
}

ImageCompressedDirSync(inputTexturePath, outputTexturePath);