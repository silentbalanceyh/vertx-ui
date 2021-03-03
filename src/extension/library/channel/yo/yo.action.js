import U from 'underscore';
import yoAmbient from './yo.ambient';

/**
 * ## 扩展函数
 *
 * 按钮和操作专用，`ExAction/ExButton` 专用的处理。
 *
 * 按钮专用过滤函数，主要过滤几种：
 *
 * 1. Open区
 * 2. Batch区
 * 3. Search区
 * 4. Extra区
 * 5. Row区
 *
 * 扩展区域
 *
 * @memberOf module:_channel
 * @method yoAction
 * @param {ReactComponent} reference React对应组件引用
 * @param {String} prefix 操作前缀
 * @param {Object} ordered 排序专用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
export default (reference, prefix = "", ordered) => {
    /*
     * 环境数据
     */
    const attrs = yoAmbient(reference);
    /*
     * 配置数据
     */
    const {op = {}} = reference.state;
    /*
     * 前缀处理
     */
    if (ordered) {
        /*
         * 有序排列
         */
        const buttons = ordered[prefix];
        if (U.isArray(buttons) && 0 < buttons.length) {
            /* 按顺序读取，几个不同区域的配置 */
            attrs.config = buttons.map(key => op[key])
                .filter(item => !!item);
        }
    } else {
        /*
         * 无序排列
         */
        attrs.config = Object.keys(op)
            .filter(opKey => opKey.startsWith(prefix))
            .map(opKey => op[opKey])
            .filter(item => !!item);
    }
    return attrs;    // 去掉 undefined;
}