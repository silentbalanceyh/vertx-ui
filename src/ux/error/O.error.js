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
        if (Cv.DEBUG && U.isFunction(executor)) {
            executor.apply(this, [message].concat(
                args.filter(item => !U.isFunction(item)).map(item => `'${item}'`)
            ));
        }
        return message;
    }
};
export default {

    /**
     * ## 标准函数
     *
     * 带条件的错误消息，构造内部消息专用。
     *
     * @memberOf module:_error
     * @param {Function|boolean} fnCond 条件值或条件函数，满足时执行。
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @return {String} 使用 error 打印警告信息，并且生成最终的警告信息。
     */
    fxTerminal: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.error, code].concat(args));
        }
    },
    /**
     * ## 标准函数
     *
     * 带条件的警告消息，构造内部消息专用。
     *
     * @memberOf module:_error
     * @param {Function|boolean} fnCond 条件值或条件函数，满足时执行。
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @return {String} 使用 warn 打印警告信息，并且生成最终的警告信息。
     */
    fxWarning: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.warn, code].concat(args));
        }
    },
    /**
     * ## 特殊函数「Zero」
     *
     * 容错专用函数，消息处理函数，生成最终的 error 的状态信息，多用于 React 中的错误 state。
     *
     * @memberOf module:_error
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @return {{code: *, error: String}} 返回最终的错误状态，组件可消费。
     */
    fxError: (code, ...args) => {
        const error = fxMessage.apply(this, [null, code].concat(args));
        return {code, error};
    },
    /**
     * ## 标准函数
     *
     * 容错专用函数，消息处理函数，生成最终合并的 Message 相关信息
     *
     * @memberOf module:_error
     * @param {Number} code 内部错误编码。
     * @param {any[]} args 错误信息中所需的参数（可变）。
     * @returns {String} 返回最终的字符串信息。
     */
    fxMessage: (code, ...args) => fxMessage.apply(this, [null, code].concat(args)),

    /**
     *
     * ## 标准函数
     *
     * 容错专用函数，终止函数，一旦出错不打印任何信息，直接抛出 Error，最终会 throw Error 导致系统中断。
     *
     * @memberOf module:_error
     * @param {Number} code 内部错误编码
     * @param {any[]} args 错误信息中所需的参数（可变）
     */
    fxFatal: (code, ...args) => {
        const error = fxMessage.apply(this, [null, code].concat(args));
        throw new Error(error);
    },
    /**
     * ## 标准函数「Ambiguity,Jsx」
     *
     * 容错专用函数，渲染错误界面（渲染内部带有错误编码的错误界面）。
     *
     * @memberOf module:_error
     * @param {Number|String} code 内部错误编码
     * @param {any[]} args 错误信息中所需的参数（可变）
     * @return {Jsx}
     */
    fxFailure: (code, ...args) => {
        let input = code;
        if ("string" === typeof input) {
            return jsxError(input);
        } else if ("number" === typeof input) {
            const message = fxMessage.apply(this, [console.error, code].concat(args));
            console.error(message);
            return jsxError(message);
        }
    },
    /**
     * ## 标准函数
     *
     * 容错专用函数，直接通过 code 来抓取内部定义错误信息的 Promise.reject 处理。
     *
     * @memberOf module:_error
     * @async
     * @param {Number} code 错误编号，内部定义。
     * @return {Promise<T>} 返回拒绝过后的内容。
     */
    fxReject: (code = 10104) => {
        const error = ERROR_CODE[code]();
        return Promise.reject({code, error})
    }
}