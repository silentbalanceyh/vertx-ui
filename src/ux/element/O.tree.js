import U from "underscore";
import Abs from '../abyss';

const valueFlat = (field, item = {}) => {
    const result = {};
    // eslint-disable-next-line
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            const value = item[key];
            const targetKey = `${field}.${key}`;
            if (U.isObject(value) && !U.isArray(value)) {
                const merged = valueFlat(targetKey, value);
                Object.assign(result, merged);
            } else {
                result[targetKey] = value;
            }
        }
    }
    return result;
};
/**
 * ## 标准函数
 *
 * 梯度处理专用函数，函数执行流程
 *
 * 1. 先全部拉平，生成带`.`属性的对象（一层结构）。
 * 2. 按照拉平的属性名进行排序（顺序处理）。
 * 3. 然后执行**结构化**，将所有的`.`操作符移除。
 *
 * 最终目的是生成`Json`树。
 *
 * ```js
 * const config = {
 *     "optionJsx.item": 12,
 *     "optionItem.label": "标签",
 *     "field": "email",
 *     "optionItem.style.color": "red",
 *     "ajax.magic.params": {
 *         "name": "Lang",
 *         "age": 13
 *     }
 * }
 * const values = Ux.valueLadder(config);
 * ```
 *
 * 上述代码执行过后，会返回下边的结果：
 *
 * ```json
 * {
 *     "ajax":{
 *         "magic":{
 *             "params":{
 *                 "name": "Lang",
 *                 "age": 13
 *             }
 *         }
 *     },
 *     "field": "email",
 *     "optionItem":{
 *         "label": "标签",
 *         "style": {
 *             "color": "red"
 *         }
 *     },
 *     "optionJsx":{
 *         "item": 12
 *     }
 * }
 * ```
 *
 * @memberOf module:_value
 * @param {Object} item 输入对象处理
 * @return {Object} 返回最终构造的对象信息
 */
const valueLadder = (item = {}) => {
    // 1. 先拉平这个对象
    const processed = {};
    // 过滤$option专用
    Abs.itObject(item, (field, value) => {
        if (U.isObject(value) && !U.isArray(value)) {
            const item = valueFlat(field, value);
            Object.assign(processed, item);
        } else {
            processed[field] = value;
        }
    });
    // 2. Key从小到大排序
    let $item = Abs.immutable({});
    Object.keys(processed).sort((left, right) => left.length - right.length)
        .forEach(field => {
            if (0 < field.indexOf(".")) {
                $item = $item.setIn(field.split('.'), processed[field]);
            } else {
                $item = $item.set(field, processed[field]);
            }
        });
    return $item.toJS();
};
export default {
    valueLadder,
}