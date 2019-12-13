import U from 'underscore';

const analyzeField = (field) => {
    if (field && "string" === typeof field) {
        const cond = {};
        const divide = field.split(',');
        cond.field = divide[0];
        if (1 === divide.length) {
            cond.op = "=";
        } else {
            cond.op = divide[1];
        }
        return cond;
    }
};
const analyzeBool = (value) => {
    if (value) {
        if (U.isArray(value)) {
            return value
                .filter(item => "string" === typeof item)
                .map(item => analyzeBool(item))
        } else {
            if ("true" === value) {
                return true;
            } else if ("false" === value) {
                return false;
            } else {
                /*
                 * 返回该值本身
                 */
                return value;
            }
        }
    }
};
const analyzePair = (condition = {}, field, value) => {
    if (value) {
        if (U.isArray(value)) {
            if (0 === value.length) {
                condition[field] = "__DELETE__";
            } else {
                condition[field] = value;
            }
        } else {
            condition[field] = value;
        }
    } else {
        if (undefined === value) {
            condition[field] = "__DELETE__";
        }
    }
};
export default {
    analyzeField,
    analyzeBool,
    analyzePair
}