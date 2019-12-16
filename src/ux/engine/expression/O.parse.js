import U from 'underscore';

import Expr from '../parser';
import Abs from '../../abyss';
import Dev from '../../develop';

const {Logger} = Dev;

const parseExpression = (reference, expr = "") => {
    let returnValue;
    if (expr) {
        // 是否包含表达式
        if ("string" === typeof expr) {
            const value = Expr.parseValue(expr, reference);
            if (value) {
                returnValue = value;
            } else {
                returnValue = expr;
            }
        } else {
            returnValue = expr;
        }
        Dev.dgDebug({expr, returnValue}, "[ UxP ] 异步验证解析结果.", "#DAA520");
    }
    return returnValue;
};
/**
 * 针对Ajax的专用参数解析器，这种Ajax参数解析一般用于异步验证、交互过程中的异步请求处理
 * @method parseAjax
 * @param reference React对应组件引用 React.PureComponent
 * @param parameters 传入的参数值信息
 */
const parseAjax = (parameters = {}, reference) => {
    const result = {};
    // eslint-disable-next-line
    for (const field in parameters) {
        if (parameters.hasOwnProperty(field)) {
            // 特殊递归参数
            if ("criteria" === field) {
                // 特殊解析流程
                result.criteria = Expr.parseInput(parameters.criteria, reference);
            } else if (U.isObject(parameters[field]) && "sorter" !== field) {
                result[field] = parseAjax(parameters[field], reference);
            } else {
                const expr = parameters[field];
                const value = parseExpression(reference, expr);
                if (value) {
                    result[field] = value;
                }
            }
        }
    }
    return result;
};
const initQuery = (reference = {}, $query) => {
    let $queryData = {};
    if ($query) {
        $queryData = Abs.clone($query);
    } else {
        if (reference.props.$query) {
            $queryData = Abs.clone(reference.props.$query);
        }
    }
    return $queryData;
};
const initCond = (reference = {}) => {
    const {$metadata = {}} = reference.props;
    return $metadata.cond ? $metadata.cond : {};
};
/**
 * 针对Query的专用参数解析器
 * @method parseQuery
 * @param reference React对应组件引用 React.PureComponent
 * @param $query 查询参数相关信息
 * @return {*}
 */
const parseQuery = (reference = {}, $query) => {
    Logger.filters(reference, {
        input: $query,
        query: reference.props['$query'],
        filters: reference.props['$filters'],
        cond: reference.props['$metadata'] ? reference.props['$metadata'].cond : {}
    });
    const queryData = initQuery(reference, $query);
    // 条件解析
    const cond = initCond(reference);
    // 遍历处理
    const criteria = {};
    Abs.itObject(queryData.criteria, (key, value) => {
        // 字段解析
        if (0 < key.indexOf(",")) key = key.split(",")[0];
        // 包含cond则字段重组
        const suffix = cond.hasOwnProperty(key) ? cond[key] : 'c';
        // 执行表达式解析
        const targetValue = parseExpression(reference, value);
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
    Abs.itObject($filters.to(), (key, value) => {
        // 包含cond则字段重组，默认是c字段
        const suffix = cond.hasOwnProperty(key) ? cond[key] : 'c';
        criteria[`${key},${suffix}`] = value;
    });
    queryData.criteria = criteria;
    return queryData;
};
/**
 * @class Param
 * @description 复杂参数解析器
 */
export default {
    parseAjax,
    parseQuery,
    ...Expr,
};
