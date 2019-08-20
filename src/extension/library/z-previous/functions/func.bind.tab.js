import Bind from './func.bind.tab.status';
import Mode from '../../functions/global/mode';
import Fn from './func.generate';

const rxTabAdd = (reference) => event => {
    Fn.prevent(event);
    const view = Bind.View.switch(reference, Mode.ADD, undefined);
    const tabs = Bind.Tab.add(reference);
    reference.setState({tabs, ...view, $inited: {}});
};
const rxTabClose = (reference) => (key, $dirty = false) => {
    const state = Bind.Tab.remove(reference, key);
    /* 是否需要刷新？*/
    state.$dirty = $dirty;
    reference.setState(state);
};
const rxTabEdit = (reference) => (key, data = {}, item = {}) => {
    /* 添加页转编辑页 */
    const view = Bind.View.switch(reference, Mode.EDIT, data.key);
    const tabs = Bind.Tab.save(reference, data, item);
    const state = {$inited: data, tabs, ...view};
    reference.setState(state);
};
const rxTabOpen = (reference) => (key, data = {}) => {
    const view = Bind.View.switch(reference, Mode.EDIT, key);
    const tabs = Bind.Tab.edit(reference, data);
    reference.setState({tabs, ...view, $inited: data});
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