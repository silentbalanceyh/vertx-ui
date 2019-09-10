import U from 'underscore';

const slice = (input, ...keys) => {
    if (0 < keys.length) {
        const fnClone = (item) => {
            const newItem = {};
            keys.filter(each => item.hasOwnProperty(each))
                .forEach(key => newItem[key] = item[key]);
            return newItem;
        };
        if (U.isArray(input)) {
            return input.map(each => fnClone.apply(this, [each].concat(keys)));
        } else if (U.isObject(input)) {
            return fnClone.apply(this, [input].concat(keys));
        } else return {};
    } else return {};
};
const Letter = {
    UPPER: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    LOWER: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
};
const sequence = (input, mode = "DIGEST") => {
    if ("UPPER" === mode) {
        return Letter.UPPER[input - 1];
    } else if ("LOWER" === mode) {
        return Letter.LOWER[input - 1];
    } else return input;
};
export default {
    slice,
    sequence,
}