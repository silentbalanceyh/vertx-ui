import __E from './fn.debug.fx.error';
import __Wy from './fn.under.way.io';
import __Is from './fn.under.is.decision';

const compilePutO = (reference, putFn = "setItem") => (key, value) => {
    __E.fxTerminal(!reference, 10063, reference);
    if (key && value) {
        value = __Wy.wayO2S(value);
        if (value) {
            reference[putFn](key, value)
        }
    }
}

const compileGetO = (reference, getFn = "getItem") => (key) => {
    __E.fxTerminal(!reference, 10063, reference);
    if (key) {
        let value = reference[getFn](key);
        value = __Wy.wayS2O(value);
        if (!value) {
            // __E.fxWarning(true, 10037, new Error("Parsed null"), key)
        }
        return value;
    }
}

const compileGet = (reference, getFn = "getItem") => (key) => {
    __E.fxTerminal(!reference, 10063, reference);
    if (key) return reference[getFn](key);
}

const compilePut = (reference, putFn = "setItem") => (key, value) => {
    __E.fxTerminal(!reference, 10063, reference);
    if (key && value) {
        reference[putFn](key, value)
    }
}

const compileRemove = (reference, removeFn = "removeItem") => (key) => {
    __E.fxTerminal(!reference, 10063, reference);
    if (key) {
        if (__Is.isArray(key)) {
            key.forEach(keyEach => reference[removeFn](keyEach));
        } else {
            reference[removeFn](key);
        }
    }
}

const compileClear = (reference, clearFn = "clear") => () => {
    __E.fxTerminal(!reference, 10063, reference);
    reference[clearFn]()
}
export default {
    compilePutO,
    compilePut,

    compileGetO,
    compileGet,

    compileClear,
    compileRemove,
}