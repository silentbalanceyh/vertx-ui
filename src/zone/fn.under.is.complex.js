import __IS_D from './fn.under.is.decision';
import __IS_B from './fn.under.is.business';
import __V from './v.feature.symbol';
import Immutable from "immutable";

const __Is = {
    ...__IS_B,
    ...__IS_D
}

const isDiff = (left, right) => {
    const leftValue = __Is.isTEntity(left) ? left.to() : left;
    const rightValue = __Is.isTEntity(right) ? right.to() : right;
    // 不同类型
    if (leftValue && rightValue) {
        if (__Is.isFunction(leftValue) || __Is.isFunction(rightValue)) {
            // 函数类型不比较返回 false
            return false;
        } else if (__Is.isObject(leftValue) && __Is.isObject(rightValue)) {
            // 对象类型，Immutable比较
            const $left = Immutable.fromJS(left);
            const $right = Immutable.fromJS(right);
            return !Immutable.is($left, $right);
        } else if (__Is.isArray(leftValue) && __Is.isArray(rightValue)) {
            // 数组类型，Immutable比较
            const $left = Immutable.fromJS(left);
            const $right = Immutable.fromJS(right);
            return !Immutable.is($left, $right);
        } else if (__Is.isSet(leftValue) && __Is.isSet(rightValue)) {
            // 集合类型
            const $left = Immutable.Set(Array.from(left));
            const $right = Immutable.Set(Array.from(right));
            return !Immutable.is($left, $right);
        } else {
            // 直接值比较
            return leftValue !== rightValue;
        }
    } else return leftValue !== rightValue;
};
const isParent = (parent = {}, input, field) => {
    if (field) {
        return input[field] === parent.key;
    } else {
        if (input.parent) {
            return parent.key === input.parent;
        } else {
            return parent.key === input.parentId;
        }
    }
}
const isRange = (input, literal) => {
    if (input && literal
        && !isNaN(input)
        && "string" === typeof literal) {
        const [start, end] = literal.split(',');
        if (start && end) {
            // (xx -> [xx
            let checked;
            const minV = parseInt(start.substring(1), 10);
            if (start.startsWith("(")) {
                checked = (input > minV);
            } else {
                checked = (input >= minV);
            }
            if (!checked) {
                return false;
            }
            // xx) -> xx]
            const maxV = parseInt(end.substring(0, end.length - 1), 10);
            if (start.endsWith(")")) {
                checked = (input < maxV);
            } else {
                checked = (input <= maxV);
            }
            return checked;
        } else return false;
    } else return false;
}

const isQr = (config = {}) => {
    const ajaxRef = config.ajax;
    if (__Is.isObject(ajaxRef)) {
        if (ajaxRef.hasOwnProperty('magic')) {
            /*
             * 非查询引擎模式，直接配置
             * magic: {
             *
             * }
             */
            return false;
        } else {
            /*
             * 查询引擎模式，一般配置，必须包含
             * params.criteria: {
             *
             * }
             */
            if (ajaxRef.hasOwnProperty('params')) {
                if (__Is.isObject(ajaxRef.params)) {
                    return ajaxRef.params.hasOwnProperty('criteria');
                } else return false;
            } else return false;
        }
    } else {
        console.error(config);
        throw new Error("[ Ux ] 查询引擎方法不可调用于不带 ajax 配置的输入");
    }
};
const isQrArg = (query) => {
    if (!query) {
        // query 不存在
        return false;
    }
    if (!__Is.isObject(query) || __Is.isEmpty(query)) {
        // query 必须是 Object，且 query 不为空
        return false;
    }
    /*
     * 必须包含分页参数 pager 且 pager 中必须包含 page / size
     */
    const pager = query[__V.K_ARG.QR.PAGER];
    if (!__Is.isObject(pager) || !__Is.isNumber(pager.page) || !__Is.isNumber(pager.size)) {
        return false;
    }
    /*
     * 必须包含 criteria
     */
    return !!query.criteria;
}
export default {
    isDiff,
    isSame: (left, right) => !isDiff(left, right),

    isParent,
    isRange,
    isQr,
    isQrArg,
}