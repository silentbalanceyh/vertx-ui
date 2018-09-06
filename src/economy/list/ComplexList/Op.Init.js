import Ux from 'ux';
import Immutable from "immutable";
import U from 'underscore';
import {v4} from 'uuid';
import Mock from './Op.Mock';

const readConfig = (reference = {}) => {
    const {$key = "grid"} = reference.props;
    const ref = reference.props.reference;
    const grid = Ux.fromHoc(ref, $key);
    return Immutable.fromJS(grid).toJS();
};

const initList = (reference = {}, queryConfig = {}) => {
    const query = Ux.irGrid(queryConfig, reference.props);
    Ux.writeTree(reference, {
        "grid.query": query
    });
};

const stateView = (view, key, reference) => {
    view = view ? view : "list";
    const {rxViewSwitch} = reference.props;
    if (U.isFunction(rxViewSwitch)) {
        rxViewSwitch(view);
    }
    return {view, key};
};

const onTabClick = (reference) => (key) => {
    let {tabs = {}} = reference.state;
    tabs = Immutable.fromJS(tabs).toJS();
    tabs.activeKey = key;
    // 右边按钮计算
    const item = tabs.items.filter(item => item.key === key)[0];
    const view = stateView(item.type, key, reference);
    const state = {tabs, ...view};
    reference.setState(state);
};

const onEdit = (reference) => (key, action) => {
    if ("remove" === action) {
        let {tabs = {}} = reference.state;
        tabs = Immutable.fromJS(tabs).toJS();
        let view = {};
        let item = tabs.items.filter(item => key === item.key)[0];
        const index = item.index - 1;
        if (2 < tabs.items.length) {
            const activeItem = tabs.items.filter(item => item.index === index)[0];
            tabs.activeKey = activeItem.key;
            tabs.items = tabs.items.filter(item => key !== item.key);
            if (0 === activeItem.index) {
                view = stateView("list", undefined, reference);
            } else {
                view = stateView("edit", activeItem.key, reference);
            }
        } else {
            tabs.activeKey = tabs.items[0].key;
            tabs.items = [tabs.items[0]];
            view = stateView("list", undefined, reference)
        }
        tabs.items.forEach((item, index) => {
            item.index = index;
        });
        reference.setState({tabs, ...view});
    }
};

const stateTabs = (reference, options = {}, state = {}) => {
    // 列表基本页
    const tab = {};
    tab.tab = options['tabs.list'];
    tab.key = v4();
    tab.type = "list";
    tab.index = 0;
    const tabs = {};
    tabs.items = [];
    tabs.items.push(tab);
    // Tab专用方法
    tabs.activeKey = tab.key;
    tabs.type = "editable-card";
    tabs.onTabClick = onTabClick(reference);
    tabs.onEdit = onEdit(reference);
    tabs.hideAdd = true;
    state.tabs = tabs;
};
const initGrid = (reference = {}) => {
    const config = readConfig(reference);
    // 初始化查询
    initList(reference, config.query);
    // 初始化Tab页
    const state = {};
    stateTabs(reference, config.options, state);
    // Mock初始化
    Mock.mockCheck(reference, config.options, state);
    reference.setState(state);
};
const readOption = (reference) => {
    let options = readConfig(reference).options;
    const {rxInject} = reference.props;
    if (rxInject) {
        return rxInject(options);
    } else {
        return options;
    }
};
const readTable = (reference) => readConfig(reference).table;
const readQuery = (reference) => {
    const queryConfig = readConfig(reference).query;
    return Ux.irGrid(queryConfig, reference.props);
};
const updateGrid = (reference = {}, prevProps = {}) => {
    const record = reference.props['$list'];
    const {$query} = reference.props;
    if ($query.is()) {
        if (undefined === record) {
            // 初始化查询
            const {rxSearch} = reference.props;
            if (rxSearch) {
                const {$query} = reference.props;
                rxSearch($query.to());
            }
            // initList(reference, config.query);
        } else {
            Mock.mockInit(reference, record);
        }
    } else {
        initGrid(reference);
    }
};
const updateMonitor = (reference, prevState = {}) => {
    const current = reference.state;
    if (current.view !== prevState.view) {
        // 如果view发生改变，则直接处理
        Ux.D.connectMajor(reference, current);
    } else if (current.key !== prevState.key) {
        // 如果view不改变，只可能在edit中切换
        Ux.D.connectMajor(reference, current);
    }
};
export default {
    initGrid,
    updateGrid,
    updateMonitor,
    stateView,
    readOption,
    readTable,
    readQuery
}