XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.png .\game\platform_asset\default_high
XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.jpg .\game\platform_asset\default_high

ts-node ./src/index.ts compressed astc -i ./game/platform_asset/default_high -o ./game/platform_asset/astc_high -m 'cl' -b '8x8' -s 'medium'


ts-node ./src/index.ts compressed dds -i ./game/platform_asset/default_high -o ./game/platform_asset/dds_high -c 'dxt5'


 ts-node ./src/index.ts resize -s '50%' -q 70  -i ./game/platform_asset/default_high/res3d/Conventional/Assets/jjsg_resources/prefab_scene -o ./game/prefab_scene


ts-node ./src/index.ts copyproject -l D:\zengfeng\GameJJSG2021\client\laya -t ./game/platform_asset  -o ./game/platform_package/astc_high  -p astc_high


ts-node ./src/index.ts compressed astc -i ./game/prefab_scene -o ./game/prefab_scene_astc_half -m 'cl' -b '8x8' -s 'medium'

convert _ResImg_LaunchBG_atlas_o0kcz8u.jpg -format dds -define dds:compression=dxt5 _ResImg_LaunchBG_atlas_o0kcz8u.dds

## 建议用astcenc-sse2， astcenc-avx2在laya会反转

## 压缩
astcenc-sse2 -cl _ResImg_LaunchBG_atlas_o0kcz8u.jpg _ResImg_LaunchBG_atlas_o0kcz8u.astc 8x8 -medium


 ts-node ./src/index.ts resize4mul -s '100%' -q 70  -i ./game/platform_asset/default_high -o ./game/platform_asset/default_high_4mul
 ts-node ./src/index.ts resize4mul -s '50%' -q 70  -i ./game/platform_asset/default_high -o ./game/platform_asset/default_middle_4mul
 
ts-node ./src/index.ts compressed dds -i ./game/platform_asset/default_high_4mul -o ./game/platform_asset/dds_high_4mul -c 'dxt5'


ts-node ./src/index.ts copyproject -l D:\zengfeng\GameJJSG2021\client\laya -t ./game/platform_asset  -o ./game/platform_package/laya-astc  -p pc_low


ts-node ./src/index.ts compressed astc -i ./game/platform_asset/default_middle_4mul -o ./game/platform_asset/astc_middle_4mul -m 'cl' -b '8x8' -s 'medium'


XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\**.** .\game\laya-astc


DEL /S/Y D:\zengfeng\github\test_laya_texture_compressed\tool_laya_platform_asset\game\laya-astc\bin\res\fspriteassets\**.png
DEL /S/Y **.jpg

Remove-Item * -Include *.png -Recurse
Remove-Item * -Include *.jpg -Recurse