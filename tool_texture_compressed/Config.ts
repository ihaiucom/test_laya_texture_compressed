import {eCompressionSpeed} from "./Define";

export class Config
{
    public static RUN_DIR: string;
    public static TOOL_ROOT_DIR: string = "./";
    public static SRC_ROOT_DIR: string = "./";
    public static OUT_ROOT_DIR: string = "./test_out/";
    public static COMPRESSION_SPEED: string = eCompressionSpeed.veryfast;//编译速度
}
