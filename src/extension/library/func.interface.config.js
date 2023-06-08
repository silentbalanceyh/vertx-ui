import __Zu from 'zet';

/**
 * ## 「配置」`Ex.configColumn`
 *
 * 表格列扩展配置。
 *
 * @memberOf module:config/utter
 * @param {Array} original 原始列配置
 * @param {Object} config 表格专用输入配置
 * @returns {Array} 返回处理过后的列配置
 */
const configColumn = (original = [], config = {}) =>
    __Zu.configColumn(original, config);
/**
 * ## 「配置」`Ex.configGrid`
 *
 * Grid布局扩展配置。
 *
 * @memberOf module:config/utter
 * @param {Array<Array>} grid 矩阵专用扩展Grid布局配置
 * @param {Object} control 控件表
 * @param {String} prefix 前缀信息，用于识别组件的key专用
 * @returns {Array} 返回最终布局
 */
const configGrid = (grid = [], control = {}, prefix) =>
    __Zu.configGrid(grid, control, prefix);
/**
 * ## 「配置」`Ex.configRelation`
 *
 * 关系扩展配置，data 中的数据结构：
 *
 * ```json
 * {
 *     "up": [],
 *     "down": []
 * }
 * ```
 *
 * @memberOf module:config/utter
 * @param {Object} data 基本数据信息
 * @param {Object} config 关系完整配置
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Object} 最终的关系配置数据信息
 */
const configRelation = (data = {}, config = {}, reference) =>
    __Zu.configRelation(data, config, reference);

/**
 * ## 「配置」`Ex.configClick`
 *
 * 按钮扩展配置。
 *
 * @memberOf module:config/utter
 * @param {Object} config 按钮完整配置
 * @param {Object|ReactComponent} reference React对应组件引用
 * @returns {Function} 返回需要绑定的执行函数
 */
const configClick = (config = {}, reference) =>
    __Zu.configClick(config, reference);

/**
 * ## 「配置」`Ex.configDialog`
 *
 * 窗口扩展配置
 *
 * Button / Link 中的 Dialog专用配置，直接的 Dialog不需要配置
 * 转换处理，Dialog的基础配置直接放到 config 变量中
 *
 * 返回数据格式如：
 *
 * ```json
 * {
 *      button: "按钮基本配置",
 *      dialog: "关联窗口配置",
 *      component: "按钮关联组件",
 *      componentConfig: "关联组件配置"
 * }
 * ```
 * @memberOf module:config/utter
 * @param {Object} input 基本输入配置
 * @returns {Object} 返回构造好的配置
 */
const configDialog = (input = {}) =>
    __Zu.configDialog(input);
export default {
    configClick,
    configDialog,
    configColumn,
    configGrid,
    configRelation,
}