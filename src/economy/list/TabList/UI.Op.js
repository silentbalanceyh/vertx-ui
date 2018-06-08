import Ux from 'ux';
import Immutable from 'immutable';

const fnInit = (reference = {}) => {
    const {$tabs = {}} = reference.props;
    const tabs = [];
    // 主Tab
    if ($tabs.page) tabs.push($tabs.page);
    reference.setState({tabs, activeKey: $tabs.page.key});
};
const fnAdd = (reference = {}, tab) => (event) => {
    event.preventDefault();
    // 添加Tab页
    const {tabs = []} = reference.state;
    const $tabs = Immutable.fromJS(tabs).toJS();
    const added = {};
    let activeKey = null;
    // 构造新的DataKey
    if (tab) {
        activeKey = Ux.randomString(16);
        added.key = activeKey;
        added.tab = tab.tab;
        added.dataKey = undefined;
        $tabs.push(added);
    }
    // 设置处理专用的key
    const state = {tabs: $tabs};
    if (activeKey) state.activeKey = activeKey;
    Ux.writeTree(reference, {"datum.record": undefined});
    reference.setState(state);
};
const fnEdit = (reference = {}) => (config, id) => (event) => {
    event.preventDefault();
    const tabConfig = reference.props['$tabs'];
    if (tabConfig.edit) {
        const {tabs = {}} = reference.state;
        const $tabs = Immutable.fromJS(tabs).toJS();
        // 激活页签
        let activeKey = null;
        const existing = $tabs.filter(item => item.dataKey === id);
        if (0 === existing.length) {
            // 不存在，创建新的
            const updated = {};
            activeKey = Ux.randomString(16);
            updated.tab = tabConfig.edit.tab;
            updated.key = activeKey;
            updated.dataKey = id;
            $tabs.push(updated);
        } else {
            // 已经存在，设置activeKey;
            activeKey = existing[0].key;
        }
        const state = {tabs: $tabs};
        if (activeKey) state.activeKey = activeKey;
        reference.setState(state);
    } else {
        console.error("[Ux] Error for 'edit' configuration.");
    }
};
const fnRemove = (reference = {}, key) => (config, id) => (event) => {
    event.preventDefault();
    if (config.ajax) {
        // 加载数据处理
        const {$mockRemove} = reference.props;
        Ux.asyncTrue(config.ajax, {id}, {
            success: () => {
                const clean = config.ajax.clean ? config.ajax.clean : [];
                const state = {};
                clean.forEach(item => state[item] = undefined);
                Ux.writeTree(reference, state);
            }
        }, $mockRemove ? $mockRemove : {});
        // 当前id是否存在于tabs中，存在则需要删除
        const {tabs = [], activeKey} = reference.state;
        const lefts = tabs.filter(item => item.dataKey !== id);
        let key = activeKey;
        if (tabs.length !== lefts.length) {
            const found = tabs.filter(item => item.dataKey === id);
            const $tabs = Immutable.fromJS(lefts).toJS();
            if (found[0].key === activeKey) {
                key = $tabs[$tabs.length - 1].key;
            }
            const state = {tabs: $tabs};
            if (key) state.activeKey = key;
            reference.setState(state);
        }
    } else {
        console.error("[Ajax] Ajax Config missing in delete operation.");
    }
};
const fnMove = (reference) => (activeKey) => reference.setState({activeKey});

const fnCloseDirect = (reference, removedKey) => (event) => {
    const {tabs = [], activeKey = ""} = reference.state;
    const removed = tabs.filter(item => removedKey !== item.key);
    const $tabs = Immutable.fromJS(removed).toJS();
    // 计算激活key
    let key = activeKey;
    if (activeKey === key) {
        // 激活窗口被删除
        key = $tabs[$tabs.length - 1].key;
    }
    reference.setState({tabs: $tabs, activeKey: key});
};
const fnClose = (reference) => (removedKey, action) => {
    if ("remove" === action) {
        fnCloseDirect(reference, removedKey)();
    }
};
export default {
    // 编辑
    fnClose,
    fnCloseDirect,
    // 移动
    fnMove,
    // 清空
    fnInit,
    // 添加按钮窗口
    fnAdd,
    // 编辑按钮窗口
    fnEdit,
    // 删除按钮
    fnRemove
}
