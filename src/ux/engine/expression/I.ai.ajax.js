import Parser from "./I.parser.up";
import Value from "../../element";

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