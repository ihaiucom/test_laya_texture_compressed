import path from "path";
import fs from "fs";
import { FileUtils } from "./FileUtils";
import { ImageFile } from "./ImageCompressedUtils";

export class FileCopyUtils {

    // 拷贝文件
    static copy(imageList: ImageFile[], srcPath: string, destPath: string, isOver = true, exts?: string[], imageExts?: string[], isCopyImage: boolean = false, isIgnoreHide = true) {
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
            this.copyFile(imageList, srcPath, destPath, isOver, exts, imageExts, isCopyImage);
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
                    this.copyFile(imageList, itemSrc, itemDest, isOver, exts, imageExts, isCopyImage);
                }
                else if (stat.isDirectory()) {
                    if (itemDest.startsWith(itemSrc)) {
                        console.warn("拷贝路径嵌套死循环", itemSrc, "   ", itemDest);
                        continue;
                    }
                    this.copy(imageList, itemSrc, itemDest, isOver, exts, imageExts, isCopyImage, isIgnoreHide);

                }

            }

        }

    }

    static copyFile(imageList: ImageFile[], srcPath: string, destPath: string, isOver: boolean, exts?: string[], imageExts?: string[], isCopyImage?: boolean) {

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

}