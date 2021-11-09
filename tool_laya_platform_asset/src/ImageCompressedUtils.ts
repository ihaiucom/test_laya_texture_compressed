import path from "path";
import fs from "fs";
import { FileUtils } from "./FileUtils";

export interface ImageFile {
    srcPath: string;
    destPath: string;
}

export class ImageCompressedUtils {

    static async ImageCompressedDirSync(srcPath: string, destPath: string, isIgnoreHide = true) {
        console.log("收集图片文件列表中...");
        let list: ImageFile[] = [];
        list = this.FindImageDir(list, srcPath, destPath);
        let count = list.length;

        for (let i = 0; i < count; i++) {
            let item = list[i];
            if (i % 10 == 0) {
                await this.ImageCompressedSync(item.srcPath, item.destPath);
            }
            else {
                this.ImageCompressedSync(item.srcPath, item.destPath);
            }
            console.log(`处理 ${Math.ceil(((i + 1) / count) * 100)}% ((${i + 1} )/${count})`);
        }
    }

    static async ImageCompressedSync(srcPath: string, destPath: string, isOver = true) {

    }





    static FindImageDir(list: ImageFile[], srcPath: string, destPath: string, destExt = ".astc", isIgnoreHide = true) {
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
            var ext = path.extname(destPath);
            destPath = destPath.replace(ext, destExt);
            this.FindImage(list, srcPath, destPath);
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
                    var ext = path.extname(itemDest);
                    itemDest = itemDest.replace(ext, destExt);
                    this.FindImage(list, itemSrc, itemDest);
                }
                else if (stat.isDirectory()) {
                    if (itemDest.startsWith(itemSrc)) {
                        console.warn("FindImageDirSync路径嵌套死循环", itemSrc, "   ", itemDest);
                        continue;
                    }
                    this.FindImageDir(list, itemSrc, itemDest, destExt, isIgnoreHide);
                }

            }

        }

        return list;
    }



    static FindImage(list: ImageFile[], srcPath: string, destPath: string) {
        let ext = path.extname(srcPath);
        if (FileUtils.IMAGE_EXT.indexOf(ext) != -1) {
            let item: ImageFile = { srcPath: srcPath, destPath: destPath };
            list.push(item);
        }

        return list;
    }

}