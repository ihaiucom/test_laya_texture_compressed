ts-node ../tool_texture_compressed/index.ts ./test/bin ./test/platform_asset/astc_high veryfast
ts-node ./src/index.ts ./test/laya ./test/platform_asset ./test/platform_package/astc_high astc_high

ts-node ../tool_texture_compressed/index.ts D:\zengfeng\GameJJSG2021\client\laya\bin ./test/platform_asset/astc_high veryfast
ts-node ./src/index.ts D:\zengfeng\GameJJSG2021\client\laya\bin ./test/platform_asset ./test/platform_package/astc_high/bin astc_high

XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.png .\test\platform_asset\default_high
XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.jpg .\test\platform_asset\default_high


// convert ./test/platform_asset/default_high/res/fgui/**.png -resize '50%' ./test/platform_asset/default_middle/res/fgui/

 ts-node ./src/index.ts resize -s '50%'  -i ./test/platform_asset/default_high -o ./test/platform_asset/default_middle -q 100




XCOPY /S/Y ..\Laya212\bin\**.png .\test2\platform_asset\default_high
XCOPY /S/Y ..\Laya212\**.jpg .\test2\platform_asset\default_high

XCOPY /S/Y D:\zengfeng\GameJJSG2021\scene_res\prefab_scene\**.lmat D:\zengfeng\GameJJSG2021\client\laya\bin\res3d\Conventional\Assets\jjsg_resources\prefab_scene


ts-node ./src/index.ts copyimage -i ../Laya212/bin -o ./test2/platform_asset/default_high
ts-node ./src/index.ts resize -s '50%' -q 70 -i ./test2/platform_asset/default_high -o ./test2/platform_asset/default_middle
ts-node ./src/index.ts resize -s '25%' -q 70 -i ./test2/platform_asset/default_high -o ./test2/platform_asset/default_low
ts-node ./src/index.ts compressed dds -i ./test2/platform_asset/default_high -o ./test2/platform_asset/dds_high -c 'dxt5'
ts-node ./src/index.ts compressed dds -i ./test2/platform_asset/default_middle -o ./test2/platform_asset/dds_middle -c 'dxt5'
ts-node ./src/index.ts compressed dds -i ./test2/platform_asset/default_low -o ./test2/platform_asset/dds_low -c 'dxt5'
ts-node ./src/index.ts copyproject -l ../Laya212 -t ./test2/platform_asset  -o ./test2/platform_package/pc_low  -p pc_low


ts-node ./src/index.ts copyimage -i D:\zengfeng\GameJJSG2021\client\laya\bin -o ./test5/platform_asset/default_high
ts-node ./src/index.ts resize -s '50%' -q 70 -i ./test3/platform_asset/default_high -o ./test3/platform_asset/default_middle
ts-node ./src/index.ts resize -s '25%' -q 70 -i ./test3/platform_asset/default_high -o ./test3/platform_asset/default_low
ts-node ./src/index.ts compressed dds -i ./test3/platform_asset/default_high -o ./test3/platform_asset/dds_high -c 'dxt5'
ts-node ./src/index.ts compressed dds -i ./test3/platform_asset/default_middle -o ./test3/platform_asset/dds_middle -c 'dxt5'
ts-node ./src/index.ts compressed dds -i ./test3/platform_asset/default_low -o ./test3/platform_asset/dds_low -c 'dxt5'
ts-node ./src/index.ts copyproject -l D:\zengfeng\GameJJSG2021\client\laya -t ./test3/platform_asset  -o ./test3/platform_package/pc_low  -p pc_low
ts-node ./src/index.ts compressed pvr -i ./test3/platform_asset/default_high -o ./test3/platform_asset/pvr_high -f 'PVRTC1_2' -q 'pvrtcfast' -p '-' -s '-'
ts-node ./src/index.ts compressed etc -i ./test5/platform_asset/default_high -o ./test5/platform_asset/etc_high -f 'etc2_rgba' -s 'fast'

ts-node ./src/index.ts resize -s '50%' -q 70 -i D:\zengfeng\GameJJSG2021\client\laya\bin\res3d\Conventional\Assets\jjsg_resources\prefab_scene\ground_layer\picture -o ./test7/picture

ts-node ./src/index.ts resize -s '50%' -q 70 -i  D:\zengfeng\GameJJSG2021\client\laya\bin\res3d\Conventional\Assets\jjsg_resources\prefab_scene\far_layer\picture -o ./test7/far_layer\picture

ts-node ./src/index.ts resize -s '50%' -q 70 -i D:\zengfeng\GameJJSG2021\client\laya\bin\res3d\Conventional\Assets\jjsg_resources\prefab_scene\middle_layer\picture -o ./test7/middle_layer\picture



ts-node ./src/index.ts copyimage -i D:\zengfeng\GameJJSG2021\client\laya\bin\res3d\Conventional\Assets\jjsg_resources\prefab_scene -o ./test8/platform_asset/prefab_scene

ts-node ./src/index.ts resize -s '50%' -q 70 -i ./test8/platform_asset/prefab_scene -o ./test8/prefab_scene


ts-node ./src/index.ts copyimagefromunity -i D:\zengfeng\GameJJSG2021\client\laya\bin\res3d\Conventional\Assets\jjsg_resources\prefab_scene -u D:\zengfeng\GameJJSG2021\client\unity\Assets\jjsg_resources\prefab_scene -o ./test8/platform_asset/unity/prefab_scene


ts-node ./src/index.ts resize -s '50%' -q 70 -i ./test8/platform_asset/unity/prefab_scene -o ./test8/unity/prefab_scene



ts-node ./src/index.ts compressed astc -i ./test8/platform_asset/unity/prefab_scene -o ./test8/platform_asset/unity_astc/prefab_scene -m 'cl' -b '12x12' s 'medium'


ts-node ./src/index.ts compressed astc -i ./test8/platform_asset/unity/prefab_scene -o ./test8/platform_asset/unity_astc_6x6/prefab_scene -m 'cl' -b '6x6' s 'medium'


ts-node ./src/index.ts compressed astc -i ./test8/unity-middle/prefab_scene -o ./test8/unity-middle_astc_6x6/prefab_scene -m 'cl' -b '6x6' s 'medium'


ts-node ./src/index.ts compressed etc -i ./test8/platform_asset/unity/prefab_scene -o ./test8/platform_asset/unity_etc/prefab_scene -f 'etc2_rgba' -s 'fast'


ts-node ./src/index.ts compressed etc -i ./test8/platform_asset/unity/prefab_scene -o ./test8/platform_asset/unity_etc_rgb/prefab_scene -f 'etc1_rgb' -s 'fast'

ts-node ./src/index.ts compressed etc -i ./test8/unity-middle/prefab_scene -o ./test8/unity-middle_etc/prefab_scene -f 'etc2_rgba' -s 'fast'


ts-node ./src/index.ts compressed etc -i ./test8/unity-middle/prefab_scene -o ./test8/unity-middle_etc_rgb/prefab_scene -f 'etc1_rgb' -s 'fast'