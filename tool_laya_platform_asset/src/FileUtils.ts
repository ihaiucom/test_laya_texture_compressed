import path from "path";
import fs from "fs";

// XCOPY /Y /S .\test\bin\**.png .\test\platform_package\astc_high\bin
export class FileUtils {

    static IMAGE_EXT = ['.png', '.jpg', '.jpeg'];

    //获取文件的后后缀名
    static getSuffix(url: string) {
        var lastIndex = url.lastIndexOf('.');
        if (lastIndex == -1) {
            console.log('[error] path do not inclue a file name:', url);
            return;
        }

        return url.substring(lastIndex);
    }

    //获取绝对路径
    static getAbsolutePath(url: string) {
        if (!path.isAbsolute(url)) {
            url = path.join(process.cwd(), url);
        }
        return path.normalize(url)
    }

    // 是否是文件夹
    static isFile(url: string) {
        if (fs.existsSync(url)) {
            var stat = fs.lstatSync(url);
            return stat.isFile();
        }
        return false;
    }

    // 是否是文件夹
    static isDirectory(url: string) {
        if (fs.existsSync(url)) {
            var stat = fs.lstatSync(url);
            return stat.isDirectory();
        }
        return false;
    }

    // 获取父级路径
    static getDirPath(url: string) {
        if (!path.isAbsolute(url)) {
            url = this.getAbsolutePath(url);
        }
        return path.dirname(url)
    }

    // 检查父级目录是否存在，不存在就创建
    static checkDirPath(url: string) {
        var dirPath = this.getDirPath(url);
        if (!fs.existsSync(dirPath)) {
            // console.log("mkdir", dirPath);
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    // 创建目录
    static mkdir(srcPath: string) {
        if (!fs.existsSync(srcPath)) {
            // console.log("mkdir", srcPath);
            fs.mkdirSync(srcPath, { recursive: true });
        }
    }

    // 拷贝文件
    static copy(srcPath: string, destPath: string, isOver = true, exts?: string[], ignoreExts?: string[], isIgnoreHide = true) {
        srcPath = this.getAbsolutePath(srcPath);
        destPath = this.getAbsolutePath(destPath);
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
            this.copyFile(srcPath, destPath, isOver, exts, ignoreExts);
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

                    // console.log("file itemSrc", itemSrc, "    ", itemDest);
                    this.copyFile(itemSrc, itemDest, isOver, exts, ignoreExts);
                }
                else if (stat.isDirectory()) {
                    if (itemDest.startsWith(itemSrc)) {
                        console.warn("拷贝路径嵌套死循环", itemSrc, "   ", itemDest);
                        continue;
                    }
                    this.copy(itemSrc, itemDest, isOver, exts, ignoreExts, isIgnoreHide);

                }

            }

        }

    }

    static copyFile(srcPath: string, destPath: string, isOver: boolean, exts?: string[], ignoreExts?: string[]) {

        if (exts || ignoreExts) {
            let ext = path.extname(srcPath);
            if (exts && exts.length > 0) {
                if (exts.indexOf(ext) == -1) {
                    return;
                }
            }

            if (ignoreExts && ignoreExts.length > 0) {
                if (ignoreExts.indexOf(ext) != -1) {
                    return;
                }
            }
        }


        if (isOver) {
            if (fs.existsSync(destPath)) {
                fs.unlinkSync(destPath);
            }

            this.checkDirPath(destPath);
            fs.copyFileSync(srcPath, destPath);
        }
        else if (!fs.existsSync(destPath)) {
            this.checkDirPath(destPath);
            fs.copyFileSync(srcPath, destPath);
        }
        // let  readable=fs.createReadStream(srcPath);//创建读取流
        // let  writable=fs.createWriteStream(destPath);//创建写入流
        // readable.pipe(writable);
    }

    // 删除文件或者目录
    static deleteFileOrDir(srcPath: string) {

        if (!fs.existsSync(srcPath)) {
            console.warn("文件不存在:", srcPath);
            return;
        }


        var stat = fs.lstatSync(srcPath);
        if (stat.isFile()) {
            fs.unlinkSync(srcPath);
        }
        else if (stat.isDirectory()) {
            var paths = fs.readdirSync(srcPath); //同步读取当前目录
            for (var i = 0, len = paths.length; i < len; i++) {
                var name = paths[i];
                var itemSrc = path.join(srcPath, name);
                var stat = fs.lstatSync(itemSrc);
                if (stat.isFile()) {
                    fs.unlinkSync(itemSrc);
                }
                else if (stat.isDirectory()) {
                    this.deleteFileOrDir(itemSrc);
                }
            }
            fs.rmdirSync(srcPath);
        }
    }

    // 写入文件
    static write(srcPath: string, body: string, flag = "w", encoding: BufferEncoding = "utf8") {
        this.checkDirPath(srcPath);
        fs.writeFileSync(srcPath, body, { flag: flag, encoding: encoding });
    }

    // 读取文件
    static read(srcPath: string, encoding: BufferEncoding = "utf8", flag: string = "a",) {
        if (!fs.existsSync(srcPath)) {
            return "";
        }
        return fs.readFileSync(srcPath, { encoding: encoding, flag: flag })
    }

    // 重命名
    static rename(srcPath: string, destPath: string, isOver = true) {
        if (!fs.existsSync(srcPath)) {
            console.error("文件不存在 srcPath:", srcPath);
            return;
        }

        if (!isOver) {
            if (fs.existsSync(destPath)) {
                console.error("目标文件已经存在 destPath:", destPath);
                return;
            }
        }

        this.checkDirPath(destPath);
        fs.renameSync(srcPath, destPath);
    }
}