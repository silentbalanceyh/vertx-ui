import Ux from 'ux';

const parseExpr = (expr = "") => {
    if ("string" === typeof expr) {
        const config = {};
        const array = expr.split(',');
        config.uri = array[0];
        config.display = array[1];
        config.parent = array[2];
        return config;
    }
};
const parseConfig = (reference, key) => {
    const {config = {}} = reference.props;
    return config[key];
};
const _parseInitItem = (reference, key) => {
    const extract = parseConfig(reference, key);
    const ajax = parseExpr(extract);
    if (ajax) {
        return {
            field: ajax.parent,
            uri: ajax.uri,
            display: ajax.display,
            parent: ajax.parent
        };
    }
};
const parseInit = (reference) => {
    const config = {};
    config.country = _parseInitItem(reference, "country");
    config.state = _parseInitItem(reference, "state");
    config.city = _parseInitItem(reference, "city");
    config.region = _parseInitItem(reference, "region");
    return config;
};
const parseAjax = (reference, key) => {
    const config = parseConfig(reference, key);
    return parseExpr(config);
};

const parseOption = (item, config, key) => {
    const option = {};
    option.value = item.key;
    option.label = item[config.display];
    option.isLeaf = "region" === key;
    option.type = key;
    option.params = Ux.clone(item);
    return option;
};

const parseResponse = (response, key) => {
    const {data = [], config = {}} = response;
    const options = [];
    data.forEach((item) => {
        if (config.display) {
            const option = parseOption(item, config, key);
            options.push(option);
        }
    });
    Ux.dgDebug({
        data, config, key
    }, "当前配置信息");
    return options;
};
export default {
    parseInit,
    parseAjax,
    parseOption,
    parseResponse
}