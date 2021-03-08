import React from 'react';
import Ex from 'ex';

import renderJsx from './Web';
import Op from "./Op";

/**
 * ## 「组件」`ExSearch`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method *ExSearch
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const _yiSearch = (reference, config = {}) => {
    const $search = {};
    $search.style = {width: "72%"};
    $search.placeholder = config[Ex.Opt.SEARCH_PLACEHOLDER];
    $search.onSearch = Op.onSearch(reference);
    $search.onChange = Op.onChange(reference);
    return $search;
};

const _yiAdvanced = (reference, config = {}) => {
    const $advanced = {};
    $advanced.title = config[Ex.Opt.SEARCH_ADVANCED_TITLE];
    $advanced.width = config[Ex.Opt.SEARCH_ADVANCED_WIDTH];
    $advanced.maskClosable = false;
    $advanced.destroyOnClose = true; // 必须有
    $advanced.onClose = Ex.rsVisible(reference, false);
    // $advanced.onClose = // Ex.rx(reference).close;
    return $advanced;
};

const componentInit = (reference) => {
    /*
     * 搜索配置项解析
     */
    const {config = {}} = reference.props;
    /*
     * 状态初始化
     */
    const state = {};
    if (config[Ex.Opt.SEARCH_ENABLED]) {
        /* 1. 搜索框 */
        state.$search = _yiSearch(reference, config);
        /* 2. 条件 */
        // state.cond = _yiCond(config);
        if (config[Ex.Opt.SEARCH_ADVANCED]) {
            /* 3. 高级搜索 */
            state.$advanced = _yiAdvanced(reference, config);
            /* 4. 高级搜索提示 */
            state.$notice = config[Ex.Opt.SEARCH_ADVANCED_NOTICE];
        }
    }
    state.$ready = true;
    reference.setState(state);
};

class Component extends React.PureComponent {
    state = {
        searchText: "",     // 输入的文本
        $search: undefined,     // 基础搜索配置
        $advanced: undefined,   // 高级搜索配置
        $visible: false,
        $ready: false,      // 没Ready
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 拆组件
             */
            return renderJsx(this, null);
        }, Ex.parserOfColor("ExSearch").private());
    }
}

export default Component;