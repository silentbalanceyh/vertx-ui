import React from 'react';
import __Is from './fn.under.is.decision';
import __V_ERR_CODE from './v.error.code';
import __V_ENV from './v.environment';
import LoadingError from './variant/LoadingError';

const __fxMessage = (executor, code, ...args) => {
    const fn = __V_ERR_CODE[code];
    if (__Is.isFunction(fn)) {
        const message = fn.apply(this, args);
        if (__V_ENV.DEBUG && __Is.isFunction(executor)) {
            executor.apply(this, [message].concat(
                args.filter(item => !__Is.isFunction(item)).map(item => `'${item}'`)
            ));
        }
        return message;
    }
};
const fxFailure = (code, ...args) => {
    let input = code;
    if ("string" === typeof input) {
        return <LoadingError $message={input}/>;
    } else if ("number" === typeof input) {
        const message = __fxMessage.apply(this, [console.error, code].concat(args));
        console.error(message);
        return <LoadingError $message={message}/>;
    } else if (input['data']) {
        const {data = {}} = input;
        const {code, detail} = data;
        return detail ? (<LoadingError $message={detail}/>) : fxFailure(code);
    }
}
const fxRedux = (object, original) => {
    if (__V_ENV.DEBUG) {
        let message = `%c 「Zero」 Redux Data Flow`;
        console.groupCollapsed(message, "color:white;background-color:#09c;font-weight:100");
        if ("string" === typeof object) {
            console.log("「Zero」 Redux Key: ", object);
        } else {
            console.log("「Zero」 Object Data: ", object);
        }
        console.log("「Zero」 Original Data: ", original);
        console.groupEnd();
    }
    // 解决Redux中的数据问题
    return object;
};
export default {
    fxRedux,
    fxTerminal: (fnCond, code, ...args) => {
        const checked = __Is.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return __fxMessage.apply(this, [console.error, code].concat(args));
        }
    },
    fxWarning: (fnCond, code, ...args) => {
        const checked = __Is.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return __fxMessage.apply(this, [console.warn, code].concat(args));
        }
    },
    fxMessage: (code, ...args) => __fxMessage.apply(this, [null, code].concat(args)),
    // Returned
    fxError: (code, ...args) => {
        const error = __fxMessage.apply(this, [null, code].concat(args));
        return {code, error};
    },
    fxReject: (code = 10104) => {
        const error = __V_ERR_CODE[code]();
        return Promise.reject({code, error})
    },
    // Throwout
    fxFatal: (code, ...args) => {
        const error = __fxMessage.apply(this, [null, code].concat(args));
        throw new Error(error);
    },
    // Web
    fxFailure
}