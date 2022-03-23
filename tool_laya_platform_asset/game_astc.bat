(
XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.png .\game\platform_asset\default_high
XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.jpg .\game\platform_asset\default_high
ts-node ./src/index.ts resize4mul -s '100%' -q 70  -i ./game/platform_asset/default_high/res/fgui -o ./game/platform_asset/default_high_4mul/res/fgui
ts-node ./src/index.ts resize4mul -s '100%' -q 70  -i ./game/platform_asset/default_high/res/fspriteassets -o ./game/platform_asset/default_high_4mul/res/fspriteassets
ts-node ./src/index.ts resize4mul -s '50%' -q 70  -i ./game/platform_asset/default_high/res3d/Conventional/Assets/jjsg_resources/prefab_scene -o ./game/platform_asset/default_high_4mul/res3d/Conventional/Assets/jjsg_resources/prefab_scene
ts-node ./src/index.ts compressed dds -i ./game/platform_asset/default_high_4mul/res/fgui -o ./game/platform_asset/dds_high/res/fgui -c 'dxt5'

ts-node ./src/index.ts compressed astc -i ./game/platform_asset/default_high_4mul -o ./game/platform_asset/astc_high -m 'cl' -b '8x8' -s 'medium'

ts-node ./src/index.ts resize4mul -s '50%' -q 70  -i ./game/platform_asset/default_high_4mul/res3d/Conventional/Assets/jjsg_resources/prefab_scene -o ./game/platform_asset/default_high_4mul_halfhalf/res3d/Conventional/Assets/jjsg_resources/prefab_scene
ts-node ./src/index.ts resize4mul -s '25%' -q 70  -i ./game/platform_asset/default_high/res3d/Conventional/Assets/jjsg_resources/prefab_scene -o ./game/platform_asset/default_high_4mul_halfhalf/res3d/Conventional/Assets/jjsg_resources/prefab_scene


ts-node ./src/index.ts compressed astc -i ./game/platform_asset/default_high_4mul_halfhalf -o ./game/platform_asset/astc_low -m 'cl' -b '8x8' -s 'medium'



ts-node ./src/index.ts resize4mul -s '100%' -q 70  -i ./game/platform_asset/default_high -o ./game/platform_asset/default_high_4mul

ts-node ./src/index.ts compressed astc -i ./game/platform_asset/default_high_4mul -o ./game/platform_asset/astc_high2 -m 'cl' -b '8x8' -s 'medium'

ts-node ./src/index.ts compressed dds -i ./game/platform_asset/default_high_4mul -o ./game/platform_asset/dds_high -c 'dxt5'

ts-node ./src/index.ts compressed pvr -i ./test/platform_asset/default_high_4mul -o ./test/platform_asset/pvr_high -f 'PVRTC1_2' -q 'pvrtcfast -p '-' -s '-'
)