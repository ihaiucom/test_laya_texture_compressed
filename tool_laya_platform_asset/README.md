ts-node ../tool_texture_compressed/index.ts ./test/bin ./test/platform_asset/astc_high veryfast
ts-node ./src/index.ts ./test/laya ./test/platform_asset ./test/platform_package/astc_high astc_high

ts-node ../tool_texture_compressed/index.ts D:\zengfeng\GameJJSG2021\client\laya\bin ./test/platform_asset/astc_high veryfast
ts-node ./src/index.ts D:\zengfeng\GameJJSG2021\client\laya\bin ./test/platform_asset ./test/platform_package/astc_high/bin astc_high

XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.png .\test\platform_asset\default_high
XCOPY /S/Y D:\zengfeng\GameJJSG2021\client\laya\bin\**.jpg .\test\platform_asset\default_high

