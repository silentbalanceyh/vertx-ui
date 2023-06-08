import Ux from 'ux';
import __PG from './idyl.__.fn._.tab.page';
import __V from './pedestal.v.constant.option';
import __RS from './idyl.fn.rs.state';

const Mode = __V.Mode;

const rxTabAdd = (reference) => event => {
    Ux.prevent(event);
    const tabs = __PG.tabAdd(reference);
    /*
     * Tab中的 activeKey 需要拷贝到 $key 中赋值（保证数据本身是同步）
     */
    const view = __PG.viewSwitch(reference, Mode.ADD, tabs.activeKey);
    Ux.of(reference).in({
        tabs,
        ...view,
        $inited: {},
        $spinning: true,
        $opened: true,
    }).handle(() => Ux.of(reference)._.open_({}))
    // reference.?etState({tabs, ...view, $inited: {}});
    // ?x(reference).openPost({});
};
const rxTabClose = (reference) => (key, callbackState = {}) => {
    const state = __PG.tabRemote(reference, key);
    /* 是否需要刷新？*/
    if (!Ux.isEmpty(callbackState)) {
        Object.assign(state, callbackState);
    }
    state.$opened = false;
    Ux.of(reference).in(state).handle(() => {

        Ux.of(reference)._.close_(key);
    });
    // reference.?etState(state);
    // reference.?etState(state);
    // ?x(reference).closePost(key);
};
const rxTabEdit = (reference) => (key, data = {}, item = {}, callbackState = {}) => {
    /* 添加页转编辑页 */
    const view = __PG.viewSwitch(reference, Mode.EDIT, data.key);
    const tabs = __PG.tabSave(reference, data, item);
    const state = {$inited: data, tabs, ...view};
    if (!Ux.isEmpty(callbackState)) {
        Object.assign(state, callbackState);
    }
    state.$opened = true;
    state.$spinning = true;
    Ux.of(reference).in(state).handle(() => {

        Ux.of(reference)._.open_(data);
    })
    // reference.?etState(state);
    // ?x(reference).openPost(data);
};
const rxTabOpen = (reference) => (key, data = {}, record) => {
    const view = __PG.viewSwitch(reference, Mode.EDIT, key);
    const tabs = __PG.tabEdit(reference, data);
    // 注入上层变量
    if (record) {
        // rowData 专用注入
        view.$rowData = Ux.clone(record);
    }
    Ux.of(reference).in({
        tabs,
        ...view,
        $inited: data,
        $opened: true,
        $spinning: true,
    }).handle(() => {

        Ux.of(reference)._.open_(data);
    })
    // reference.?etState({tabs, ...view, $inited: data});
    // ?x(reference).openPost(data);
};

const rxPostOpen = (reference) => (data) => __RS.rsOpened(reference, true)(data);
const rxPostClose = (reference) => (key) => __RS.rsOpened(reference, false)(key);
export default {
    rxTabOpen,
    rxTabAdd,
    rxTabClose,
    rxTabEdit,

    rxPostOpen,         // 打开之后
    rxPostClose,        // 关闭之后
}