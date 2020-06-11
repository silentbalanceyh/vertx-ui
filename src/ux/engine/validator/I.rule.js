import Value from "../../element";

const after = (value, to) => {
    const fromValue = Value.valueTime(value);
    to = Value.valueTime(to);
    return fromValue.isAfter(to);
};

const before = (value, to) => {
    const fromValue = Value.valueTime(value);
    to = Value.valueTime(to);
    return to.isAfter(fromValue);
};
const less = (value, to) => value < to;
const lessOr = (value, to) => value <= to;
const great = (value, to) => value > to;
const greatOr = (value, to) => value >= to;
const equal = (value, to) => value === to;
const diff = (value, to) => value !== to;

export default {
    after,
    before,
    less,
    lessOr,
    great,
    greatOr,
    equal,
    same: equal,
    diff,
};