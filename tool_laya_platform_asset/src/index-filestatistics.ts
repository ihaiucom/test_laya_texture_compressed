import path from "path";
import fs from "fs";
import imagesize from "image-size";
import { FileUtils } from "./FileUtils";
import { FileCopyUtils } from "./FileCopyUtils";
import { ImageFile } from "./ImageCompressedUtils";

import exceljs from "exceljs";
import { fstat } from "fs";


var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')


    .usage(`
tool-laya-platform filestatistics <layaWorkspace> <outputPath>

Example

tool-laya-platform  filestatistics -i D:\zengfeng\GameJJSG2021\client\laya\bin -o D:\zengfeng\GameJJSG2021\client\laya\.statistics


ts-node ./src/index.ts filestatistics -i D:\zengfeng\GameJJSG2021\client\laya\bin -o D:\zengfeng\GameJJSG2021\client\laya\.statistics

    `)

    .option("-i, --inputPath <inputPath>", "laya bin目录")
    .option("-o, --outputPath <outputPath>", "输出文件位置")
    .parse(process.argv);

const options = commander.opts();

let inputPath = options.inputPath;
let outputPath = options.outputPath;

inputPath = inputPath.replace(/\\/g, '/');
outputPath = outputPath.replace(/\\/g, '/');

var date = new Date();
let xlsxFile = path.join(outputPath, `filestatistics_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}--${date.getHours()}-${date.getMinutes()}.xlsx`);
xlsxFile = xlsxFile.replace(/\\/g, '/');

let cwdDir: string = process.cwd();

FileUtils.checkDirPath(xlsxFile);


function bToStr(b: number) {
    if (b < 1024) {
        return b + "B";
    }
    let kb = b / 1024;
    return kbToStr(kb);
}

function kbToStr(kb: number) {
    if (kb < 1024) {
        return Math.ceil(kb) + "KB";
    }
    let mb = kb / 1024;
    if (mb < 1024) {
        return (Math.ceil(mb * 100) / 100) + "MB";
    }
    let gb = mb / 1024;
    return (Math.ceil(gb * 100) / 100) + "GB";
}

function bToM(b: number) {
    let kb = b / 1024;
    return kbToM(kb);
}

function kbToM(kb: number) {
    let mb = kb / 1024;
    return (Math.ceil(mb * 1000) / 1000);
}


enum FileTotalType {
    character = "角色",
    fx = "特效",
    map = "地图",
    ui = "UI",
    loadImg = "图标类图片",
    audio = "声音",
    video = "视频",
    spine = "spine",
    other = "其他",
}

class FileModuleInfo {
    modelType!: FileTotalType;
    total: number = 0;

    keyValue = new Map<string, number>();

    Get(key: string) {
        if (this.keyValue.has(key)) {
            return this.keyValue.get(key) as number;
        }
        return 0;
    }


    Set(key: string, value: number) {
        this.keyValue.set(key, value + this.Get(key));
    }
}


class GpuSkinningUnitFileInfo {
    name!: string;

    textureMainSize: number = 0;

    textureWidth: number = 0;
    textureHeight: number = 0;

    matrixSize: number = 0;
    infoSize: number = 0;
    meshSize: number = 0;
    materailSize: number = 0;

    clipNum: number = 0;


    get total() {
        return this.textureMainSize + this.matrixSize + this.infoSize + this.meshSize + this.materailSize;
    }

}


class GpuSkinningFileInfo {
    textureMainSize: number = 0;
    matrixSize: number = 0;
    infoSize: number = 0;
    meshSize: number = 0;
    materailSize: number = 0;

    get total() {
        return this.textureMainSize + this.matrixSize + this.infoSize + this.meshSize + this.materailSize;
    }


    files = new Map<string, GpuSkinningUnitFileInfo>();


}

class GpuSkinningFileModuleInfo extends FileModuleInfo {

    all = new GpuSkinningFileInfo();

    weapon = new GpuSkinningFileInfo();
    hero = new GpuSkinningFileInfo();
    monster = new GpuSkinningFileInfo();



}




class FileInfo {
    path: string = "";
    size: number = 0;
}

class ImageInfo extends FileInfo {
    width: number = 0;
    height: number = 0;
}


class AudioInfo extends FileInfo {
    length: number = 0;
    ext: string = ".mp3";
}


class VideoInfo extends FileInfo {
    length: number = 0;
    ext: string = ".mp3";
}

class SpineInfo extends FileInfo {
    name: string = "";

    atlas: number = 0;
    json: number = 0;
    png: number = 0;
    pngM: number = 0;
    sk: number = 0;

    pngList: ImageInfo[] = [];
}

class FspriteassetsTypeInfo {
    name = "";
    total = 0;


    img: ImageInfo[] = [];
    audio: AudioInfo[] = [];
    video: VideoInfo[] = [];
    spine: SpineInfo[] = [];
    other: FileInfo[] = [];

    constructor(name: string) {
        this.name = name;
    }
}

class FspriteassetsInfo {
    all = new FspriteassetsTypeInfo("all");
    img = 0;
    audio = 0;
    video = 0;
    spine = 0;
    other = 0;
}



class MapInfo {
    imgList: ImageInfo[] = [];
    lhList: FileInfo[] = [];
    lmatList: FileInfo[] = [];
    otherList: FileInfo[] = [];

    img = 0;
    lh = 0;
    lmat = 0;
    other = 0;

    get total() {
        return this.img + this.lh + this.lmat + this.other;
    }
}


class EffectModuleInfo {


    imgList: ImageInfo[] = [];
    lhList: FileInfo[] = [];
    lmatList: FileInfo[] = [];
    otherList: FileInfo[] = [];

    img = 0;
    lh = 0;
    lmat = 0;
    other = 0;


    get moduletotal(): number {
        return this.img + this.lh + this.lmat + this.other;
    }

}

class EffectInfo extends EffectModuleInfo {

    colorTexList: EffectModuleInfo = new EffectModuleInfo();
    mainTexList: EffectModuleInfo = new EffectModuleInfo();
    paramBinList: EffectModuleInfo = new EffectModuleInfo();

    config_file: FileInfo = new FileInfo();



    get total(): number {
        return this.moduletotal
            + this.colorTexList.moduletotal
            + this.mainTexList.moduletotal
            + this.paramBinList.moduletotal
            + this.config_file.size;
    }
}



class FguiModule {
    moduleName = "";
    binSize = 0;
    imgSize = 0;
    imgMSize = 0;
    soundSize = 0;

    imgList: ImageInfo[] = [];

    get total() {
        return this.binSize + this.imgSize + this.soundSize;
    }
}


class FguiFileModuleInfo extends FileModuleInfo {

    map = new Map<string, FguiModule>();
}

class FileModule {
    static moduleMap = new Map<FileTotalType, FileModuleInfo>();
    static moduleList: FileModuleInfo[] = [];

    static Get(t: FileTotalType) {
        return this.moduleMap.get(t) as FileModuleInfo;
    }

    static Init() {
        for (var k in FileTotalType) {
            var modelType = (FileTotalType as any)[k];

            var item: FileModuleInfo;
            switch (modelType) {
                case FileTotalType.character:
                    item = new GpuSkinningFileModuleInfo();
                    break;
                case FileTotalType.ui:
                    item = new FguiFileModuleInfo();
                    break;
                default:
                    item = new FileModuleInfo();
                    break;
            }

            item.modelType = modelType;
            this.moduleMap.set(item.modelType, item);
            this.moduleList.push(item);
        }
    }
}

FileModule.Init();


var workbook: exceljs.Workbook;

class FileStatistics {
    constructor() {
        this.Run();
    }

    async Run(): Promise<void> {

        workbook = new exceljs.Workbook();
        if (fs.existsSync(xlsxFile)) {
            await workbook.xlsx.readFile(xlsxFile);
        }


        var sheetName = '总大小';
        var worksheet = workbook.getWorksheet(sheetName);
        // if (!worksheet) {
        //     worksheet = workbook.addWorksheet(sheetName);
        // }
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        this.ReadFiles();
        await this.SheetTotal(workbook);

        await workbook.xlsx.writeFile(xlsxFile);
    }


    async SheetTotal(workbook: exceljs.Workbook) {

        var sheetName = '总大小';
        var worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            worksheet = workbook.addWorksheet(sheetName);
        }
        // if (worksheet) {
        //     workbook.removeWorksheet(sheetName);
        // }

        worksheet.columns = [
            { header: "类型", key: "Type", width: 15 },
            { header: "大小(MB)", key: "Size", width: 15 },
        ];


        var length = FileModule.moduleList.length;
        for (var i = 0; i < length; i++) {
            var m = FileModule.moduleList[i];
            var row = worksheet.getRow(i + 2);
            row.getCell(1).value = m.modelType;
            row.getCell(2).value = bToM(m.total);
        }

        var row = worksheet.getRow(length + 2 + 2);
        row.getCell(1).value = "总大小";
        row.getCell(2).value = { formula: `SUM(B2:B${2 + length - 1})`, result: 7, date1904: false };
    }

    async ReadFiles() {
        this.ReadFgui(FileModule.Get(FileTotalType.ui) as FguiFileModuleInfo)
        this.ReadCharacter(FileModule.Get(FileTotalType.character) as GpuSkinningFileModuleInfo)
        this.ReadFspriteassets();
        this.ReadMap();
        this.ReadEffect();
    }


    ReadEffect() {
        var dir = path.join(inputPath, 'res3d/Conventional');
        dir = dir.replace(/\\/g, '/');

        var module = FileModule.Get(FileTotalType.fx)

        var effectInfo = new EffectInfo();
        this.ReadEffectDir(effectInfo, dir, inputPath);
        this.ReadEffectExportResource(effectInfo);
        module.total = effectInfo.total;


        var sheetName = '特效-colorTex';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "宽", key: "width", width: 15 },
            { header: "高", key: "height", width: 15 },
            { header: "内存(MB)", key: "height", width: 15 },
        ];

        var imgList = effectInfo.colorTexList.imgList;
        var length = imgList.length;
        for (var i = 0; i < length; i++) {
            var imgInfo = imgList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = imgInfo.path;
            row.getCell(c++).value = bToM(imgInfo.size);
            row.getCell(c++).value = imgInfo.width;
            row.getCell(c++).value = imgInfo.height;
            row.getCell(c++).value = bToM(imgInfo.width * imgInfo.height * 4);
        }


        var sheetName = '特效-mainTex';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "宽", key: "width", width: 15 },
            { header: "高", key: "height", width: 15 },
            { header: "内存(MB)", key: "height", width: 15 },
        ];

        var imgList = effectInfo.mainTexList.imgList;
        var length = imgList.length;
        for (var i = 0; i < length; i++) {
            var imgInfo = imgList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = imgInfo.path;
            row.getCell(c++).value = bToM(imgInfo.size);
            row.getCell(c++).value = imgInfo.width;
            row.getCell(c++).value = imgInfo.height;
            row.getCell(c++).value = bToM(imgInfo.width * imgInfo.height * 4);
        }


        var sheetName = '特效-paramBin';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 }
        ];

        var fileList = effectInfo.paramBinList.otherList;
        var length = fileList.length;
        for (var i = 0; i < length; i++) {
            var fileInfo = fileList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = fileInfo.path;
            row.getCell(c++).value = bToM(fileInfo.size);
        }


    }

    ReadEffectExportResource(m: EffectInfo) {
        var dir = path.join(inputPath, 'res3d/ExportResource/colorTex');
        dir = dir.replace(/\\/g, '/');
        this.ReadEffectImagDir(m.colorTexList, dir, inputPath);

        var dir = path.join(inputPath, 'res3d/ExportResource/mainTex');
        dir = dir.replace(/\\/g, '/');
        this.ReadEffectImagDir(m.mainTexList, dir, inputPath);


        var dir = path.join(inputPath, 'res3d/ExportResource/paramBin');
        dir = dir.replace(/\\/g, '/');
        this.ReadEffectImagDir(m.paramBinList, dir, inputPath);

        var itemPath = path.join(inputPath, 'res3d/ExportResource/config_file.json');
        itemPath = itemPath.replace(/\\/g, '/');
        if (fs.existsSync(dir)) {
            var stat = fs.lstatSync(dir);
            var info = m.config_file;
            info.path = path.relative(inputPath, itemPath).replace(/\\/g, '/');
            info.size = stat.size;
        }




    }

    ReadEffectImagDir(m: EffectModuleInfo, dir: string, root: string) {
        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {
                var ext = path.extname(itemPath);
                ext = ext.toLowerCase();
                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        var img = new ImageInfo();
                        img.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        img.size = stat.size;
                        m.img += stat.size;
                        var imgInfo = imagesize(itemPath);
                        img.width = imgInfo.width as number;
                        img.height = imgInfo.height as number;
                        m.imgList.push(img);
                        break;
                    default:
                        var info = new FileInfo();
                        info.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        info.size = stat.size;
                        switch (ext) {
                            case ".lmat":
                                m.lmat += stat.size;
                                m.lmatList.push(info);
                                break;
                            case ".lh":
                                m.lh += stat.size;
                                m.lhList.push(info);
                                break;
                            default:
                                m.other += stat.size;
                                m.otherList.push(info);
                                break;
                        }
                        break;
                }

            }
            else if (stat.isDirectory()) {
                // this.ReadMapDir(m, itemPath, root);
            }

        }
    }



    ReadEffectDir(m: EffectInfo, dir: string, root: string) {


        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];

            if (name.indexOf('sfx') != 0) {
                continue;
            }

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {
                var ext = path.extname(itemPath);
                ext = ext.toLowerCase();
                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        var img = new ImageInfo();
                        img.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        img.size = stat.size;
                        m.img += stat.size;
                        var imgInfo = imagesize(itemPath);
                        img.width = imgInfo.width as number;
                        img.height = imgInfo.height as number;
                        m.imgList.push(img);
                        break;
                    default:
                        var info = new FileInfo();
                        info.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        info.size = stat.size;
                        switch (ext) {
                            case ".lmat":
                                m.lmat += stat.size;
                                m.lmatList.push(info);
                                break;
                            case ".lh":
                                m.lh += stat.size;
                                m.lhList.push(info);
                                break;
                            default:
                                m.other += stat.size;
                                m.otherList.push(info);
                                break;
                        }
                        break;
                }

            }
            else if (stat.isDirectory()) {
                // this.ReadMapDir(m, itemPath, root);
            }

        }
    }


    ReadMap() {
        var dir = path.join(inputPath, 'res3d/Conventional');
        dir = dir.replace(/\\/g, '/');

        var module = FileModule.Get(FileTotalType.map)

        var mapInfo = new MapInfo();
        this.ReadMapDir(mapInfo, dir, inputPath);
        module.total = mapInfo.total;


        var sheetName = '地图-图片';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "宽", key: "width", width: 15 },
            { header: "高", key: "height", width: 15 },
            { header: "内存(MB)", key: "height", width: 15 },
        ];

        var imgList = mapInfo.imgList;
        var length = imgList.length;
        for (var i = 0; i < length; i++) {
            var imgInfo = imgList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = imgInfo.path;
            row.getCell(c++).value = bToM(imgInfo.size);
            row.getCell(c++).value = imgInfo.width;
            row.getCell(c++).value = imgInfo.height;
            row.getCell(c++).value = bToM(imgInfo.width * imgInfo.height * 4);
        }


        var sheetName = '地图-材质';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 }
        ];

        var fileList = mapInfo.lmatList;
        var length = fileList.length;
        for (var i = 0; i < length; i++) {
            var fileInfo = fileList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = fileInfo.path;
            row.getCell(c++).value = bToM(fileInfo.size);
        }


        var sheetName = '地图-预设';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 }
        ];

        var fileList = mapInfo.lhList;
        var length = fileList.length;
        for (var i = 0; i < length; i++) {
            var fileInfo = fileList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = fileInfo.path;
            row.getCell(c++).value = bToM(fileInfo.size);
        }

        if (mapInfo.otherList.length > 0) {

            var sheetName = '地图-其他';
            var worksheet = workbook.getWorksheet(sheetName);
            if (worksheet) {
                workbook.removeWorksheet(sheetName);
            }
            worksheet = workbook.addWorksheet(sheetName);

            worksheet.columns = [
                { header: "路径", key: "name", width: 30 },
                { header: "大小(MB)", key: "size", width: 15 }
            ];

            var fileList = mapInfo.otherList;
            var length = fileList.length;
            for (var i = 0; i < length; i++) {
                var fileInfo = fileList[i];
                var row = worksheet.getRow(i + 2);
                var c = 1;
                row.getCell(c++).value = fileInfo.path;
                row.getCell(c++).value = bToM(fileInfo.size);
            }
        }
    }

    ReadMapDir(m: MapInfo, dir: string, root: string) {


        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];
            if (name.indexOf('sfx') == 0) {
                continue;
            }

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {
                var ext = path.extname(itemPath);
                ext = ext.toLowerCase();
                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        var img = new ImageInfo();
                        img.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        img.size = stat.size;
                        m.img += stat.size;
                        var imgInfo = imagesize(itemPath);
                        img.width = imgInfo.width as number;
                        img.height = imgInfo.height as number;
                        m.imgList.push(img);
                        break;
                    default:
                        var info = new FileInfo();
                        info.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        info.size = stat.size;
                        switch (ext) {
                            case ".lmat":
                                m.lmat += stat.size;
                                m.lmatList.push(info);
                                break;
                            case ".lh":
                                m.lh += stat.size;
                                m.lhList.push(info);
                                break;
                            default:
                                m.other += stat.size;
                                m.otherList.push(info);
                                break;
                        }
                        break;
                }

            }
            else if (stat.isDirectory()) {
                this.ReadMapDir(m, itemPath, root);
            }

        }
    }


    ReadFgui(f: FguiFileModuleInfo) {
        var map = f.map;
        var dir = path.join(inputPath, 'res/fgui');
        dir = dir.replace(/\\/g, '/');


        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {

                var ext = path.extname(itemPath);
                ext = ext.toLowerCase();

                var moduleName = name;
                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        moduleName = name.split('_atlas')[0];
                        break
                    case ".wav":
                    case ".mp3":
                        moduleName = name.substr(0, name.lastIndexOf('_'));
                        break
                    default:
                        moduleName = name.split('.')[0];
                        break
                }


                var module: FguiModule = map.get(moduleName) as FguiModule;
                if (!module) {
                    module = new FguiModule();
                    module.moduleName = moduleName;
                    map.set(moduleName, module);
                }

                f.total += stat.size;

                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        var img = new ImageInfo();
                        img.path = path.relative(dir, itemPath).replace(/\\/g, '/');
                        img.size = stat.size;
                        module.imgSize += stat.size;
                        var imgInfo = imagesize(itemPath);
                        img.width = imgInfo.width as number;
                        img.height = imgInfo.height as number;
                        module.imgMSize += img.width * img.height * 4;
                        module.imgList.push(img);
                        break;
                    case ".wav":
                    case ".mp3":
                        module.soundSize += stat.size;
                        break;
                    default:
                        module.binSize += stat.size;
                        break;
                }

            }

        }


        var sheetName = 'fgui';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "模块", key: "modulename", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "bin(MB)", key: "bin", width: 15 },
            { header: "sound(MB)", key: "sound", width: 15 },
            { header: "图片(MB)", key: "img", width: 15 },
            { header: "图片内存(MB)", key: "img", width: 15 },
        ];

        var i = 0;
        map.forEach((module, moduleName) => {
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = module.moduleName;
            row.getCell(c++).value = bToM(module.total);
            row.getCell(c++).value = bToM(module.binSize);
            row.getCell(c++).value = bToM(module.soundSize);
            row.getCell(c++).value = bToM(module.imgSize);
            row.getCell(c++).value = bToM(module.imgMSize);
            for (var img of module.imgList) {
                row.getCell(c++).value = path.basename(img.path);
                row.getCell(c++).value = bToM(img.size);
                row.getCell(c++).value = bToM(img.width * img.height * 4);
                row.getCell(c++).value = img.width;
                row.getCell(c++).value = img.height;
            }
            i++;
        })



    }

    ReadFspriteassets() {
        var m = new FspriteassetsInfo();
        var dir = path.join(inputPath, 'res/fspriteassets');
        dir = dir.replace(/\\/g, '/');

        var spineDir = path.join(inputPath, 'res/fspriteassets/herospine');
        spineDir = spineDir.replace(/\\/g, '/');
        var spineMap = new Map<string, SpineInfo>();

        this.ReadFspriteassetsDir(m, dir, dir, spineDir);
        this.ReadFspriteassetsSpineDir(m, spineDir, spineDir, spineMap);

        FileModule.Get(FileTotalType.loadImg).total = m.img;
        FileModule.Get(FileTotalType.audio).total = m.audio;
        FileModule.Get(FileTotalType.video).total = m.video;
        FileModule.Get(FileTotalType.spine).total = m.spine;
        FileModule.Get(FileTotalType.other).total = m.other;


        var sheetName = '动态加载图片';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "宽", key: "width", width: 15 },
            { header: "高", key: "height", width: 15 },
            { header: "内存(MB)", key: "height", width: 15 },
        ];

        var imgList = m.all.img;
        var length = imgList.length;
        for (var i = 0; i < length; i++) {
            var img = imgList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = img.path;
            row.getCell(c++).value = bToM(img.size);
            row.getCell(c++).value = img.width;
            row.getCell(c++).value = img.height;
            row.getCell(c++).value = bToM(img.width * img.height * 4);
        }


        var sheetName = '声音';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "时长", key: "length", width: 15 },
        ];

        var audoList = m.all.audio;
        var length = audoList.length;
        for (var i = 0; i < length; i++) {
            var audio = audoList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = audio.path;
            row.getCell(c++).value = bToM(audio.size);
            row.getCell(c++).value = audio.length;
        }


        var sheetName = '视频';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "时长", key: "length", width: 15 },
        ];

        var videoList = m.all.video;
        var length = videoList.length;
        for (var i = 0; i < length; i++) {
            var audio = videoList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = audio.path;
            row.getCell(c++).value = bToM(audio.size);
        }



        var sheetName = 'Spine';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "总大小(MB)", key: "size", width: 15 },
            { header: "atlas(MB)", key: "size", width: 15 },
            { header: "json(MB)", key: "size", width: 15 },
            { header: "sk(MB)", key: "size", width: 15 },
            { header: "png(MB)", key: "size", width: 15 },
            { header: "png内存(MB)", key: "size", width: 15 },
        ];

        var spineList = m.all.spine;
        var length = spineList.length;
        for (var i = 0; i < length; i++) {
            var spine = spineList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = spine.name;
            row.getCell(c++).value = bToM(spine.size);


            row.getCell(c++).value = bToM(spine.atlas);
            row.getCell(c++).value = bToM(spine.json);
            row.getCell(c++).value = bToM(spine.sk);
            row.getCell(c++).value = bToM(spine.png);
            row.getCell(c++).value = bToM(spine.pngM);

            for (var img of spine.pngList) {
                row.getCell(c++).value = img.path;
                row.getCell(c++).value = bToM(img.size);
                row.getCell(c++).value = img.width + ' x ' + img.height;
            }


        }


        var sheetName = '其他';
        var worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = [
            { header: "路径", key: "name", width: 30 },
            { header: "大小(MB)", key: "size", width: 15 },
            { header: "时长", key: "length", width: 15 },
        ];

        var otherList = m.all.other;
        var length = otherList.length;
        for (var i = 0; i < length; i++) {
            var other = otherList[i];
            var row = worksheet.getRow(i + 2);
            var c = 1;
            row.getCell(c++).value = other.path;
            row.getCell(c++).value = bToM(other.size);
        }

    }


    ReadFspriteassetsSpineDir(m: FspriteassetsInfo, dir: string, root: string, map: Map<string, SpineInfo>) {
        var t = m.all;


        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {

                var unitName = path.basename(dir);
                if (dir == root) {
                    unitName = name.split('.')[0];
                }

                var spine: SpineInfo = map.get(unitName) as SpineInfo;
                if (!spine) {
                    spine = new SpineInfo();
                    spine.name = unitName;
                    map.set(unitName, spine);
                    m.all.spine.push(spine);
                }


                m.spine += stat.size;
                spine.size += stat.size;

                var ext = path.extname(itemPath);
                ext = ext.toLowerCase();
                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        var img = new ImageInfo();
                        img.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        img.size = stat.size;
                        spine.png += stat.size;
                        var imgInfo = imagesize(itemPath);
                        img.width = imgInfo.width as number;
                        img.height = imgInfo.height as number;
                        spine.pngM += img.width * img.height * 4;
                        spine.pngList.push(img);
                        break;
                    default:
                        var info = new FileInfo();
                        info.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        info.size = stat.size;
                        switch (ext) {
                            case '.atlas':
                                spine.atlas += stat.size;
                                break;
                            case '.json':
                                spine.json += stat.size;
                                break;
                            case '.sk':
                                spine.sk += stat.size;
                                break;
                        }
                        break;
                }

            }
            else if (stat.isDirectory()) {
                this.ReadFspriteassetsSpineDir(m, itemPath, root, map);
            }

        }
    }

    ReadFspriteassetsDir(m: FspriteassetsInfo, dir: string, root: string, spineDir: string) {
        var t = m.all;


        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {
                var ext = path.extname(itemPath);
                ext = ext.toLowerCase();
                switch (ext) {
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        var img = new ImageInfo();
                        img.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        img.size = stat.size;
                        m.img += stat.size;
                        var imgInfo = imagesize(itemPath);
                        img.width = imgInfo.width as number;
                        img.height = imgInfo.height as number;
                        t.img.push(img);
                        break;
                    case ".mp3":
                    case ".wav":
                        var audio = new AudioInfo();
                        audio.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        audio.size = stat.size;
                        t.audio.push(audio);
                        m.audio += stat.size;
                        break;
                    case ".mp4":
                        var video = new VideoInfo();
                        video.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        video.size = stat.size;
                        m.video += stat.size;
                        t.video.push(video);
                        break;
                    default:
                        var info = new FileInfo();
                        info.path = path.relative(root, itemPath).replace(/\\/g, '/');
                        info.size = stat.size;
                        m.other += stat.size;
                        t.other.push(info);
                        break;
                }

            }
            else if (stat.isDirectory()) {
                if (itemPath != spineDir) {
                    this.ReadFspriteassetsDir(m, itemPath, root, spineDir);
                }

            }

        }
    }

    ReadCharacter(m: GpuSkinningFileModuleInfo) {
        var dir = path.join(inputPath, 'res3d/GPUSKinning-30');
        dir = dir.replace(/\\/g, '/');
        this.ReadCharacterDir(m, dir);


        // 角色
        var sheetName = '角色';
        var worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            worksheet = workbook.addWorksheet(sheetName);
        }

        worksheet.columns = [
            { header: "类型", key: "Type", width: 15 },
            { header: "大小(MB)", key: "Size", width: 15 },
        ];

        var keys = ["textureMainSize", "materailSize", "matrixSize", "infoSize", "meshSize"];
        var keyCns = ["主贴图", "材质球", "动作矩阵", "动作信息", "模型网格"];

        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var row = worksheet.getRow(i + 2);
            row.getCell(1).value = keyCns[i];
            row.getCell(2).value = bToM((m.all as any)[keys[i]]);
        }

        var r = length + 2;
        var row = worksheet.getRow(r);
        row.getCell(1).value = "总大小";
        row.getCell(2).value = { formula: `SUM(B2:B${2 + length - 1})`, result: 7, date1904: false };


        r += 2;

        var row = worksheet.getRow(r);
        var l = 1;
        row.getCell(l++).value = "单位类型";
        row.getCell(l++).value = "总大小(MB)";
        row.getCell(l++).value = "主贴图(MB)";
        row.getCell(l++).value = "材质球(MB)";
        row.getCell(l++).value = "动作矩阵(MB)";
        row.getCell(l++).value = "动作信息(MB)";
        row.getCell(l++).value = "模型网格(MB)";


        var keys = ["weapon", "hero", "monster"];
        var keyCns = ["武器", "英雄", "怪物和NPC"];

        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var l = 1;
            var row = worksheet.getRow(r + i + 1);
            row.getCell(l++).value = keyCns[i];
            var typeInfo = (m as any)[keys[i]] as GpuSkinningFileInfo;

            row.getCell(l++).value = bToM(typeInfo.total);
            row.getCell(l++).value = bToM(typeInfo.textureMainSize);
            row.getCell(l++).value = bToM(typeInfo.materailSize);
            row.getCell(l++).value = bToM(typeInfo.matrixSize);
            row.getCell(l++).value = bToM(typeInfo.infoSize);
            row.getCell(l++).value = bToM(typeInfo.meshSize);
        }






        // 类型详情
        var keys = ["weapon", "hero", "monster"];
        var keyCns = ["武器", "英雄", "怪物和NPC"];
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var sheetName = keyCns[i];
            var typeInfo = (m as any)[keys[i]] as GpuSkinningFileInfo;
            var worksheet = workbook.getWorksheet(sheetName);
            if (worksheet) {
                workbook.removeWorksheet(sheetName);
            }

            worksheet = workbook.addWorksheet(sheetName);

            worksheet.columns = [
                { header: "名称", key: "name", width: 15 },
                { header: "总大小(MB)", key: "total", width: 20 },
                { header: "主贴图(MB)", key: "textureMainSize", width: 20 },
                { header: "主贴图(宽)", key: "textureWidth", width: 20 },
                { header: "主贴图(高)", key: "textureHeight", width: 20 },
                { header: "动作(MB)", key: "matrixSize", width: 20 },
                { header: "动作(数量)", key: "clipNum", width: 20 },
                { header: "模型网格(MB)", key: "meshSize", width: 20 },
                { header: "动作信息(MB)", key: "infoSize", width: 20 },
                { header: "材质(MB)", key: "materailSize", width: 20 },
            ];

            var r = 2;
            typeInfo.files.forEach((unitInfo, unitName) => {
                var row = worksheet.getRow(r++);
                var c = 1;
                row.getCell(c++).value = unitInfo.name;
                row.getCell(c++).value = bToM(unitInfo.total);
                row.getCell(c++).value = bToM(unitInfo.textureMainSize);
                row.getCell(c++).value = unitInfo.textureWidth;
                row.getCell(c++).value = unitInfo.textureHeight;
                row.getCell(c++).value = bToM(unitInfo.matrixSize);
                row.getCell(c++).value = unitInfo.clipNum;
                row.getCell(c++).value = bToM(unitInfo.meshSize);
                row.getCell(c++).value = bToM(unitInfo.infoSize);
                row.getCell(c++).value = bToM(unitInfo.materailSize);
            })






        }


    }


    ReadCharacterDir(m: GpuSkinningFileModuleInfo, dir: string) {
        var paths = fs.readdirSync(dir); //同步读取当前目录
        for (var i = 0, len = paths.length; i < len; i++) {
            var name = paths[i];

            var itemPath = path.join(dir, name);
            itemPath = itemPath.replace(/\\/g, '/');

            var stat = fs.lstatSync(itemPath);
            if (stat.isFile()) {
                m.total += stat.size;



                var typeInfo: GpuSkinningFileInfo = m.monster;
                if (name.startsWith('w_')) {
                    typeInfo = m.weapon;
                }
                else if (name.startsWith('1')) {
                    typeInfo = m.hero;
                }
                else {
                    typeInfo = m.monster;
                }

                var unitName = name.split('.')[0];
                if (name.endsWith('.matrix.bin')) {
                    unitName = unitName.split('__')[0];
                } else if (name.endsWith('_main.png')) {
                    unitName = unitName.replace("_main", "");
                }

                var unitInfo = typeInfo.files.get(unitName);
                if (!unitInfo) {
                    unitInfo = new GpuSkinningUnitFileInfo();
                    unitInfo.name = unitName;
                    typeInfo.files.set(unitName, unitInfo);
                }


                var ext = path.extname(itemPath);
                switch (ext) {
                    case ".png":
                        m.all.textureMainSize += stat.size;
                        typeInfo.textureMainSize += stat.size;
                        unitInfo.textureMainSize += stat.size;
                        var imgInfo = imagesize(itemPath);
                        unitInfo.textureWidth = imgInfo.width as number;
                        unitInfo.textureHeight = imgInfo.height as number;
                        break;
                    case ".lmat":
                        m.all.materailSize += stat.size;
                        typeInfo.materailSize += stat.size;
                        unitInfo.materailSize += stat.size;
                        break;
                }

                if (name.endsWith('.matrix.bin')) {
                    m.all.matrixSize += stat.size;
                    typeInfo.matrixSize += stat.size;
                    unitInfo.matrixSize += stat.size;
                    unitInfo.clipNum++;
                }
                else if (name.endsWith('.info.bin')) {
                    m.all.infoSize += stat.size;
                    typeInfo.infoSize += stat.size;
                    unitInfo.infoSize += stat.size;
                }
                else if (name.endsWith('.mesh.bin')) {
                    m.all.meshSize += stat.size;
                    typeInfo.meshSize += stat.size;
                    unitInfo.meshSize += stat.size;
                }

            }
            else if (stat.isDirectory()) {
                this.ReadCharacterDir(m, dir);
            }

        }
    }
}

new FileStatistics();