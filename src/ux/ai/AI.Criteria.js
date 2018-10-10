import Sorter from "../util/Ux.Sorter";
import Type from "../Ux.Type";
import U from 'underscore';
import {DataLabor} from 'entity';
import Value from '../Ux.Value';

const _fnSorter = (source = [], $query = {}) => {
    if ($query.sorter) {
        $query.sorter.forEach(sortItem => {
            const field = sortItem.split(',')[0];
            const isAsc = "ASC" === sortItem.split(',')[1];
            source = source.sort((left, right) => isAsc ? Sorter.sorterAsc(left, right, field) :
                Sorter.sorterDesc(left, right, field));
        });
    }
    return source;
};

const FILTERS = {
    // 包含
    "c": (field, value) => {
        return (item) => item && item[field] && 0 <= item[field].indexOf(value);
    }
};

const _fnOr = (input = []) => {
    const pushed = {};
    const result = [];
    Type.itMatrix(input, (item) => {
        if (!pushed[item.key]) {
            result.push(item);
        }
    });
    return result;
};

const _fnIn = (input = [], key = "") => {
    const result = input.filter(item => key === item.key);
    return 0 < result.length;
};

const _fnIntersect = (left = [], right = []) => {
    const result = [];
    left.forEach(leftItem => {
        if (_fnIn(right, leftItem.key)) {
            result.push(leftItem);
        }
    });
    return result;
};

const _fnAnd = (input = []) => {
    let result = input[0];
    for (let idx = 0; idx < input.length; idx++) {
        result = _fnIntersect(result, input[idx]);
    }
    return result;
};

const _fnLinear = (source = [], criteria = {}, and = false) => {
    let result = [];
    if (and) {
        Type.itObject(criteria, (expr, value) => {
            const field = expr.split(',')[0];
            if ("" !== field) {
                let fun = expr.split(',')[1];
                fun = fun ? FILTERS[fun] : FILTERS['c'];
                source = source.filter(fun(field, value));
            }
        });
        result = source;
    } else {
        let $result = DataLabor.getArray([]);
        Type.itObject(criteria, (expr, value) => {
            const field = expr.split(',')[0];
            if ("" !== field) {
                let $source = Value.clone(source);
                let fun = expr.split(',')[1];
                fun = fun ? FILTERS[fun] : FILTERS['c'];
                $source = $source.filter(fun(field, value));
                $source.forEach(record => $result.saveElement(record));
            }
        });
        result = $result.to();
    }
    return result;
};

const _fnAnalyze = (criteria = {}) => {
    let isTree = false;
    let isAnd = false;
    let linear = {};
    let tree = {};
    Type.itObject(criteria, (field, value) => {
        if ("" === field) {
            isAnd = (true === value);
        } else {
            if (U.isObject(value)) {
                isTree = true;
                tree[field] = value;
            } else {
                linear[field] = value;
            }
        }
    });
    return {isAnd, isTree, linear, tree};
};

const _fnTree = (source = [], criteria = {}, level = 1) => {
    // 搜索线性条件
    const {isAnd, isTree, linear = {}, tree = {}} = _fnAnalyze(criteria);
    // 打印
    console.groupCollapsed("[ Mock ] 查询分析结果 ");
    console.info(`[ Mock ] Level = ${level} 查询树：`, isTree);
    console.info("[ Mock ] 连接符：and = ", isAnd);
    console.info("[ Mock ] 当前节点线性查询：cond = ", linear);
    console.info("[ Mock ] 查询条件：", criteria);
    console.groupEnd();
    if (isTree) {
        const result = [];
        Type.itObject(tree, (field, value) => {
            const single = _fnTree(source, value, level + 1);
            result.push(single);
        });
        if (0 < Object.keys(linear).length) {
            result.push(_fnLinear(source, criteria, isAnd));
        }
        if (isAnd) {
            return _fnAnd(result);
        } else {
            return _fnOr(result);
        }
    } else {
        return _fnLinear(source, criteria, isAnd);
    }
};

const _fnCriteria = (source = [], $query = {}) => {
    const criteria = Value.clone($query.criteria);
    Value.valueValid(criteria);
    if (0 < Object.keys(criteria).length) {
        source = _fnTree(source, criteria, 1);
        // 去重，过滤重复key的情况
        const result = [];
        const hash = {};
        if (source) {
            source.forEach(item => {
                if (!hash[item.key]) {
                    hash[item.key] = true;
                    result.push(item);
                }
            });
        }
        source = result;
    }
    return source;
};

class Criteria {
    constructor(data = []) {
        this.data = Value.clone(data);
    }

    query($query = {}) {
        let source = this.data;
        // 先过滤，再排序
        source = _fnCriteria(source, $query);
        // 排序
        source = _fnSorter(source, $query);
        // Reduce
        return source;
    }
}

export default {
    aiCriteria: (data) => new Criteria(data)
};