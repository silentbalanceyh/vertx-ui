import Immutable from 'immutable';

const ensureStream = (reference) => {
    if (!reference.config) {
        throw new Error("[Z-Stem] The 'config' has not been initialized, please call 'init()' first.");
    }
};

const ensureKeys = (key, expected = []) => {
    const $expected = Immutable.fromJS(expected);
    if (!$expected.contains(key)) {
        throw new Error(`[Z-Stem] The 'key=${key}' is not supported in current component.`);
    }
};

const itSwitch = (target, value, callback, supportedKeys = []) => {
    if (target) {
        if ("string" === typeof target) {
            ensureKeys(target, supportedKeys);
            if (value) {
                callback(target, value);
            }
        }
    } else if ("object" === typeof target) {
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
}