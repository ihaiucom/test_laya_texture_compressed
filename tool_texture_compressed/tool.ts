/**
 * 用子进程的方式调用工具
 */

import {ChildProcess} from "child_process";
import {eAstcBlockSize,eAstcencModes,eAstcSpeed,eEtcFromat,eEtcSpeed,eExtType,ePvrFormat,ePvrQuality,ImageStruct} from "./Define";

const {spawn,spawnSync} = require('child_process');
// const astcenc = spawn('astcenc.exe',['-cl','test.png',"astc6.astc","6x6","-medium"]);

//该模式可以考虑跑多个线程，加速编译
export function Image2Astc(modes: eAstcencModes,srcFile: string,outastc: string,size: eAstcBlockSize,speed: eAstcSpeed): void
{
    const astcenc = spawn('./tool/astcenc.exe',[modes,srcFile,outastc,size,speed,"-normal_psnr"],{encoding: "string"});
    astcenc.on("close",(code: any) =>
    {
        console.log(`child process close with code ${code}`);
    });
    astcenc.on('exit',(code: any) =>
    {
        console.log(`child process exited with code ${code}`);
    });
}

export async function Image2AstcSync(image: ImageStruct,modes: eAstcencModes,size: string,speed: string): Promise<ImageStruct>
{
    const tool = "./tool/astcenc-sse2.exe";
    const outFile: string = image.GetOutFile(eExtType.astc);
    let param = [modes,image.fullPath,outFile,size,speed];
    return await RunToolSync(tool,param,image,outFile);
}

export async function Image2PvrSync(image: ImageStruct,format: ePvrFormat,quality: ePvrQuality): Promise<ImageStruct>
{
    const tool = "./tool/PVRTexToolCLI.exe";
    const outFile: string = image.GetOutFile(eExtType.pvr);
    let param = [`-i ${image.fullPath}`,`-o ${outFile}`,`-f ${format},UBN,lRGB`,`-q ${quality}`];
    return await RunToolSync(tool,param,image,outFile);
}

export async function Image2EtcSync(image: ImageStruct,speed: eEtcSpeed,farmat: eEtcFromat,bKtx: boolean = true): Promise<ImageStruct>
{
    const tool = "./tool/etccompress.exe";
    const outFile: string = bKtx ? image.GetOutFile(eExtType.ktx) : image.GetOutFile(eExtType.pkm);
    let param = [`-i ${image.fullPath}`,`-o ${outFile}`,`-q ${speed}`,"-e numeric","-c etcpak",`-f ${farmat}`,"-y noflip"];
    return await RunToolSync(tool,param,image,outFile);
}

export async function Image2DdsSync(image: ImageStruct): Promise<ImageStruct>
{
    const tool = "./tool/convert.exe"
    const outFile: string = image.GetOutFile(eExtType.dds);
    let param = [`-format dds`,`-define dds:compression=dxt5`,`${image.fullPath}`,outFile];
    return await RunToolSync(tool,param,image,outFile);
}

export async function Image2JepgSync(image: ImageStruct,quality: number): Promise<ImageStruct>
{
    const tool = "./tool/convert.exe"
    let outFile: string = image.GetOutFile(eExtType.jpg);
    let param = [`-quality ${quality}`,`${image.fullPath}`,outFile];
    return await RunToolSync(tool,param,image,outFile);
}

export async function Image2PngSync(image: ImageStruct,quality: number): Promise<ImageStruct>
{
    const tool = "./tool/convert.exe"
    const outFile: string = image.GetOutFile(eExtType.png);
    let param = [`-quality ${quality}`,`${image.fullPath}`,outFile];
    return await RunToolSync(tool,param,image,outFile);
}


async function RunToolSync(tool: string,param: string[],image: ImageStruct,outFile: string): Promise<ImageStruct>
{
    param = param.join(" ").split(" ");
    let now: number = Date.now();
    const process: ChildProcess = await spawnSync(tool,param)
    if(!process["error"] && process["status"] == 0)
    {
        console.log(`compression success! src:${image.fileName},outFile:${outFile},time:${Date.now() - now}ms`);
        return image;
    }
    console.log("process::error:",process["error"]);
    console.log(`${tool} ${param.join(" ")}`);
    if(!process["error"])
    {
        console.log(process.stdout.toString());
        console.log(process.stderr.toString());
    }
    return image;
}
