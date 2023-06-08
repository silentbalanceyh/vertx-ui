import __Zn from '../zero.uca.dependency';
// =====================================================
// 解析配置部分
// =====================================================
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
    option.params = __Zn.clone(item);
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
    __Zn.dgDebug({
        data, config, key
    }, "当前配置信息");
    return options;
};
// =====================================================
// 数据加载部分
// =====================================================
const _initParams = (reference) => {
    const ref = __Zn.onReference(reference, 1);
    const {$app} = ref.props;
    const params = {};
    params.language = __Zn.Env['LANGUAGE'];
    if ($app && $app.is()) {
        params.sigma = $app._("sigma");
    }
    return params;
};
const _ajaxUniform = (ajax, params) =>
    __Zn.ajaxGet(ajax.uri, params)
        // 这里需要转config
        .then(data => __Zn.promise({data, config: ajax}));
const loadCountry = (reference) => {
    const ajax = parseAjax(reference, "country");
    const params = _initParams(reference);
    return _ajaxUniform(ajax, params);
};
const loadSub = (key) => (reference, input) => {
    const ajax = parseAjax(reference, key);
    const params = _initParams(reference);
    // 直接关联，使用 key
    params.key = input.key;
    return _ajaxUniform(ajax, params);
};
const loadLeaf = (reference) => {
    const ajax = parseAjax(reference, "init");
    const params = _initParams(reference);
    // 直接关联，使用 key
    const {value} = reference.props;
    if (value) {
        params.key = value;
    }
    return _ajaxUniform(ajax, params);
};
const I = {
    loadCountry,
    loadState: loadSub("state"),
    loadCity: loadSub("city"),
    loadRegion: loadSub("region"),
    loadLeaf
}
// =====================================================
// 两个核心事件
// =====================================================

const _findSelected = (
    options = [],
    selected = {},
    config = {},
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
    } else if ("region" === key) {
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

const _setChange = (reference, value = [], updated) => {
    // 选择触发时，country / state / city 整个一条链上的数据已经加载完成，这里value为数组，直接设置
    __Zn.of(reference).in({
        defaultValue: __Zn.clone(value)
    }).handle(() => {

        const {onChange, rxSelect} = reference.props;
        // 更改完成过后的变更函数
        const {options = []} = reference.state;
        if (__Zn.isFunction(onChange)) {
            // 表单设置值
            __Zn.dgDebug({updated}, "值更改 = ");
            // 将当前值更新为regionId专用
            onChange(updated, options);
        }
        if (__Zn.isFunction(rxSelect)) {
            rxSelect(value, options);
        }
    })
    // reference.?etState({defaultValue: __Zn.clone(value)});
    // const {onChange, rxSelect} = reference.props;
    // // 更改完成过后的变更函数
    // const {options = []} = reference.state;
    // if (__Zn.isFunction(onChange)) {
    //     // 表单设置值
    //     __Zn.dgDebug({updated}, "值更改 = ");
    //     // 将当前值更新为regionId专用
    //     onChange(updated, options);
    // }
    // if (__Zn.isFunction(rxSelect)) {
    //     rxSelect(value, options);
    // }
};

const onCallback = (reference, key, parent = undefined) => (response) => {
    if ("string" === typeof key) {
        __Zn.dgDebug(response, "响应数据");
        // 设置状态
        let state = __Zn.clone(reference.state);
        if (!state) state = {};
        // options设置
        let options = [];
        const {config = {}} = response;
        if ("country" === key) {
            // key = country 国家
            options = parseResponse(response, key);
        } else {
            // key = state 省会
            __Zn.dgDebug(state, "当前组件状态信息：");
            const previous = state.options;
            if (0 === previous.length) {
                console.error("没有国家信息，错误！");
                if (parent) parent.loading = false;
            } else {
                // 基本内容
                options = __Zn.clone(previous);
                // 选中被选项
                const selected = _findSelected(options, parent, config, key);
                // 追加选中项
                const stateArray = parseResponse(response, key);
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
        __Zn.of(reference).in(state).done();
        // reference.?etState(__Zn.clone(state));
    }
};
const onChange = (reference) => (value) => {
    if (!value || 0 === value.length) {
        // 清空
        _setChange(reference, value, undefined);
    } else if (4 === value.length) {
        // 完成
        const updated = value[3];
        if (updated) {
            _setChange(reference, value, updated);
        }
    }
};
const yoData = (reference) => (selectedOptions) => {
    // 被选中的option
    const option = selectedOptions[selectedOptions.length - 1];
    option.loading = true;
    if ("country" === option.type) {
        // 选中的是国家
        I.loadState(reference, option.params)
            .then(onCallback(reference, "state", option));
    } else if ("state" === option.type) {
        I.loadCity(reference, option.params)
            .then(onCallback(reference, "city", option));
    } else if ("city" === option.type) {
        I.loadRegion(reference, option.params)
            .then(onCallback(reference, "region", option));
    }
};
export default {
    onCallback,   // onCallback专用
    onChange,     // onChange专用
    yoData,       // 注入loadData属性

    // 生命周期所需函数
    parseOption,  // 解析选项
    parseInit,    // 解析参数信息
    ...I,         // 加载数据专用
}