export class TestImage {

    index: number = 0;
    max = 20;

    ext: string = "png";
    dir: string = "test_pic_png";

    arr: Laya.Sprite[] = [];

    constructor(dir: string, ext: string) {
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
        if (this.index >= this.max) return;
        var sprite = TestImage.CreateSprite(this.index, this.GetUrl(this.index));
        this.arr[this.index] = sprite;
        this.index++;
    }

    Remove() {
        if (this.index <= 0) return;
        var sprite = this.arr[this.index - 1];
        delete this.arr[this.index - 1];
        var url = sprite['url'];
        sprite.destroy();
        // sprite.removeSelf();
        Laya.loader.clearRes(url);
        Laya.Resource.destroyUnusedResources();
        this.index--;
    }

    GetUrl(index: number) {
        return `${this.dir}/${index}.${this.ext}`;
    }


    static CreateSprite(index: number, url: string) {
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