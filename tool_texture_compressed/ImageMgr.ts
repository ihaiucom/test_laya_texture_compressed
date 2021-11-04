import {AstcFormat,DdsFormat,eAstcBlockSize,eAstcencModes,eAstcSpeed,eEtcFromat,eEtcSpeed,eExtType,ePvrFormat,ePvrQuality,EtcFormat,ImageStruct,PngOrJepgFromat,PvrFormat} from "./Define";
import {FileMgr} from "./FileMgr";
import {Image2AstcSync,Image2DdsSync,Image2EtcSync,Image2JepgSync,Image2PngSync,Image2PvrSync} from "./tool";

export class ImageMgr
{
    private m_mapAstcFormat: Map<string,AstcFormat>;
    private m_mapPvrFormat: Map<string,PvrFormat>;
    private m_mapEtcFormat: Map<string,EtcFormat>;
    private m_mapDdsFormat: Map<string,DdsFormat>;
    private m_mapPngOrJepgFormat: Map<string,PngOrJepgFromat>
    private static m_pInstance: ImageMgr;
    constructor()
    {
        this.m_mapAstcFormat = new Map();
        this.m_mapPvrFormat = new Map();
        this.m_mapEtcFormat = new Map();
        this.m_mapDdsFormat = new Map();
        this.m_mapPngOrJepgFormat = new Map();

    }
    public static Get(): ImageMgr
    {
        if(!ImageMgr.m_pInstance)
        {
            ImageMgr.m_pInstance = new ImageMgr();
        }
        return ImageMgr.m_pInstance;
    }


    async Init()
    {
        let mapImage: ImageStruct[] = FileMgr.Get().GetImageList();
        for await(const image of mapImage)
        {
            await Image2AstcSync(image,eAstcencModes.cl,eAstcBlockSize.size_12x12,eAstcSpeed.fast);

            await Image2PvrSync(image,ePvrFormat.PVRTC2_4,ePvrQuality.pvrtcfast);

            await Image2EtcSync(image,eEtcSpeed.fast,eEtcFromat.etc1_rgb);

            await Image2DdsSync(image);

            if(image.extName == eExtType.png)
            {
                await Image2PngSync(image,80);
            }
            else
            {
                await Image2JepgSync(image,80);
            }
        }
    }
}