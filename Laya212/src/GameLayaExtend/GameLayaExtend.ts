import { EnumGameAssetFolder } from "./EnumGameAssetFolder";
import { EnumGameAssetLevel } from "./EnumGameAssetLevel";
import { EnumGamePaltformApp } from "./EnumGamePaltformApp";
import { EnumGamePaltformOS } from "./EnumGamePaltformOS";
import { EnumGameTextureExt } from "./EnumGameTextureExt";
import { GameLayaURL } from "./GameLayaURL";
import { GameWebGLCompressedTexture } from "./GameWebGLCompressedTexture";

export class GameLayaExtend {
    /** 平台应用 */
    static PaltformApp: EnumGamePaltformApp;
    /** 平台操作系统 */
    static PaltformOS: EnumGamePaltformOS;
    /** 平台资源目录 */
    static AssetFolder: EnumGameAssetFolder;

    static Init() {
        window['GameWebGLCompressedTexture'] = GameWebGLCompressedTexture;
        window['GameLayaURL'] = GameLayaURL;
        window['GameLayaExtend'] = GameLayaExtend;


        this.SetPaltformOS();
        this.SetPaltformApp();
        this.SetAssetFolder();
    }

    /** 是否是本地测试 */
    private static _isLocal;
    static get isLocal() {
        if (this._isLocal === undefined) {
            if (window['wx'] || window['conch']) {
                this._isLocal = false;
            }
            else {
                if (window && window.location && window.location.href) {
                    this._isLocal = window.location.href.startsWith("file:") || window.location.host.startsWith("192");
                }
                else {

                    this._isLocal = false;
                }
            }
        }
        return this._isLocal;
    }


    private static SetPaltformOS() {

        var os = EnumGamePaltformOS.windows;
        if (Laya.Browser.onIOS) {
            os = EnumGamePaltformOS.ios;
        }
        else if (Laya.Browser.onAndroid) {
            os = EnumGamePaltformOS.android;
        }
        else if (Laya.Browser.onMac) {
            os = EnumGamePaltformOS.mac;
        }

        if (Laya.Browser.window && Laya.Browser.window.navigator) {
            if (Laya.Browser.window.navigator.platform == "devtools") {
                os = EnumGamePaltformOS.windows;
            }
        }

        this.PaltformOS = os;
    }

    private static SetPaltformApp() {
        var app = EnumGamePaltformApp.Brower;
        if (Laya.Browser._isMiniGame) {
            app = EnumGamePaltformApp.Mini;
        }
        else if ((window as any).conch) {
            app = EnumGamePaltformApp.App;
        }


        if (Laya.Browser.window && Laya.Browser.window.navigator) {
            if (Laya.Browser.window.navigator.platform == "devtools") {
                app = EnumGamePaltformApp.Devtool;
            }
        }

        this.PaltformApp = app;
    }

    private static SetAssetFolder() {
        let folder = EnumGameAssetFolder.default_high;

        let os = "pc";
        let ext = EnumGameTextureExt.defalut;
        let level = EnumGameAssetLevel.high;

        switch (this.PaltformOS) {
            case EnumGamePaltformOS.windows:
            case EnumGamePaltformOS.mac:
                os = "pc";
                break;
            default:
                os = this.PaltformOS;
                break;
        }

        // 选择文件格式
        if (GameWebGLCompressedTexture.astc) {
            ext = EnumGameTextureExt.astc;
        }
        else if (GameWebGLCompressedTexture.etc1) {
            ext = EnumGameTextureExt.etc;
        }
        else if (GameWebGLCompressedTexture.pvrtc) {
            ext = EnumGameTextureExt.pvr;
        }
        else if (GameWebGLCompressedTexture.s3tc) {
            ext = EnumGameTextureExt.dds;
        }

        // 选择清晰度
        switch (this.PaltformApp) {
            case EnumGamePaltformApp.Mini:
            case EnumGamePaltformApp.Devtool:
                level = EnumGameAssetLevel.low;
                break;
            case EnumGamePaltformApp.App:
                level = EnumGameAssetLevel.high;
                break;
            case EnumGamePaltformApp.Brower:
                if (Laya.Browser.onMobile) {
                    level = EnumGameAssetLevel.low;
                }
                else {
                    level = EnumGameAssetLevel.high;
                }
                break;
        }

        // 选择目录
        folder = `${ext}_${level}` as EnumGameAssetFolder;

        // 如果支持astc并且是ios、android，就用最优资源压缩方案
        // if (GameWebGLCompressedTexture.astc) {
        //     switch (this.PaltformOS) {
        //         case EnumGamePaltformOS.ios:
        //         case EnumGamePaltformOS.android:
        //             folder = `${os}_${ext}_${level}` as EnumGameAssetFolder;
        //             break;
        //     }
        // }

        this.AssetFolder = folder;
    }


}