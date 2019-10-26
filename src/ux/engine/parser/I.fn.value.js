import Pr from './I.parser';
import U from 'underscore';

export default (valueOrExpr, reference) => {
    let value;
    /*
     * 解析基本条件
     * 1）valueOrExpr 不为 undefined
     * 2）valueOfExpr 是一个完整的 string 类型
     * 3）valueOfExpr 中包含了 :
     */
    if (valueOrExpr && ("string" === typeof valueOrExpr)
        && 0 < valueOrExpr.indexOf(":")) {
        /*
         * 解析最终结果
         */
        const firstIndex = valueOrExpr.indexOf(":");
        const parsed = {};
        parsed.type = valueOrExpr.substring(0, firstIndex);
        parsed.expression = valueOrExpr.substring(firstIndex + 1, valueOrExpr.length);
        /*
         * 去掉 parser 流程，直接执行，以后都不采用 parser 流程处理
         */
        const parser = Pr[parsed.type] ? Pr[parsed.type] : undefined;
        if (U.isFunction(parser)) {
            /*
             * 直接单参数解析
             */
            value = parser(parsed.expression, reference);
        } else {
            /*
             * 未解析的直接为 expression
             */
            console.warn("[ Ux ] 未解析 parsed = ", parsed);
            value = parsed.expression;
        }
    } else {
        /*
         * 原始值可直接解析
         */
        if ("NULL" === valueOrExpr) {
            value = null;
        } else {
            /*
             * 不执行任何解析，value 直接等于原始值
             */
            value = valueOrExpr;
        }
    }
    return value;
};