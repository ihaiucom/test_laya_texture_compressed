export enum EnumAstcMode {
    cl = "-cl",//use the linear LDR color profile.
    cs = "-cs",//use the sRGB LDR color profile.
    ch = "-ch",//use the HDR color profile, tuned for HDR RGB and LDR A.
    cH = "-cH",//use the HDR color profile, tuned for HDR RGBA.
}