import path from "path";
import { ImageResizeUtils } from "./ImageResizeUtils";
import { Tool } from "./Tool";

var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')
    .usage(`
tool-laya-platform resize <size> <quality> <inputTexturePath> <outputTexturePath>

Example
tool-laya-platform resize '50%' ./test/platform_asset/default_high ./test/platform_asset/default_middle

ts-node ./src/index.ts resize -s '50%' -q 70 -i ./test/platform_asset/default_high -o ./test/platform_asset/default_middle
    `)
    .option("-s, --size <size>", "大小")
    .option("-q, --quality <quality>", "质量")
    .option("-r, --isOver [over]", "是否覆盖")
    .option("-i, --inputTexturePath <inputTexturePath>", "原图目录")
    .option("-o, --outputTexturePath <outputTexturePath>", "缩放后的图片目录")
    .parse(process.argv);

Tool.__Init__();
const options = commander.opts();

console.log("index-resize.ts");

let size = options.size;
let quality = options.quality;
let isOver = options.isOver !== undefined ? options.isOver : true;
let inputTexturePath = options.inputTexturePath;
let outputTexturePath = options.outputTexturePath;

let cwdDir: string = process.cwd();


console.log("process.argv:", process.argv);

console.log("cwdDir:", cwdDir);
console.log("----参数-----");
console.log("size:", size);
console.log("quality:", quality);
console.log("inputTexturePath:", inputTexturePath);
console.log("outputTexturePath:", outputTexturePath);

ImageResizeUtils.ImageResizeDirSync(inputTexturePath, outputTexturePath, size, quality, isOver);
