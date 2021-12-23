
import { Command } from 'commander';
import path from 'path';
import { Tool } from './Tool';

let rootPath = path.normalize(path.join(process.argv[1], "../../"));
let toolPath = path.normalize(path.join(rootPath, "./tool/"));
Tool.TOOL_ROOT_DIR = toolPath;

const commander = new Command();
// 程序参数
commander
    .version('1.0.0', '-v, --version')
    .usage("[command] [args]")
    .command('copyimage', '拷贝图片.')
    .command('copyimagefromunity', '拷贝图片从unity拷贝.')
    .command('resize', '缩放图片.')
    .command('compressed', '压缩图片.')
    .command('copyproject', '拷贝laya工程.')
    .command('imagesize', '输出图片大小.')
    .command('filestatistics', '统计项目资源文件大小.')
    .parse(process.argv);

const cmd = `
Usage
ts-node ./index.ts copyproject <laya_directory> <texture_directory> <output_directory> <platform>
ts-node ./index.ts resize <size> <texture_directory> <output_directory>
ts-node ./index.ts compressed <ext> <texture_directory> <output_directory>

Example
ts-node ./src/index.ts copyproject ./test/laya ./test/platform_asset ./test/platform_package/astc_high astc_high
ts-node ./src/index.ts resize ’50%‘ ./test/platform_asset/default_high ./test/platform_asset/default_middle
ts-node ./src/index.ts compressed astc ./test/platform_asset/default_high ./test/platform_asset/astc_high
`;