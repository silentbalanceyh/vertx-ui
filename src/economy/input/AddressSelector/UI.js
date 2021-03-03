import React from 'react';
import {Cascader, Input} from 'antd';
import Op from './Op';
import Ux from "ux";

/**
 * ## 「组件」`AddressSelector`
 *
 * 地址选择器
 *
 * ```js
 * import { AddressSelector } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * #### 0.1. Json配置
 *
 * ```json
 * {
 *      "metadata": "regionId,选择地址,12,,,placeholder=选择地址",
 *      "optionJsx.config.ajax": "DIRECT",
 *      "optionJsx.config.country": "/api/countries,name",
 *      "optionJsx.config.state": "/api/states/query/:key,name,countryId",
 *      "optionJsx.config.city": "/api/cities/query/:key,name,stateId",
 *      "optionJsx.config.region": "/api/regions/query/:key,name,cityId",
 *      "optionJsx.config.init": "/api/regions/meta/:key"
 * }
 * ```
 *
 * ### 0.2. Js注入
 *
 * ```js
 * // 调用2阶函数执行渲染，最终传入`ExForm`组件。
 * const jsx = {
 *      regionId: Ux.ai2AddressSelector(Op.onChange)
 * };
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Any|Ant Form给当前组件传入的值。|
 * |reference||props|React|父引用，遵循Zero Ui的规范，该变量为固定变量，引用父组件。|
 * |config|ajax|props|String|地址选择器的Ajax类型设置，目前支持两种`DIRECT | QR`。|
 * |config|country|props|String|读取国家数据专用Ajax配置。|
 * |config|state|props|String|读取省会数据专用Ajax配置。|
 * |config|city|props|String|读取城市数据专用Ajax配置。|
 * |config|region|props|String|读取区域数据专用Ajax配置。|
 * |config|init|props|String|初始化数据专用Ajax配置。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 关于流程
 *
 * * 如果value无值，则只读取国家数据，执行country加载。
 * * 如果value有值，则执行初始化数据，走完加载全流程。
 *
 * #### 3.2. 关于请求初始参数
 *
 * 初始参数表格如下
 *
 * |参数名|说明|
 * |:---|:---|
 * |language|环境变量中配置`Z_LANGUAGE`，当前应用运行的语言信息。|
 * |sigma|从`$app`变量（应用配置）中读取`sigma`变量，可租户，可应用分割。|
 * |key|直接读取`props`中的value（Ant Form自定义组件专用字段）。|
 *
 * ### 4. 配置详解
 *
 * > 整个加载流程全部走GET方法，而不走POST方法，这是组件限制，底层调用`Ux.ajaxGet`实现。
 *
 * #### 4.1. init节点
 *
 * 该节点只有一个路径信息，没有其他信息。
 *
 * ```js
 * /api/regions/meta/:key
 * ```
 *
 * #### 4.2. state,city,region节点
 *
 * 中间节点有三个，对应省会、城市、区域三个维度，格式都如：
 *
 * ```
 * <uri>,<responseField>,<requestField>
 * ```
 *
 * #### 4.3. country节点
 *
 * 顶层节点主要针对国家，格式如：
 *
 * ```
 * <uri>,<responseField>
 * ```
 *
 * #### 4.4. 节点语法
 *
 * 上述表达式是这三种节点的专用表达式
 *
 * |参数名|说明|
 * |:---|:---|
 * |uri|读取当前数据的Ajax路径。|
 * |responseField|读取的Array数据中需要显示的字段信息，如使用name则响应数据中使用name作为显示字段。|
 * |requestField|上层请求数据，最终会转换成key信息，（顶层国家不需要该配置）。|
 *
 * @memberOf module:web-input
 * @method AddressSelector
 */
// =====================================================
// componentInit/componentUp
// =====================================================
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
        if (Ux.isArray(regions)) {
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
    Op.loadCity(reference, selected.params).then(response => new Promise((resolve, reject) => {
        const cities = response.data;
        if (Ux.isArray(cities)) {
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
        if (Ux.isArray(states)) {
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
        if (Ux.isArray(countries)) {
            // 1.加载国家数据
            const options = yiOptions(countries, metadata, 'country');
            if (Ux.isArray(options)) {
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
        if (Ux.isFunction(fnChange)) {
            // 清空处理
            fnChange(undefined);
        }
    }
};

class Component extends React.PureComponent {
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
        return (
            <Input.Group>
                <Cascader {...attrs}
                          loadData={Op.yoData(this)}
                          onChange={Op.onChange(this)}
                          style={{minWidth: 280}}/>
            </Input.Group>
        );
    }
}

export default Component;