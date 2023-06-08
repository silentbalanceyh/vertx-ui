import U from "underscore";
import __V_MODEL from './v.modello.type';
import dayjs from "dayjs";

const isArray = (input) => !!input && U.isArray(input);
const isFunction = (input) => !!input && U.isFunction(input);
const isObject = (input, includeArray = false) => {
    if (includeArray) {
        return U.isObject(input)
    }
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
}
const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return true; // undefined 也是 empty
};
const isSet = (input) => U.isSet(input);
const isMoment = (input) => dayjs.isDayjs(input);
const isTEntity = (input) => {
    // __type()
    if (!input) return false;
    return isFunction(input['__type']);
}
const isTObject = (input) => {
    if (isTEntity(input)) {
        return __V_MODEL.E_TYPE.DATA_OBJECT === input.__type();
    } else return false;
}
const isNodeList = (input) => NodeList.prototype.isPrototypeOf(input);
const isSubset = (input, source) => {
    if (isObject(input) && isObject(source)) {
        let subset = true;
        // Checked Finished must be 1 size
        Object.keys(input).forEach(field => {
            const expected = input[field];
            if (expected !== source[field]) {
                subset = false;
            }
        });
        return subset;
    } else return false;
}
export default {
    isTEntity,
    isTObject,
    isNull: (input) => undefined === input || null === input,

    isNodeList,
    isMoment,

    isSet,
    isArray,
    isCollection: (input) => (isSet(input) || isArray(input)),
    isObject,
    isSubset,

    isFunction,
    isEmpty,
    isBlank: (input) => {
        if ("string" !== typeof input) {
            return false;
        }
        if (0 < input.length) {
            return /^\s*$/.test(input);
        } else {
            return true;
        }
    },
    isNotEmpty: (input) => !isEmpty(input),
}