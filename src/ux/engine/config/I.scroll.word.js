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

export default {
    widthSeed,
    widthWord: (input, isPadding = true) => {
        let length = 0;
        if ("string" !== typeof input) {
            return 0;
        } else {
            for (let idx = 0; idx < input.length; idx++) {
                const code = input.charCodeAt(idx);
                const str = String(input.charAt(idx));
                const seed = widthSeed();

                /*
                 * 特殊字符
                 */
                const widthEn = Abs.immutable([
                    "@",    // 邮件格式
                    "-",    // 时间中线
                    "/",    // 路径
                    " ",    // 空白
                    ";",    // 分号
                    ",",    // 逗号
                    "_",    // 下划线
                    "=",    // 等号
                ])
                const width1Px = Abs.immutable([
                    ".",    // 点符号
                    ":",    // 冒号
                ])

                const widthCn = Abs.immutable([
                    "：",    // 中文冒号
                    "，",    // 中文逗号
                    "。",    // 中文句号
                    "；",    // 中文分号
                ])

                if (Abs.isCn(str) || widthCn.contains(str)) {
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
                        length += (seed / 6 * 5);
                    } else if (65 <= code && code <= 90) {
                        /*
                         * 大写字母
                         */
                        length += (seed / 4 * 3);
                    } else if (97 <= code && code <= 122) {
                        /*
                         * 小写字母
                         */
                        length += (seed / 3 * 2);
                    } else {
                        if (width1Px.contains(str)) {
                            length += 1;
                        } else if (widthEn.contains(str)) {
                            length += (seed / 2);
                        } else {
                            // length += seed;
                        }
                    }
                }
            }
            length = parseInt(length);                  // 转换成整数
            return isPadding ? (length + 32) : length;  // 边距 16px
        }
    }
}