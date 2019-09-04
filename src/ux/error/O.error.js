// 导入第三方库
import U from "underscore";
// 导入当前目录
import ERROR_CODE from './I.error.code';
// 导入当前目录
import Cv from "../constant";
// Error 处理
import React from 'react';

const jsxError = (message) => (
    <div className={"ux-error"}>
        {message}
    </div>
);

const fxMessage = (executor, code, ...args) => {
    const fn = ERROR_CODE[code];
    if (U.isFunction(fn)) {
        const message = fn.apply(this, args);
        if (Cv.DEBUG) {
            executor.apply(this, [message].concat(
                args.filter(item => !U.isFunction(item)).map(item => `'${item}'`)
            ));
        }
        return message;
    }
};
export default {
    /*
     * 带条件的中断流程
     * 返回一个错误消息的 String
     */
    fxTerminal: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.error, code].concat(args));
        }
    },
    fxWarning: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.warn, code].concat(args));
        }
    },
    /*
     * 带条件的中断流程
     * 直接返回 Object
     */
    fxError: (code, ...args) => {
        const error = fxMessage.apply(this, [null, code].concat(args));
        return {code, error};
    },
    fxFatal: (code, ...args) => {
        const error = fxMessage.apply(this, [null, code].concat(args));
        throw new Error(error);
    },
    /*
     * 直接返回错误信息（用于 render）
     * <div>
     * </div>
     */
    fxFailure: (code, ...args) => {
        const message = fxMessage.apply(this, [console.error, code].concat(args));
        console.error(message);
        return jsxError(message);
    },
    /*
     * 直接返回 promise 错误信息
     * Promise
     */
    fxReject: (code = 10104) => {
        const error = ERROR_CODE[code]();
        return Promise.reject({code, error})
    },
}