/** webgl对压缩图片的支持 */
export class GameWebGLCompressedTexture
{
    
    // WEBGL_compressed_texture_s3tc
    // WEBGL_compressed_texture_s3tc_srgb
    // WEBGL_compressed_texture_astc
    // WEBGL_compressed_texture_etc
    // WEBGL_compressed_texture_etc1
    // WEBGL_compressed_texture_pvrtc
    
    /** 是否支持 dds */
    static get s3tc(): boolean
    {
        return (<any>Laya).LayaGL.layaGPUInstance._compressedTextureS3tc != null;
    }
    
    /** 是否支持 astc */
    static get astc(): boolean
    {
        return (<any>Laya).LayaGL.layaGPUInstance._compressedTextureASTC != null;
    }
    
    
    /** 是否支持 pvr */
    static get pvrtc(): boolean
    {
        return (<any>Laya).LayaGL.layaGPUInstance._compressedTexturePvrtc != null;
    }
    
    /** 是否支持 etc */
    static get etc(): boolean
    {
        return (<any>Laya).LayaGL.layaGPUInstance._compressedTextureETC != null;
    }
    
    /** 是否支持 etc1 */
    static get etc1(): boolean
    {
        return (<any>Laya).LayaGL.layaGPUInstance._compressedTextureEtc1 != null;
    }
}