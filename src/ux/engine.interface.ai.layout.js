// 导入当前目录
// 导入外层

import __Zi from 'zi';

/**
 * 「标准」 `Ux.aiLayout`
 *
 * @memberOf module:ai/zion
 * @param item
 * @param layout
 */
const aiLayout = (item, layout = {}) => __Zi.aiLayout(item, layout);
/**
 * 「标准」 `Ux.aiLayoutItem`
 *
 * @memberOf module:ai/zion
 * @param window
 * @param key
 * @returns {*}
 */
const aiLayoutItem = (window = 1, key) => __Zi.aiLayoutItem(window, key);
/**
 * 「标准」 `Ux.aiLayoutAdjust`
 *
 * @memberOf module:ai/zion
 * @param window
 * @returns {*}
 */
const aiLayoutAdjust = (window = 1) => __Zi.aiLayoutAdjust(window);

export default {
    aiLayout,
    aiLayoutItem,
    aiLayoutAdjust,
    /**
     * 「标准」 `Ux.aiAdjust`
     *
     * @memberOf module:ai/zion
     * @deprecated
     * @method aiAdjust
     * @param window
     * @returns {*}
     */
    aiAdjust: aiLayoutAdjust,
};