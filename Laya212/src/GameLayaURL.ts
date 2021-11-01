export class GameLayaURL
{
    // WEBGL_compressed_texture_s3tc
    // WEBGL_compressed_texture_s3tc_srgb
    // WEBGL_compressed_texture_astc
    // WEBGL_compressed_texture_etc
    // WEBGL_compressed_texture_etc1
    // WEBGL_compressed_texture_pvrtc

    static InitCustomFormat()
    {
        GameLayaURL.__src_customFormatExtReplace = <any> Laya.URL.customFormat;
        Laya.URL.customFormatExtReplace = GameLayaURL.customFormatExtReplace;

    }
    
    private static __src_customFormatExtReplace: (url:String)=>string;
    /** 自定义URL格式化的方式。例如： customFormat = function(url:String):String{} */
    static customFormatExtReplace(url: string): string {

        // var ext: string = Laya.Utils.getFileExtension(url);
        var newUrl = url;
        if(Laya.Browser.onPC)
        {
            newUrl = newUrl.replace(".png", ".dds");
        }
        else if(Laya.Browser.onIOS)
        {
            newUrl = newUrl.replace(".png", ".pvr");
        }
        else if(Laya.Browser.onAndroid)
        {
            newUrl = newUrl.replace(".png", ".ktx");
        }

        if(GameLayaURL.__src_customFormatExtReplace)
        {
            newUrl = GameLayaURL.__src_customFormatExtReplace(newUrl);
        }
        console.log("【customFormat】url:", url);
        console.log("【customFormat】newUrl:", newUrl);
        return newUrl;
    }
}

/** 资源设置 */
export class GameAssetSettingItem
{
    /** 路径 */
    public path:string ;

    /** 压缩后缀格式 (.astc, .ktx, .pvr, .dds) */
    public compressedExt: string;
}

/** 资源平台类型 */
export enum EnumGameAssetPlatformType
{
    /** 默认，图片格式默认png */
    Default = 0,
    /** PC, 图片格式 .dds */
    PC = 1,
    /** Android, 图片格式 .ktx */
    Android = 2,
    /** Android, 图片格式 .ktx */
    Android_Web = 2,
    /** Android, 图片格式 .ktx */
    Android_MiniGame = 2,
    /** iOS, 图片格式 .pvr */
    iOS = 3,
    /** iOS, 图片格式 .pvr */
    iOS_Web = 4,
    /** iOS, 图片格式 .astc */
    iOS_MiniGame = 5,
}

/** 平台 */
export enum EnumPlatformType
{

}