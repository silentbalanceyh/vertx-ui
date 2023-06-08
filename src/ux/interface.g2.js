import __Zn from 'zs';

/**
 * ## 「标准」`Ux.g2Chart`
 *
 * ### 1. 详细配置
 *
 * 配置详细数据结构
 *
 * {
 *     "chart": {},         // 图配置
 *     "tooltip": {},       // Tooltip配置
 *     "interval": {},      // 图呈现专用配置
 * }
 *
 * @memberOf module:g2/zest
 * @param id {String} 图元关联的Div元素id
 * @param config {any} 配置属性
 */
const g2Chart = (id, config = {}) =>
    __Zn.g2Chart(id, config);
/**
 * ## 「标准」`Ux.g2Pie`
 *
 * @memberOf module:g2/zest
 * @param $g
 * @param config
 */
const g2Pie = ($g, config = {}) =>
    __Zn.g2Pie($g, config);
/**
 * ## 「标准」`Ux.g2Line`
 *
 * @memberOf module:g2/zest
 * @param $g
 * @param config
 */
const g2Line = ($g, config = {}) =>
    __Zn.g2Line($g, config);
/**
 * ## 「标准」`Ux.g2Bar`
 *
 * @memberOf module:g2/zest
 * @param $g
 * @param config
 */
const g2Bar = ($g, config = {}) =>
    __Zn.g2Bar($g, config);
/**
 * ## 「标准」`Ux.g2Draw`
 *
 * @memberOf module:g2/zest
 * @param $g
 * @param data
 * @param config
 */
const g2Draw = ($g, data = [], config = {}) =>
    __Zn.g2Draw($g, data, config);
/**
 * ## 「标准」`Ux.g2ScaleMax`
 *
 * @memberOf module:g2/zest
 * @param data
 * @param field
 * @param ratio
 * @returns {*}
 */
const g2ScaleMax = (data = [], field = "value", ratio = 0.8) =>
    __Zn.g2ScaleMax(data, field, ratio);
/**
 * ## 「标准」`Ux.g2Broken`
 *
 * @memberOf module:g2/zest
 * @param $g
 * @param config
 */
const g2Broken = ($g, config = {}) =>
    __Zn.g2Broken($g, config);
/**
 * ## 「标准」`Ux.g2MoreLine`
 *
 * @memberOf module:g2/zest
 * @param $g
 * @param config
 */
const g2MoreLine = ($g, config = {}) =>
    __Zn.g2MoreLine($g, config);

export default {
    // 创建图引用
    g2Chart,
    // Pie
    g2Pie,          // Pie
    g2Bar,          // Bar
    g2Line,         // Line
    g2Broken,       // Broken
    g2MoreLine,     // MoreLine
    // 图更新
    g2Draw,
    g2ScaleMax,
}