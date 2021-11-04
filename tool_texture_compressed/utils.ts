import {createHash,Hash} from "crypto";
import {readFileSync} from "fs";

export class Utils
{
    constructor()
    {

    }

    public GetMD5ByFile(file: string): string
    {
        let md5: string;
        let hash: Hash = createHash("md5");
        let image = readFileSync(file);
        hash.update(image);
        md5 = hash.digest("hex").toUpperCase();
        return md5;
    }

    public GetMd5ByString(cmd: string): string
    {
        let md5: string;
        let hash: Hash = createHash("md5");
        hash.update(cmd);
        md5 = hash.digest("hex").toUpperCase();
        return md5;
    }
}