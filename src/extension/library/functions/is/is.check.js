import U from "underscore";

const specFun = (fnName) => U.isString(fnName) && (
    fnName.startsWith('rx') ||
    fnName.startsWith('fn') ||
    fnName.startsWith('do')
);

export default {
    specFun
}