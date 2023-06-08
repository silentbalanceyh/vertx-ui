import __Zo from 'zo';

/**
 * ## 「引擎」`Ux.parseAjax`
 *
 * 标准的ajax配置解析函数，针对Ajax的专用参数解析器，这种Ajax参数解析一般用于异步验证、交互过程中的异步请求处理
 *
 * @memberOf module:parse/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} parameters 传入的参数值相关信息。
 * @returns {Object} 返回最终解析好的 Ajax 参数。
 */
const parseAjax = (parameters = {}, reference) =>
    __Zo.parseAjax(parameters, reference);
/**
 * ## 「引擎」`Ux.parseQuery`
 *
 * 针对Query的专用参数解析器。
 *
 * @memberOf module:parse/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} $query 查询参数数据结构。
 * @return {Object} 返回解析好的查询参数。
 */
const parseQuery = (reference = {}, $query) =>
    __Zo.parseQuery(reference, $query)
export default {
    parseAjax,
    parseQuery,
    /**
     * ## 「引擎」`Ux.parseAction`
     *
     * @memberOf module:parse/zodiac
     * @param jsx
     * @returns {*}
     */
    parseAction: (jsx) => __Zo.parseAction(jsx),
    /**
     * ## 「引擎」`Ux.parseItem`
     *
     * @memberOf module:parse/zodiac
     * @param kvs
     * @param key
     */
    parseItem: (kvs = [], key) => __Zo.parseItem(kvs, key),
};
