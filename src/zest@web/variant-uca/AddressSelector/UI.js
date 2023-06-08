import React from 'react';
import {Cascader} from 'antd';
import Op from './Op';
import __Zn from '../zero.uca.dependency';

const UCA_NAME = "AddressSelector";
const yiOptions = (data = [], config, key) => {
    const options = [];
    data.forEach(each => {
        const option = Op.parseOption(each, config[key], key);
        options.push(option);
    });
    return options;
};

const yiRegion = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    Op.loadRegion(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const regions = response.data;
        if (__Zn.isArray(regions)) {
            selected.children = yiOptions(regions, metadata, 'region');
            // regionId
            const regionId = remoteData['regionId'];
            defaultValue.push(regionId);
            __Zn.dgDebug({options, metadata, remoteData, defaultValue}, "最终Cascader数据：");
            resolve({options})
        } else {
            reject("Region：数据错误，请检查数据！");
        }
    }));
const yiCity = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    Op.loadCity(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const cities = response.data;
        if (__Zn.isArray(cities)) {
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
    Op.loadState(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const states = response.data;
        if (__Zn.isArray(states)) {
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
    Op.loadCountry(reference).then(response => new Promise((resolve, reject) => {
        const countries = response.data;
        if (__Zn.isArray(countries)) {
            // 1.加载国家数据
            const options = yiOptions(countries, metadata, 'country');
            if (__Zn.isArray(options)) {
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
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {value} = reference.props;
    // 先加载国家数据
    if (undefined === value) {
        // 添加流程
        Op.loadCountry(reference)
            .then(Op.onCallback(reference, "country"));
    } else {
        // 反向读取专用处理，用于在更新流程时使用，此时必须包含
        // optionJsx.config.init配置必须存在
        Op.loadLeaf(reference).then(response => {
            // 先解开数据
            const {config = {}} = response;
            const remoteData = response.data ? response.data : {};
            // 先读取国家数据
            const metadata = Op.parseInit(reference);
            // 国家数据处理
            __Zn.dgDebug({
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
                .then(({options}) => {
                    const stateUp = {
                        options: __Zn.clone(options),
                        defaultValue: __Zn.clone(defaultValue)
                    };
                    __Zn.of(reference).in(stateUp).handle(() =>
                        /*
                         * 新版版和旧版本不同的点在于，旧版本会执行两次初始化，而旧版本
                         * 在最初就已经绑定好相关信息执行了，旧流程：
                         * 1）undefined
                         * 2）初始化完成后触发 Updated（onChange触发）
                         * 3）然后执行第二次初始化带值
                         *
                         * 新流程：
                         * 1）最早就已经有值了，Ajax处理完成后不会初始化
                         * 2）手动 callback 执行初始化流程（onChange触发）
                         * 此处多写了一个 () =>
                         */
                        Op.onChange(reference)(defaultValue, options))
                    // reference.?etState(stateUp,
                    //     /*
                    //      * 新版版和旧版本不同的点在于，旧版本会执行两次初始化，而旧版本
                    //      * 在最初就已经绑定好相关信息执行了，旧流程：
                    //      * 1）undefined
                    //      * 2）初始化完成后触发 Updated（onChange触发）
                    //      * 3）然后执行第二次初始化带值
                    //      *
                    //      * 新流程：
                    //      * 1）最早就已经有值了，Ajax处理完成后不会初始化
                    //      * 2）手动 callback 执行初始化流程（onChange触发）
                    //      */
                    //     () => Op.onChange(reference)(defaultValue, options));
                });
        })
    }
}
const componentUp = (reference, prevProps) => {
    if (reference.props.value) {
        // 1. 检查 是否发生了改变
        if (reference.props.value !== prevProps.value) {
            // 读取初始值，一般用于重设
            const meta = reference.props['data-__meta'];
            if (meta) {
                const initValue = meta['initialValue'];
                // 直接更新
                if (initValue === reference.props.value) {
                    componentInit(reference);
                }
            }
        }
    } else {
        // 清空处理
        const {fnChange} = reference.props;
        if (__Zn.isFunction(fnChange)) {
            // 清空处理
            fnChange(undefined);
        }
    }
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, prevProps);
    }

    render() {
        const {options = [], defaultValue} = this.state;
        const {placeholder} = this.props;
        const attrs = {};
        if (placeholder) attrs.placeholder = placeholder;
        // 设置默认值
        if (defaultValue) {
            attrs.value = defaultValue;
        }
        attrs.options = options;

        const WebField = __Zn.V4InputGroup;
        return (
            <WebField>
                <Cascader {...attrs}
                          loadData={Op.yoData(this)}
                          onChange={Op.onChange(this)}
                          style={{minWidth: 280}}/>
            </WebField>
        );
    }
}

export default Component;