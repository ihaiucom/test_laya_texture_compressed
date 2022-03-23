import { DebugMemory } from "./Debug/DebugMemory";
import TestButtonBinder from "./fgui/TestButton/TestButtonBinder";
import UI_TestButtonPanel from "./fgui/TestButton/UI_TestButtonPanel";
import GameConfig from "./GameConfig";
import { TestImage } from "./TestImage";
import { TestScene } from "./TestScene";
import Vector3 = Laya.Vector3;
class Main {
	scene: TestScene;
	constructor() {

		window['debugMemory'] = DebugMemory;

		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.name = "stage";
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		if (Laya.MiniAdpter) Laya.MiniAdpter.autoCacheFile = false;


		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);


		// 设置fgui文件后缀
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
				})

				testPanel[`m_${names[i]}_remove`].onClick(this, () => {
					img.Remove();
				})


				testPanel[`m_${names[i]}_addall`].onClick(this, () => {
					img.AddAll();
				})

				testPanel[`m_${names[i]}_removeall`].onClick(this, () => {
					img.RemoveAll();
				})

			}


		}));


	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}


}

function RunMain() {

	//激活启动类
	new Main();

}

RunMain();