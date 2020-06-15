import U from 'underscore';
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * 不重复追加值到`item`对象中（包含则不设置）
 *
 * 框架内部的使用代码如：
 *
 * ```js
 *
 *     const {$clear, form} = reference.props;
 *     // 记录切换：从更新表单 -> 添加表单切换
 *     if ($clear && $clear.is()) {
 *          const keys = $clear.to();
 *          keys.forEach(key => Value.valueAppend(data, key, undefined));
 *     }
 * ```
 *
 * @memberOf module:_value
 * @param {Object} item 被设置的对象引用
 * @param {String} field 将要设置的字段名
 * @param {any} value 将要设置的字段值
 */
const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};

/**
 * ## 标准函数
 *
 * 将输入数据处理成合法对象，两种模式处理对象Object，由于后端无法识别某些值，所以执行下边处理
 *
 * 1. 宽模式，0, null, undefined，false 都会被移除，包括 ""。
 * 2. 严格模式，仅移除 undefined，其他的保留。
 *
 * @memberOf module:_value
 * @param {Object} data 输入的Object对象。
 * @param {boolean} wild 是否使用宽模式。
 * @returns {Object} 返回处理好的数据。
 */
const valueValid = (data = {}, wild = false) => {
    // eslint-disable-next-line
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (U.isArray(value)) {
                value.forEach(item => valueValid(item, wild));
            } else if (U.isObject(value)) {
                valueValid(value, wild);
            } else {
                if (wild) {
                    // 空字符串、0，以及其他值
                    if (!value) {
                        delete data[key];
                    }
                } else {
                    if (undefined === value) {
                        delete data[key];
                    }
                }
            }
        }
    }
    return data;
};
/**
 * ## 标准函数
 *
 * 对象树检索专用函数，可根据 path 检索对象树
 *
 * ```js
 * const user = {
 *     "teacher":{
 *         "son":{
 *             "username": "Lang"
 *         }
 *     }
 * }
 * const son = Ux.valuePath(user, "teacher.son");
 * const username = Ux.valuePath(user, "teacher.son.username");
 * ```
 *
 * @memberOf module:_value
 * @param {Object} data 将要搜索的对象。
 * @param {String} path 路径必须是一个字符串，并且包含`.`格式。
 * @return {null|any} 返回最终搜索到的值，否则为 null。
 */
const valuePath = (data = {}, path) => {
    if ("string" !== typeof path) {
        console.error(data, path);
        throw new Error("[ Ux ] valuePath 要求第二个参数必须是 String 类型");
    }
    if (path.indexOf('.')) {
        const $data = Abs.immutable(data);
        const fullPath = path.split('.');
        const calculated = $data.getIn(fullPath);
        if (calculated) {
            /*
             * 拿到对象信息
             */
            if (U.isFunction(calculated.toJS)) {
                const value = calculated.toJS();
                if (undefined === value) {
                    return null;
                } else {
                    return value;
                }
            } else {
                if (undefined === calculated) {
                    return null;
                } else {
                    return calculated;
                }
            }
        } else {
            /*
             * 搜索到的值是undefined
             */
            return null;
        }
    } else {
        /*
         * 读取不带表达式字段的值
         */
        const value = data[path];
        if (undefined === value) {
            return null;
        } else {
            return value;
        }
    }
};
export default {
    valueAppend,
    valueValid,
    valuePath,
}