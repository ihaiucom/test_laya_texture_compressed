import { argv } from "process";
import fs from "fs";
import path from "path";
import { FileUtils } from "./FileUtils";
import { stringify } from "querystring";
import { EnumExt } from "./EnumExt";
import { FileCopyUtils } from "./FileCopyUtils";
import { ImageFile } from "./ImageCompressedUtils";


var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')


    .usage(`
tool-laya-platform copyimagefromunity <inputPath> <unityPath> <outputPath>

Example
ts-node ./src/index.ts copyimagefromunity -i D:/zengfeng/GameJJSG2021/client/laya/bin/res3d/Conventional/Assets/jjsg_resources/prefab_scene -u D:/zengfeng/GameJJSG2021/client/unity/Assets/jjsg_resources/prefab_scene -o ./test8/platform_asset/unity/prefab_scene

    `)

    .option("-i, --inputPath <inputPath>", "输入目录")
    .option("-o, --outputPath <outputPath>", "输出目录")
    .option("-u, --unityPath <unityPath>", "输出目录")
    .parse(process.argv);

const options = commander.opts();

let inputPath = options.inputPath;
let outputPath = options.outputPath;
let unityPath = options.unityPath;

inputPath = FileUtils.getAbsolutePath(inputPath);
outputPath = FileUtils.getAbsolutePath(outputPath);
unityPath = FileUtils.getAbsolutePath(unityPath);

let cwdDir: string = process.cwd();




// 拷贝文件
function copy(imageList: ImageFile[], srcPath: string, destPath: string, isOver = true, exts?: string[], imageExts?: string[], isCopyImage: boolean = false, isIgnoreHide = true) {
    srcPath = FileUtils.getAbsolutePath(srcPath);
    destPath = FileUtils.getAbsolutePath(destPath);
    if (srcPath == destPath) {
        console.warn("拷贝路径一样", srcPath);
        return;
    }

    if (!fs.existsSync(srcPath)) {
        console.warn("文件不存在:", srcPath);
        return;
    }


    var stat = fs.lstatSync(srcPath);
    if (stat.isFile()) {
        copyFile(imageList, srcPath, destPath, isOver, exts, imageExts, isCopyImage);
    }
    else {
        var paths = fs.readdirSync(srcPath); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];
            if (isIgnoreHide) {
                if (name.startsWith(".")) {
                    continue;
                }
            }
            var itemSrc = path.join(srcPath, name);
            var itemDest = path.join(destPath, name);
            var stat = fs.lstatSync(itemSrc);
            if (stat.isFile()) {
                copyFile(imageList, itemSrc, itemDest, isOver, exts, imageExts, isCopyImage);
            }
            else if (stat.isDirectory()) {
                if (itemDest.startsWith(itemSrc)) {
                    console.warn("拷贝路径嵌套死循环", itemSrc, "   ", itemDest);
                    continue;
                }
                copy(imageList, itemSrc, itemDest, isOver, exts, imageExts, isCopyImage, isIgnoreHide);

            }

        }

    }

}

function copyFile(imageList: ImageFile[], srcPath: string, destPath: string, isOver: boolean, exts?: string[], imageExts?: string[], isCopyImage?: boolean) {

    if (exts || imageExts) {
        let ext = path.extname(srcPath);

        let isImage = false;
        if (imageExts && imageExts.length > 0) {
            if (imageExts.indexOf(ext) != -1) {
                isImage = true;
                imageList.push({ srcPath: srcPath, destPath: destPath });
            }
        }

        if (isCopyImage) {
            if (!isImage) {
                return;
            }
        }
        else {
            if (exts && exts.length > 0) {
                if (exts.indexOf(ext) == -1) {
                    return;
                }
            }

            if (isImage) {
                return;
            }
        }

    }

    var srcRP = path.relative(inputPath, srcPath);
    var unitSrcPath = path.join(unityPath, srcRP);
    if (fs.existsSync(unitSrcPath)) {
        srcPath = unitSrcPath;
    }
    else {
        unitSrcPath = unitSrcPath.replace(".jpg", ".png")
        if (fs.existsSync(unitSrcPath)) {
            srcPath = unitSrcPath;
        }
        else {
            console.error(unitSrcPath);
        }
    }


    if (isOver) {
        if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
        }

        FileUtils.checkDirPath(destPath);
        fs.copyFileSync(srcPath, destPath);
    }
    else if (!fs.existsSync(destPath)) {
        FileUtils.checkDirPath(destPath);
        fs.copyFileSync(srcPath, destPath);
    }
}


var imageList: ImageFile[] = [];
copy(imageList, inputPath, outputPath, true, undefined, FileUtils.IMAGE_EXT, true);

let imagePathList: string[] = [];
for (let item of imageList) {
    item.srcPath = path.relative(inputPath, item.srcPath).replace(/\\/g, '/');
    imagePathList.push(item.srcPath);
}

let imageListFilePath = path.normalize(path.join(outputPath, "image_list.json"));
FileUtils.write(imageListFilePath, JSON.stringify(imagePathList, null, 4));