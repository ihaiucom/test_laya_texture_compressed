export class TestUI3D {

    scene: Laya.Scene3D;
    camera: Laya.Camera;
    light: Laya.DirectionLight;
    box: Laya.MeshSprite3D;
    constructor() {
        window['testUI3D'] = this;
        var scene = new Laya.Scene3D();
        var camera = new Laya.Camera();
        camera.clearFlag = Laya.CameraClearFlags.Nothing;
        camera.transform.localPositionZ = -10;
        camera.transform.rotation = new Laya.Quaternion(0, 1, 0, 0);
        scene.addChild(camera);
        this.camera = camera;
        var light = new Laya.DirectionLight();
        scene.addChild(light);
        var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        scene.addChild(box);

        this.scene = scene;
        this.light = light;
        this.box = box;

    }

    show() {
        Laya.stage.addChild(this.scene);
        Laya.timer.frameLoop(1, this, this.onLoop);
    }


    hide() {
        this.scene.removeSelf();
        Laya.timer.clear(this, this.onLoop);
    }

    onLoop() {
        this.box.transform.localRotationEulerX += 1;
        this.box.transform.localRotationEulerY += 0.5;
        this.box.transform.localRotationEulerZ += 0.25;
    }



}