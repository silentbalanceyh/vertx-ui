import T from './I.common';
import Abs from '../../../abyss';

export default (field, value = {}, condition = {}) => {
    let fieldNorm = "";
    if (!Abs.isEmpty(value)) {
        fieldNorm = field + "," + value.op;
    } else {
        fieldNorm = field + ",c";
    }
    const text = value.text ? value.text : "";
    T.analyzePair(condition, fieldNorm, text);
}