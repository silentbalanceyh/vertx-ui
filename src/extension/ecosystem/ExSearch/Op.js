import Ex from 'ex';
import Event from './event';

const _yiSearch = (reference, config = {}) => {
    const $search = {};
    $search.style = {width: "72%"};
    $search.placeholder = config[Ex.Opt.SEARCH_PLACEHOLDER];
    $search.onSearch = Event.onSearch(reference);
    $search.onChange = Event.onChange(reference);
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

const yiSearch = (reference) => {
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
const isSearch = (reference) => {
    const {config = {}} = reference.props;
    const {$search} = reference.state;
    return !!config[Ex.Opt.SEARCH_ENABLED] && !!$search;
};
const isAdvanced = (reference) => {
    const {config = {}} = reference.props;
    const {$advanced} = reference.state;
    return !!config[Ex.Opt.SEARCH_ADVANCED] && !!$advanced;
};
export default {
    yiSearch,
    isSearch,
    isAdvanced,
    // 穿透
    onClear: Event.onClear,
}