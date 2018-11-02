import Ux from 'ux';
import Immutable from "immutable";
import U from 'underscore';
import {v4} from 'uuid';

import Fn from '../../../_internal/Ix.Fn';

const {Mock} = Fn;

const readConfig = (reference = {}) => Fn.fetchConfig(reference, "grid");
const readOption = (reference) => Fn.fetchOption(reference, readConfig(reference));
const readTable = (reference) => readConfig(reference).table;
const readQuery = (reference) => Fn.fetchQuery(reference, readConfig(reference));

const stateView = (view, key, reference) => {
    view = view ? view : "list";
    const {rxViewSwitch} = reference.props;
    if (U.isFunction(rxViewSwitch)) {
        rxViewSwitch(view, key);
    }
    return {view, key, $$loading: "list" !== view};
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

const _onDelete = (reference, key, state = {}) => {
    const {$items} = reference.props;
    if ($items) {
        // list.items处理
        const dataRecord = $items.to();
        if (dataRecord && dataRecord.hasOwnProperty(key)) {
            delete dataRecord[key];
        }
        // 重写list.items;
        Ux.writeTree(reference, {
            "list.items": dataRecord,
            ...state,
        });
    } else {
        Ux.writeTree(reference, state);
    }
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
            view = stateView("list", undefined, reference);
        }
        tabs.items.forEach((item, index) => {
            item.index = index;
        });
        // 如果是list则直接关闭$$loading效果（小范围加载）
        const state = {tabs, ...view};
        reference.setState(state);
        // 删除当前主节点中的 id = key
        _onDelete(reference, key);
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
    Fn.initReduxQuery(reference, config.query);
    // 初始化Tab页
    const state = {};
    stateTabs(reference, config.options, state);
    // Mock初始化
    Mock.mockCheck(reference, config.options, state);
    reference.setState(state);
};
const updateGrid = (reference = {}, prevProps = {}) => {
    const record = reference.props['$list'];
    const {$query} = reference.props;
    if ($query.is()) {
        if (undefined === record) {
            // 初始化查询
            const {rxSearch} = reference.props;
            if (rxSearch) rxSearch($query.to());
            // initList(reference, config.query);
            Fn.initStateQuery(reference, $query.to());
        } else {
            // 初始化Mock
            Mock.mockInit(reference, record);
        }
    } else {
        initGrid(reference);
        // 初始化Mock
        Mock.mockInit(reference, {});
    }
};
export default {
    initGrid,
    updateGrid,
    stateView,
    clearByKey: _onDelete,
    // 已连接Fn
    readOption,
    readTable,
    readQuery,
};