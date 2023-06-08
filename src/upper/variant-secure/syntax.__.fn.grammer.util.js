import Ux from 'ux';
// View, Single, H
const syntaxView = (reference, param = {}, flag) => {
    const {webValue: {data = []}, webKv = {}} = param;
    if (0 === data.length) {
        return {}
    }
    // Single View
    if (1 === data.length) {
        const found = data[0];
        const object = found[flag];
        if (object) {
            return object[webKv.to];
        } else return {};
    }
    return {};
}
const __visit = (value = {}, kv = {}, flag) => {
    const {
        dmRow: h = {},
        dmQr: q = {},
        dmColumn: v = []
    } = value;
    const valueHQV = {h, q, v};
    let values = [];
    const found = valueHQV[flag];
    if (Ux.isArray(found)) {
        values = values.concat(found);
    } else {
        if (Ux.isArray(found[kv.to])) {
            values = values.concat(found[kv.to])
        }
    }
    return values;
}
const syntaxVisits = (reference, param = {}, flag) => {
    const {webValue: {data = []}, webKv = {}} = param;
    const visitants = {}
    data.map(each => each.visitant)
        .filter(item => !!item)
        .forEach(visitant => Object.assign(visitants, visitant));
    let values = [];
    Object.values(visitants)
        .forEach((value = {}) => values = values.concat(__visit(value, webKv, flag)))
    return values;
}
const syntaxVisit = (reference, param = {}, flag) => {
    const {webValue: {data = []}, webKv = {}, keyVisit} = param;
    const visitants = {}
    data.map(each => each.visitant)
        .filter(item => !!item)
        .forEach(visitant => Object.assign(visitants, visitant));
    if (keyVisit && visitants.hasOwnProperty(keyVisit)) {
        const value = visitants[keyVisit];
        return __visit(value, webKv, flag);
    } else return [];
}
export default {
    syntaxView,
    syntaxVisit,
    syntaxVisits,
}