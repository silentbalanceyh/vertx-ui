import __Zo from "zo";

/**
 * ## 「标准」`Ux.htmlReadOnly`
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 直接返回`id`相匹配的 HTML 元素的 `readOnly` 属性，直接判断是否只读。
 *
 * @memberOf module:html/zodiac
 * @param {String} id Html中的元素ID。
 * @return {boolean} 返回元素是否只读。
 */
const htmlReadOnly = (id) => __Zo.htmlReadOnly(id);
/**
 *
 * ## 「标准」`Ux.htmlDisabled`
 *
 * > 必须在`componentDidMount`之后才能执行。
 *
 * 直接返回`id`相匹配的 HTML 元素的 `disabled` 属性，直接判断是否禁用。
 *
 * @memberOf module:html/zodiac
 * @param {String} id Html中的元素ID。
 * @return {boolean} 返回元素是否禁用。
 */
const htmlDisabled = (id) => __Zo.htmlDisabled(id);

/**
 * ## 「标准」`Ux.htmlErrorFocus`
 *
 * > 「2阶」必须在`componentDidMount`之后才能执行。
 *
 * 当元素聚焦时执行该函数，用于验证。
 *
 * @memberOf module:html/zodiac
 * @param {Object} item 被验证的元素配置
 * @return {function(*): void}
 */
const htmlErrorFocus = (item = {}) => __Zo.htmlErrorFocus(item);
/**
 * ## 「标准」`Ux.htmlErrorBlur`
 *
 * > 「2阶」必须在`componentDidMount`之后才能执行。
 *
 * 当元素离开焦点时执行该函数，用于验证。
 *
 * @memberOf module:html/zodiac
 * @param {Object} item 被验证的元素配置
 * @return {function(*): void}
 */
const htmlErrorBlur = (item = {}) => __Zo.htmlErrorBlur(item);

export default {
    htmlReadOnly,
    htmlDisabled,
    htmlErrorFocus,
    htmlErrorBlur
};
