import U from 'underscore'
import Immutable from 'immutable';
import Logger from './Ux.Log'
import Type from './Ux.Type'

const parseProp = (reference, path = "") => {
    const attrPath = path.split('.');
    if (2 === attrPath.length) {
        const targetKey = attrPath[0];
        const dataObj = reference.props[`$${targetKey}`];
        if (dataObj && dataObj.is()) {
            const to = attrPath[1];
            return dataObj._(to);
        }
    } else {
        console.error("[Param] Props support two path only");
    }
};
const parseCriteria = (reference, path = "") => {

};
const parser = {
    p : parseProp,
    q : parseCriteria
};
const parseExpression = (reference, expr = "") => {
    let returnValue;
    console.groupCollapsed("[Parser] Start to parsing.", expr);
    if (expr) {
        // 是否包含表达式
        if ("string" === typeof expr) {
            if (0 <= expr.indexOf(",")) {
                // 持续递归处理
                const prefix = expr.split(',')[0];
                const parserFun = parser[prefix];
                if (U.isFunction(parserFun)) {
                    const value = parserFun(reference, expr.split(',')[1]);
                    if (value) {
                        returnValue = value;
                    }
                } else {
                    console.warn("[Param] prefix will be ignored.", prefix);
                }
            } else {
                returnValue = expr;
            }
        } else {
            returnValue = expr;
        }
    }
    console.info("[Parser] End Parsing.", expr, returnValue);
    console.groupEnd();
    return returnValue;
};
const parseAjax = (reference, parameters = {}) => {
    const result = {};
    for (const field in parameters) {
        // 特殊递归参数
        if ("criteria" === field) {
            result.criteria = parseAjax(reference, parameters.criteria);
        } else {
            const expr = parameters[field];
            const value = parseExpression(reference, expr);
            if (value) {
                result[field] = value;
            }
        }
    }
    return result;
};
const initQuery = (reference = {}, $query) => {
    let $queryData = {};
    if ($query) {
        $queryData = Immutable.fromJS($query).toJS();
    } else {
        if (reference.props.$query) {
            $queryData = Immutable.fromJS(reference.props.$query).toJS();
        }
    }
    return $queryData;
};
const initCond = (reference = {}) => {
    const {$metadata = {}} = reference.props;
    return $metadata.cond ? $metadata.cond : {};
};
const parseQuery = (reference = {}, $query) => {
    Logger.filters(reference, {
        input : $query,
        query : reference.props.$query,
        filters : reference.props.$filters,
        cond : reference.props.$metadata ? reference.props.$metadata.cond : {}
    });
    const queryData = initQuery(reference, $query);
    // 条件解析
    const cond = initCond(reference);
    // 遍历处理
    const criteria = {};
    Type.itObject(queryData.criteria, (key, value) => {
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
    const $filters = reference.props.$filters;
    Type.itObject($filters.to(), (key, value) => {
        // 包含cond则字段重组，默认是c字段
        const suffix = cond.hasOwnProperty(key) ? cond[key] : 'c';
        criteria[`${key},${suffix}`] = value;
    });
    queryData.criteria = criteria;
    return queryData;
};
export default {
    parseAjax,
    parseQuery
}
