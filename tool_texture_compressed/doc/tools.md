# 一些常用的图片处理工具

## astcenc.exe 
>一个开源的astc编码器，维护的较多。支持bmp\jepg\png\tga与astc的互转，可选参数较多，常用方式如下:

* encode命令:  
`astcenc {-cl|-cs|-ch|-cH} <in> <out> <blockdim> <quality> [options]`  
* decode命令，解压astc成普通图片，一般解压成tga，可以查看压缩后的质量  
`astcenc {-dl|-ds|-dh|-dH} <in> <out>`  
* test命令,该命令压缩后直接解压，不生成astc文件，方便快速查看压缩质量  
`astcenc {-tl|-ts|-th|-tH} <in> <out> <blockdim> <quality> [options]`

可以方便的查看测试图像质量  
### 注意事项:
下载最新的官方release版本，windows下面有三个版本：  
- astcenc-sse2.exe 速度最慢，但支持最好
- astcenc-sse4.1.exe 速度一般，较sse2 版本快15%
- astcenc-avx2.exe 速度最快，较sse4.1再快15%，但兼容性较差（14年以后的cpu支持avx2才行）
有时候会遇到图片翻转的问题，遇到这类问题，在后面加上`-yflip`翻转命令即可，如果不支持该命令，请升级至最新版。


## PVRTexToolCLI PVR打包工具

## etcpack.exe etc1、etc2打包工具

