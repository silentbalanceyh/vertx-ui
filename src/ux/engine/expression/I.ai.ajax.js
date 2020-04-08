import Parser from "./I.parser.up";
import Value from "../../element";

/**
 * ## 标准函数
 *
 * Ajax配置专用解析函数，解析表达式，在 ListSelector 中常用的 Ajax 表达式完整信息。
 *
 * @memberOf module:_aiExpr
 * @param {Object} ajax 基本的 ajax 配置。
 * @returns {Object} 解析过后的标准 ajax 配置对象。
 */
const aiExprAjax = (ajax = {}) => {
    // 默认是POST方法
    let item = ajax;
    const {metadata, ...rest} = ajax;
    if (metadata) {
        // 如果是对象，出现了metadata才会执行属性解析
        item = Parser.parseItem(metadata, "ajax");
        // 分页参数执行整数
        const pager = item.params.pager;
        if (pager) {
            pager.page = Value.valueInt(pager.page);
            pager.size = Value.valueInt(pager.size);
        }
        const lefts = Value.valueLadder(rest);
        // 只合并criteria
        if (!lefts.params) lefts.params = {};
        item.params.criteria = lefts.params.criteria;
    }
    return item;
};
export default {
    aiExprAjax,
}