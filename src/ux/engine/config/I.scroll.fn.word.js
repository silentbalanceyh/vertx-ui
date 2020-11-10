import Abs from "../../abyss";
import Cv from "../../constant";

const widthSeed = () => {
    const fontSize = Cv.CSS_FONT;       // 默认的字体值
    if (fontSize) {
        if (0 <= fontSize.indexOf("12")) {
            return 12;          // 12px;
        } else if (0 <= fontSize.indexOf("13")) {
            return 13;          // 13px;
        } else {
            return 14;          // 14px;
        }
    } else {
        return 14;              // 14px;
    }
}

export default (input, isPadding = true) => {
    let length = 0;
    if ("string" !== typeof input) {
        return 0;
    } else {
        for (let idx = 0; idx < input.length; idx++) {
            const code = input.charCodeAt(idx);
            const str = String(input.charAt(idx));
            const seed = widthSeed();
            if (Abs.isCn(str)) {
                /*
                 * 中文字符长度
                 * 中文是方块字，宽度完全统一
                 */
                length += seed;
            } else {
                if (48 <= code && code <= 57) {
                    /*
                     * 数字
                     */
                    length += (seed / 5 * 4);
                } else if (65 <= code && code <= 90) {
                    /*
                     * 大写字母
                     */
                    length += (seed / 4 * 3);
                } else if (97 <= code && code <= 122) {
                    /*
                     * 小写字母
                     */
                    length += (seed / 2);
                } else {
                    /*
                     * 特殊字符
                     */
                    const widthCh = Abs.immutable([
                        "@", "-", "/", " ", ":", ","
                    ])
                    if ("." === str) {
                        length += 1;
                    } else if (widthCh.contains(str)) {
                        length += (seed / 3 * 2);
                    }
                    // length += seed;
                }
            }
        }
        return isPadding ? (length + 32) : length; // 边距 16px
    }
}