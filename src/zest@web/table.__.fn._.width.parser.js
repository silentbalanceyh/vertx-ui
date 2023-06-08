import __Zn, {_Ant} from './zero.module.dependency';
import __WD from './equip.fn.width.calculate';

const Cv = __Zn.Env;

const _widthObject = (input = {}) => {
    if (input) {
        let defaultWidth = 0;
        Object.keys(input).forEach(field => {
            const value = input[field];
            const calculated = __WD.widthWord(field) + __WD.widthWord(value) + 12; // ( " = " )
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
        if (__Zn.isObject(child)) {
            const keys = Object.keys(child);
            if (fields.length < keys.length) {
                fields = keys;
            }
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
        if (!__Zn.isArray(fieldsPrev)) {
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
const _widthArray = (input, config = {}) => {
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
            const widthTitle = __WD.widthWord(field, false);
            /*
             * 计算数据中的最大宽度
             */
            let widthColumn = 0;
            input.forEach(each => {
                const value = each[field];
                const widthRow = __WD.widthWord(value ? value : "", false);
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
const _widthMix = (input, data = []) => {
    if (__Zn.isArray(input)) {
        return _widthArray(input, data);
    } else if (__Zn.isObject(input)) {
        return _widthObject(input);
    } else {
        return __WD.widthWord(input);
    }
}
const _widthMax = (data = [], field = "", fnWidth = () => 0, column) => {
    let defaultWidth = 0;
    /*
     * 解决BUG：
     * Unhandled Rejection (TypeError): Cannot read property 'forEach' of null
     */
    data = __Zn.isArray(data) ? data : [];
    data.forEach(record => {
        // Fix Issue
        let literal = record[field];
        if (undefined === literal) {
            if (column && column.$empty) {
                literal = column.$empty;
            }
        }
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
const _widthOption = (mapping = []) => {
    let defaultWidth = 0;
    mapping.forEach(each => {
        if ("string" === typeof each) {
            let calculated;
            if (0 < each.indexOf(',')) {
                const segments = each.split(',');
                calculated = __WD.widthWord(segments[0]);
                calculated += 8;
                const size = __Zn.valueInt(segments[2], 0);
                calculated += size;
                // if (36 < size) {
                //     calculated += (size - __WD.widthSeed());
                // }
            } else {
                calculated = __WD.widthWord(each);
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
// ------------- 核心方法

const widthObject = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex, _widthObject);
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthArray = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex,
        _widthArray, column // 传入 column 引用，如果是 Array 可能会被更改
    );
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthText = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex,
        _widthMix, column // 传入 column 引用，如果是 Array 可能会被更改
    );
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthCurrency = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex, (input) => __WD.widthWord(__Zn.formatCurrency(input)));
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthMapping = (titleWidth = 0, column = {}, data = []) => {
    const mapping = Object.keys(column[Cv.K_NAME.V_COLUMN.MAPPING])
        .map(key => column[Cv.K_NAME.V_COLUMN.MAPPING][key]);
    const textWidth = _widthOption(mapping);
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthExecutor = (titleWidth = 0, column = {}, data = []) => {
    let width = 0;
    if (__Zn.isArray(column[Cv.K_NAME.V_COLUMN.OPTION])) {
        /*
         * 多个按钮操作
         */
        column[Cv.K_NAME.V_COLUMN.OPTION].forEach(opt => {
            if ("divider" === opt) {
                /*
                 * 分隔符操作
                 */
                width += __WD.widthSeed();
            } else {
                /*
                 * 计算每一个的文字，累加
                 */
                const single = __WD.widthWord(opt.text, false);
                width += single;
            }
        });
        width += 36;
    }
    return titleWidth > width ? titleWidth : width;
};
const widthUser = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = 160;      // 创建人默认（一个图标 + 4个字）
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDate = (titleWidth = 0, column = {}, data = []) => {
    let textWidth = 0;
    const format = column[Cv.K_NAME.V_COLUMN.FORMAT];
    if (0 < data.length) {
        data.map(record => record[column.dataIndex])
            .filter(value => !!value)
            .map(value => __Zn.valueDatetime(value, format))
            .filter(__Zn.isMoment)
            .map(value => value.format(format))
            .map(__WD.widthWord)
            .forEach(current => {
                if (textWidth < current) {
                    textWidth = current;
                }
            });
    } else {
        // 修正无数据的最小日期格式
        textWidth = __WD.widthWord(format);
    }
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDatum = (titleWidth = 0, column = {}, data = [], reference) => {
    const options = _Ant.toUnique(reference, {datum: column[Cv.K_NAME.V_COLUMN.DATUM]});
    const source = options.data;
    const {value, display} = options.config;
    let textWidth = 0;
    data.map(record => record[column.dataIndex])
        .filter(value => !!value)
        .map(text => __Zn.elementUnique(source, value, text))
        .filter(found => !!found)
        .map(found => __Zn.valueExpr(display, found, true))
        .map(__WD.widthWord)
        .forEach(current => {
            if (textWidth < current) {
                /*
                 * 暂时使用固定值，防止越界
                 */
                textWidth = current;
            }
        });
    textWidth += 32;        // 引入24的修正值
    return titleWidth > textWidth ? titleWidth : textWidth;
};
export default {
    "EXECUTOR": widthExecutor,
    "TEXT": widthText,
    "CURRENCY": widthCurrency,
    "INPUT": widthText,
    "LOGICAL": widthMapping,
    "MAPPING": widthMapping,
    "USER": widthUser,
    "DATE": widthDate,
    "DATUM": widthDatum,
    "OBJECT": widthObject,
    "ARRAY": widthArray,
    "RENDERS": widthText,
};