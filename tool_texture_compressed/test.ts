// import {utils,writeFile} from "xlsx";
// import {eAstcencModes,eAstcSpeed,eEtcFromat,eEtcSpeed,ePvrFormat,ePvrQuality,ImageStruct} from "./Define";
// import {Image2AstcSync,Image2DdsSync,Image2EtcSync,Image2JepgSync,Image2PngSync,Image2PvrSync} from "./tool";

// import {utils,writeFile} from "xlsx";

// async function Test(): Promise<void>
// {
//     let image: ImageStruct = new ImageStruct("./test/test.png");
//     await Image2AstcSync(image,eAstcencModes.cl,"12x12",eAstcSpeed.medium);
//     await Image2PvrSync(image,ePvrFormat.PVRTC2_4,ePvrQuality.pvrtcfast);
//     await Image2EtcSync(image,eEtcSpeed.fast,eEtcFromat.etc1_rgb);
//     await Image2DdsSync(image);
//     await Image2PngSync(image,80);
//     await Image2JepgSync(image,80);
// }

async function Run()
{
    // mkdir(Config.OUT_ROOT_DIR,{recursive: true},err =>
    // {
    //     if(err)
    //     {
    //         console.error(err);
    //         return
    //     }
    //     Test();
    // })

    // let json = [
    //     {"大标题": null},
    //     {null: "大标题"},
    //     {null: "大标题"},
    //     {null: "大标题"},
    //     {Name: 'name_01',Age: 21,Address: 'address_01'},
    //     {Name: 'name_02',Age: 22,Address: 'address_02'},
    //     {Name: 'name_03',Age: 23,Address: 'address_03'},
    //     {Name: 'name_04',Age: 24,Address: 'address_04'},
    //     {Name: 'name_05',Age: 25,Address: 'address_05'},];
    // let ss = utils.json_to_sheet(json);
    // let keys = Object.keys(ss).sort(); //排序 [需要注意，必须从A1开始]
    // let ref = keys[1] + ':' + keys[keys.length - 1]; //这个是定义一个字符串 也就是表的范围[A1:C5] 
    // let workbook = { //定义操作文档
    //     SheetNames: ['nodejs-sheetname'], //定义表明
    //     Sheets: {
    //         'nodejs-sheetname': Object.assign({},ss,{'!ref': ref}) //表对象[注意表明]
    //     },
    // }
    // writeFile(workbook,"./out_dir_del/xx.xls");
}
Run();