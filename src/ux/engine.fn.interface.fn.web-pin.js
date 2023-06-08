import __Zi from 'zi';

/**
 * ## 「标准」`Ux.anchorColumn`
 *
 * 渲染列清除锚点，ID格式：`__BTN_CLEAR_<column>`。
 *
 * @memberOf module:a/zion
 * @param {String} field 列名。
 * @param {Function} onClick 点击专用回调。
 * @returns {Jsx}
 */
const anchorColumn = (field, onClick) =>
    __Zi.anchorColumn(field, onClick);
/**
 * ## 「标准」`Ux.anchorSearch`
 *
 * 搜索条件清除专用锚点，清除所有搜索条件，ID格式：`__BTN_CLEAR_SEARCH`。
 *
 * @memberOf module:a/zion
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Jsx}
 */
const anchorSearch = (reference) =>
    __Zi.anchorSearch(reference);
/**
 * ## 「标准」`Ux.anchorTree`
 *
 * 树专用的状态锚点设置
 *
 * * `__BTN_TREE_OFF`：禁用树菜单。
 * * `__BTN_TREE_ON`：启用树菜单。
 *
 * @memberOf module:a/zion
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Jsx}
 */
const anchorTree = (reference) =>
    __Zi.anchorTree(reference);
/**
 * ## 「标准」`Ux.activeColumn`
 *
 * 点击查询条件的清除专用激活按钮。
 *
 * @memberOf module:a/zion
 * @param {Object} $terms 查询条件专用。
 */
const activeColumn = ($terms = {}) => __Zi.activeColumn($terms);
/**
 * ## 「标准」`Ux.activeSearch`
 *
 * 点击清除搜索框的按钮专用触发函数。
 *
 * @memberOf module:a/zion
 */
const activeSearch = () => __Zi.activeSearch();
/**
 * ## 「标准」`Ux.activeTreeOn`
 *
 * 点击树桩菜单激活按钮
 *
 * @memberOf module:a/zion
 */
const activeTreeOn = () => __Zi.activeTreeOn();
/**
 * ## 「标准」`Ux.activeTreeOff`
 *
 * 点击树桩菜单禁用按钮
 *
 * @memberOf module:a/zion
 */
const activeTreeOff = () => __Zi.activeTreeOff();
export default {
    anchorTree,
    activeTreeOff,
    activeTreeOn,

    anchorColumn,
    activeColumn,
    anchorSearch,
    activeSearch,
}