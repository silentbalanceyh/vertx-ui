import React from 'react';
import Ux from 'ux';
import __Zn from '../zero.aero.dependency';

import renderJsx from './UI.Web';
import Op from "./UI.Op";

const UCA_NAME = "ExSearch";
/**
 * ## 「组件」`ExSearch`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method *ExSearch
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const _yiSearch = (reference, config = {}) => {
    const $search = {};
    $search.placeholder = config[__Zn.Opt.SEARCH_PLACEHOLDER];
    $search.onSearch = Op.onSearch(reference);
    $search.onChange = Op.onChange(reference);
    return $search;
};

const _yiAdvanced = (reference, config = {}) => {
    const $advanced = {};
    $advanced.title = config[__Zn.Opt.SEARCH_ADVANCED_TITLE];
    $advanced.width = config[__Zn.Opt.SEARCH_ADVANCED_WIDTH];
    $advanced.maskClosable = false;
    $advanced.destroyOnClose = true; // 必须有
    $advanced.onClose = (event) => {
        // __Zn.r?Visible(reference, false);
        const addOn = Ux.prevent(event);
        Ux.of(reference).in(addOn).hide().done()
    }
    // $advanced.onClose = // __Zn.?x(reference).close;
    return $advanced;
};

const componentState = (reference) => {

    /*
     * 搜索配置项解析
     */
    const {config = {}, $options = {}} = reference.props;
    /*
     * 状态初始化
     */
    const state = {};
    if (config[__Zn.Opt.SEARCH_ENABLED]) {
        /* 1. 搜索框 */
        state.$search = _yiSearch(reference, config);
        const conds = config['search.cond'];
        const searchFields = [];
        conds.forEach(cond => {
            if (0 < cond.indexOf(",")) {
                const expr = cond.split(',')[0];
                searchFields.push(expr);
            }
        })
        state.$fields = searchFields;
        /* 2. 条件 */
        // state.cond = _yiCond(config);
        if (config[__Zn.Opt.SEARCH_ADVANCED]) {
            /* 3. 高级搜索 */
            state.$advanced = _yiAdvanced(reference, config);
            /* 4. 高级搜索提示 */
            state.$notice = config[__Zn.Opt.SEARCH_ADVANCED_NOTICE];
        }
    }
    /*
     * 窗口
     */
    if (config[__Zn.Opt.SEARCH_OP_VIEW]) {
        state.$dialog = Ux.configDialog(reference, $options[__Zn.Opt.SEARCH_CRITERIA_WINDOW]);
    }
    return {
        ...state,
        searchText: "",     // 输入的文本
        $visible: false,
        $ready: true,      // Ready
    }
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = componentState(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            /*
             * 拆组件
             */
            return renderJsx(this, null);
        }, __Zn.parserOfColor(UCA_NAME).private({off: true}));
    }
}

export default Component;