import Ux from 'ux';
import I from './O.parser';

const _initParams = (reference) => {
    const ref = Ux.onReference(reference, 1);
    const {$app} = ref.props;
    const params = {};
    params.language = Ux.Env['LANGUAGE'];
    if ($app && $app.is()) {
        params.sigma = $app._("sigma");
    }
    return params;
};
const _ajaxUniform = (ajax, params) =>
    Ux.ajaxGet(ajax.uri, params)
        // 这里需要转config
        .then(data => Ux.promise({data, config: ajax}));
const loadCountry = (reference) => {
    const ajax = I.parseAjax(reference, "country");
    const params = _initParams(reference);
    return _ajaxUniform(ajax, params);
};
const loadSub = (key) => (reference, input) => {
    const ajax = I.parseAjax(reference, key);
    const params = _initParams(reference);
    // 直接关联，使用 key
    params.key = input.key;
    return _ajaxUniform(ajax, params);
};
const loadLeaf = (reference) => {
    const ajax = I.parseAjax(reference, "init");
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
    loadRegion: loadSub("region"),
    loadLeaf
}