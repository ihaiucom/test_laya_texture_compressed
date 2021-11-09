import path from "path";
import fs from "fs";
import { FileUtils } from "./FileUtils";
import { Tool } from "./Tool";

interface ImageFile {
    srcPath: string;
    destPath: string;
    size: string;
    quality: number;
}
export class ImageResizeUtils {



    static FindImageDir(list: ImageFile[], srcPath: string, destPath: string, size: string, quality: number, isOver = true, isIgnoreHide = true) {
        if (list == null) list = [];
        srcPath = FileUtils.getAbsolutePath(srcPath);
        destPath = FileUtils.getAbsolutePath(destPath);
        if (srcPath == destPath) {
            console.warn("FindImageDirSync路径一样", srcPath);
            return list;
        }

        if (!fs.existsSync(srcPath)) {
            console.warn("FindImageDirSync文件不存在:", srcPath);
            return list;
        }

        var stat = fs.lstatSync(srcPath);
        if (stat.isFile()) {
            this.FindImage(list, srcPath, destPath, size, isOver, quality);
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
                    this.FindImage(list, itemSrc, itemDest, size, isOver, quality);
                }
                else if (stat.isDirectory()) {
                    if (itemDest.startsWith(itemSrc)) {
                        console.warn("FindImageDirSync路径嵌套死循环", itemSrc, "   ", itemDest);
                        continue;
                    }
                    this.FindImageDir(list, itemSrc, itemDest, size, quality, isIgnoreHide);
                }

            }

        }

        return list;
    }



    static FindImage(list: ImageFile[], srcPath: string, destPath: string, size: string, isOver = true, quality: number) {

        if (!isOver) {
            if (fs.existsSync(destPath)) {
                return list;
            }
        }

        let ext = path.extname(srcPath);
        if (FileUtils.IMAGE_EXT.indexOf(ext) != -1) {
            let item: ImageFile = { srcPath: srcPath, destPath: destPath, size: size, quality: quality };
            list.push(item);
        }

        return list;
    }


    static async ImageResizeDirSync(srcPath: string, destPath: string, size: string, quality: number, isOver = true, isIgnoreHide = true) {
        console.log("收集图片文件列表中...");
        let list: ImageFile[] = [];
        list = this.FindImageDir(list, srcPath, destPath, size, quality, isOver, isIgnoreHide);
        let count = list.length;

        for (let i = 0; i < count; i++) {
            let item = list[i];
            if (i % 10 == 0) {
                await this.ImageResizeSync(item.srcPath, item.destPath, item.size, isOver, item.quality);
            }
            else {
                this.ImageResizeSync(item.srcPath, item.destPath, item.size, isOver, item.quality);
            }
            console.log(`处理 ${Math.floor(((i + 1) / count) * 100)}% (${i + 1} /${count})`);
        }

    }


    static async ImageResizeSync(srcPath: string, destPath: string, size: string, isOver = true, quality: number) {

        if (!isOver) {
            if (fs.existsSync(destPath)) {
                return;
            }
        }

        let ext = path.extname(srcPath);
        if (FileUtils.IMAGE_EXT.indexOf(ext) == -1) {
            return;
        }

        await Tool.ImageResizeSync(srcPath, destPath, size, quality);
    }
}