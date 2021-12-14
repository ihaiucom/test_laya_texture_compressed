import path from "path";
import { FileUtils } from "./FileUtils";
import { FileCopyUtils } from "./FileCopyUtils";
import { ImageFile } from "./ImageCompressedUtils";


var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')


    .usage(`
tool-laya-platform imagesize <inputPath> <outputPath>

Example

tool-laya-platform  imagesize -i D:\zengfeng\GameJJSG2021\client\laya\bin -o ./test/platform_asset/default_high


ts-node ./src/index.ts imagesize -i ../Laya212/bin -o ./test2/platform_asset/default_high

    `)

    .option("-i, --inputPath <inputPath>", "输入目录")
    .option("-o, --outputPath <outputPath>", "输出目录")
    .parse(process.argv);

const options = commander.opts();

let inputPath = options.inputPath;
let outputPath = options.outputPath;

let cwdDir: string = process.cwd();

