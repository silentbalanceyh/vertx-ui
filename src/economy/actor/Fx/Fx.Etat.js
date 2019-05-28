import Ux from "ux";
import U from 'underscore';

const _createTab = (reference, view, supplier) => {
    if (U.isFunction(supplier)) {
        let {tabs = {}} = reference.state;
        tabs = Ux.clone(tabs);
        const type = tabs.items.filter(item => view === item.type);
        if (0 < type.length) {
            tabs.activeKey = type[0].key;
        } else {
            const tab = supplier(tabs);
            tabs.items.push(tab);
            tabs.activeKey = tab.key;
        }
        return tabs;
    } else {
        throw new Error("[Ex] 构造 Tab 页面的 supplier 不是一个合法函数");
    }
};

const addTab = (reference) => {
    let {options = {}} = reference.state;
    return _createTab(reference, "add", (tabs) => ({
        key: Ux.randomUUID(),
        tab: options['tabs.add'],
        type: "add",
        index: tabs.items.length
    }));
};
const editTab = (reference, data = {}) => {
    let {options = {}} = reference.state;
    return _createTab(reference, "edit", (tabs) => ({
        key: data.key,
        tab: options['tabs.edit'],
        type: "edit",
        index: tabs.items.length
    }));
};
const closeTab = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.items = tabs.items.filter(each => each.key !== key);
    tabs.items.forEach((each, index) => each.index = index);
    tabs.activeKey = tabs.items[0].key;
    // 计算 view
    const view = viewSwitch(reference, "list", undefined);
    return {tabs, ...view};
};
const clickTab = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.activeKey = key;
    // 右边按钮计算
    const item = tabs.items.filter(item => item.key === key)[0];
    const view = viewSwitch(reference, item.type, key);
    return {tabs, ...view};
};
const removeTab = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    let view = {};
    let item = tabs.items.filter(item => key === item.key)[0];
    const index = item.index - 1;
    if (2 < tabs.items.length) {
        const activeItem = tabs.items.filter(item => item.index === index)[0];
        tabs.activeKey = activeItem.key;
        tabs.items = tabs.items.filter(item => key !== item.key);
        if (0 === activeItem.index) {
            view = viewSwitch(reference, "list", undefined);
        } else {
            view = viewSwitch(reference, "edit", activeItem.key);
        }
    } else {
        tabs.activeKey = tabs.items[0].key;
        tabs.items = [tabs.items[0]];
        view = viewSwitch(reference, "list", undefined);
    }
    tabs.items.forEach((item, index) => {
        item.index = index;
    });
    return {tabs, ...view};
};
const viewSwitch = (reference, view = "list", key) => {
    const {rxViewSwitch} = reference.props;
    if (U.isFunction(rxViewSwitch)) {
        rxViewSwitch(view, key);
    }
    return {view, key};
};
const projection = (reference, projection = []) => {
    let {query = {}} = reference.state ? reference.state : {};
    query = Ux.clone(query);
    // 修改 query
    query.projection = Ux.clone(projection.map(projection => projection.dataIndex));
    return {query, projection};
};
export default {
    Tab: {
        add: addTab,
        edit: editTab,
        close: closeTab,
        click: clickTab,
        remove: removeTab
    },
    View: {
        switch: viewSwitch,
    },
    Query: {
        projection,
    }
};
