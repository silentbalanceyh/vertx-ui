import U from 'underscore';
import Value from '../Ux.Value';

const ensureStream = (reference) => {
    if (!reference.config) {
        throw new Error("[Z-Stem] The 'config' has not been initialized, please call 'init()' first.");
    }
};

const ensureKeys = (key, expected = []) => {
    const $expected = Value.immutable(expected);
    if (!$expected.contains(key)) {
        throw new Error(`[Z-Stem] The 'key=${key}' is not supported in current component.`);
    }
};

const itSwitch = (target, value, callback, supportedKeys = []) => {
    if (target) {
        if ("string" === typeof target) {
            ensureKeys(target, supportedKeys);
            if (undefined !== value) {
                callback(target, value);
            }
        }
    } else if (U.isObject(target)) {
        for (const key in target) {
            if (target.hasOwnProperty(key)) {
                ensureKeys(key, supportedKeys);
                const targetValue = target[key];
                if (targetValue) {
                    callback(key, targetValue);
                }
            }
        }
    }
};
export default {
    ensureStream,
    ensureKeys,
    itSwitch
};