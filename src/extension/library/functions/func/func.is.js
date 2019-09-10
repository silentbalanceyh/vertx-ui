import U from "underscore";

const isExFun = (fnName) => U.isString(fnName) && (
    fnName.startsWith('rx') ||
    fnName.startsWith('fn') ||
    fnName.startsWith('do')
);
export default {
    isExFun
}