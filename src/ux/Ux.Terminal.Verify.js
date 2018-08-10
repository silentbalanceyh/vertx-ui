import E from "./Ux.Error";
import U from 'underscore';

const calcKey = (key) => {
    if (!key.startsWith("_")) key = `_${key}`;
    return key;
};

const verifyRooKey = (reference, key = "") => {
    const {$hoc} = reference.state;
    key = calcKey(key);
    const value = $hoc._(key);
    if (!value) {
        const name = $hoc.name();
        return E.fxMessageError(10001, name, key);
    }
};

const verifyQuery = (key, query) => {
    key = calcKey(key);
    if (!query) {
        return E.fxMessageError(10009, key, 'query');
    }
    if (!query.projection) {
        return E.fxMessageError(10009, `${key}.query`, 'projection')
    }
    if (!U.isArray(query.projection)) {
        return E.fxMessageError(10010, `${key}.query.projection`, 'Array')
    }
    if (!query.pager) {
        return E.fxMessageError(10009, `${key}.query`, 'pager')
    }
    if (!query.sorter) {
        return E.fxMessageError(10009, `${key}.query`, 'sorter')
    }
    if (!query.criteria) {
        return E.fxMessageError(10009, `${key}.query`, 'criteria')
    }
};

const verifyOptions = (key, options) => {
    key = calcKey(key);
    if (!options) {
        return E.fxMessageError(10009, key, 'options');
    }
    if (!options['tabs.list']) {
        return E.fxMessageError(10009, `${key}.options`, 'tabs.list')
    }
};

export default {
    verifyRooKey,
    verifyQuery,
    verifyOptions
}