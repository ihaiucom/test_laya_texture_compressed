import { EnumEtcFormat } from "./EnumEtcFormat";
import { EnumEtcSpeed } from "./EnumEtcSpeed";
import { EnumExt } from "./EnumExt";
import { ImageCompressedUtils, ImageFile } from "./ImageCompressedUtils";
import { Tool } from "./Tool";

var commander = require('commander');
commander
    .version('1.0.0', '-v, --version')

    .usage(`
tool-laya-platform compressed etc <inputTexturePath> <outputTexturePath> [format] [speed]

Example

tool-laya-platform compressed etc -i ./test/platform_asset/default_high -o ./test/platform_asset/etc_high -f 'etc2_rgba' -s 'fast'


ts-node ./src/index.ts compressed etc -i ./test/platform_asset/default_high -o ./test/platform_asset/etc_high -f 'etc2_rgba' -s 'fast'

    `)

    .option("-f, --format [format]", "默认 etc2_rgba，可选etc1_rgb、etc2_rgb、etc2_rgba、etc2_rgba1、eac_r、eac_rg")
    .option("-s, --speed [speed]", "默认 fast，可选fast、normal、best")
    .option("-i, --inputTexturePath <inputTexturePath>", "原图目录")
    .option("-o, --outputTexturePath <outputTexturePath>", "输出图片目录")
    .parse(process.argv);




Tool.__Init__();
const options = commander.opts();
console.log(options);


let format = options.format !== undefined ? options.format : EnumEtcFormat.etc2_rgba;
let speed = options.speed !== undefined ? options.speed : EnumEtcSpeed.fast;
let inputTexturePath = options.inputTexturePath;
let outputTexturePath = options.outputTexturePath;

console.log("format:", format);
console.log("speed:", speed);
console.log("inputTexturePath:", inputTexturePath);
console.log("outputTexturePath:", outputTexturePath);



async function ImageCompressedDirSync(srcPath: string, destPath: string, isIgnoreHide = true) {
    console.log("收集图片文件列表中...");
    let list: ImageFile[] = [];
    list = ImageCompressedUtils.FindImageDir(list, srcPath, destPath, EnumExt.etc);
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
    Tool.Image2EtcSync(srcPath, destPath, <EnumEtcFormat>format, <EnumEtcSpeed>speed)
}

ImageCompressedDirSync(inputTexturePath, outputTexturePath);