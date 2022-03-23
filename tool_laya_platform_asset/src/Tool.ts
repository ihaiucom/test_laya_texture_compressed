import { spawnSync } from "child_process";
import path from "path";
import { EnumAstcBlockSize } from "./EnumAstcBlockSize";
import { EnumAstcMode } from "./EnumAstcMode";
import { EnumAstcSpeed } from "./EnumAstcSpeed";
import { EnumDdsCompression } from "./EnumDdsCompression";
import { EnumEtcFormat } from "./EnumEtcFormat";
import { EnumEtcSpeed } from "./EnumEtcSpeed";
import { EnumPvrFormat } from "./EnumPvrFormat";
import { EnumPvrQuality } from "./EnumPvrQuality";
import { FileUtils } from "./FileUtils";

export class Tool {
    static TOOL_ROOT_DIR = "./tool/";

    static __Init__() {
        let rootPath = path.normalize(path.join(process.argv[1], "../../"));
        let toolPath = path.normalize(path.join(rootPath, "./tool/"));
        Tool.TOOL_ROOT_DIR = toolPath;
    }


    static async Image2AstcSync(inPath: string, outPath: string, modes: EnumAstcMode = EnumAstcMode.cl, blockSize: EnumAstcBlockSize = EnumAstcBlockSize.size_8x8, speed: EnumAstcSpeed = EnumAstcSpeed.fast): Promise<boolean> {
        FileUtils.checkDirPath(outPath);
        const tool = "astcenc-sse2.exe";
        // let param = [modes, inPath, outPath, blockSize, speed, '-pp-premultiply'];
        let param = [modes, inPath, outPath, blockSize, speed];
        return await this.RunToolSync(tool, param);
    }


    static async Image2PvrSync(inPath: string, outPath: string, format: EnumPvrFormat = EnumPvrFormat.PVRTC1_2, quality: EnumPvrQuality = EnumPvrQuality.pvrtcfast, pot = "-", square: string = "-"): Promise<boolean> {
        FileUtils.checkDirPath(outPath);
        const tool = "PVRTexToolCLI.exe";
        // let param = [`-i ${inPath}`, `-o ${outPath}`, `-f ${format},UBN,lRGB`, `-q ${quality}`, `-pot ${pot}`, `-square ${square}`, '-p'];

        let param = [`-i ${inPath}`, `-o ${outPath}`, `-f ${format},UBN,lRGB`, `-q ${quality}`, '-p'];
        return await this.RunToolSync(tool, param);
    }


    static async Image2EtcSync(inPath: string, outPath: string, farmat: EnumEtcFormat = EnumEtcFormat.etc2_rgba, speed: EnumEtcSpeed = EnumEtcSpeed.fast): Promise<boolean> {
        FileUtils.checkDirPath(outPath);
        const tool = "etccompress.exe";
        let param = [`-i ${inPath}`, `-o ${outPath}`, `-q ${speed}`, "-e numeric", "-c etcpak", `-f ${farmat}`, "-y noflip"];
        return await this.RunToolSync(tool, param);
    }

    static async Image2DdsSync(inPath: string, outPath: string, compression: EnumDdsCompression = EnumDdsCompression.dxt5): Promise<boolean> {
        FileUtils.checkDirPath(outPath);
        const tool = "convert.exe"
        let param = [`-format dds`, `-define dds:compression=${compression}`, inPath, outPath];
        return await this.RunToolSync(tool, param);
    }


    static async ImageResizeSync(inPath: string, outPath: string, size: string, quality: number): Promise<boolean> {
        FileUtils.checkDirPath(outPath);

        let tool = "convert.exe";
        let parm = [inPath, `-resize ${size}`, `-quality ${quality}`, outPath];
        return await this.RunToolSync(tool, parm);
    }

    static async RunToolSync(tool: string, param: string[]): Promise<boolean> {

        tool = path.normalize(path.join(Tool.TOOL_ROOT_DIR, tool));

        param = param.join(" ").split(" ");
        let now: number = Date.now();
        let cmdStr = `${tool} ${param.join(" ")}`;
        const process = await spawnSync(tool, param)
        if (!process.error && process.status == 0) {
            console.log(`success! ${cmdStr},time:${Date.now() - now}ms`);
            return true;
        }

        if (process.error) {
            console.error(cmdStr);
            console.error(process.error);
        }

        if (!process.error) {
            console.error(cmdStr);
            console.log(process.stdout.toString());
            console.log(process.stderr.toString());
        }
        return false;
    }

}