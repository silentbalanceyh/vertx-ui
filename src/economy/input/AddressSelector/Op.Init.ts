import Split from './Op.Load';
import Ux from 'ux';
import * as U from 'underscore';

const loadData = (reference: any) => (selectedOptions) => {
    // 被选中的option
    const option = selectedOptions[selectedOptions.length - 1];
    option.loading = true;
    if ("country" === option.type) {
        // 选中的是国家
        Split.loadState(reference, option.params)
            .then(_callback(reference, "state", option));
    } else if ("state" === option.type) {
        Split.loadCity(reference, option.params)
            .then(_callback(reference, "city", option));
    } else if ("city" === option.type) {
        Split.loadDistinct(reference, option.params)
            .then(_callback(reference, "distinct", option));
    }
};

const _executeData = (item: any, config: any, key) => {
    const option: any = {};
    option.value = item.key;
    option.label = item[config.display];
    option.isLeaf = "distinct" === key;
    option.type = key;
    option.params = Ux.clone(item);
    return option;
};

const _findSelected = (
    options: any = [],
    selected: any = {},
    config: any = {},
    key
) => {
    // 搜索树一直往下找到对应的节点
    let result;
    let source = [];
    if ("state" === key) {
        // 选中项就是国家信息，当前选择项，返回 selected 以及 options中的数据都可
        // 国家到省份
        source = options;
    } else if ("city" === key) {
        // 省份到城市
        source = options.flatMap(item => item.children).filter(item => !!item);
    } else if ("distinct" === key) {
        // 城市到二级县
        const states = options.flatMap(item => item.children);
        source = states.flatMap(item => item.children).filter(item => !!item);
    }
    const filtered = source.filter(option => option.value === selected.value);
    if (1 === filtered.length) {
        result = filtered[0];
    }
    return result;
};

const _executeResponse = (response: any, key) => {
    const {data = [], config = {}} = response;
    const options = [];
    data.forEach((item: any) => {
        if (config.display) {
            const option = _executeData(item, config, key);
            options.push(option);
        }
    });
    Ux.dgDebug({
        data, config, key
    }, "当前配置信息");
    return options;
};

const _callback = (reference: any, key, parent: any = undefined) => (response: any) => {
    if ("string" === typeof key) {
        Ux.dgDebug(response, "响应数据");
        // 设置状态
        let state: any = reference.state;
        if (!state) state = {};
        // options设置
        let options = [];
        const {config = {}} = response;
        if ("country" === key) {
            // key = country 国家
            options = _executeResponse(response, key);
        } else {
            // key = state 省会
            Ux.dgDebug(state, "当前组件状态信息：");
            const previous = state.options;
            if (0 === previous.length) {
                console.error("没有国家信息，错误！");
                if (parent) parent.loading = false;
            } else {
                // 基本内容
                options = Ux.clone(previous);
                // 选中被选项
                const selected: any = _findSelected(options, parent, config, key);
                // 追加选中项
                const stateArray = _executeResponse(response, key);
                // 选中项的children追加
                if (selected) {
                    // 这里不能使用parent了，因为要更新
                    selected.children = stateArray;
                    selected.loading = false;
                }
            }
        }
        // 暂定options
        state.options = options;
        // 这里必须clone
        reference.setState(Ux.clone(state));
    }
};
const _initOptions = (data = [], config, key) => {
    const options = [];
    data.forEach(each => {
        const option: any = _executeData(each, config[key], key);
        options.push(option);
    });
    return options;
};
const _initData = (reference, response: any = {}) => {
    // 先解开数据
    const {config = {}} = response;
    const remoteData = response.data ? response.data : {};
    // 先读取国家数据
    const metadata = Split.parseInit(reference);
    // 国家数据处理
    Ux.dgDebug({
        remoteData,
        config,
        metadata
    }, "逆向初始化数据");
    // 国家数据处理专用：/api/countries
    const defaultValue = [];
    _initCountry(reference, metadata, remoteData, defaultValue)
        .then(_initState(reference, metadata, remoteData, defaultValue))
        .then(_initCity(reference, metadata, remoteData, defaultValue))
        .then(_initDistinct(reference, metadata, remoteData, defaultValue))
        .then(({options}) => reference.setState({
            options: Ux.clone(options),
            defaultValue: Ux.clone(defaultValue)
        }));
};

const _initDistinct = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    Split.loadDistinct(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const distincts = response.data;
        if (U.isArray(distincts)) {
            selected.children = _initOptions(distincts, metadata, 'distinct');
            // distinctId
            const distinctId = remoteData['distinctId'];
            defaultValue.push(distinctId);
            Ux.dgDebug({options, metadata, remoteData, defaultValue}, "最终Cascader数据：");
            resolve({options})
        } else {
            reject("Distinct：数据错误，请检查数据！");
        }
    }));

const _initCity = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    Split.loadCity(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const cities = response.data;
        if (U.isArray(cities)) {
            // 3.加载城市数据
            const children = _initOptions(cities, metadata, 'city');
            // 连接
            selected.children = children;
            // cityId
            const cityId = remoteData[metadata.distinct.field];
            defaultValue.push(cityId);
            const hit = children.filter(option => cityId === option.value);
            if (1 === hit.length) {
                resolve({options, selected: hit[0]});
            } else {
                reject("City: 数据错误，请检查数据！");
            }
        }
    }));

const _initState = (reference, metadata, remoteData, defaultValue = []) => ({options, selected}) =>
    Split.loadState(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const states = response.data;
        if (U.isArray(states)) {
            // 2.加载省会数据
            const children = _initOptions(states, metadata, 'state');
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

const _initCountry = (reference, metadata, remoteData, defaultValue = []) =>
    Split.loadCountry(reference).then(response => new Promise((resolve, reject) => {
        const countries = response.data;
        if (U.isArray(countries)) {
            // 1.加载国家数据
            const options = _initOptions(countries, metadata, 'country');
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
// 只做一级初始化（初始化国家）
const _initEmpty = (reference: any) => {
    // 国家数据读取，暂时只支持 sigma, language作为主体查询条件
    Split.loadCountry(reference)
        .then(_callback(reference, "country"))
};
const _initExisting = (reference: any) => {
    // 反向读取专用处理，用于在更新流程时使用，此时必须包含
    // optionJsx.config.init配置必须存在
    Split.loadLeaf(reference)
        .then(response => _initData(reference, response));
};
const initOptions = (reference: any) => {
    const {value} = reference.props;
    // 先加载国家数据
    if (undefined === value) {
        // 添加流程
        _initEmpty(reference);
    } else {
        // 更新流程
        _initExisting(reference);
    }
};
export default {
    loadData,
    initOptions
}