import { TestUI3D } from "../TestUI3D";
import { EnumGameAssetFolder } from "./EnumGameAssetFolder";
import { EnumGamePaltformApp } from "./EnumGamePaltformApp";
import { GameLayaExtend } from "./GameLayaExtend";


export class TestAstc {
    static async Test() {
        var testUI3D = new TestUI3D();
        var url = "res3d/Conventional/Assets/jjsg_resources/prefab_scene/ground_layer/picture/Room_jxyfj/map_Chjxyfj_ground_01.png";

        var url = "res/fspriteassets/loading/1.jpg";
        // var url = "res/fgui/_ResImg_LaunchBG_atlas_o0kcz8u.jpg";
        var sprite = new Laya.Sprite();
        sprite.loadImage(url);
        Laya.stage.addChild(sprite);

        // testUI3D.show();

        // var r = await GResouce.defaultInstance.GetInstantiateAsync('Room_jxyfj_01', pbe.ResType.Prefab) as Laya.Sprite;
        // testUI3D.scene.addChild(r);

        // var r = await GResouce.defaultInstance.GetInstantiateAsync('map_Chjxyfj_ground_01', pbe.ResType.Prefab) as any;
        // testUI3D.scene.addChild(r);
        // window['r'] = r;
        // alert(r.meshRenderer.material.albedoTexture)



        // var c = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(5, 5, 5));
        // var m = new Laya.UnlitMaterial();
        // Laya.loader.create(url, Laya.Handler.create(this, (t) => {
        //     m.albedoTexture = t;
        // }))
        // c.meshRenderer.material = m;
        // testUI3D.scene.addChild(c);

    }
}

export class GameLayaURL {

    /** 格式替换 */
    static ext_replace: { [key: string]: string } = {};

    static SetBasePath(basePath: string, folder: EnumGameAssetFolder) {
        Laya.URL.basePath = basePath + "/" + folder + "/";
        // Laya.URL.basePath = basePath + "/";
    }

    /** 加载 ext_replace.json */
    static AsyncLoadExtReplaceConfig(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.LoadExtReplaceConfig(Laya.Handler.create(null, () => {
                resolve();
            }))
        })
    }

    /** 加载 ext_replace.json */
    static LoadExtReplaceConfig(complete: Handler) {
        var path = "asset_url_replace.json";
        Laya.loader.load(path, Laya.Handler.create(null, (json) => {
            Laya.loader.clearRes(path);
            if (json != null) {
                this.ext_replace = json;
            }
            complete && complete.run();
        }), null, Laya.Loader.JSON)
    }

    static InitCustomFormat() {
        GameLayaURL.__src_customFormatExtReplace = <any>Laya.URL.customFormat;
        Laya.URL.customFormatExtReplace = GameLayaURL.customFormatExtReplace;
    }

    private static __src_customFormatExtReplace: (url: String) => string;
    /** 自定义URL格式化的方式。例如： customFormat = function(url:String):String{} */
    static customFormatExtReplace(url: string): string {

        var newUrl = url;


        // var ext = Laya.Utils.getFileExtension(url);
        // if (ext == "png" || ext == "jpg") {
        //     newUrl = newUrl.replace('res', 'astc_high/res');
        //     newUrl = newUrl.replace('.' + ext, ".astc");
        // }


        if (GameLayaExtend.PaltformApp == EnumGamePaltformApp.App) {
            if (url.indexOf('res3d/Conventional/Assets/jjsg_resources/prefab_scene') != -1) {
                var ext = Laya.Utils.getFileExtension(url);
                if (ext == "png" || ext == "jpg") {
                    newUrl = newUrl.replace('res3d/Conventional/Assets/jjsg_resources/prefab_scene', 'res3d/prefab_scene1');
                    newUrl = newUrl.replace('.' + ext, ".astc");
                    console.log(newUrl);
                }
            }
        }
        else {
            var ext = Laya.Utils.getFileExtension(url);
            if (ext == "png" || ext == "jpg") {
                if (
                    url.indexOf('res3d/ExportResource/colorTex') == -1 &&
                    url.indexOf('res/fspriteassets/herospine') == -1
                ) {
                    newUrl = "dds_high/" + newUrl;
                    newUrl = newUrl.replace('.' + ext, ".dds");
                    console.log(newUrl);
                }
            }
        }


        // if (GameLayaExtend.PaltformApp == EnumGamePaltformApp.App) {
        //     if (url.indexOf('res3d/Conventional/Assets/jjsg_resources/prefab_scene') != -1) {
        //         var ext = Laya.Utils.getFileExtension(url);
        //         if (ext == "png" || ext == "jpg") {
        //             newUrl = newUrl.replace('res3d/Conventional/Assets/jjsg_resources/prefab_scene', 'res3d/prefab_scene_astc_half');
        //             newUrl = newUrl.replace('.' + ext, ".astc");
        //             console.log(newUrl);
        //         }
        //     }
        // }
        // else {
        //     if (url.indexOf('res3d/Conventional/Assets/jjsg_resources/prefab_scene') != -1) {
        //         var ext = Laya.Utils.getFileExtension(url);
        //         if (ext == "png" || ext == "jpg") {
        //             newUrl = newUrl.replace('res3d/Conventional/Assets/jjsg_resources/prefab_scene', 'res3d/prefab_scene3');
        //             newUrl = newUrl.replace('.' + ext, ".dds");
        //             console.log(newUrl);
        //         }
        //     }
        // }







        // var ext2 = GameLayaURL.ext_replace[url];
        // if (ext2) {
        //     newUrl = ext2;
        //     // var ext: string = "." + Laya.Utils.getFileExtension(url);
        //     // newUrl = newUrl.replace(ext, ".dds");
        //     // newUrl = "file:///D:/zengfeng/github/test_laya_texture_compressed/tool_laya_platform_asset/test3/platform_asset/dds_high/" + ext2
        // }

        // var ext: string = "." + Laya.Utils.getFileExtension(url);
        // if (ext == ".png" || ext == ".jpg") {
        //     var ext: string = "." + Laya.Utils.getFileExtension(url);
        //     newUrl = newUrl.replace(ext, ".ktx");
        //     newUrl = "http://192.168.15.71:8902/tool_laya_platform_asset/test5/platform_asset/etc_high/" + newUrl

        // }

        if (GameLayaURL.__src_customFormatExtReplace) {
            newUrl = GameLayaURL.__src_customFormatExtReplace(newUrl);
        }
        // console.log("【customFormat】url:", url);
        // console.log("【customFormat】newUrl:", newUrl);
        return newUrl;
    }
}