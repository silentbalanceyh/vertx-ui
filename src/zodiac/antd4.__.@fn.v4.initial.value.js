import __Zn from './zero.module.dependency';
import __Pr from './source.fn.parse.transformer';

const Cv = __Zn.Env;
// value = undefined
const __v4Choice = (item, value, cell = {}) => {
    // 值为 undefined，检查 valuePropName = checked
    /*
    * 非多选模式下的 boolean 值转 false的问题处理
    * 一般配置了 valuePropName = "checked" 证明是布尔类型组件
    * 而此时如果 initialValue 不是 Array 的话，若是 undefined
    * 直接在此处转换成 false 以确认其组件状态正常
    */
    const {optionConfig = {}, optionJsx = {}} = cell;
    const {valuePropName} = optionConfig;
    const {config = {}} = optionJsx;
    const {
        datum,
        items,
    } = config;
    if (datum) {
        // 字典类，跳过
        return;
    }
    if (items) {
        if (1 < items.length) {
            // 非字典类，长度大于1时跳过
            // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQLH
            if ("checked" === valuePropName && __Zn.isArray(value)) {
                if (2 === items.length) {
                    // 仅仅两个选项的时候，直接取第一个
                    item.initialValue = value.map(item => {
                        if ("boolean" === typeof (item)) {
                            return String(item);
                        } else {
                            return item;
                        }
                    });
                } else {
                    item.initialValue = value;
                }
            }
            // console.log(item.label, item.initialValue, valuePropName, items, value);
        }
    } else {
        item.valuePropName = valuePropName;
        // 单独的 checkbox
        if (undefined === value) {
            if ("checked" === valuePropName) {
                // 修复 Checkbox.Group
                item.initialValue = false;
            }
        } else {
            item.initialValue = value;
        }
    }
}

const __v4Object = (value = {}, reference) => {
    const {$delay = false, expression = ""} = value;
    if ($delay) {
        /* 解析 */
        return __Pr.parseValue(expression, reference);
    } else {
        /* 原样 */
        return value;
    }
}
const __v4Value = (value = {}, cell = {}) => {
    if (cell.moment) {
        /* ACL 控制，维持原值，保证更新 */
        if (Cv.FORBIDDEN === value) {
            return __Zn.valueDatetime("9999-01-01");
        } else {
            return __Zn.valueDatetime(value);
        }
    } else {
        /* 原样 */
        return value;
    }
}
export default (item = {}, configuration = {}) => {
    const {
        values = {},
        cell = {},
        reference
    } = configuration;
    /*
     * 1. 先根据路径提取初始值
     * 2. 再根据类型执行转换
     * 3. 单元素判断处理
     * -- 时间
     * -- ACL
     */
    const expr = cell.field;
    // 初期计算当前字段值
    let value;
    if (expr) {
        if (0 < expr.indexOf(".")) {
            // 字段名为 field = user.name 这种
            const path = expr.split(".");
            value = __Zn.immutable(values).getIn(path);
        } else if (values.hasOwnProperty(expr)) {
            // 字段名为 field = username 这种
            value = values[expr];
        }
        // Fix: https://e.gitee.com/wei-code/issues/table?issue=I6ZH5Q
        if (undefined !== value) {
            // 有值
            if (__Zn.isObject(value)) {
                // Object: 1) ( $delay, expression ); 2) Object
                value = __v4Object(value, reference);
            } else if (__Zn.isArray(value)) {
                // Array
                const valueArr = [];
                value.forEach(item => valueArr.push(__v4Value(item, cell)));
                value = valueArr;
            } else {
                // 纯值
                value = __v4Value(value, cell);
            }
            item.initialValue = value;
        } else {
            // 考虑时间库
            if (cell.moment) {
                item.initialValue = null;   // null 替换 undefined
            }
            // value = undefined
        }
        // CheckBox / Radio
        __v4Choice(item, value, cell);
    }
}