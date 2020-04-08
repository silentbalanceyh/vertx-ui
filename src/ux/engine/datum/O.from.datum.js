import {Dsl} from "entity";

const parseDatum = (target, key) => {
    const targetKey = target[`$t_${key}`] || target[`$a_${key}`];
    if (targetKey) {
        if (targetKey.is()) {
            return targetKey;
        } else {
            return targetKey;
        }
    }
};
const _fromDatum = (reference, key) => {
    if (reference.state) {
        const parsed = parseDatum(reference.state, key);
        if (parsed) {
            return parsed;
        }
    }
};
export default (reference, key) => {
    key = key.replace(/\./g, "_");
    /*
     * 先从 props 中读取
     */
    let parsed;
    if (reference.props) {
        parsed = parseDatum(reference.props, key);
        if (!parsed) {
            parsed = _fromDatum(reference, key);
        }
    } else {
        parsed = _fromDatum(reference, key);
    }
    if (parsed) {
        return parsed;
    } else {
        return Dsl.getArray(undefined);
    }
};