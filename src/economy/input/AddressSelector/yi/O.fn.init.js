import T from '../util';
import U from 'underscore';
import Ux from "ux";

const yiOptions = (data = [], config, key) => {
    const options = [];
    data.forEach(each => {
        const option = T.parseOption(each, config[key], key);
        options.push(option);
    });
    return options;
};

const yiRegion = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    T.loadRegion(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const regions = response.data;
        if (U.isArray(regions)) {
            selected.children = yiOptions(regions, metadata, 'region');
            // regionId
            const regionId = remoteData['regionId'];
            defaultValue.push(regionId);
            Ux.dgDebug({options, metadata, remoteData, defaultValue}, "最终Cascader数据：");
            resolve({options})
        } else {
            reject("Region：数据错误，请检查数据！");
        }
    }));
const yiCity = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    T.loadCity(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const cities = response.data;
        if (U.isArray(cities)) {
            // 3.加载城市数据
            const children = yiOptions(cities, metadata, 'city');
            // 连接
            selected.children = children;
            // cityId
            const cityId = remoteData[metadata.region.field];
            defaultValue.push(cityId);
            const hit = children.filter(option => cityId === option.value);
            if (1 === hit.length) {
                resolve({options, selected: hit[0]});
            } else {
                reject("City: 数据错误，请检查数据！");
            }
        }
    }));
const yiState = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    T.loadState(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const states = response.data;
        if (U.isArray(states)) {
            // 2.加载省会数据
            const children = yiOptions(states, metadata, 'state');
            // 连接
            selected.children = children;
            // stateId
            const stateId = remoteData[metadata.city.field];
            defaultValue.push(stateId);
            const hit = children.filter(option => stateId === option.value);
            if (1 === hit.length) {
                resolve({options, selected: hit[0]});
            } else {
                reject("State: 数据错误，请检查数据！");
            }
        }
    }));
const yiCountry = (reference, metadata, remoteData, defaultValue = []) =>
    T.loadCountry(reference).then(response => new Promise((resolve, reject) => {
        const countries = response.data;
        if (U.isArray(countries)) {
            // 1.加载国家数据
            const options = yiOptions(countries, metadata, 'country');
            if (U.isArray(options)) {
                // countryId
                const countryId = remoteData[metadata.state.field];
                const hit = options.filter(option => countryId === option.value);
                if (1 === hit.length) {
                    defaultValue.push(countryId);
                    resolve({options, selected: hit[0]});
                } else {
                    reject("Country: 数据错误，请检查数据！");
                }
            } else {
                reject("国家数据格式错误！");
            }
        }
    }));
export default (reference) => {
    const {value} = reference.props;
    // 先加载国家数据
    if (undefined === value) {
        // 添加流程
        T.loadCountry(reference)
            .then(T.onCallback(reference, "country"));
    } else {
        // 反向读取专用处理，用于在更新流程时使用，此时必须包含
        // optionJsx.config.init配置必须存在
        T.loadLeaf(reference).then(response => {
            // 先解开数据
            const {config = {}} = response;
            const remoteData = response.data ? response.data : {};
            // 先读取国家数据
            const metadata = T.parseInit(reference);
            // 国家数据处理
            Ux.dgDebug({
                remoteData,
                config,
                metadata
            }, "逆向初始化数据");
            // 国家数据处理专用：/api/countries
            const defaultValue = [];
            yiCountry(reference, metadata, remoteData, defaultValue)
                .then(yiState(reference, metadata, remoteData, defaultValue))
                .then(yiCity(reference, metadata, remoteData, defaultValue))
                .then(yiRegion(reference, metadata, remoteData, defaultValue))
                .then(({options}) => reference.setState({
                    options: Ux.clone(options),
                    defaultValue: Ux.clone(defaultValue)
                }));
        })
    }
}