import { argv } from "process";
import fs from "fs";
import path from "path";
import { FileUtils } from "./FileUtils";
import { stringify } from "querystring";
import { EnumExt } from "./EnumExt";

interface ImageFile {
    srcPath: string;
    destPath?: string | undefined;
}

export class CsvParse {

    keyField: string = "path";

    private fieldIndexMap = new Map<string, number>();
    private lineMap = new Map<string, string[]>();

    Load(csvPath: string) {
        var text = FileUtils.read(csvPath);
        var lines = text.split('\r\n');


        let fieldLine = lines[0];
        var fieldNames = fieldLine.split(',');
        this.fieldIndexMap.clear();
        for (var i = 0; i < fieldNames.length; i++) {
            let fieldName = fieldNames[i].trim();
            if (fieldName != "") {
                this.fieldIndexMap.set(fieldName, i);
            }
        }

        let keyIndex = this.fieldIndexMap.get(this.keyField) as number;

        this.lineMap.clear();
        for (var i = 1; i < lines.length; i++) {
            var lineStr = lines[i].trim();
            if (lineStr == "") {
                continue;
            }

            var arr = lineStr.split(',');
            for (var r = 0; r < arr.length; r++) {
                arr[r] = arr[r].trim();
            }
            var key = arr[keyIndex];

            this.lineMap.set(key, arr);
        }
    }

    GetFieldValue(key: string, field: string) {
        let fieldIndex = this.fieldIndexMap.get(field) as number;
        let arr = this.lineMap.get(key) as string[];
        if (!arr) return undefined;
        return arr[fieldIndex];
    }
}

export class AssetSettingManager {
    private static _I: AssetSettingManager;
    static get I() {
        if (this._I == null) {
            this._I = new AssetSettingManager();
        }
        return this._I;
    }

    csv = new CsvParse();

    constructor() {
        this.csv.keyField = "path";
    }

    Load(assetSettingPath: string) {
        this.csv.Load(assetSettingPath);
    }

    GetFieldValue(imageSrcPath: string, platform: string) {
        var value = this.csv.GetFieldValue(imageSrcPath, platform);
        if (value == null) {
            value = this.csv.GetFieldValue("default", platform);
        }
        return value;
    }
}

var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')


    .usage(`
tool-laya-platform copyproject <layaWorkspace> <texturePath> <outputPath> <platform>

Example

tool-laya-platform  copyproject -l D:\zengfeng\GameJJSG2021\client\laya -t ./test/platform_asset/astc_high  -o ./test/platform_package/astc_high 


ts-node ./src/index.ts copyproject -l D:\zengfeng\GameJJSG2021\client\laya -t ./test/platform_asset  -o ./test/platform_package/pc_low  -p pc_low

ts-node ./src/index.ts copyproject -l ./test/laya -t ./test/platform_asset  -o ./test/platform_package/pc_low  -p pc_low

    `)

    .option("-l, --layaWorkspace <layaWorkspace>", "laya工程目录")
    .option("-t, --texturePath <texturePath>", "贴图目录")
    .option("-o, --outputPath <outputPath>", "输出目录")
    .option("-p, --platform <platform>", "平台")
    .parse(process.argv);


console.log("index-copyproject.ts");

const options = commander.opts();
let cwdDir: string = process.cwd();
let layaWorkspace = options.layaWorkspace;
let texturePath = options.texturePath;
let outputPath = options.outputPath;
let platform = options.platform;


if (path.isAbsolute(layaWorkspace)) {
    layaWorkspace = path.normalize(layaWorkspace);
}
else {
    layaWorkspace = path.normalize(path.join(cwdDir, layaWorkspace));
}


if (path.isAbsolute(texturePath)) {
    texturePath = path.normalize(texturePath);
}
else {
    texturePath = path.normalize(path.join(cwdDir, texturePath));
}


if (path.isAbsolute(outputPath)) {
    outputPath = path.normalize(outputPath);
}
else {
    outputPath = path.normalize(path.join(cwdDir, outputPath));
}

let layaWorkspaceBin = path.normalize(path.join(layaWorkspace, "bin"));
let outputPathBin = path.normalize(path.join(outputPath, "bin"));
let assetsettingPath = path.normalize(path.join(layaWorkspace, "platform_assetsetting.csv"));

console.log("assetsettingPath:", assetsettingPath);

function copyproject() {
    let imageList: ImageFile[] = copylaya();
    let imagePathList: string[] = [];
    for (let item of imageList) {
        item.srcPath = path.relative(layaWorkspaceBin, item.srcPath).replace(/\\/g, '/');
        item.destPath = undefined;
        imagePathList.push(item.srcPath);
    }

    let imageListFilePath = path.normalize(path.join(layaWorkspace, "image_list.json"));
    FileUtils.write(imageListFilePath, JSON.stringify(imagePathList, null, 4));

    let asset_url_replace_dict = copytexture(imagePathList);
    let asset_url_replaceFilePath = path.normalize(path.join(outputPathBin, "asset_url_replace.json"));

    FileUtils.write(asset_url_replaceFilePath, JSON.stringify(asset_url_replace_dict, null, 4));

}



function copylaya() {



    console.log("拷贝工程文件中...");
    FileUtils.copy(layaWorkspace + "/laya.laya", outputPath + "/laya.laya", true);
    FileUtils.copy(layaWorkspace + "/tsconfig.json", outputPath + "/tsconfig.json", true);
    FileUtils.copy(layaWorkspace + "/.vscode", outputPath + "/.vscode", true);
    FileUtils.copy(layaWorkspace + "/.gitignore", outputPath + "/.gitignore", true);
    FileUtils.copy(layaWorkspace + "/.laya", outputPath + "/.laya", true, ['.js', '.json']);


    let imageList: ImageFile[] = [];
    copy(imageList, layaWorkspaceBin, outputPathBin, true, undefined, FileUtils.IMAGE_EXT, false);


    // FileUtils.copy(layaDir + "/bin", outDir, true, undefined, ['.png', '.jpg', '.jpeg']);
    // FileUtils.copy(platformAssetDir, outDir, true);
    return imageList;
}

function copytexture(imagePathList: string[]) {
    let asset_url_replace_dict: any = {};
    let count = imagePathList.length;
    for (var i = 0; i < count; i++) {
        let imageSrcPath = imagePathList[i];
        let imageSrcExt = path.extname(imageSrcPath);
        let ext_level = AssetSettingManager.I.GetFieldValue(imageSrcPath, platform);
        if (ext_level == null) {
            console.error(`${imageSrcPath}, platform=${platform}, ext_level=${ext_level}}`);
            continue;
        }
        let arr = ext_level.split('_');
        let extName = arr[0];
        let compressedExt = (EnumExt as any)[extName];
        let compressedFilePath = imageSrcPath.replace(imageSrcExt, compressedExt);
        let compressedFileTexturePath = path.join(texturePath, ext_level, compressedFilePath);
        let outFilePath = path.join(outputPathBin, compressedFilePath);

        if (!fs.existsSync(compressedFileTexturePath)) {
            console.warn("不存在文件", compressedFileTexturePath);
            compressedFileTexturePath = path.join(layaWorkspaceBin, imageSrcPath);
            outFilePath = path.join(outputPathBin, imageSrcPath);
        }

        asset_url_replace_dict[imageSrcPath] = compressedFilePath;

        if (fs.existsSync(outFilePath)) {
            fs.unlinkSync(outFilePath);
        }

        FileUtils.checkDirPath(outFilePath);
        fs.copyFileSync(compressedFileTexturePath, outFilePath);
    }

    return asset_url_replace_dict;
}


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
                copy(imageList, itemSrc, itemDest, isOver, exts, imageExts, isIgnoreHide);

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

AssetSettingManager.I.Load(assetsettingPath);
copyproject();