import path from "path";
import {Config} from "./Config";
import {ImageStruct} from "./Define";
import {DirInfo,FileMgr} from "./FileMgr";
import {XLSX} from "./type";

export class ConfMgr
{
    private static m_pInstance: ConfMgr;
    private static readonly IMAGE_LIST: string = "image_list";
    private static readonly DIR_LIST: string = "dir_list";
    private m_stWorkBook: XLSX.WorkBook;
    private m_sBuildConfigFile: string;

    constructor()
    {

    }

    public static Get(): ConfMgr
    {
        if(!ConfMgr.m_pInstance)
        {
            ConfMgr.m_pInstance = new ConfMgr;
        }
        return ConfMgr.m_pInstance;
    }

    public Init(): void
    {
        this.m_sBuildConfigFile = path.join(Config.SRC_ROOT_DIR,"build_config.xls");
        this.ReadOrCreateConf();
    }

    private async ReadOrCreateConf(): Promise<void>
    {
        let wb: XLSX.WorkBook;
        try
        {
            // accessSync(this.m_sBuildConfigFile);
            wb = await XLSX.readFile(this.m_sBuildConfigFile);
            let ws: XLSX.WorkSheet = wb.Sheets[ConfMgr.DIR_LIST];
            let json = XLSX.utils.sheet_to_json(ws);
            //#TODO 将读取的配置与现有的配置融合
            console.log(json);
            // json.forEach(data =>
            // {
            //     console.log(data);
            // })
            console.log("读取到数据");
        } catch(error)
        {
            console.log("未发现配置，尝试创建配置");
            wb = this.CreateWorkbook();
        }
        this.m_stWorkBook = wb;
    }

    private CreateWorkbook(): XLSX.WorkBook
    {
        let wb: XLSX.WorkBook = XLSX.utils.book_new();
        let wsData = [["path","baseName","width","height","relative_dirname"]];
        let ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb,ws,ConfMgr.IMAGE_LIST);
        XLSX.writeFile(wb,this.m_sBuildConfigFile);
        return wb;
    }

    public UpdateBuildConfig(): void
    {
        return;
        this.UpdateImageList();
        this.UpdateDirList();
        XLSX.writeFile(this.m_stWorkBook,this.m_sBuildConfigFile);
    }

    private UpdateImageList(): void
    {
        let image_list: ImageStruct[] = FileMgr.Get().GetImageList();
        const titles = {
            path: "path",
            baseName: "baseName",
            width: "width",
            height: "height",
            relative_dirname: "relative_dirname"
        }
        const fields = ["path","baseName","width","height","relative_dirname"];
        const data = [];
        image_list.forEach(image =>
        {
            data.push({
                path: image.fullPath,
                baseName: image.baseName,
                width: image.width,
                height: image.height,
                relative_dirname: image.relative_dirname
            });
        });
        const ws = this.CreateWs(data,fields,titles);
        this.m_stWorkBook.Sheets[ConfMgr.IMAGE_LIST] = ws;

        if(!this.m_stWorkBook.Sheets[ConfMgr.IMAGE_LIST])
        {
            XLSX.utils.book_append_sheet(this.m_stWorkBook,ws,ConfMgr.IMAGE_LIST);
        }
        else
        {
            this.m_stWorkBook.Sheets[ConfMgr.IMAGE_LIST] = ws;
        }
    }

    private UpdateDirList(): void
    {
        let dirInfoList: DirInfo[] = FileMgr.Get().GetDirInfoList();
        const titles = {
            path: "path",
        }
        const fields = ["path"];
        const data = [];
        dirInfoList.forEach(info =>
        {
            data.push({
                path: info.file,
            });
        });
        const ws = this.CreateWs(data,fields,titles);
        if(!this.m_stWorkBook.Sheets[ConfMgr.DIR_LIST])
        {
            XLSX.utils.book_append_sheet(this.m_stWorkBook,ws,ConfMgr.DIR_LIST);
        }
        else
        {
            this.m_stWorkBook.Sheets[ConfMgr.DIR_LIST] = ws;
        }
    }


    public CreateWs(wsData,fields,titles): XLSX.WorkSheet
    {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            wsData,{
            header: fields
        }
        );
        const range = XLSX.utils.decode_range(ws['!ref']);
        for(let c = range.s.c;c <= range.e.c;c++)
        {
            const header = XLSX.utils.encode_col(c) + "1";
            ws[header].v = titles[ws[header].v];
        }
        return ws;
    }
}