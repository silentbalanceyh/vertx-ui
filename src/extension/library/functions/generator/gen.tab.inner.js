import U from "underscore";
import Ux from "ux";
import Opt from '../global/option';
import Mode from '../global/mode';

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
    return _createTab(reference, Mode.ADD, (tabs) => ({
        key: Ux.randomUUID(),
        tab: options[Opt.TABS_ADD],
        type: Mode.ADD,
        index: tabs.items.length
    }));
};
const editTab = (reference, data = {}) => {
    let {options = {}} = reference.state;
    return _createTab(reference, Mode.EDIT, (tabs) => ({
        key: data.key,
        tab: options[Opt.TABS_EDIT],
        type: Mode.EDIT,
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
    const view = viewSwitch(reference, Mode.LIST, undefined);
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
};
const saveTab = (reference, data, item) => {
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
const viewSwitch = (reference, $view = Mode.LIST, $key) => {
    const {rxViewSwitch} = reference.props;
    if (U.isFunction(rxViewSwitch)) {
        rxViewSwitch($view, $key);
    }
    return {$view, $key};
};

/**
 * @class View
 * @private
 */
class View {
    /**
     * 切换视图专用方法
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} $view 视图状态`list, add, edit`
     * @param {String} $key 处理专用key 值
     * @returns {Object} 执行
     */
    static switch(reference, $view = Mode.LIST, $key) {
        return viewSwitch(reference, $view, $key);
    }
}

/**
 * 返回状态信息：
 *
 * ```json
 * {
 *     tabs: {},
 *     $key: "",
 *     $view: ""
 * }
 * ```
 *
 * @class Tab
 * @private
 */
class Tab {
    /**
     * 添加Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Object} 返回最终状态
     */
    static add(reference) {
        return addTab(reference);
    }

    /**
     * 编辑Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {Object} data 当前数据记录
     * @returns {Object} 返回最终状态
     */
    static edit(reference, data = {}) {
        return editTab(reference, data);
    }

    /**
     * 关闭Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} key 当前 active 的键值
     * @returns {Object} 返回最终状态
     */
    static close(reference, key) {
        return closeTab(reference, key);
    }

    /**
     * 点击Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} key 当前 active 的键值
     * @returns {Object} 返回最终状态
     */
    static click(reference, key) {
        return clickTab(reference, key);
    }

    /**
     * 移除Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} key 当前 active 的键值
     * @returns {Object} 返回最终状态
     */
    static remove(reference, key) {
        return removeTab(reference, key);
    }

    /**
     * 保存Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {Object} data 当前数据记录
     * @param {Object} item 设置页面配置信息
     * @returns {Object} 返回最终状态
     */
    static save(reference, data, item) {
        return saveTab(reference, data, item);
    }
}

export default {
    Tab,
    View,
}