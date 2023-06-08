import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

// widthSeed / widthWord
const widthSeed = () => {
    const fontSize = Cv['CSS_FONT'];       // 默认的字体值
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
const widthWord = (input, isPadding = true) => {
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

            if (__Zn.isCn(str) || [
                "：",    // 中文冒号
                "，",    // 中文逗号
                "。",    // 中文句号
                "；",    // 中文分号
                "（",    // 中文左括号
                "）",    // 中文右括号
            ].includes(str)) {
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
                    if ([
                        ".",    // 点符号
                        ":",    // 冒号
                    ].includes(str)) {
                        length += 1;
                    } else if ([
                        "@",    // 邮件格式
                        "-",    // 时间中线
                        "/",    // 路径
                        " ",    // 空白
                        ";",    // 分号
                        ",",    // 逗号
                        "_",    // 下划线
                        "=",    // 等号
                    ].includes(str)) {
                        length += (seed / 3 * 2);
                    } else {
                        // length += seed;
                    }
                }
            }
        }
        length = __Zn.valueInt(length);                  // 转换成整数
        return isPadding ? (length + 32) : length;  // 边距 16px
    }
}
const widthTitle = (title = "", column = {}) => {
    let titleWidth = widthWord(title);
    if (column.sorter) {
        titleWidth += 24;
    }
    if (column.hasOwnProperty(Cv.K_NAME.V_COLUMN.FILTER)) {
        titleWidth += 28;
    }
    return titleWidth;
};
export default {
    widthSeed,
    widthWord,
    widthTitle
}