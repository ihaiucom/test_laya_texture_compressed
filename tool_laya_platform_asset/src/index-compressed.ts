var commander = require('commander');
commander
    .version('1.0.0', '-v, --version')
    .command('astc', 'astc')
    .command('etc', 'etc')
    .command('pvr', 'pvr')
    .command('dds', 'dds')
    // .option("-e, --ext <ext>", "格式")
    // .option("-i, --inputTexturePath <inputTexturePath>", "原图目录")
    // .option("-o, --outputTexturePath <outputTexturePath>", "缩放后的图片目录")
    .parse(process.argv);
console.log("index-compressed.ts");