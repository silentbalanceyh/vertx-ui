import Ux from 'ux';
import U from 'underscore';
import Immutable from "immutable";
import {v4} from 'uuid';

const initList = (reference = {}, queryConfig = {}) => {
    const {rxSearch} = reference.props;
    if (rxSearch) {
        const query = Ux.irGrid(queryConfig, reference.props);
        rxSearch(query);
    }
};

const initQuery = (reference = {}, queryConfig = {}) => {
    const {fnOut} = reference.props;
    if (fnOut) {
        const query = Ux.irGrid(queryConfig, reference.props);
        Ux.writeTree(reference, {
            "grid.query": query
        });
        reference.setState({
            view: "list", key: undefined
        })
    }
};

const initGrid = (reference = {}) => {
    const config = initConfig(reference);
    // 初始化数据
    initList(reference, config.query);
    initQuery(reference, config.query);
    initTabs(reference, config.tabs);
};

const initConfig = (reference = {}) => {
    const {$key = "grid"} = reference.props;
    const ref = reference.props.reference;
    const grid = Ux.fromHoc(ref, $key);
    return Immutable.fromJS(grid).toJS();
};

const initData = (reference) => {
    const {$list} = reference.props;
    const data = $list.is() ? $list.to() : {};
    if (U.isArray(data.list)) {
        return data;
    } else {
        return {list: [], count: 0};
    }
};

const initTabs = (reference, tabs = {}) => {
    const tabsConfig = [];
    // 列表基本页
    const tab = {};
    tab.tab = tabs.list;
    tab.key = v4();
    tab.type = "FIXED";
    tab.index = 0;
    tabsConfig.push(tab);
    // 所有Tab
    let tabState = {};
    tabState.activeKey = tab.key;
    tabState.items = tabsConfig;
    tabState = Immutable.fromJS(tabState).toJS();
    reference.setState({tabs: tabState});
};

export default {
    initGrid,
    initConfig,
    initData,
    initTabs
}