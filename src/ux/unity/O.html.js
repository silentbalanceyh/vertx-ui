import jQuery from 'jquery';

/**
 * ## 标准函数
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 直接返回`id`相匹配的 HTML 元素的 `readOnly` 属性，直接判断是否只读。
 *
 * @memberOf module:_html
 * @param {String} id Html中的元素ID。
 * @return {boolean} 返回元素是否只读。
 */
const htmlReadOnly = (id) => {
    const ele = document.getElementById(id);
    if (ele) {
        return ele.readOnly;
    }
};
/**
 *
 * ## 标准函数
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 直接返回`id`相匹配的 HTML 元素的 `disabled` 属性，直接判断是否禁用。
 *
 * @memberOf module:_html
 * @param {String} id Html中的元素ID。
 * @return {boolean} 返回元素是否禁用。
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
 * ## 特殊函数「2阶，Zero」
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 当元素聚焦时执行该函数，用于验证。
 *
 * @memberOf module:_html
 * @param {Object} item 被验证的元素配置
 * @return {function(*): void}
 */
const htmlErrorFocus = (item = {}) => (event) => _execError(event ? event.target : {}, item.field, true);
/**
 * ## 特殊函数「2阶，Zero」
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 当元素离开焦点时执行该函数，用于验证。
 *
 * @memberOf module:_html
 * @param {Object} item 被验证的元素配置
 * @return {function(*): void}
 */
const htmlErrorBlur = (item = {}) => (event) => _execError(event ? event.target : {}, item.field, false);

export default {
    htmlReadOnly,
    htmlDisabled,
    htmlErrorFocus,
    htmlErrorBlur
};
