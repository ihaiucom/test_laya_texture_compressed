import path from "path";
import {Config} from "./Config";
import {CompressionFormat,eExtType,ImageStruct} from "./Define";
import {fs} from "./type";

export class FileMgr
{
    private static m_pInstance: FileMgr;
    private m_stRootDirInfo: DirInfo;
    private m_mapDirInfo: Map<string,DirInfo>;
    public m_mapImageStruct: Map<string,ImageStruct>;
    private m_arrImageStruct: ImageStruct[];
    private m_arrDirInfo: DirInfo[];
    constructor()
    {
        this.m_mapDirInfo = new Map();
        this.m_mapImageStruct = new Map();
        this.m_arrImageStruct = [];
        this.m_arrDirInfo = [];
    }

    public static Get(): FileMgr
    {
        if(!FileMgr.m_pInstance)
        {
            FileMgr.m_pInstance = new FileMgr();
        }
        return FileMgr.m_pInstance;
    }

    public async Init(): Promise<void>
    {
        this.m_stRootDirInfo = new DirInfo();
        await this.ReadDir(Config.SRC_ROOT_DIR,this.m_stRootDirInfo);
        for await(const [key,info] of this.m_mapDirInfo)
        {
            if(info.is_image)
            {
                let image = await new ImageStruct(info.file);
                this.m_mapImageStruct.set(key,image);
                this.m_arrImageStruct.push(image);
            }
            else if(info.is_dir)
            {
                this.m_arrDirInfo.push(info);
            }
        }
        await this.Mkdir();

        this.m_arrImageStruct.sort((image1,image2) =>
        {
            return image1.fullPath > image2.fullPath ? 1 : -1;
        });
        this.m_arrDirInfo.sort((info1,info2) =>
        {
            return info1.file > info2.file ? 1 : -1;
        })
        // console.log(this.m_mapImageStruct);
        console.log(this.m_mapDirInfo.size);
        console.log(this.m_mapImageStruct.size);
        // ConfMgr.Get().UpdateBuildConfig();
    }

    public GetImageList(): ImageStruct[]
    {
        return this.m_arrImageStruct;
    }

    public GetDirInfoList(): DirInfo[]
    {
        return this.m_arrDirInfo;
    }

    private async ReadDir(dir: string,parent: DirInfo): Promise<void>
    {
        let info = new DirInfo();
        info.file = path.relative(Config.SRC_ROOT_DIR,dir);
        info.parent = parent;
        let status = await fs.statSync(dir);
        if(status.isDirectory())
        {
            info.is_dir = true;
            let files = await fs.readdirSync(dir);
            for await(const file of files)
            {
                if(file !== ".svn"
                    && file !== ".git")
                {
                    await this.ReadDir(`${dir}\\${file}`,info);
                }
            }
            parent.child.push(info);
            this.m_mapDirInfo.set(dir,info);
        }
        else if(status.isFile())
        {
            let ext = path.extname(dir);
            if(eExtType.jpg == ext
                || eExtType.png == ext)
            {
                if(status.size > 0)
                {
                    info.is_image = true;
                    parent.child.push(info);
                    this.m_mapDirInfo.set(dir,info);
                }
                else
                {
                    console.warn("\n文件损坏:",info.file);
                }
            }

        }
    }


    private async Mkdir(): Promise<void>
    {
        for await(const [key,info] of this.m_mapDirInfo)
        {
            if(info.is_dir)
            {
                await fs.mkdirSync(path.join(Config.OUT_ROOT_DIR,info.file),{recursive: true});
            }
        }
    }
}
export class DirInfo
{
    file: string;
    is_dir: boolean;
    is_image: boolean;
    is_json: boolean;
    child: DirInfo[];
    parent: DirInfo;
    config: CompressionFormat;
    constructor()
    {
        this.child = [];
    }
}