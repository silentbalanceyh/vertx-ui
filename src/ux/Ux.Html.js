import jQuery from 'jquery';

/**
 * 读取Html原生组件的只读状态（必须在Mount之后）
 * @method htmlReadOnly
 * @param id Html组件的ID
 * @return {*}
 */
const htmlReadOnly = (id) => {
    const ele = document.getElementById(id);
    if (ele) {
        return ele.readOnly;
    }
};
/**
 * 读取Html原生组件的禁用状态（必须在Mount之后）
 * @method htmlDisabled
 * @param id Html组件的ID
 * @return {*}
 */
const htmlDisabled = (id) => {
    const ele = document.getElementById(id);
    if (ele) {
        return ele.disabled;
    }
};
const _execError = (target, id, show) => {
    if (id) {
        const ele = jQuery(target).parents(".ant-form-item-children");
        const subling = ele.siblings(".ant-form-explain");
        if (subling) {
            subling.css("display", show ? "block" : "none");
        }
    }
};
/**
 * 聚焦输入组件时的错误验证（必须在Mount之后）
 * @method htmlErrorFocus
 * @param item
 * @return {Function}
 */
const htmlErrorFocus = (item = {}) => (event) => _execError(event.target, item.field, true);
/**
 * 焦点移除时候的错误验证（必须在Mount之后）
 * @method htmlErrorBlur
 * @param item
 * @return {Function}
 */
const htmlErrorBlur = (item = {}) => (event) => _execError(event.target, item.field, false);
/**
 * @class Html
 * @description 原生Html元素连接类
 */
export default {
    htmlReadOnly,
    htmlDisabled,
    htmlErrorFocus,
    htmlErrorBlur
}
