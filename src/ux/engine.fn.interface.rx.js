/*
 * 根据分辨率计算核心高度
 * 1）width > 1400 的宽度：默认 - 48
 * 3）width > 1900 的宽度：默认 - 56
 */
import __Zi from 'zi';
import __Zs from 'zs';
import __Zo from 'zo';

/**
 * ## 「标准」`Ux.rxCheckedRow`
 *
 * 表格 Table 中的专用 selected 函数生成器。
 *
 * @memberOf module:rx/zest
 * @param {Object} reference React对应组件引用。
 * @param {String} field 字段名称。
 * @returns {Function} 选中函数。
 */
const rxCheckedRow = (reference, field = "$selected") =>
    __Zs.rxCheckedRow(reference, field);
/**
 *
 * ## 「标准」`Ux.rxCheckedTree`
 *
 * 树专用组件 Tree 中的专用选择函数，借助 $keySet 集合
 *
 * @memberOf module:rx/zest
 * @param {Object} reference React对应组件引用。
 * @param {Array} input 当前组中数组，本身为一棵树
 * @param {Function} callback 回调函数
 * @returns {Function} 选中函数。
 */
const rxCheckedTree = (reference, input = [], callback) =>
    __Zs.rxCheckedTree(reference, input, callback);

// ----------------------------- 常用事件处理方法 ------------------------------
/*
 * 工作流部分最后会使用此处相关操作
 * 单纯打开/关闭窗口
 * - 添加按钮
 * - 编辑按钮
 * 该操作会设置核心变量，变量如下
 * -- $inited: 表单初始化方法
 * -- $visible：窗口显示或隐藏
 * -- $loading：窗口是否正在加载
 * -- $submitting：窗口处于正在提交
 */

// ----------------------------- rxShow
/**
 * ## 「标准」`Ux.rxShow`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 */
const rxShow = (reference, addOn = {}) => __Zs.rxShow(reference, addOn);
/**
 * ## 「标准」`Ux.rxShowFn`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @returns {Function}
 */
const rxShowFn = (reference, addOn = {}) => __Zs.rxShowFn(reference, addOn);
/**
 * ## 「标准」`Ux.rxOpen`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 */
const rxOpen = (reference, addOn = {}, rxRunner) => __Zs.rxOpen(reference, addOn, rxRunner);
/**
 * ## 「标准」`Ux.rxOpenFn`
 *
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 * @returns {Function}
 */
const rxOpenFn = (reference, addOn = {}, rxRunner) => __Zs.rxOpenFn(reference, addOn, rxRunner);
// ----------------------------- rxClose
/**
 * ## 「标准」`Ux.rxClose`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 */
const rxClose = (reference, addOn = {}) => __Zs.rxClose(reference, addOn);
/**
 * ## 「标准」`Ux.rxCloseFn`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @returns {Function}
 */
const rxCloseFn = (reference, addOn = {}) => __Zs.rxCloseFn(reference, addOn);

// ----------------------------- rxRow
/**
 * ## 「标准」`Ux.rxRow`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 * @returns {*}
 */
const rxRow = (reference, addOn = {}, rxRunner) =>
    __Zs.rxRow(reference, addOn, rxRunner);
/**
 * ## 「标准」`Ux.rxRowFn`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 * @returns {Function}
 */
const rxRowFn = (reference, addOn = {}, rxRunner) =>
    __Zs.rxRowFn(reference, addOn, rxRunner);
// ----------------------------- rxSelected
/**
 * ## 「标准」`Ux.rxSelected`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 * @returns {*}
 */
const rxSelected = (reference, addOn = {}, rxRunner) =>
    __Zs.rxSelected(reference, addOn, rxRunner);
/**
 * ## 「标准」`Ux.rxSelectedFn`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @returns {Function}
 */
const rxSelectedFn = (reference, addOn = {}) =>
    __Zs.rxSelectedFn(reference, addOn);

// ----------------------------- rxBatch
/**
 * ## 「标准」`Ux.rxBatch`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 * @returns {Promise<void>}
 */
const rxBatch = (reference, addOn = {}, rxRunner) =>
    __Zs.rxBatch(reference, addOn, rxRunner);
/**
 * ## 「标准」`Ux.rxBatchFn`
 *
 * @memberOf module:rx/zest
 * @param reference
 * @param addOn
 * @param rxRunner
 * @returns {Function}
 */
const rxBatchFn = (reference, addOn = {}, rxRunner) =>
    __Zs.rxBatchFn(reference, addOn, rxRunner);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * ## 「标准」`Ux.rxSubmitting`
     *
     * @memberOf module:rx/zodiac
     * @param reference
     * @param deleted
     * @returns {*}
     */
    rxSubmitting: (reference, deleted) => __Zo.rxSubmitting(reference, deleted),
    /**
     * ## 「标准」`Ux.rxResize`
     *
     * 设置窗口 resize 的事件专用。
     *
     * @memberOf module:rx/zion
     * @method rxResize
     * @param {Object} reference React对应组件引用。
     * @returns {Function} 返回 resize 回调函数。
     */
    rxResize: __Zi.rxResize,
    rxCheckedRow,
    rxCheckedTree,
    // 快速开发核心方法（函数Action专用）
    /*
     * 统一数据结构
     * {
     *     $inited: {},     // 记录数据信息
     *     state: {},       // 附加状态信息
     *     ...rest: {},     // 构造成 config 状态信息
     * }
     */
    // 显示窗口
    rxShow,
    rxShowFn,
    // 关闭窗口
    rxClose,
    rxCloseFn,
    // 行执行操作
    rxRow,
    rxRowFn,
    // 行选择操作
    rxSelected,
    rxSelectedFn,
    // 行打开操作
    rxOpen,
    rxOpenFn,
    // 批量操作
    rxBatch,
    rxBatchFn,
}