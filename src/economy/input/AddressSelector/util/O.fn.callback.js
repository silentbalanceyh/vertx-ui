import Ux from 'ux';
import T from '../util';

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

export default (reference, key, parent = undefined) => (response) => {
    if ("string" === typeof key) {
        Ux.dgDebug(response, "响应数据");
        // 设置状态
        let state = reference.state;
        if (!state) state = {};
        // options设置
        let options = [];
        const {config = {}} = response;
        if ("country" === key) {
            // key = country 国家
            options = T.parseResponse(response, key);
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
                const selected = _findSelected(options, parent, config, key);
                // 追加选中项
                const stateArray = T.parseResponse(response, key);
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

