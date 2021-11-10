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


ts-node ./src/index.ts copyimage -i ../Laya212/bin -o ./test2/platform_asset/default_high
ts-node ./src/index.ts resize -s '50%' -q 70 -i ./test2/platform_asset/default_high -o ./test2/platform_asset/default_middle
ts-node ./src/index.ts resize -s '25%' -q 70 -i ./test2/platform_asset/default_high -o ./test2/platform_asset/default_low
ts-node ./src/index.ts compressed dds -i ./test2/platform_asset/default_high -o ./test2/platform_asset/dds_high -c 'dxt5'
ts-node ./src/index.ts compressed dds -i ./test2/platform_asset/default_middle -o ./test2/platform_asset/dds_middle -c 'dxt5'
ts-node ./src/index.ts compressed dds -i ./test2/platform_asset/default_low -o ./test2/platform_asset/dds_low -c 'dxt5'
ts-node ./src/index.ts copyproject -l ../Laya212 -t ./test2/platform_asset  -o ./test2/platform_package/pc_low  -p pc_low