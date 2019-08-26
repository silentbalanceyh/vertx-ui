import Value from '../../Ux.Value';
import U from 'underscore';
import Ux from "ux";

const _isOk = (value) => !U.isArray(value) && U.isObject(value);

const _searchReference = (criteria = {}, field, flag = "") => {
    /**
     * 直接在 criteria 的树中查找是否包含了 field 的信息
     *
     */
    if (criteria.hasOwnProperty(field)) {
        return criteria;
    } else {
        let reference = undefined;
        for (const key in criteria) {
            // 基本规范
            if (criteria.hasOwnProperty(key)) {
                const value = criteria[key];
                // 满足的子节点
                if (_isOk(value)) {
                    // 搜索基础信息
                    reference = _searchReference(value, field, flag);
                    // 如果找到了就跳出
                    if (!reference) {
                        break;
                    }
                }
            }
        }
        return reference;
    }
};
/**
 * 追加查询条件
 * 直接替换
 */
const _saveCondition = (original = {}, field, value, connector = "AND") => {
    /*
     * 分析原始条件类型来执行更新，最终更新的内容就是
     * criteria = value，
     * 其中 criteria 是查询表达式
     */
    if (Value.isEmpty(original)) {
        /**
         * 如果原始条件为空，直接设置
         * {}
         * 转换成
         * { criteria:value }
         */
        original[field] = value;
        return original;
    } else {
        const keys = Object.keys(original);
        if (1 === keys.length) {
            /*
             * 如果只有一个键值对，直接追加
             * { key: value }
             * 转换成
             * {
             *     key: value
             *     "": xxx
             *     criteria:value
             * }
             * 如果 field 和当前传入的相同，会直接被替换掉
             */
            original[field] = value;
            original[""] = "AND" === connector;
            return original;
        } else {
            /**
             * 否则，直接搜索 criteria 的位置，找到那个引用
             */
            const reference = _searchReference(original, field, "Save");
            if (reference) {
                /**
                 * 如果直接搜索到了过后，就直接替换
                 */
                reference[field] = value;
                reference[""] = "AND" === connector;
                return original;
            } else {
                /**
                 * 「不包含criteria」如果是多个，直接将原始的内容降级处理
                 * { key:value, key1:value }
                 * 转换成
                 * {
                 *     "$O":{
                 *         key:value,
                 *         key1:value
                 *     },
                 *     "": xxx
                 *     criteria:value
                 * }
                 */
                const newQuery = {};
                newQuery["$O"] = Ux.clone(original);
                newQuery[""] = "AND" === connector;
                newQuery[field] = value;
                return newQuery;
            }
        }
    }
};
/**
 * 对查询条件进行降维
 */
const _reduceCondition = (criteria = {}) => {
    // 读取最终的 criteria 查询条件
    let keys = Object.keys(criteria);
    // 如果删除过后只有两个节点，则执行第一步降维，删除 "" 的连接符维度
    if (2 === keys.length && criteria.hasOwnProperty("")) {
        // 删除连接符
        delete criteria[""];
        // 重新运算删除过后的连接符，这个时候 keys.length 就只有1了
        keys = Object.keys(criteria);
    }
    if (1 === keys.length) {
        // 读取对应的 key
        const key = keys[0];
        const single = criteria[key];
        // 特殊返回值，必须是 Object 而且不能是 Array
        if (U.isObject(single) && !U.isArray(single)) {
            return single;
        }
    }
    return criteria;
};
const _removeCondition = (criteria = {}, field) => {
    /**
     * 查找当前field对应的节点
     * 注意：这里查找的引用是当前 field 所在节点的父节点
     */
    const reference = _searchReference(criteria, field, "Remove");
    if (reference) {
        // 找到该节点的信息
        delete reference[field];
        // 返回简化过后的条件
        return _reduceCondition(criteria);
    }
    return criteria;
};
/*
 * 新方法合并查询树
 */
const aiCriteria = (query = {}, values = {}, connector = "AND") => {

    return query;
};
/*
 * 新方法（核心方法处理Criteria）
 */
export default {
    aiCriteria
};