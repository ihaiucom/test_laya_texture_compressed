
/** 平台资源目录 */
export enum EnumGameAssetFolder {
    /** 默认图片格式， 清晰度高, (png,jpg) */
    default_high = "default_high",
    /** 默认图片格式， 清晰度中, (png,jpg) */
    default_middle = "default_middle",
    /** 默认图片格式， 清晰度低, (png,jpg) */
    default_low = "default_low",


    /** dds为主， 清晰度高, (png,jpg,dds) */
    dds_high = "dds_high",
    /** pvr为主， 清晰度中, (png,jpg,dds) */
    dds_middle = "dds_middle",
    /** pvr为主， 清晰度低, (png,jpg,dds) */
    dds_low = "dds_low",



    /** astc为主， 清晰度高, (png,jpg,astc) */
    astc_high = "astc_high",
    /** astc为主， 清晰度中, (png,jpg,astc) */
    astc_middle = "astc_middle",
    /** astc为主， 清晰度低, (png,jpg,astc) */
    astc_low = "astc_low",


    /** pvr为主， 清晰度高, (png,jpg,pvr) */
    pvr_high = "pvr_high",
    /** pvr为主， 清晰度中, (png,jpg,pvr) */
    pvr_middle = "pvr_middle",
    /** pvr为主， 清晰度低, (png,jpg,pvr) */
    pvr_low = "pvr_low",


    /** ktx为主， 清晰度高, (png,jpg,ktx) */
    etc_high = "etc_high",
    /** ktx为主， 清晰度中, (png,jpg,ktx) */
    etc_middle = "etc_middle",
    /** ktx为主， 清晰度低, (png,jpg,ktx) */
    etc_low = "etc_low",


    /** ios, astc为主， 清晰度高, (png,jpg,pvr,astc) */
    ios_astc_high = "ios_astc_high",
    /** ios, astc为主， 清晰度中, (png,jpg,pvr,astc) */
    ios_astc_middle = "ios_astc_middle",
    /** ios, astc为主， 清晰度低, (png,jpg,pvr,astc) */
    ios_astc_low = "ios_astc_low",



    /** android, astc为主， 清晰度高, (png,jpg,ktx,astc) */
    android_astc_high = "android_astc_high",
    /** android, astc为主， 清晰度中, (png,jpg,ktx,astc) */
    android_astc_middle = "android_astc_middle",
    /** android, astc为主， 清晰度低, (png,jpg,ktx,astc) */
    android_astc_low = "android_astc_low",
}