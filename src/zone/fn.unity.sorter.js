import __Is from './fn.under.is.decision';
import __Tv from './fn.assort.value.datetime';

const sortString = (left = "", right = "", asc = true) => {
    const minLen = Math.max(left.length, right.length);
    let order = 0;
    for (let idx = 0; idx < minLen; idx++) {
        let leftCode = left.charCodeAt(idx);
        let rightCode = right.charCodeAt(idx);
        // 空白的处理
        if (leftCode !== rightCode) {
            // 修正长度不等的时候的基础算法
            if (isNaN(leftCode)) leftCode = 0;
            if (isNaN(rightCode)) rightCode = 0;
            if (asc) {
                order = leftCode - rightCode;
            } else {
                order = rightCode - leftCode;
            }
            break;
        }
    }
    return order;
};
const sortDate = (left, right, asc = true) => {
    const leftDate = __Tv.valueDatetime(left);
    const rightDate = __Tv.valueDatetime(right);
    if (__Is.isMoment(leftDate) && __Is.isMoment(rightDate)) {
        if (asc) {
            return leftDate.isBefore(rightDate) ? -1 : 1;
        } else {
            return leftDate.isBefore(rightDate) ? 1 : -1;
        }
    } else return 0;
};
const sortT = (left, right, asc = true) => {
    if ("string" === typeof left && "string" === typeof right) {
        /*
         * 两个字符串
         */
        return sortString(left, right, asc);
    } else if ("number" === typeof left && "number" === typeof right) {
        /*
         * 两个数值
         */
        if (asc) {
            return left - right;
        } else {
            return right - left;
        }
    } else if ("boolean" === typeof left && "boolean" === typeof right) {
        return sortT(left.toString(), right.toString(), asc);
    }
};
const sorterObject = (input = {}) => {
    const normalized = {};
    const keys = Object.keys(input).sort((left, right) => sortString(left, right));
    keys.forEach(key => normalized[key] = input[key]);
    return normalized;
};
export default {
    sorterObject,
    sorterAsc: (left, right, key) => key ? sortString(left[key], right[key]) : sortString(left, right),
    sorterAscT: (left, right, key) => key ? sortT(left[key], right[key]) : sortT(left, right),
    sorterAscD: (left, right, key) => key ? sortDate(left[key], right[key]) : sortDate(left, right),
    sorterDesc: (left, right, key) => key ? sortString(left[key], right[key], false) : sortString(left, right, false),
    sorterDescT: (left, right, key) => key ? sortT(left[key], right[key], false) : sortT(left, right, false),
    sorterDescD: (left, right, key) => key ? sortDate(left[key], right[key], false) : sortDate(left, right, false),
}