import Value from "../Ux.Value";

const after = (value, to) => {
    const fromValue = Value.convertTime(value);
    to = Value.convertTime(to);
    return fromValue.isAfter(to);
};

const before = (value, to) => {
    const fromValue = Value.convertTime(value);
    to = Value.convertTime(to);
    return to.isAfter(fromValue);
};
const less = (value, to) => value < to;
const lessOr = (value, to) => value <= to;
const greater = (value, to) => value > to;
const greaterOr = (value, to) => value >= to;
const equal = (value, to) => value === to;
const diff = (value, to) => value !== to;

export default {
    after,
    before,
    less,
    lessOr,
    greater,
    greaterOr,
    equal,
    same: equal,
    diff,
}