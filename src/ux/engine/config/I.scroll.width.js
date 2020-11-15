import Abs from "../../abyss";
import Wd from './I.scroll.word';

const widthObject = (input = {}) => {
    if (input) {
        let defaultWidth = 0;
        Object.keys(input).forEach(field => {
            const value = input[field];
            const calculated = Wd.widthWord(field) + Wd.widthWord(value) + 12; // ( " = " )
            if (defaultWidth < calculated) {
                defaultWidth = calculated;
            }
        });
        return defaultWidth;
    } else return 0;
}
const _widthFields = (input = []) => {
    let fields = [];
    input.forEach(child => {
        const keys = Object.keys(child);
        if (fields.length < keys.length) {
            fields = keys;
        }
    });
    return fields;
}
/*
 * Mount `__array` variable to column
 */
const _widthFieldsSub = (column = {}, fields = [], widthMap = {}) => {
    /*
     * 构造 `__array` 每一列的元数据，由于是数组列
     * 1）fields：当前表格存在的所有字段
     * 2）width：构造 `field = number`
     */
    const array = {};
    array.fields = fields;
    array.width = widthMap;

    /*
     * 计算 __array
     * {
     *     "fields": [],
     *     "width": {
     *         "field1": xxx,
     *         "field2": yyy
     *     }
     * }
     */
    const originalRef = column.__array;
    if (originalRef) {
        /*
         * 旧版本执行
         * 1. - fields 变化：直接替换
         * 2. - fields 不变化：计算最大的 width（单字段执行）
         */
        let fieldsPrev = originalRef.fields;
        if (!Abs.isArray(fieldsPrev)) {
            fieldsPrev = [];
        }
        if (fields.length > fieldsPrev.length) {
            /*
             * 「直接替换」字段发生变化
             */
            originalRef.fields = fields;  // 单独替换 fields
        }
        /*
         * `width` 计算
         */
        if (!originalRef.width) {
            originalRef.width = {};
        }
        /*
         * fields 计算
         */
        fields.forEach(field => {
            let fieldOld = originalRef.width[field];
            if (!fieldOld) {
                fieldOld = 0;
            }
            let fieldNew = widthMap[field];
            if (!fieldNew) {
                fieldNew = 0;
            }
            /*
             * 计算结果
             */
            if (fieldNew >= fieldOld) {
                originalRef.width[field] = widthMap[field];
            }
        });
    } else {
        /*
         * 「直接替换」第一次执行宽度设置
         */
        column.__array = array;
    }
}
const widthArray = (input, config = {}) => {
    if (input) {
        // 计算基础表渲染数据，当前列
        const fields = _widthFields(input);

        // 计算当前列的最大宽度，特殊变量
        let defaultWidth = 0;
        const widthMap = {};
        /*
         * 计算当前列的最大宽度
         * 1）先遍历列，计算每一列的最大宽度
         * 2）再遍历数据，不考虑 ["","",""] 的数据格式
         */
        fields.forEach(field => {
            /*
             * 当前列标题宽度
             */
            const widthTitle = Wd.widthWord(field, false);
            /*
             * 计算数据中的最大宽度
             */
            let widthColumn = 0;
            input.forEach(each => {
                const value = each[field];
                const widthRow = Wd.widthWord(value ? value : "", false);
                if (widthColumn < widthRow) {
                    widthColumn = widthRow;
                }
            });
            /*
             * 计算每列最大值
             */
            const current = Math.max(widthTitle, widthColumn);
            widthMap[field] = current + 12;
        });
        const {column = {}} = config;

        _widthFieldsSub(column, fields, widthMap);

        defaultWidth = Object.keys(column.__array.width)
            .map(key => column.__array.width[key])
            .reduce((left, right) => left + right, 0);

        return defaultWidth + 32;
    } else return 0;
}
const widthMix = (input, data = []) => {
    if (Abs.isArray(input)) {
        return widthArray(input, data);
    } else if (Abs.isObject(input)) {
        return widthObject(input);
    } else {
        return Wd.widthWord(input);
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
    let titleWidth = Wd.widthWord(title);
    if (column.sorter) {
        titleWidth += 24;
    }
    if (column.hasOwnProperty("$filter")) {
        titleWidth += 28;
    }
    return titleWidth;
};
const widthOption = (mapping = []) => {
    let defaultWidth = 0;
    mapping.forEach(each => {
        if ("string" === typeof each) {
            let calculated;
            if (0 < each.indexOf(',')) {
                calculated = Wd.widthWord(each.split(',')[0]);
                calculated += 8;
            } else {
                calculated = Wd.widthWord(each);
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
    widthWord: Wd.widthWord,
    // Row Data
    widthMax,
    // Object
    widthObject,
    // Array
    widthArray,
    // Title Append
    widthTitle,
}