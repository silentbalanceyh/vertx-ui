import U from "underscore";
import Ut from '../unity';
import Cv from '../constant';

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
 * @return {{}}
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
    const {config = {}} = props;
    const {format = Cv.XT_FORMAT.OBJECT} = config;
    if (Cv.XT_FORMAT.OBJECT === format) {
        /* 默认格式：OBJECT */
        return xtInitObject(props);
    } else if (Cv.XT_FORMAT.ARRAY === format) {
        /* 默认格式：ARRAY */
        return xtInitArray(props);
    } else if (Cv.XT_FORMAT.SET === format) {
        /* 特殊格式 */
        return [];
    }
}
export default {
    xtInitArray,
    xtInitObject,
    xtInitFormat,
};