import Expr from './Ux.Parser';
import U from 'underscore';
import Ux from "ux";
/*
 * 字段解析
 */
const parseField = (input) => {
    let op = "=";
    let field;
    if (0 < input.indexOf(',')) {
        /*
         * 带符号
         */
        const parsed = input.replace(/ /g, '').split(',');
        field = parsed[0];
        op = parsed[1];
        if (!op) op = "=";   // 默认是等号
    } else {
        /*
         * 不带符号
         */
        field = input;
    }
    return {op, field};
};
/*
 * 值解析
 */
const parseValue = (valueOrExpr, {state, props}) => {
    let value;
    if (valueOrExpr) {
        if ("string" === typeof valueOrExpr) {
            /*
             * 表达式
             */
            const kv = valueOrExpr.split(":");
            if (2 === kv.length) {
                /*
                 * 表达式分为两部分
                 */
                const source = kv[0];
                const expression = kv[1];
                /*
                 * 读取 parser
                 */
                const parser = Expr[source].parser;
                let searcherInput;
                if (U.isFunction(parser)) {
                    searcherInput = parser(expression);
                } else {
                    searcherInput = expression.split('.');
                }
                /*
                 * 读取 searcher
                 */
                const searcher = Expr[source].searcher;
                if (U.isFunction(searcher)) {
                    value = searcher(searcherInput, props, state);
                } else {
                    const propName = `$${source}`;
                    const dataObject = props[propName];
                    if (dataObject && U.isFunction(dataObject._)) {
                        value = dataObject._(searcherInput);
                    }
                }
            } else {
                /*
                 * 保留原始值
                 */
                value = valueOrExpr;
            }
        } else {
            /*
             * 非表达式
             */
            value = valueOrExpr;
        }
    }
    return value;
};
const parseInput = (input = {}, {props, state}) => {
    // 查找根节点
    const parsed = {};
    Object.keys(input)
        .filter(field => undefined !== input[field])
        .forEach(field => {
            const value = Ux.parseValue(input[field], {state, props});
            if (value) {
                parsed[field] = value;
            }
        });
    Ux.dgDebug(parsed, "[ Ux ] 参数分析最终结果：", "black");
    return parsed;
};
export default {
    parseField,
    parseValue,
    parseInput,
}