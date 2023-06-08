import Ux from 'ux';

const dataKey = (source = [], value, kv = {}) => {
    const initial = Ux.isArray(value) ? value : [];
    const dataKey = {};
    dataKey.keys = source.filter(item => initial.includes(item[kv.to]))
        .map(item => item[kv.from]);
    dataKey.keysAll = source
        .map(item => item[kv.from]);
    return dataKey;
}
const dataDFT = (compiled = {}, param) => {
    const {keys, keysAll} = compiled;
    const {
        paramDefault
    } = param.webData;
    if (0 === keys.length) {
        return "ALL" === paramDefault ? new Set(keysAll) : new Set();
    } else {
        return new Set(keys);
    }
}
const dataValue = (source = [], param, kv = {}) => {
    const {webSelected = []} = param;
    return source.filter(item => webSelected.includes(item[kv.from]))
        .map(item => item[kv.to]);
}
const dataRequest = (webRequest = {}, vv = {}) => {
    const {
        paramView = {},
        paramVisit
    } = vv;
    const requestData = Ux.clone(paramView);
    if (paramVisit) {
        // visitRequest
        const visitant = {};
        if (paramVisit['seekKey']) {
            visitant[paramVisit['seekKey']] = {
                ...paramVisit,
                ...webRequest
            }
        }
        requestData.visitant = visitant;
    } else {
        const {
            h: rows = {},
            q: criteria = {},
            v: projection = [],
        } = webRequest;
        Object.assign(requestData, Ux.valueValid({
            rows,
            criteria,
            projection
        }));
    }
    return requestData;
}
export default {
    dataDFT,
    dataValue,
    dataRequest,
    dataKey
}