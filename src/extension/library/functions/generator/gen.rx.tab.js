import Mode from "../global/mode";
import _Tab from './gen.tab.inner';
import Ux from 'ux';
import Rt from './gen.runtime';

const rxTabAdd = (reference) => event => {
    Ux.prevent(event);
    const tabs = _Tab.Tab.add(reference);
    /*
     * Tab中的 activeKey 需要拷贝到 $key 中赋值（保证数据本身是同步）
     */
    const view = _Tab.View.switch(reference, Mode.ADD, tabs.activeKey);
    reference.setState({tabs, ...view, $inited: {}});
    Rt.rx(reference).openPost({});
};
const rxTabClose = (reference) => (key, callbackState = {}) => {
    const state = _Tab.Tab.remove(reference, key);
    /* 是否需要刷新？*/
    if (!Ux.isEmpty(callbackState)) {
        Object.assign(state, callbackState);
    }
    reference.setState(state);
    Rt.rx(reference).closePost(key);
};
const rxTabEdit = (reference) => (key, data = {}, item = {}, callbackState = {}) => {
    /* 添加页转编辑页 */
    const view = _Tab.View.switch(reference, Mode.EDIT, data.key);
    const tabs = _Tab.Tab.save(reference, data, item);
    const state = {$inited: data, tabs, ...view};
    if (!Ux.isEmpty(callbackState)) {
        Object.assign(state, callbackState);
    }
    reference.setState(state);
    Rt.rx(reference).openPost(data);
};
const rxTabOpen = (reference) => (key, data = {}) => {
    const view = _Tab.View.switch(reference, Mode.EDIT, key);
    const tabs = _Tab.Tab.edit(reference, data);
    reference.setState({tabs, ...view, $inited: data});
    Rt.rx(reference).openPost(data);
};
/*
 * 这里 reference 是 Tab 的 Holder
 */
export default {
    rxTabAdd,    // 打开一个新的 Tab 页
    rxTabClose,  // 关闭当前 Tab 页，如果需要刷新则第二参 $dirty = true
    rxTabEdit,   // 切换到 Edit 的 Tab 页
    rxTabOpen,   // 打开一个新的 Tab 页（带数据）
}