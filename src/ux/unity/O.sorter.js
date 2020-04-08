import Ele from '../element';
import moment from 'moment';
// 还有Bug
const sortString = (left = "", right = "", asc = true) => {
    const minLen = Math.max(left.length, right.length);
    let order = 0;
    for (let idx = 0; idx < minLen; idx++) {
        let leftCode = left.charCodeAt(idx);
        let rightCode = right.charCodeAt(idx);
        // 空白的处理
        if (leftCode !== rightCode) {
            // 修正长度不等的时候的基础算法
            if (isNaN(leftCode)) leftCode = 0;
            if (isNaN(rightCode)) rightCode = 0;
            if (asc) {
                order = leftCode - rightCode;
            } else {
                order = rightCode - leftCode;
            }
            break;
        }
    }
    return order;
};
const sortT = (left, right, asc = true) => {
    if ("string" === typeof left && "string" === typeof right) {
        /*
         * 两个字符串
         */
        return sortString(left, right, asc);
    } else if ("number" === typeof left && "number" === typeof right) {
        /*
         * 两个数值
         */
        if (asc) {
            return left - right;
        } else {
            return right - left;
        }
    }
};

const sortDate = (left, right, asc = true) => {
    const leftDate = Ele.valueTime(left);
    const rightDate = Ele.valueTime(right);
    if (moment.isMoment(leftDate) && moment.isMoment(rightDate)) {
        if (asc) {
            return leftDate.isBefore(rightDate) ? -1 : 1;
        } else {
            return leftDate.isBefore(rightDate) ? 1 : -1;
        }
    } else return 0;
};
/**
 *
 * ## 标准函数「Zero」
 *
 * 针对对象按照`key`的字典序进行排序，主要用于打印过程中生成更容易分析的日志专用。
 *
 * @memberOf module:_sorter
 * @param {Object} input 传入的对象Object的值。
 * @return {Object} 排序过后的对象。
 */
const sorterObject = (input = {}) => {
    const normalized = {};
    const keys = Object.keys(input).sort((left, right) => sortString(left, right, true));
    keys.forEach(key => normalized[key] = input[key]);
    return normalized;
};
export default {
    sorterObject,
    /**
     * ## 标准函数「Zero」
     *
     * 按字符串顺序排序。
     *
     * ```js
     * Object.keys(groupedData).sort(Ux.sorterAsc).forEach(identifier => {
     *      // 排序后的执行
     * });
     * ```
     *
     * @memberOf module:_sorter
     * @param {Object|any} left 左值。
     * @param {Object|any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterAsc: (left, right, key) => key ? sortString(left[key], right[key]) : sortString(left, right),
    /**
     * ## 标准函数「2阶，Zero」
     *
     * 按字符串顺序排序，生成函数。
     *
     * @memberOf module:_sorter
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterAscFn: (key) => (left, right) => key ? sortString(left[key], right[key]) : sortString(left, right),
    /**
     * ## 标准函数「Zero」
     *
     * 按任意类型顺序排序。
     *
     * @memberOf module:_sorter
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterAscT: (left, right, key) => key ? sortT(left[key], right[key]) : sortT(left, right),

    /**
     * ## 标准函数「2阶，Zero」
     *
     * 按任意类型顺序排序，生成函数。
     *
     * @memberOf module:_sorter
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterAscTFn: (key) => (left, right) => key ? sortT(left[key], right[key]) : sortT(left, right),
    /**
     * ## 标准函数「Zero」
     *
     * 按时间类型顺序排序。
     *
     * @memberOf module:_sorter
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterAscD: (left, right, key) => key ? sortDate(left[key], right[key]) : sortDate(left, right),
    /**
     * ## 标准函数「2阶，Zero」
     *
     * 按时间类型顺序排序，生成函数。
     *
     * @memberOf module:_sorter
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterAscDFn: (key) => (left, right) => key ? sortDate(left[key], right[key]) : sortDate(left, right),
    /**
     * ## 标准函数「Zero」
     *
     * 按字符串逆序排序。
     *
     * @memberOf module:_sorter
     * @param {Object|any} left 左值。
     * @param {Object|any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterDesc: (left, right, key) => key ? sortString(left[key], right[key], false) : sortString(left, right, false),
    /**
     * ## 标准函数「2阶，Zero」
     *
     * 按字符串逆序排序，生成函数。
     *
     * @memberOf module:_sorter
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterDescFn: (key) => (left, right) => key ? sortString(left[key], right[key], false) : sortString(left, right, false),
    /**
     * ## 标准函数「Zero」
     *
     * 按任意类型逆序排序。
     *
     * @memberOf module:_sorter
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterDescT: (left, right, key) => key ? sortT(left[key], right[key], false) : sortT(left, right, false),
    /**
     * ## 标准函数「2阶，Zero」
     *
     * 按任意类型逆序排序，生成函数。
     *
     * @memberOf module:_sorter
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterDescTFn: (key) => (left, right) => key ? sortT(left[key], right[key], false) : sortT(left, right, false),
    /**
     * ## 标准函数「Zero」
     *
     * 按时间类型逆序排序。
     *
     * @memberOf module:_sorter
     * @param {any} left 左值。
     * @param {any} right 右值。
     * @param {String} key 键值。
     * @return {number} 排序因子
     */
    sorterDescD: (left, right, key) => key ? sortDate(left[key], right[key], false) : sortDate(left, right, false),
    /**
     * ## 标准函数「2阶，Zero」
     *
     * 按时间类型逆序排序，生成函数。
     *
     * @memberOf module:_sorter
     * @param {String} key 生成函数需要比较的字段`key`的值。
     * @return {function(*=, *=): number} 排序函数。
     */
    sorterDescDFn: (key) => (left, right) => key ? sortDate(left[key], right[key], false) : sortDate(left, right, false)
};
