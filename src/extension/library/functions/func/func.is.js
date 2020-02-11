import U from "underscore";

const isExFun = (fnName) => U.isString(fnName) && (
    fnName.startsWith('rx') ||  // 触发函数
    fnName.startsWith('fn') ||  // 普通函数
    fnName.startsWith('do')  // 状态函数
);
export default {
    isExFun
}