import Sorter from "../Ux.Sorter";
import Type from "../Ux.Type";
import Immutable from 'immutable';

const _fnSorter = (source = [], $query = {}) => {
    if ($query.sorter) {
        $query.sorter.forEach(sortItem => {
            const field = sortItem.split(',')[0];
            const isAsc = "ASC" === sortItem.split(',')[1];
            source = source.sort((left, right) => isAsc ? Sorter.sorterAsc(left, right, field) :
                Sorter.sorterDesc(left, right, field))
        })
    }
    return source;
};

const FILTERS = {
    // 包含
    "c": (field, value) => {
        return (item) => item && item[field] && 0 <= item[field].indexOf(value)
    }
};

const _fnMerged = (input = []) => {
    const pushed = {};
    const result = [];
    Type.itMatrix(input, (item) => {
        if (!pushed[item.key]) {
            result.push(item);
        }
    });
    return result;
};

const _fnAnd = (source = [], criteria = {}) => {

};

const _fnOr = (source = [], criteria = {}) => {

};

const _fnLinear = (source = [], criteria = {}, and = false) => {
    const result = [];
    if (and) {

    } else {
        Type.itObject(criteria, (expr, value) => {
            const field = expr.split(',')[0];
            let fun = expr.split(',')[1];
            fun = fun ? FILTERS[fun] : FILTERS['c'];
            result.push(source.filter(fun(field, value)));
        });
        return _fnMerged(result);
    }
};

const _fnTree = (source = [], criteria = {}, and = false) => {

};

const _fnSearch = (source = [], criteria = {}) => {
    // 搜索线性条件
    let isTree = false;
    let isAnd = false;
    let linear = {};
    Type.itObject(criteria, (field, value) => {
        if ("" === field && true === value) {
            isAnd = true;
        } else if ("object" === typeof value) {
            isTree = true;
        } else {
            linear[field] = value;
        }
    });
    // 打印
    console.info("[ Mock ] 查询树：", isTree,
        "连接符：and = ", isAnd,
        "当前节点线性查询：cond = ", linear,
        "查询条件：", criteria);
    if (isTree) {
        _fnTree(source, criteria);
    } else {
        return _fnLinear(source, criteria, isAnd);
    }
};

const _fnCriteria = (source = [], $query = {}) => {
    console.info(source);
    if (0 < Object.keys($query.criteria).length) {
        source = _fnSearch(source, $query.criteria);
    }
    return source;
};

class Criteria {
    constructor(data = []) {
        this.data = Immutable.fromJS(data).toJS();
    }

    query($query = {}) {
        let source = this.data;
        // 先过滤，再排序
        source = _fnCriteria(source, $query);
        // 排序
        source = _fnSorter(source, $query);
        return source;
    }
}

export default {
    aiCriteria: (data) => new Criteria(data)
};