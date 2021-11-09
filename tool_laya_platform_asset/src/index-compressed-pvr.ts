import path from "path";
import { EnumExt } from "./EnumExt";
import { EnumPvrFormat } from "./EnumPvrFormat";
import { EnumPvrQuality } from "./EnumPvrQuality";
import { ImageCompressedUtils, ImageFile } from "./ImageCompressedUtils";
import { Tool } from "./Tool";

var commander = require('commander');
commander
    .version('1.0.0', '-v, --version')

    .usage(`
tool-laya-platform compressed pvr <inputTexturePath> <outputTexturePath> [format] [quality]

Example

tool-laya-platform compressed pvr -i ./test/platform_asset/default_high -o ./test/platform_asset/pvr_high -f 'PVRTC1_2' -q 'pvrtcfast' -p '-' -s '-'


ts-node ./src/index.ts compressed pvr -i ./test/platform_asset/default_high -o ./test/platform_asset/pvr_high -f 'PVRTC1_2' -q 'pvrtcfast -p '-' -s '-'

    `)

    .option("-f, --format [format]", "默认 PVRTC1_2，可选PVRTC1_2、PVRTC1_4、PVRTC1_2_RGB、PVRTC1_4_RGB、PVRTC2_2、PVRTC2_4")
    .option("-q, --quality [quality]", "默认 pvrtcfast，可选pvrtcfastest、pvrtcfast、pvrtcnormal、pvrtchigh、pvrtcbest")
    .option("-p, --pot [pot]", "默认 -, 可选 +、-")
    .option("-s, --square [square]", "默认 -, 可选 +、-")
    .option("-i, --inputTexturePath <inputTexturePath>", "原图目录")
    .option("-o, --outputTexturePath <outputTexturePath>", "输出图片目录")
    .parse(process.argv);



Tool.__Init__();
const options = commander.opts();

let format = options.format !== undefined ? options.format : EnumPvrFormat.PVRTC1_2;
let quality = options.quality !== undefined ? options.quality : EnumPvrQuality.pvrtcfast;
let pot = options.pot !== undefined ? options.pot : "-";
let square = options.square !== undefined ? options.square : "-";
let inputTexturePath = options.inputTexturePath;
let outputTexturePath = options.outputTexturePath;

console.log("format:", format);
console.log("quality:", quality);
console.log("inputTexturePath:", inputTexturePath);
console.log("outputTexturePath:", outputTexturePath);



async function ImageCompressedDirSync(srcPath: string, destPath: string, isIgnoreHide = true) {
    console.log("收集图片文件列表中...");
    let list: ImageFile[] = [];
    list = ImageCompressedUtils.FindImageDir(list, srcPath, destPath, EnumExt.pvr);
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
    Tool.Image2PvrSync(srcPath, destPath, <EnumPvrFormat>format, <EnumPvrQuality>quality, pot, square)
}

ImageCompressedDirSync(inputTexturePath, outputTexturePath);