import U from "underscore";
import Abs from '../abyss';
import Ut from '../unity';

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
 * ## 标准函数
 *
 * * 如果属性 props 中存在 `value` 变量，则返回该值。
 * * 如果属性 props 中不存在 `value` 变量，则返回 `{}`。
 *
 * 返回结构：
 *
 * ```json
 * {
 *     "...":"数据内容"
 * }
 * ```
 *
 * @deprecated 未来使用`xtInitObject`替换。
 * @memberOf module:_xt
 * @param {Props} props React属性信息。
 * @return {any|{}} 返回初始值。
 */
const xtInit = (props = {}) => (props.value || {});
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
 * ## 标准函数
 *
 * 内部使用特殊信息，可选择初始化行数，默认生成：
 *
 * ```json
 * {
 *     dataSource: {
 *         "key1": {},
 *         "key2": {},
 *         "key3": {},
 *         "...": "其他记录集"
 *     }
 * }
 * ```
 *
 * @memberOf module:_xt
 * @param {Props} props React属性信息。
 * @param {Number} records 初始化的数据记录值，默认为2.
 * @return {Object} 返回特殊结构。
 */
const xtInitSource = (props = {}, records = 2) => {
    const {source = []} = props;
    const keys = source.map(item => item.key);
    // 读取旧数据
    const state = xtInit(props);
    // 使用keys先过滤
    const $state = {};
    const $keys = Abs.immutable(keys);
    Object.keys(state).filter(key => $keys.contains(key))
        .forEach(key => $state[key] = state[key]);
    // 其次执行操作
    keys.forEach(key => {
        if (!U.isArray($state[key])) {
            let item = [];
            for (let idx = 0; idx < records; idx++) {
                item.push({key: Ut.randomUUID()});
            }
            $state[key] = item;
        }
    });
    // initSource的核心，就是包含了一个dataSource节点
    return {dataSource: $state};
};
export default {
    xtInitSource,
    xtInitArray,
    xtInit,
    xtInitObject
};