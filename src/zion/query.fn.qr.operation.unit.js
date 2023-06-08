import __Zn from './zero.module.dependency';
import {QQuery} from 'zmr';

const __qrInternal = (condition) => {
    const conditionJ = __Zn.clone(condition);
    if (conditionJ.hasOwnProperty("")) {
        delete condition[""];
    }
    return conditionJ;
}
const qrOp = (condition) => {
    if (!condition.hasOwnProperty("")) {
        // OR
        return false;
    }
    return !!condition[""]
}

const qrNil = (condition) => {
    if (__Zn.isObject(condition)) {
        const conditionJ = __qrInternal(condition);
        return 0 === Object.keys(conditionJ).length;
    } else return true;
}
const qrOne = (condition) => {
    if (qrNil(condition)) {
        return false;
    }
    const conditionJ = __qrInternal(condition);
    return 1 === Object.keys(conditionJ).length;
}
// reference will provide the parameters for syntax parsing here.
const qrAndH = (reference = {}, criteria, field, value) => {
    // 构造Query
    // 解析
    const criteriaJ = __Zn.parseInput(criteria, reference);
    // 构造Query
    const query = new QQuery({criteria: criteriaJ}, reference);
    const condition = {};
    if (__Zn.isObject(field)) {
        Object.assign(condition, field)
    } else if ("string" === typeof field) {
        condition[field] = value;
    }
    query.and(condition);
    const queryRef = query.to();
    return queryRef.criteria ? queryRef.criteria : {};
}

const qrAndQH = (reference, query, field, value) => {
    // $query引用的提取
    let $queryRef;
    if (query) {
        $queryRef = query;
    } else {
        const {$query} = reference.state;
        $queryRef = __Zn.clone($query);
    }
    $queryRef.criteria = qrAndH(reference, $queryRef.criteria, field, value);
    return $queryRef;
}
export default {
    qrNil,
    qrOne,
    qrOp,
    /*
     * 对应后端
     * Ux.irAndH
     * Ux.irAndQH
     */
    qrAndH,
    qrAndQH
}