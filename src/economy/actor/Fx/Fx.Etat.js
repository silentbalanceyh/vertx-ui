import Ux from "ux";
import U from 'underscore';

const addTab = (reference) => {
    let {tabs = {}, options = {}} = reference.state;
    tabs = Ux.clone(tabs);
    const type = tabs.items.filter(item => "add" === item.type);
    if (0 < type.length) {
        tabs.activeKey = type[0].key;
    } else {
        const tab = {
            key: Ux.randomUUID(),
            tab: options['tabs.add'],
            type: "add",
            index: tabs.items.length
        };
        tabs.items.push(tab);
        tabs.activeKey = tab.key;
    }
    return tabs;
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
    return {view, key, $$loading: "list" !== view};
};
export default {
    Tab: {
        add: addTab,
        close: closeTab,
        click: clickTab,
        remove: removeTab
    },
    View: {
        switch: viewSwitch,
    }
};
