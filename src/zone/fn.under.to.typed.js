import __WAY from './fn.under.way.io';
import __Is from './fn.under.is.decision';
import moment from 'moment';
import Immutable from "immutable";

const toJson = (input) => {
    if ("string" === typeof input) {
        return __WAY.wayS2O(input);
    } else return input;
};

const toTime = (momentValue, timeStr) => {
    // Fix: https://github.com/silentbalanceyh/hotel/issues/358
    /*
     * 非 moment 值，直接返回原始值
     */
    if (!moment.isMoment(momentValue)) {
        return momentValue;
    }
    let defaultTime;
    if ("string" === typeof timeStr) {
        defaultTime = moment(timeStr, "HH:mm:ss");
    } else if (moment.isMoment(timeStr)) {
        defaultTime = timeStr;
    }
    if (defaultTime && defaultTime.isValid()) {
        /*
         * Copy hour, min, second
         */
        momentValue.hour(defaultTime.hour());
        momentValue.minute(defaultTime.minute());
        momentValue.second(defaultTime.second());
    }
    return momentValue;
};

const toArray = (input, column) => {
    let resultArr = [];
    if (__Is.isSet(input)) {
        resultArr = Array.from(input);
    } else if (__Is.isArray(input)) {
        resultArr = Immutable.fromJS(input).toJS();
    } else if (__Is.isTEntity(input)) {
        // Extension Logical
        const $data = input.to();
        if (__Is.isArray($data)) {
            resultArr = Immutable.fromJS($data).toJS();
        } else {
            resultArr = [];
        }
    } else {
        resultArr = [input];
    }
    if (column) {
        /*
         * Grid Layout for Array because column input
         * for example
         * [], [], [], [], []
         * column = 3
         * [
         *     [],[],[],
         *     [],[]
         * ]
         */
        const result = [];
        let row = [];
        for (let idx = 0; idx < resultArr.length; idx++) {
            row.push(resultArr[idx]);
            if (0 === (idx + 1) % column) {
                result.push(row);
                row = [];
            }
        }
        if (0 < row.length) {
            result.push(row);
        }
        return result;
    } else {
        return resultArr;
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    toJson,
    toTime,
    toArray,
}