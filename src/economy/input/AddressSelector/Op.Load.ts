import Ux from 'ux';

const _parseConfig = (reference: any, key: any) => {
    const {config = {}} = reference.props;
    return config[key];
};
const _parseInitItem = (reference: any, key: any) => {
    const extract = _parseConfig(reference, key);
    const ajax = _parseExpr(extract);
    if (ajax) {
        return {
            field: ajax.parent,
            uri: ajax.uri,
        };
    }
};
const parseInit = (reference: any) => {
    const config: any = {};
    config.country = _parseInitItem(reference, "country");
    config.state = _parseInitItem(reference, "state");
    config.city = _parseInitItem(reference, "city");
    config.distinct = _parseInitItem(reference, "distinct");
    return config;
};
const _initParams = (reference: any) => {
    const ref = Ux.onReference(reference, 1);
    const {$app} = ref.props;
    const params: any = {};
    params.language = Ux.Env.LANGUAGE;
    if ($app && $app.is()) {
        params.sigma = $app._("sigma");
    }
    return params;
};
const _parseExpr = (expr = "") => {
    if ("string" === typeof expr) {
        const config: any = {};
        const array = expr.split(',');
        config.uri = array[0];
        config.display = array[1];
        config.parent = array[2];
        return config;
    }
};
const _ajaxUniform = (ajax: any, params: any) =>
    Ux.ajaxGet(ajax.uri, params)
    // 这里需要转config
        .then(data => Promise.resolve({data, config: ajax}));
const loadCountry = (reference: any) => {
    const country = _parseConfig(reference, "country");
    const ajax = _parseExpr(country);
    const params = _initParams(reference);
    return _ajaxUniform(ajax, params);
};
const loadSub = (key: any) => (reference: any, input: any) => {
    const city = _parseConfig(reference, key);
    const ajax = _parseExpr(city);
    const params = _initParams(reference);
    // 直接关联，使用 key
    params.key = input.key;
    return _ajaxUniform(ajax, params);
};
const loadLeaf = (reference: any) => {
    const leaf = _parseConfig(reference, "init");
    const ajax = _parseExpr(leaf);
    const params = _initParams(reference);
    // 直接关联，使用 key
    const {value} = reference.props;
    if (value) {
        params.key = value;
    }
    return _ajaxUniform(ajax, params);
};
export default {
    loadCountry,
    loadState: loadSub("state"),
    loadCity: loadSub("city"),
    loadDistinct: loadSub("distinct"),
    loadLeaf,
    parseInit,
}