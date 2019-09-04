import U from 'underscore';
import Ux from "ux";

/**
 * 不重复追加值到`item`对象中（包含则不设置）
 * @method valueAppend
 * @param item 被设置的对象引用
 * @param field 设置的字段名
 * @param value 设置的字段值
 */
const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};

/**
 * 读取非undefined的值，去掉undefined值相关信息
 * @method valueValid
 * @param {Object} data
 * @param wild
 */
const valueValid = (data = {}, wild = false) => {
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
const valuePath = (data = {}, path) => {
    if ("string" !== typeof path) {
        console.error(data, path);
        throw new Error("[ Ux ] valuePath 要求第二个参数必须是 String 类型");
    }
    if (path.indexOf('.')) {
        const $data = Ux.immutable(data);
        const fullPath = path.split('.');
        const calculated = $data.getIn(fullPath);
        if (calculated) {
            /*
             * 拿到对象信息
             */
            if (U.isFunction(calculated.toJS)) {
                return calculated.toJS();
            } else {
                return calculated;
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
        return data[path];
    }
};
export default {
    valueAppend,
    valueValid,
    valuePath,
}