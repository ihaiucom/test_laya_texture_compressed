import { EnumGameAssetFolder } from "./EnumGameAssetFolder";


export class GameLayaURL {

    /** 格式替换 */
    static ext_replace: { [key: string]: string };

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
        Laya.loader.load("ext_replace.json", Laya.Handler.create(null, (json) => {
            console.log(json);
            this.ext_replace = json;
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
        var ext2 = GameLayaURL.ext_replace[url];
        if (ext2) {
            // var ext: string = "." + Laya.Utils.getFileExtension(url);
            // newUrl = newUrl.replace(ext, ext2);
            newUrl = ext2
        }

        if (GameLayaURL.__src_customFormatExtReplace) {
            newUrl = GameLayaURL.__src_customFormatExtReplace(newUrl);
        }
        console.log("【customFormat】url:", url);
        console.log("【customFormat】newUrl:", newUrl);
        return newUrl;
    }
}