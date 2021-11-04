// const srcDir: string = argv[2];
// const outDir: string = argv[3];
// const size: string = argv[4];
// const speed: string = argv[5];

import imageSize from "image-size";
import path from "path";
import {Config} from "./Config";

export enum eCompressionType
{
    ASTC = "astc",
    ETC = "etc",
    PVR = "pvr",
    PNG = "png",
    JEPG = "jpg",
    DDS = "dds"
}

export enum eExtType
{
    astc = ".astc",
    pkm = ".pkm",
    ktx = ".ktx",
    pvr = ".pvr",
    png = ".png",
    jpg = ".jpg",
    dds = ".dds",
    json = ".json"

}

export enum eAstcencModes
{
    cl = "-cl",//use the linear LDR color profile.
    cs = "-cs",//use the sRGB LDR color profile.
    ch = "-ch",//use the HDR color profile, tuned for HDR RGB and LDR A.
    cH = "-cH",//use the HDR color profile, tuned for HDR RGBA.
}


export enum eAstcBlockSize
{
    size_4x4 = "4x4",
    size_5x4 = "5x4",
    size_6x5 = "6x5",
    size_6x6 = "6x6",
    size_8x5 = "8x5",
    size_8x6 = "8x6",
    size_10x5 = "10x5",
    size_10x6 = "10x6",
    size_8x8 = "8x8",
    size_10x8 = "10x8",
    size_10x10 = "10x10",
    size_12x10 = "12x10",
    size_12x12 = "12x12",
}

export enum eAstcSpeed
{
    /**
     * Run codec in very-fast-mode; this generally results in substantial
     * quality loss.
     */
    veryfast = "-veryfast",
    /**
     * Run codec in fast-mode. This generally results in mild quality loss.
     */
    fast = "-fast",
    /**
     * Run codec in medium-speed-mode.
     */
    medium = "-medium",
    /**
     * Run codec in thorough-mode. This should be sufficient to fix most
     * cases where "-medium" provides inadequate quality.
     */
    thorough = "-thorough",
    /**
     * Run codec in exhaustive-mode. This usually produces only
     * marginally better quality than "-thorough" while considerably
     * increasing encode time.
     */
    exhaustive = "-exhaustive"
}

export enum eEtcSpeed
{
    fast = "fast",
    normal = "normal",
    best = "best"
}

export enum eEtcFromat
{
    etc1_rgb = "etc1_rgb",
    etc2_rgb = "etc2_rgb",
    etc2_rgba = "etc2_rgba",
    etc2_rgba1 = "etc2_rgba1",
    eac_r = "eac_r",
    eac_rg = "eac_rg"
}

export enum ePvrQuality
{
    pvrtcfastest = "pvrtcfastest",
    pvrtcfast = "pvrtcfast",
    pvrtcnormal = "pvrtcnormal",
    pvrtchigh = "pvrtchigh",
    pvrtcbest = "pvrtcbest",
}

export enum ePvrFormat
{
    PVRTC1_2 = "PVRTC1_2",
    PVRTC1_4 = "PVRTC1_4",
    PVRTC1_2_RGB = "PVRTC1_2_RGB",
    PVRTC1_4_RGB = "PVRTC1_4_RGB",
    PVRTC2_2 = "PVRTC2_2",
    PVRTC2_4 = "PVRTC2_4",
}

/**
 - Key: 
 - First Char- S=Signed, U=Unsigned. 
 - Second Char- B=Byte, S=Short, I=Integer, F=Float. 
 - Third Character (optional) N=Normalised.
 */
export enum ePvrVariableType
{
    UB = "UB",
    UBN = "UBN",
    SB = "SB",
    SBN = "SBN",
    US = "US",
    USN = "USN",
    SS = "SS",
    SSN = "SSN",
    UI = "UI",
    UIN = "UIN",
    SI = "SI",
    SIN = "SIN",
    UF = "UF",
    SF = "SF",
}

export enum ePvrColourSpace
{
    lRGB = "lRGB",
    sRGB = "sRGB"
}


export enum eCompressionSpeed
{
    /**最快 */
    veryfast = "veryfast",
    /**均衡 */
    normal = "normal",
    /**质量最好 */
    best = "best",
}

export class AstcFormat
{
    blockSize: eAstcBlockSize | string;
    speed: eAstcSpeed | string;

    static create(): AstcFormat
    {
        let format = new AstcFormat();
        format.blockSize = eAstcBlockSize.size_12x12;
        format.speed = eAstcSpeed.medium;
        return format;
    }
}

export class PvrFormat
{
    format: ePvrFormat;
    quality: ePvrQuality;

    static create(): PvrFormat
    {
        let format = new PvrFormat();
        format.format = ePvrFormat.PVRTC1_4;
        format.quality = ePvrQuality.pvrtcnormal;
        return format;
    }
}

export class EtcFormat
{
    speed: eEtcSpeed;
    format: eEtcFromat;
    isKtx: boolean;
    static create(): EtcFormat
    {
        let format = new EtcFormat();
        format.speed = eEtcSpeed.normal
        format.format = eEtcFromat.etc2_rgba;
        format.isKtx = true;
        return format;
    }
}
export class DdsFormat
{
    static create(): DdsFormat
    {
        let format = new DdsFormat();
        return format;
    }
}

export class PngOrJepgFromat
{
    quality: number;
    static create(): PngOrJepgFromat
    {
        let format = new PngOrJepgFromat();
        format.quality = 800;
        return format;
    }
}

export class CompressionFormat
{
    astc: AstcFormat = AstcFormat.create();
    pvr: PvrFormat = PvrFormat.create();
    etc: EtcFormat = EtcFormat.create();
    dds: DdsFormat = DdsFormat.create();
    png: PngOrJepgFromat = PngOrJepgFromat.create();
    jpg: PngOrJepgFromat = PngOrJepgFromat.create();
}

export class ImageStruct
{
    public extName: string;
    public fileName: string;
    public baseName: string;
    public fullPath: string;
    //相对路径
    public relative_dirname: string;
    public width: number;
    public height: number;
    public scale: number;

    constructor(file: string)
    {
        this.extName = path.extname(file);
        this.relative_dirname = path.dirname(file)
        this.fileName = path.basename(file);
        this.baseName = path.basename(file,this.extName);
        this.fullPath = path.normalize(path.join(Config.SRC_ROOT_DIR,file));
        if(eExtType.png == this.extName || eExtType.jpg == this.extName)
        {
            try
            {
                let size = imageSize(this.fullPath);
                this.width = size.width;
                this.height = size.height;
            } catch(error)
            {
                console.log("\n",this);
                console.error(error);
            }

        }
    }

    public GetOutFile(ext: eExtType): string
    {
        return path.normalize(path.join(Config.OUT_ROOT_DIR,this.relative_dirname,this.baseName.concat(ext)));
    }
}

export class OutFileDetail
{
    type: eCompressionType;
    src: string;
    file: string;
    width: number;
    height: number;
    cmd: string;
    cache: boolean;
}

export function TimeFormat(time: number): string
{
    let hour: number = ((time / 1000) / 3600) >> 0;
    let min: number = (((time / 1000) % 3600) / 60) >> 0;
    let sce: number = ((time / 1000) % 3600) >> 0;
    if(hour > 0)
    {
        return `${hour}小时${(100 + min).toString().substring(1)}分${(100 + sce).toString().substring(1)}秒`;
    }
    if(min > 0)
    {
        return `${min}分:${(100 + sce).toString().substring(1)}秒`;
    }
    if(sce > 1)
    {
        return `${sce}s`;
    }
    return `${time}ms`;
}
