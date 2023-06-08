import __Zn from 'zone';
import __Zs from 'zs';

/**
 * ## 「标准」`Ux.connectId`
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 使用外围的代码触发`onClick`操作，点击`id`相匹配的元素。
 *
 * @memberOf module:atomic/zone
 * @param {String} id 触发id的点击事件。
 */
function connectId(id) {
    return __Zn.connectId(id);
}

/**
 * ## 「标准」`Ux.connectItem`
 *
 * 为表中的`<Item/>`设置验证修饰效果。
 *
 * @memberOf module:atomic/zest
 * @param {Object} cell 字段配置
 * @returns {Object} 返回执行过后的结果
 */
const connectItem = (cell = {}) =>
    __Zs.connectItem(cell);
export default {
    connectId,
    connectItem,
};