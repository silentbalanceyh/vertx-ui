import __Zi from 'zi';

/**
 * ## 「标准」`Ux.onConfirm`
 *
 * 基础函数，用于执行 confirm，在按钮中执行提交确认注入。
 *
 * 1. 如果带 content 则将原始函数处理在 onOk 回调中。
 * 2. 如果不带 content 则直接执行函数。
 *
 * @memberOf module:on/zion
 * @param {Function} fnEvent 原始事件方法。
 * @param {String} content 提示框中的内容数据。
 * @returns {Function} 返回事件函数
 */
const onConfirm = (fnEvent, content) => __Zi.onConfirm(fnEvent, content);

export default {
    onConfirm,
}