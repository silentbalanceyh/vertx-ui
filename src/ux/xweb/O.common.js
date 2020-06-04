import Cv from "../constant";
import Abs from '../abyss';
import U from "underscore";
import Ut from "../unity";

/**
 * ## 标准函数
 *
 * 新版中的`UNSAFE_componentWillReceiveProps(nextProps,context)`的内部调用，虽然不提倡使用，
 * 但在自定义组件中，该函数依然会控制内部状态变更，所以依旧采用该方法。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Props} nextProps 下一个属性。
 */
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};

const xtValue = (reference, consumer) => {
    const {config = {}} = reference.props;
    const originalFormat = config.format ? config.format : Cv.XT_FORMAT.OBJECT;
    const state = reference.state ? Abs.clone(reference.state) : {};
    let data = state.data;
    /* 计算简单format */
    let hitFormat;
    if ("string" === typeof originalFormat) {
        hitFormat = originalFormat;
    } else {
        const {type} = originalFormat;
        hitFormat = type ? type : Cv.XT_FORMAT.OBJECT;
    }
    // Dev.dgDebug({format: hitFormat}, "自定义组件选择数据格式")
    if (Cv.XT_FORMAT.OBJECT === hitFormat) {
        if (Abs.isArray(data) || undefined === data) {
            throw new Error("格式和数据异常，状态格式：Array，定义格式：Object。");
        } else {
            return consumer.object(data);
        }
    } else if (Cv.XT_FORMAT.ARRAY === hitFormat) {
        if (Abs.isArray(data) || undefined === data) {
            return consumer.array(data);
        } else {
            throw new Error("格式和数据异常，状态格式：Object，定义格式：Array。");
        }
    } else if (Cv.XT_FORMAT.ARRAY_PURE === hitFormat) {
        return consumer.arrayPure(data);
    } else if (Cv.XT_FORMAT.ARRAY_MAP === hitFormat) {
        /* 两种格式都支持 */
        return consumer.arrayMap(data);
    } else if (Cv.XT_FORMAT.ARRAY_GROUP === hitFormat) {

    }
}
/**
 * ## 标准函数
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {String} field 读取字段的数据（只适用于OBJECT类型）。
 * @return {Object} 返回最终状态信息。
 */
const xtGet = (reference, field) => {
    return xtValue(reference, {
        object: (data) => {
            if (data) {
                return field ? data[field] : data;
            } else return data;
        },
        array: (data) => field ? data
            .filter(Abs.isObject)
            .map(item => item[field]) : data,
        arrayMap: (data) => field ? data
            .filter(Abs.isObject)
            .map(item => item[field]) : data,
        set: (data) => data ? data : []
    })
};
/**
 * ## 标准函数
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Array} name 读取字段的数据（只适用于OBJECT类型）。
 * @param {any} value 设置的任何值。
 * @return {Object} 返回最终状态信息。
 */
const xtSet = (reference, name, value) => {
    let field;
    let index = -1;
    if ("string" === typeof name) {
        field = name;
    } else if (Abs.isArray(name)) {
        field = name[0];
        index = undefined !== name[1] ? name[1] : -1;
    } else if ("number" === typeof name) {
        index = name;
    }
    return xtValue(reference, {
        object: data => {
            if (data) {
                data[field] = value;
            }
            return data;
        },
        array: data => {
            const ref = data[index] ? data[index] : null;
            if (ref) {
                ref[field] = value;
            }
            return data;
        },
        arrayPure: data => {
            data[index] = value;
            return data;
        },
        arrayMap: (data) => {
            data = Abs.clone(data);
            const objRef = data[index];
            if (objRef) {
                objRef[field] = value;
            }
            return data;
        }
    })
};

/**
 * ## 标准函数
 *
 * * 如果属性 props 中存在 `value` 变量，则返回该值。
 * * 如果属性 props 中不存在 `value` 变量，则返回 `{}`。
 *
 * @memberOf module:_xt
 * @param {Props} props React属性信息。
 * @return {Object} 返回初始值。
 */
const xtInitObject = (props = {}) => {
    const values = {};
    const value = props.value;
    if (value) {
        values.data = value;
    } else {
        // 默认对象
        values.data = {};
    }
    return values;
};
/**
 *
 * ## 标准函数
 *
 * * 如果属性 props 中存在 `value` 变量
 *      * value本身是一个 Array，直接使用该 Array 初始化（步骤2）。
 *      * value本身是一个 Object，则使用 `value.data` 执行初始化（步骤2）。
 * * 如果属性 props 中不存在 `value` 变量。
 *      * 如果允许空数组，则使用`{data:[]}`。
 *      * 如果不允许空数组，则使用`{data:[{key:"uuid"}]}`。
 *
 * 返回结构：
 *
 * ```json
 * {
 *     "empty模式": {
 *         data: []
 *     },
 *     "非empty模式": {
 *         data: [
 *             {
 *                 key: "ef78bf10-4db7-49d1-910d-96bc7eaad3c3"
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * @memberOf module:_xt
 * @param {Props} props React属性信息。
 * @param {boolean} empty 是否使用空数组作为初始值。
 * @return {Array}
 */
const xtInitArray = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        values.data = U.isArray(value) && value.length > 0 ? value : (U.isArray(value.data) ? value.data :
            ((empty) ? [] : [{key: Ut.randomUUID()}]));
    } else {
        values.data = ((empty) ? [] : [{key: Ut.randomUUID()}]);
    }
    return values;
};

/**
 * ## 标准函数
 *
 * @memberOf module:_xt
 * @param {Props} props React属性信息。
 * @param {boolean} empty 是否使用空数组作为初始值。
 * @return {Object}
 */
const xtInitArrayMap = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        // 构造存在的数组信息
        const normalized = [];
        const {config = {}} = props;
        const {format = {}} = config;
        const {keyField} = format;
        Object.keys(value).forEach(key => {
            const item = Abs.clone(value[key]);
            if (keyField) {
                item[keyField] = key;
            }
            item.key = Ut.randomUUID();
            item._key = key;
            normalized.push(item);
        });
        values.data = normalized;
        return values;
    } else return xtInitArray(props, empty);
}
/**
 *
 * ## 标准函数
 *
 * 双格式处理
 *
 * ```json
 * {
 *     "Array直接格式":[],
 *     "Json格式":{}
 * }
 * ```
 *
 * @memberOf module:_xt
 * @param {Props} props React属性信息
 * @return {{}}
 */
const xtInitFormat = (props = {}) => {
    return xtValue({props}, {
        object: () => xtInitObject(props),
        array: () => xtInitArray(props),
        arrayPure: () => [],
        arrayMap: () => xtInitArrayMap(props),
        arrayGroup: () => ({})
    });
}
const xtFormat = (internal = [], format) => {
    /* 如果 format 不存在则直接返回 */
    const normalized = Abs.clone(internal);
    if (format) {
        const formatted = {};
        if ("string" === typeof format) {
            formatted.type = format;
        } else {
            Object.assign(formatted, format);
        }
        /* format 格式化过后 */
        if (Cv.XT_FORMAT.OBJECT === formatted.type
            || Cv.XT_FORMAT.ARRAY_PURE === formatted.type) {
            return normalized;
        } else if (Cv.XT_FORMAT.ARRAY === formatted.type) {
            if ("key" !== formatted.keyField) {
                normalized.forEach(item => {
                    item.key = item[formatted.keyField];
                });
            }
            return normalized;
        } else if (Cv.XT_FORMAT.ARRAY_MAP === formatted.type) {
            const grouped = formatted.keyField ? formatted.keyField : "key";
            const result = {};
            normalized.forEach(item => {
                const key = item[grouped];
                if (key) {
                    const $item = Abs.clone(item);
                    if ("key" !== grouped) {
                        delete $item.key;
                    }
                    delete $item[grouped];
                    result[key] = $item;
                }
            });
            return result;
        }
    } else return normalized;
}
export default {
    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
    xtSet,
    xtFormat,

    xtInitObject,
    xtInitArray,
    xtInitArrayMap,
    xtInitFormat,
};