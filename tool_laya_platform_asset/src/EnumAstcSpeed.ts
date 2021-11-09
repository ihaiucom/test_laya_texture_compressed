
export enum EnumAstcSpeed {
    /**
     * Run codec in very-fast-mode; this generally results in substantial
     * quality loss.
     */
    veryfast = "-veryfast",
    /**
     * Run codec in fast-mode. This generally results in mild quality loss.
     */
    fast = "-fast",
    /**
     * Run codec in medium-speed-mode.
     */
    medium = "-medium",
    /**
     * Run codec in thorough-mode. This should be sufficient to fix most
     * cases where "-medium" provides inadequate quality.
     */
    thorough = "-thorough",
    /**
     * Run codec in exhaustive-mode. This usually produces only
     * marginally better quality than "-thorough" while considerably
     * increasing encode time.
     */
    exhaustive = "-exhaustive"
}