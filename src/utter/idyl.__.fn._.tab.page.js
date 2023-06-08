import Ux from 'ux';
import __V from './pedestal.v.constant.option';

const Mode = __V.Mode;
const Opt = __V.Opt;

const __createTab = (reference, view, supplier) => {
    if (Ux.isFunction(supplier)) {
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
const tabAdd = (reference) => {
    let {options = {}} = reference.state;
    return __createTab(reference, Mode.ADD, (tabs) => ({
        key: Ux.randomUUID(),
        tab: options[Opt.TABS_ADD],
        type: Mode.ADD,
        index: tabs.items.length
    }));
};
const tabEdit = (reference, data = {}) => {
    let {options = {}} = reference.state;
    return __createTab(reference, Mode.EDIT, (tabs) => ({
        key: data.key,
        tab: options[Opt.TABS_EDIT],
        type: Mode.EDIT,
        index: tabs.items.length
    }));
};
const tabClose = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.items = tabs.items.filter(each => each.key !== key);
    tabs.items.forEach((each, index) => each.index = index);
    tabs.activeKey = tabs.items[0].key;
    // 计算 view
    const view = viewSwitch(reference, Mode.LIST, undefined);
    return {tabs, ...view};
};
const viewSwitch = (reference, $view = Mode.LIST, $key) => {
    const {rxViewSwitch} = reference.props;
    if (Ux.isFunction(rxViewSwitch)) {
        rxViewSwitch($view, $key);
    }
    return {$view, $key};
};
const tabActive = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.activeKey = key;
    // 右边按钮计算
    const item = tabs.items.filter(item => item.key === key)[0];
    const view = viewSwitch(reference, item.type, key);
    return {tabs, ...view};
};
const tabRemote = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    let view = {};
    let item = tabs.items.filter(item => key === item.key)[0];
    if (item) {
        const index = item.index - 1;
        if (2 < tabs.items.length) {
            const activeItem = tabs.items.filter(item => item.index === index)[0];
            tabs.activeKey = activeItem.key;
            tabs.items = tabs.items.filter(item => key !== item.key);
            if (0 === activeItem.index) {
                view = viewSwitch(reference, Mode.LIST, undefined);
            } else {
                view = viewSwitch(reference, Mode.EDIT, activeItem.key);
            }
        } else {
            tabs.activeKey = tabs.items[0].key;
            tabs.items = [tabs.items[0]];
            view = viewSwitch(reference, Mode.LIST, undefined);
        }
        tabs.items.forEach((item, index) => {
            item.index = index;
        });
        /*
         * 关闭窗口时需设置
         * $inited = {}（防止编辑表单混用）
         */
        return {tabs, ...view, $inited: {}};
    } else {
        console.error("请检查响应数据，key 值不对应：", key, tabs.items)
    }
};
const tabSave = (reference, data, item) => {
    // 删除
    let {tabs = {}, options = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.items = tabs.items.filter(each => each.key !== item.key);
    // 添加新的
    const tab = {
        key: data.key,
        tab: options[Opt.TABS_EDIT],
        type: Mode.EDIT,   // 类型
        index: tabs.items.length
    };
    tabs.items.push(tab);
    tabs.activeKey = data.key;
    return tabs;
};
export default {
    tabAdd,
    tabEdit,
    tabClose,
    tabActive,
    tabRemote,
    tabSave,

    viewSwitch, // rxViewSwitch
}