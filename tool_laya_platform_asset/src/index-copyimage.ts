import path from "path";
import { FileUtils } from "./FileUtils";
import { FileCopyUtils } from "./FileCopyUtils";
import { ImageFile } from "./ImageCompressedUtils";


var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')


    .usage(`
tool-laya-platform copyimage <inputPath> <outputPath>

Example

tool-laya-platform  copyimage -i D:\zengfeng\GameJJSG2021\client\laya\bin -o ./test/platform_asset/default_high


ts-node ./src/index.ts copyimage -i ../Laya212/bin -o ./test2/platform_asset/default_high

    `)

    .option("-i, --inputPath <inputPath>", "输入目录")
    .option("-o, --outputPath <outputPath>", "输出目录")
    .parse(process.argv);

const options = commander.opts();

let inputPath = options.inputPath;
let outputPath = options.outputPath;

let cwdDir: string = process.cwd();


var imageList: ImageFile[] = [];
FileCopyUtils.copy(imageList, inputPath, outputPath, true, undefined, FileUtils.IMAGE_EXT, true);

let imagePathList: string[] = [];
for (let item of imageList) {
    item.srcPath = path.relative(inputPath, item.srcPath).replace(/\\/g, '/');
    imagePathList.push(item.srcPath);
}

let imageListFilePath = path.normalize(path.join(outputPath, "image_list.json"));
FileUtils.write(imageListFilePath, JSON.stringify(imagePathList, null, 4));