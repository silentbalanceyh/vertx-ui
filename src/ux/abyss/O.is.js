import {DataArray, DataObject} from "entity";
import Immutable from "immutable";
import U from "underscore";

const isDiff = (left, right) => {
    const leftValue = (left instanceof DataObject ||
        left instanceof DataArray) ? left.to() : left;
    const rightValue = (right instanceof DataObject ||
        right instanceof DataArray) ? right.to() : right;
    if (leftValue && rightValue) {
        const $left = Immutable.fromJS(left);
        const $right = Immutable.fromJS(right);
        return !Immutable.is($left, $right);
    } else return leftValue !== rightValue;
};

const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return true; // undefined 也是 empty
};

const isObject = (input) => {
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
};
const isIn = (input, array = []) => {
    if (U.isArray(array)) {
        const $array = Immutable.fromJS(array);
        return $array.contains(input);
    } else return false;
};
const isCn = (input) => /.*[\u4e00-\u9fa5]+.*$/.test(input);
export default {
    isObject,
    isEmpty,
    isDiff,
    isIn,
    isCn,
}