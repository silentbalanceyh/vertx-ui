import U from "underscore";

/**
 * ## 扩展函数
 *
 * 判断哪些函数需要继承：
 *
 * * `rx`前缀函数
 * * `fn`前缀函数
 * * `do`前缀函数
 *
 * @memberOf module:_function
 * @param {String} fnName 函数名称
 * @returns {boolean} 返回判断结果
 */
const mapFun = (fnName) => U.isString(fnName) && (
    fnName.startsWith('rx') ||  // 触发函数
    fnName.startsWith('fn') ||  // 普通函数
    fnName.startsWith('do')  // 状态函数
);
export default {
    mapFun
}