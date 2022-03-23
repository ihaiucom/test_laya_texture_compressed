(function () {
    'use strict';

    function bToStr(b) {
        if (b < 1024) {
            return b + "B";
        }
        let kb = b / 1024;
        return kbToStr(kb);
    }
    function kbToStr(kb) {
        if (kb < 1024) {
            return Math.ceil(kb) + "KB";
        }
        let mb = kb / 1024;
        if (mb < 1024) {
            return (Math.ceil(mb * 100) / 100) + "MB";
        }
        let gb = mb / 1024;
        return (Math.ceil(gb * 100) / 100) + "GB";
    }
    class DebugMemory {
        static PrintTexture() {
            if (!Laya.Browser.onPC) {
                return;
            }
            var tabel = [];
            var textureMap = Laya.Loader.textureMap;
            var totalGPUMemory = 0;
            for (var url in textureMap) {
                var texture = textureMap[url];
                var path = url.replace(Laya.URL.rootPath, "");
                var gpuMemory = texture.sourceWidth * texture.sourceHeight * 4;
                totalGPUMemory += gpuMemory;
                var info = {
                    path: path,
                    width: texture.sourceWidth,
                    height: texture.sourceHeight,
                    "显存": bToStr(gpuMemory),
                };
                tabel.push(info);
            }
            console.table(tabel);
            console.log("图片总显存:" + bToStr(totalGPUMemory));
        }
        static PrintRes() {
            var table = [];
            var totalSize = 0;
            for (var url in Laya.Loader.loadedMap) {
                var obj = Laya.Loader.loadedMap[url];
                var path = url.replace(Laya.URL.rootPath, "");
                var info = {
                    path: path,
                    type: obj.constructor.name,
                };
                table.push(info);
            }
            console.table(table);
        }
        static PrintImage() {
            var table = [];
            var totalSize = 0;
            var mapSize = 0;
            var mapCount = 0;
            var fguiSize = 0;
            var fguiCount = 0;
            var fspriteassetsSize = 0;
            var fspriteassetsCount = 0;
            var effectSize = 0;
            var effectCount = 0;
            var weponSize = 0;
            var weponCount = 0;
            var unitSize = 0;
            var unitCount = 0;
            for (var url in Laya.Loader.loadedMap) {
                var obj = Laya.Loader.loadedMap[url];
                var path = url.replace(Laya.URL.rootPath, "");
                var size = 0;
                var clsName = obj.constructor.name;
                var isSkip = false;
                switch (clsName) {
                    case 'Texture2D':
                        var texture2D = obj;
                        size += texture2D.width * texture2D.height * 4;
                        break;
                    default:
                        isSkip = true;
                        break;
                }
                if (isSkip)
                    continue;
                if (path.indexOf("prefab_scene") != -1) {
                    mapSize += size;
                    mapCount++;
                }
                else if (path.indexOf("res/fgui/") != -1) {
                    fguiSize += size;
                    fguiCount++;
                }
                else if (path.indexOf("ExportResource") != -1) {
                    effectSize += size;
                    effectCount++;
                }
                else if (path.indexOf("w_") != -1) {
                    weponSize += size;
                    weponCount++;
                }
                else if (path.indexOf("GPUSKinning") != -1 || path.indexOf("@") != -1) {
                    unitSize += size;
                    unitCount++;
                }
                else if (path.indexOf("res/fspriteassets") != -1) {
                    fspriteassetsSize += size;
                    fspriteassetsCount++;
                }
                totalSize += size;
                var info = {
                    path: path,
                    type: obj.constructor.name,
                    size: bToStr(size),
                };
                table.push(info);
            }
            console.table(table);
            console.log("总大小:" + bToStr(totalSize));
            var otherSize = totalSize - fguiSize - fspriteassetsSize - mapSize - effectSize - unitSize - weponSize;
            var otherCount = table.length - fguiCount - fspriteassetsCount - mapCount - effectCount - unitCount - weponCount;
            var table2 = [
                { module: "fgui", "图片内存大小": bToStr(fguiSize), size: fguiSize, "文件数量": fguiCount },
                { module: "fspriteassets", "图片内存大小": bToStr(fspriteassetsSize), size: fspriteassetsSize, "文件数量": fspriteassetsCount },
                { module: "地图", "图片内存大小": bToStr(mapSize), size: mapSize, "文件数量": mapCount },
                { module: "特效", "图片内存大小": bToStr(effectSize), size: effectSize, "文件数量": effectCount },
                { module: "角色", "图片内存大小": bToStr(unitSize), size: unitSize, "文件数量": unitCount },
                { module: "武器", "图片内存大小": bToStr(weponSize), size: weponSize, "文件数量": weponCount },
                { module: "其他", "图片内存大小": bToStr(otherSize), size: otherSize, "文件数量": otherCount },
            ];
            console.table(table2);
        }
        static sizeof(object) {
            var objects = [object];
            var processed = [];
            var size = 0;
            for (var index = 0; index < objects.length; ++index) {
                var _object = objects[index];
                switch (typeof _object) {
                    case 'boolean':
                        size += 4;
                        break;
                    case 'number':
                        size += 8;
                        break;
                    case 'string':
                        size += 2 * _object.length;
                        break;
                    case 'object':
                        if (_object === null) {
                            size += 4;
                            break;
                        }
                        var clsName = _object.constructor.name;
                        switch (clsName) {
                            case 'ArrayBuffer':
                                var ab = _object;
                                size += ab.byteLength;
                                break;
                            case 'Texture2D':
                                var texture2D = _object;
                                size += texture2D.width * texture2D.height * 4;
                                break;
                        }
                        var keySizeFactor = Array.isArray(_object) ? 0 : 1;
                        for (var key in _object) {
                            size += keySizeFactor * 2 * key.length;
                            if (processed.indexOf(_object[key]) === -1) {
                                objects.push(_object[key]);
                                if (typeof _object[key] === 'object') {
                                    processed.push(_object[key]);
                                }
                            }
                        }
                        break;
                }
            }
            return size;
        }
    }
    window['DebugMemory'] = DebugMemory;

    class UI_TestButtonPanel extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("TestButton", "TestButtonPanel"));
        }
        onConstruct() {
            this.m_png_add = (this.getChildAt(0));
            this.m_png_remove = (this.getChildAt(1));
            this.m_astc_add = (this.getChildAt(3));
            this.m_astc_remove = (this.getChildAt(4));
            this.m_png_removeall = (this.getChildAt(6));
            this.m_astc_removeall = (this.getChildAt(7));
            this.m_png_addall = (this.getChildAt(8));
            this.m_astc_addall = (this.getChildAt(9));
            this.m_ktx_add = (this.getChildAt(10));
            this.m_ktx_remove = (this.getChildAt(11));
            this.m_ktx_removeall = (this.getChildAt(13));
            this.m_ktx_addall = (this.getChildAt(14));
            this.m_ktx1_add = (this.getChildAt(15));
            this.m_ktx1_remove = (this.getChildAt(16));
            this.m_ktx1_removeall = (this.getChildAt(18));
            this.m_ktx1_addall = (this.getChildAt(19));
            this.m_ktxr_add = (this.getChildAt(20));
            this.m_ktxr_remove = (this.getChildAt(21));
            this.m_ktxr_removeall = (this.getChildAt(23));
            this.m_ktxr_addall = (this.getChildAt(24));
            this.m_dds_add = (this.getChildAt(25));
            this.m_dds_remove = (this.getChildAt(26));
            this.m_dds_removeall = (this.getChildAt(28));
            this.m_dds_addall = (this.getChildAt(29));
        }
    }
    UI_TestButtonPanel.URL = "ui://85ybivoejqfk1";

    class TestButtonBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(UI_TestButtonPanel.URL, UI_TestButtonPanel);
        }
    }

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            var scene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
                material.albedoTexture = tex;
            }));
            box.meshRenderer.material = material;
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 1334;
    GameConfig.height = 750;
    GameConfig.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class TestImage {
        constructor(dir, ext) {
            this.index = 0;
            this.max = 20;
            this.ext = "png";
            this.dir = "test_pic_png";
            this.arr = [];
            this.dir = dir;
            this.ext = ext;
        }
        AddAll() {
            while (this.index < this.max) {
                this.Add();
            }
        }
        RemoveAll() {
            while (this.index > 0) {
                this.Remove();
            }
        }
        Add() {
            if (this.index >= this.max)
                return;
            var sprite = TestImage.CreateSprite(this.index, this.GetUrl(this.index));
            this.arr[this.index] = sprite;
            this.index++;
        }
        Remove() {
            if (this.index <= 0)
                return;
            var sprite = this.arr[this.index - 1];
            delete this.arr[this.index - 1];
            var url = sprite['url'];
            sprite.destroy();
            Laya.loader.clearRes(url);
            Laya.Resource.destroyUnusedResources();
            this.index--;
        }
        GetUrl(index) {
            return `${this.dir}/${index}.${this.ext}`;
        }
        static CreateSprite(index, url) {
            var s = 0.1;
            var sprite = new Laya.Sprite();
            sprite.loadImage(url);
            sprite.scale(s, s);
            var cx = 5;
            var cy = 4;
            var w = 2048 * s;
            var ax = index % cx;
            var ay = Math.floor(index / cx) % cy + (Math.floor(index / cx / cy) * 10);
            sprite.x = ax * w;
            sprite.y = ay * w;
            Laya.stage.addChildAt(sprite, 0);
            sprite.name = url.replace('/', '-');
            sprite['index'] = index;
            sprite['url'] = url;
            return sprite;
        }
    }

    class Main {
        constructor() {
            window['debugMemory'] = DebugMemory;
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.name = "stage";
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (Laya.MiniAdpter)
                Laya.MiniAdpter.autoCacheFile = false;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            fgui.UIConfig.packageFileExtension = "bin";
            TestButtonBinder.bindAll();
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            var png = new TestImage("test_pic_png", "png");
            var astc = new TestImage("test_pic_astc", "astc");
            var ktx = new TestImage("test_pic_ktx", "ktx");
            var ktx1 = new TestImage("test_pic_ktx1", "ktx");
            var ktxr = new TestImage("test_pic_ktx_r", "ktx");
            var dds = new TestImage("test_pic_dds", "dds");
            var types = [png, astc, ktx, ktx1, ktxr, dds];
            var names = ["png", "astc", "ktx", "ktx1", "ktxr", 'dds'];
            window['types'] = types;
            fgui.UIPackage.loadPackage("fgui/TestButton", Laya.Handler.create(this, () => {
                var testPanel = UI_TestButtonPanel.createInstance();
                fgui.GRoot.inst.addChild(testPanel);
                for (let i = 0; i < types.length; i++) {
                    let img = types[i];
                    testPanel[`m_${names[i]}_add`].onClick(this, () => {
                        img.Add();
                    });
                    testPanel[`m_${names[i]}_remove`].onClick(this, () => {
                        img.Remove();
                    });
                    testPanel[`m_${names[i]}_addall`].onClick(this, () => {
                        img.AddAll();
                    });
                    testPanel[`m_${names[i]}_removeall`].onClick(this, () => {
                        img.RemoveAll();
                    });
                }
            }));
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    function RunMain() {
        new Main();
    }
    RunMain();

}());
//# sourceMappingURL=bundle.js.map
