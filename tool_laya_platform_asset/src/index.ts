import { argv } from "process";

const cmd = `
Usage
ts-node ./index.ts <input_directory> <output_directory> <platform>

Example
ts-node ./src/index.ts ./test/bin ./test/platform_package android_astc_low
`;
function main()
{
    console.log(argv);
}

main();