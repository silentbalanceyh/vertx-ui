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
const _execError = (id, show) => {
    if (id) {
        const ele = jQuery(`#${id}`).parents();
        ele.each((index, element) => {
            const childEle = jQuery(element);
            const errorCls = childEle.attr("class");
            if (errorCls && errorCls.indexOf && 0 < errorCls.indexOf("has-error")) {
                childEle.children().each((iindex, ielement) => {
                    const errorChildEle = jQuery(ielement);
                    const errorChildCls = errorChildEle.attr("class");
                    if (errorChildCls && errorChildCls.indexOf && 0 <= errorChildCls.indexOf("ant-form-explain")) {
                        errorChildEle.css("display", show ? "block" : "none");
                    }
                });
            }
        });
    }
};
/**
 * 聚焦输入组件时的错误验证（必须在Mount之后）
 * @method htmlErrorFocus
 * @param item
 * @return {Function}
 */
const htmlErrorFocus = (item = {}) => () => {
    _execError(item.field, true);
};
/**
 * 焦点移除时候的错误验证（必须在Mount之后）
 * @method htmlErrorBlur
 * @param item
 * @return {Function}
 */
const htmlErrorBlur = (item = {}) => () => {
    _execError(item.field, false);
};
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
