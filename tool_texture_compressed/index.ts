import path from "path";
import {argv} from "process";
import {Config} from "./Config";
import {ConfMgr} from "./ConfMgr";
import {eCompressionSpeed} from "./Define";
import {FileMgr} from "./FileMgr";
import {ImageMgr} from "./ImageMgr";
import {fs} from "./type";
const cmd = "\n Usage\n   ts-node ./index.ts <input_directory> <output_directory> <speed{veryfast|normal|best}>\n Example\n   ts-node ./index.ts ./src_dir ./out_dir best\n";
async function Init()
{
    const rootDir: string = path.dirname(argv[1]);
    const cwdDir: string = process.cwd();
    const srcDir: string = argv[2];
    const outDir: string = argv[3] ? argv[3] : Config.OUT_ROOT_DIR;
    const speed: string = argv[4];
    console.log("srcDir:",srcDir);
    console.log("outDir:",outDir);
    console.log("speed:",speed);
    console.log(rootDir);
    if(!srcDir || !outDir)
    {
        console.warn("\n [!err] src dir or out dir is undefined!");
        console.log(cmd);
        return;
    }

    Config.TOOL_ROOT_DIR = rootDir;
    fs.access(srcDir,fs.constants.F_OK,err =>
    {
        if(err)
        {
            console.log("\n [!err]src dir err!");
            console.log(cmd);
            return;
        }
        if(path.isAbsolute(srcDir))
        {
            Config.SRC_ROOT_DIR = path.normalize(srcDir);
        }
        else
        {
            Config.SRC_ROOT_DIR = path.normalize(path.join(cwdDir,srcDir));
        }
        if(path.isAbsolute(outDir))
        {
            Config.OUT_ROOT_DIR = path.normalize(outDir);
        }
        else
        {
            Config.OUT_ROOT_DIR = path.normalize(path.join(cwdDir,outDir));
        }
        if(speed && eCompressionSpeed[speed])
        {
            Config.COMPRESSION_SPEED = speed;
        }
        else
        {
            console.warn("\n [!warn] 未识别的速度参数，使用默认值: veryfast");
            console.log(cmd);
            Config.COMPRESSION_SPEED = eCompressionSpeed.veryfast;
        }
        console.log("src:::",Config.SRC_ROOT_DIR);
        console.log("out::",Config.OUT_ROOT_DIR);
        console.log("speed::",Config.COMPRESSION_SPEED);
        ConfMgr.Get().Init();
        Run();
    });
}

async function Run(): Promise<void>
{
    await fs.mkdirSync(Config.OUT_ROOT_DIR,{recursive: true});
    await FileMgr.Get().Init();
    // let arrImage: ImageStruct[] = ReadImageList();
    ImageMgr.Get().Init();

}

Init();

