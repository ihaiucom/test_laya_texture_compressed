import { icmd } from "./icmd";
import { argv } from "process";
import fs from "fs";
import path from "path";
import { SettingArgv } from "./SettingArgv";
import { FileUtils } from "./FileUtils";
const colors = require('colors-console')

var commander = require('commander');

commander
    .version('1.0.0', '-v, --version')
    .option("-l, --layaWorkspace <layaWorkspace>", "laya工程目录")
    .option("-t, --texturePath <texturePath>", "贴图目录")
    .option("-o, --outputPath <outputPath>", "输出目录")
    .parse(process.argv);


console.log("index-copyproject.ts");

export class cmd_copyproject implements icmd {

    constructor() {

    }

    Main() {

        console.log(argv);
        let cwdDir: string = process.cwd();
        let layaDir = argv[2];
        let platformAssetRootDir = argv[3];
        let outDir = argv[4];
        let platform = argv[5];
        let platformAssetDir = path.join(platformAssetRootDir, platform);

        // console.log('__dirname : ' + __dirname)
        // console.log('resolve   : ' + path.resolve('./'))
        // console.log('cwd       : ' + process.cwd())
        // console.log(cwdDir);

        if (!layaDir || !outDir) {
            console.error("\n", colors('red', '[Error]'), `没有输入 input_directory 或者 output_directory`);
            console.log(cmd);
            return;
        }

        if (!platform) {
            console.error("\n", colors('red', '[Error]'), "没有输入 platform");
            console.log(cmd);
            return;
        }

        fs.access(layaDir, fs.constants.F_OK, err => {
            if (err) {
                console.error("\n", colors('red', '[Error]'), '\x1B[46m input_directory \x1B[0m 不可访问!');
                console.log(cmd);
                return;
            }


            if (path.isAbsolute(layaDir)) {
                SettingArgv.layaDir = path.normalize(layaDir);
            }
            else {
                SettingArgv.layaDir = path.normalize(path.join(cwdDir, layaDir));
            }

            if (path.isAbsolute(platformAssetDir)) {
                SettingArgv.platformAssetDir = path.normalize(platformAssetDir);
            }
            else {
                SettingArgv.platformAssetDir = path.normalize(path.join(cwdDir, platformAssetDir));
            }


            if (path.isAbsolute(outDir)) {
                SettingArgv.outDir = path.normalize(outDir);
            }
            else {
                SettingArgv.outDir = path.normalize(path.join(cwdDir, outDir));
            }


            SettingArgv.platform = platform;

            console.log("layaDir:", SettingArgv.layaDir);
            console.log("platformAssetDir:", SettingArgv.platformAssetDir);
            console.log("outDir:", SettingArgv.outDir);


            FileUtils.copy(SettingArgv.layaDir + "/laya.laya", SettingArgv.outDir + "/laya.laya", true);
            FileUtils.copy(SettingArgv.layaDir + "/tsconfig.json", SettingArgv.outDir + "/tsconfig.json", true);
            FileUtils.copy(SettingArgv.layaDir + "/.vscode", SettingArgv.outDir + "/.vscode", true);
            FileUtils.copy(SettingArgv.layaDir + "/.gitignore", SettingArgv.outDir + "/.gitignore", true);
            FileUtils.copy(SettingArgv.layaDir + "/.laya", SettingArgv.outDir + "/.laya", true, ['.js', '.json']);


            FileUtils.copy(SettingArgv.layaDir + "/bin", SettingArgv.outDir + "/bin", true, undefined, ['.png', '.jpg', '.jpeg']);


            // FileUtils.copy(SettingArgv.layaDir + "/bin", SettingArgv.outDir, true, undefined, ['.png', '.jpg', '.jpeg']);
            // FileUtils.copy(SettingArgv.platformAssetDir, SettingArgv.outDir, true);
        });

    }

}