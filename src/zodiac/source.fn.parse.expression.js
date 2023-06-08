import __Zn from './zero.module.dependency';
import __Pv from './source.fn.parse.transformer';

import _Logger from './tracer.c.logger';

const __parseExpression = (reference, expr = "") => {
    let returnValue;
    if (expr) {
        // 是否包含表达式
        if ("string" === typeof expr) {
            const value = __Pv.parseValue(expr, reference);
            if (value) {
                returnValue = value;
            } else {
                /*
                 * 参数设置的 BUG
                 * 如果设置表达式，当表达式的数据本身不合法时
                 * 直接将参数置空，保证不多出类似 FORM:xxx 的值
                 * 解析不了走原始值的参数。
                 */
                returnValue = null; // expr;
            }
        } else {
            returnValue = expr;
        }
        __Zn.dgDebug({expr, returnValue}, "[ UxP ] 异步验证解析结果.", "#DAA520");
    }
    return returnValue;
};

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
const parseInput = (input = {}, ref) => {
    // 查找根节点
    const parsed = {};
    Object.keys(input)
        .filter(field => undefined !== input[field])
        .forEach(field => {
            if (__Zn.isObject(input[field])) {
                parsed[field] = parseInput(input[field], ref);
            } else {
                const value = __Pv.parseValue(input[field], ref);
                if (undefined !== value) {        // value 不为 undefined 就处理
                    parsed[field] = value;
                }
            }
        });
    return parsed;
};
const parsePosition = (positionExpr, reference) => {
    const parsed = __Zn.ambArray(positionExpr);
    const seed = [];
    parsed.forEach(eachExpr => {
        seed.push(__Pv.parseValue(eachExpr, reference));
    })
    // Join后的结果
    const literal = seed.join(":");
    return __Zn.encryptMD5(literal);
}
const parseParameter = (parameter = {}, reference) => {
    const result = {};
    Object.keys(parameter).forEach(name => {
        result[name] = __Pv.parseValue(parameter[name], reference);
    })
    return result;
}
const parseAjax = (parameters = {}, reference) => {
    const result = {};
    // eslint-disable-next-line
    for (const field in parameters) {
        if (parameters.hasOwnProperty(field)) {
            // 特殊递归参数
            if ("criteria" === field) {
                // 特殊解析流程
                result.criteria = parseInput(parameters.criteria, reference);
            } else if (__Zn.isObject(parameters[field]) && "sorter" !== field) {
                result[field] = parseAjax(parameters[field], reference);
            } else {
                const expr = parameters[field];
                const value = __parseExpression(reference, expr);
                if (value) {
                    result[field] = value;
                }
            }
        }
    }
    return result;
};

const __initQuery = (reference = {}, $query) => {
    let $queryData = {};
    if ($query) {
        $queryData = __Zn.clone($query);
    } else {
        if (reference.props.$query) {
            $queryData = __Zn.clone(reference.props.$query);
        }
    }
    return $queryData;
};
const __initCond = (reference = {}) => {
    const {$metadata = {}} = reference.props;
    return $metadata.cond ? $metadata.cond : {};
};

const parseQuery = (reference = {}, $query) => {
    _Logger.filters(reference, {
        input: $query,
        query: reference.props['$query'],
        filters: reference.props['$filters'],
        cond: reference.props['$metadata'] ? reference.props['$metadata'].cond : {}
    });
    const queryData = __initQuery(reference, $query);
    // 条件解析
    const cond = __initCond(reference);
    // 遍历处理
    const criteria = {};
    __Zn.itObject(queryData.criteria, (key, value) => {
        // 字段解析
        if (0 < key.indexOf(",")) key = key.split(",")[0];
        // 包含cond则字段重组
        const suffix = cond.hasOwnProperty(key) ? cond[key] : 'c';
        // 执行表达式解析
        const targetValue = __parseExpression(reference, value);
        if (targetValue) {
            if (cond.hasOwnProperty(key)) {
                criteria[`${key},${suffix}`] = targetValue;
            } else {
                criteria[key] = targetValue;
            }
        }
    });
    // 处理查询专用的$filters属性中的信息
    const $filters = reference.props['$filters'];
    __Zn.itObject($filters.to(), (key, value) => {
        // 包含cond则字段重组，默认是c字段
        const suffix = cond.hasOwnProperty(key) ? cond[key] : 'c';
        criteria[`${key},${suffix}`] = value;
    });
    queryData.criteria = criteria;
    return queryData;
};
export default {
    parseField,
    parseInput,
    parseParameter,
    parsePosition,
    parseAjax,
    parseQuery,
}