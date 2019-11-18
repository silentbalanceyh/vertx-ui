import Ux from 'ux';
import U from 'underscore';

const _yoLabel = (value, config = {}, reference) => {
    const source = config.source;
    const extracted = Ux.elementUniqueDatum(reference, source, "identifier", value);
    return extracted ? extracted.alias : "";
};

const _yoData = (data = [], config = {}, reference) => {
    const {current = {}} = reference.props;
    const result = {};
    data.forEach(each => {
        console.info(each);
    })
};

const yiPage = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    const $config = Ux.clone(config);
    const header = Ux.fromHoc(reference, "header");
    if (header) {
        $config.header = Ux.clone(header);
    }
    /*
     * 设置函数用于处理数据
     */
    state.$config = $config;
    state.$ready = true;
    reference.setState(state);
};
/*
 * 分组处理数据信息
 */
const yoTabs = (reference) => {
    const {$config = {}} = reference.state;
    const {data = {}} = reference.props;
    /*
     * 根据数据计算
     */
    let up = {};
    let down = {};
    if (U.isArray($config['relation'])) {
        const $relations = Ux.immutable($config['relation']);
        if ($relations.contains("UP")) {
            up = _yoData(data.up, $config, reference);
        }
        if ($relations.contains("DOWN")) {
            down = _yoData(data.down, $config, reference);
        }
    }

};
export default {
    yiPage,
    yoTabs,
}