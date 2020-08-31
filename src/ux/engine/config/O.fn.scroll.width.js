import Abs from "../../abyss";

const widthWord = (input) => {
    let length = 0;
    if ("string" !== typeof input) {
        return 0;
    } else {
        for (let idx = 0; idx < input.length; idx++) {
            const code = input.charCodeAt(idx);
            const str = String(input.charAt(idx));
            if (Abs.isCn(str)) {
                /*
                 * 中文字符长度
                 * 中文是方块字，宽度完全统一
                 */
                length += 24;
            } else {
                if (65 <= code && code <= 90) {
                    /*
                     * 大写字母
                     */
                    length += 14;
                } else if (97 <= code && code <= 122) {
                    /*
                     * 小写字母
                     */
                    length += 11;
                } else {
                    /*
                     * 特殊字符
                     */
                    length += 13;
                }
            }
        }
        return length;
    }
}
const widthObject = (input = {}) => {
    if (input) {
        let defaultWidth = 0;
        Object.keys(input).forEach(field => {
            const value = input[field];
            const calculated = widthWord(field) + widthWord(value) + 12; // ( " = " )
            if (defaultWidth < calculated) {
                defaultWidth = calculated;
            }
        });
        return defaultWidth;
    } else return 0;
}
const widthArray = (input, config = {}) => {
    if (input) {
        // 计算基础表渲染数据，当前列
        const {column = {}} = config;
        let fields = [];
        input.forEach(child => {
            const keys = Object.keys(child);
            if (fields.length < keys.length) {
                fields = keys;
            }
        });
        const array = {};
        array.fields = fields;
        // 计算当前列的最大宽度
        let defaultWidth = 0;
        const widthMap = {};
        input.forEach(each => {
            let calculated = 0;
            if ("string" === typeof each) {
                calculated = widthWord(each);
            } else {
                /*
                 * Title 和 Value 同时计算
                 */
                Object.keys(each).forEach(field => {
                    const value = each[field];
                    const titleWidth = widthWord(field);
                    const valueWidth = widthWord(value ? value : "");
                    const current = Math.max(titleWidth, valueWidth);
                    calculated += current;
                    /*
                     * 计算每列最大值
                     */
                    if (widthMap.hasOwnProperty(field)) {
                        if (widthMap[field] < current) {
                            // 修正12的长度
                            widthMap[field] = current;
                        }
                    } else {
                        widthMap[field] = current;
                    }
                })
            }
            if (defaultWidth < calculated) {
                defaultWidth = calculated;
            }
        });
        array.width = widthMap;
        /*
         * 合并 __array
         */
        const arrayOriginal = column.__array;
        if (arrayOriginal) {
            /*
             * 原始处理专用
             */
            if (array.fields.length > arrayOriginal.fields.length) {
                column.__array = array;
            }
        } else {
            column.__array = array;
        }
        return defaultWidth;
    } else return 0;
}
const widthMix = (input, data = []) => {
    if (Abs.isArray(input)) {
        return widthArray(input, data);
    } else if (Abs.isObject(input)) {
        return widthObject(input);
    } else {
        return widthWord(input);
    }
}
const widthMax = (data = [], field = "", fnWidth = () => 0, column) => {
    let defaultWidth = 0;
    data.forEach(record => {
        const literal = record[field];
        let calculated;
        if (literal) {
            calculated = fnWidth(literal, {
                // 计算宽度专用，field 字段名，data 所有记录集
                field, data, column
            });
        } else {
            calculated = 0;
        }
        if (defaultWidth < calculated) {
            defaultWidth = calculated;
        }
    });
    return defaultWidth;
}

const widthTitle = (title = "", column = {}) => {
    let titleWidth = widthWord(title);
    if (column.sorter) {
        titleWidth += 32;
    }
    if (column.hasOwnProperty("$filter")) {
        titleWidth += 32;
    }
    return titleWidth;
};
const widthOption = (mapping = []) => {
    let defaultWidth = 0;
    mapping.forEach(each => {
        if ("string" === typeof each) {
            let calculated;
            if (0 < each.indexOf(',')) {
                calculated = widthWord(each.split(',')[0]);
                calculated += 8;
            } else {
                calculated = widthWord(each);
            }
            if (defaultWidth < calculated) {
                defaultWidth = calculated;
            }
        } else {
            defaultWidth = 0;
        }
    });
    return defaultWidth;
}
export default {
    // 宽度更改
    widthOption,
    // 混合模式
    widthMix,
    // String
    widthWord,
    // Row Data
    widthMax,
    // Object
    widthObject,
    // Array
    widthArray,
    // Title Append
    widthTitle,
}