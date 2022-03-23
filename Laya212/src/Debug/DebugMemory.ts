
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

export class DebugMemory {

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
            totalGPUMemory += gpuMemory
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
            // var size = this.sizeof(obj);
            // totalSize += size;
            var info = {
                path: path,
                type: obj.constructor.name,
                // size: bToStr(size),
            };
            table.push(info)
        }
        console.table(table);
        // console.log("总大小:" + bToStr(totalSize));
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
                    var texture2D: Laya.Texture2D = obj;
                    size += texture2D.width * texture2D.height * 4;
                    break;
                default:
                    isSkip = true;
                    break;
            }
            if (isSkip) continue;


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
            table.push(info)
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
                        size += 4; // assume null is the same size as a boolean
                        break;
                    }

                    var clsName = _object.constructor.name;
                    switch (clsName) {
                        case 'ArrayBuffer':
                            var ab: ArrayBuffer = _object;
                            size += ab.byteLength;
                            break;
                        case 'Texture2D':
                            var texture2D: Laya.Texture2D = _object;
                            size += texture2D.width * texture2D.height * 4;
                            break;
                    }



                    // if it's an array, the keys add no size. if it's an object, keys
                    // add size based on their length (keys must be strings according to spec)
                    var keySizeFactor = Array.isArray(_object) ? 0 : 1;

                    // coerces even array indices to strings, so we can use key.length safely
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