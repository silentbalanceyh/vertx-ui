import {DataArray, DataObject} from "entity";
import Immutable from "immutable";
import U from "underscore";
import Reg from './O.is.regexp';
import rule from './O.is.rule';

/**
 * ## 标准函数
 *
 * 判断两个对象是否不同，内部使用`Immutable.is` 判断，等价于 Java 语言中的
 * equals 方法
 * 1. 如果是原始JS数据类型，则直接比对二者是否不同。
 * 2. 如果是JS中的对象（Array, Object), 则比较二者的内容是否不同。
 * 3. 如果是自定义的 DataArray, DataObject, 则比较二者内容是否不同。
 *
 * @memberOf module:_is
 * @param {Object | DataObject | DataArray} left 比对左值
 * @param {Object | DataObject | DataArray} right 比对右值
 * @returns {boolean} 不同返回 true，相同则返回 false
 */
const isDiff = (left, right) => {
    const leftValue = (left instanceof DataObject ||
        left instanceof DataArray) ? left.to() : left;
    const rightValue = (right instanceof DataObject ||
        right instanceof DataArray) ? right.to() : right;
    if (leftValue && rightValue) {
        const $left = Immutable.fromJS(left);
        const $right = Immutable.fromJS(right);
        return !Immutable.is($left, $right);
    } else return leftValue !== rightValue;
};
/**
 * ## 标准函数
 *
 * 判断对象是否为空或 undefined，空包括 {}
 *
 * 1. 如果 undefined，则表示为空。
 * 2. 如果 Object，则判断它是否包含了键，无任何键则为空。
 * 3. 如果 Array，则判断长度是否为`0`，为0就表示空。
 *
 * @memberOf module:_is
 * @param {any} input
 * @returns {boolean} 如果为空返回 true，否则返回 false
 */
const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return true; // undefined 也是 empty
};
/**
 * ## 标准函数
 *
 * 检查两个节点是否有父子关系，不传入 field 时，直接检查两个核心字段
 *
 * 1. 标准树专用字段：parent
 * 2. 非标准树的专用字段：parentId
 *
 * @memberOf module:_is
 * @param {Object} input 输入节点
 * @param {Object} parent 父节点
 * @param {String} field 固定字段检查
 * @return {boolean} 如果 input 的 parent 是 parent，那么为 true
 */
const isParent = (parent = {}, input, field) => {
    if (field) {
        return input[field] === parent.key;
    } else {
        if (input.parent) {
            return parent.key === input.parent;
        } else {
            return parent.key === input.parentId;
        }
    }
}
/**
 * ## 标准函数
 *
 * 是否合法对象，合法对象的满足条件
 *
 * 1. 如果是 undefined 则不是合法对象。
 * 2. 如果是 Object 还会排除 Array。
 *
 * @memberOf module:_is
 * @param {any} input 输入值
 * @returns {boolean} 如果是合法对象则为true，否则返回false
 */
const isObject = (input) => {
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
};
/**
 * 判断当前元素是否存在于 Array 集合中
 *
 * @memberOf module:_is
 * @param {any} input 任意输入值
 * @param {Array} array 一个合法数组
 * @returns {boolean} 如果包含该元素返回true，否则返回false
 */
const isIn = (input, array = []) => {
    if (U.isArray(array)) {
        const $array = Immutable.fromJS(array);
        return $array.contains(input);
    } else return false;
};
/**
 * ## 集成函数
 *
 * 内部调用`underscore`，判断输入值是否是一个合法的 JavaScript 函数。
 *
 * @memberOf module:_is
 * @param {any} input 传入值
 * @returns {boolean} 是函数返回true，不是函数返回false
 */
const isFunction = (input) => U.isFunction(input);
/**
 * ## 集成函数
 *
 * 内部调用`underscore`，判断输入值是否是一个合法 Array 的函数。
 *
 * @memberOf module:_is
 * @param {any} input 输入值
 * @returns {boolean} 是数组则返回true，不是则返回false
 */
const isArray = (input) => U.isArray(input);
/**
 * ## 特殊函数「Qr」
 *
 * 判断输入的配置是否合法的带查询的结构，输入的 config 必须是合法的 Object
 *
 * ### 格式1
 *
 * ```json
 * {
 *     "ajax": {
 *         "magic":{
 *             "...": "< 合法可解析的查询条件模式 >"
 *         }
 *     }
 * }
 * ```
 *
 * ### 格式2
 *
 * ```json
 * {
 *     "params": {
 *          "criteria": {
 *              "...": "< 合法可解析的查询条件模式 >"
 *          }
 *     }
 * }
 * ```
 *
 * 该方法比较特殊，必须配合 Zero UI 中的查询引擎执行相关处理，主要用于判断查询参数
 * 所传入的对象必须包含以下路径下的值：
 *
 * ```shell
 * # 新格式，直接使用 ajax.magic
 * ajax.magic
 *
 * # 旧格式（最早的查询参数）直接使用 ajax.params.criteria
 * ajax.params.criteria
 * ```
 *
 * @memberOf module:_is
 * @param {Object} config 传入的配置信息
 * @returns {boolean} 如果合法则返回true，否则返回false
 */
const isQr = (config = {}) => {
    const ajaxRef = config.ajax;
    if (isObject(ajaxRef)) {
        if (ajaxRef.hasOwnProperty('magic')) {
            /*
             * 非查询引擎模式，直接配置
             * magic: {
             *
             * }
             */
            return false;
        } else {
            /*
             * 查询引擎模式，一般配置，必须包含
             * params.criteria: {
             *
             * }
             */
            if (ajaxRef.hasOwnProperty('params')) {
                if (isObject(ajaxRef.params)) {
                    return ajaxRef.params.hasOwnProperty('criteria');
                } else return false;
            } else return false;
        }
    } else {
        console.error(config);
        throw new Error("[ Ux ] 查询引擎方法不可调用于不带 ajax 配置的输入");
    }
};
export default {
    isObject,   /* 验证合法的对象 */
    isEmpty,    /* Object 是否 Empty，支持数组 */
    isDiff,     /* 两个 Object 是否不同 */
    isIn,       /* input 是否存在于 Array 中 */
    isParent,   /* 判断输入节点是否当前节点父节点 */
    /* underscore 连接 */
    isFunction,
    isArray,
    isQr,       /* 配置是否查询引擎配置 */
    ...rule,     /* 检查记录是否符合 Rule 中的定义 */
    ...Reg,     /* 正则表达式验证专用库 */
}