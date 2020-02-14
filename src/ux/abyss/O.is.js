import {DataArray, DataObject} from "entity";
import Immutable from "immutable";
import U from "underscore";
import Reg from './O.is.regexp';

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

const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return true; // undefined 也是 empty
};

const isObject = (input) => {
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
};
const isIn = (input, array = []) => {
    if (U.isArray(array)) {
        const $array = Immutable.fromJS(array);
        return $array.contains(input);
    } else return false;
};
const isFunction = (input) => U.isFunction(input);
const isArray = (input) => U.isArray(input);
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
    /* underscore 连接 */
    isFunction,
    isArray,
    isQr,       /* 配置是否查询引擎配置 */
    ...Reg,     /* 正则表达式验证专用库 */
}