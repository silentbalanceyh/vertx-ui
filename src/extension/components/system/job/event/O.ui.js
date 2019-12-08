import Ux from "ux";
import Ex from "ex";
import {Dsl} from "entity";

const rxClose = (reference, key) => {
    let {$tabs = {}} = reference.state;
    $tabs = Ux.clone($tabs);
    $tabs.items = $tabs.items.filter(item => key !== item.key);
    $tabs.activeKey = $tabs.items[0].key;
    $tabs.items[0].disabled = false;
    const $timer = rxTimer(reference);
    const state = {};
    state.$tabs = $tabs;
    state.$timer = $timer;
    state.$loading = true;
    reference.setState(state);
};
const rxRefresh = (reference, callback) => {
    let state = reference.state;
    state = Ux.clone(state);
    state.$loading = true;
    reference.setState(state);
    return Ux.toLoading(() => Ex.I.jobs().then((data = []) => {
        state = Ux.clone(state);
        state.$loading = false;
        state.$data = data;
        if (Ux.isFunction(callback)) {
            callback(state);
        }
    }), 5)
};
const rxTimer = (reference) =>
    setInterval(() => rxRefresh(reference,
        state => reference.setState(state)),
        10000);

const rxTabEdit = (reference) => (key, action) => {
    if ("remove" === action) {
        rxClose(reference, key);
    }
};
const rxTabClose = (reference, item) => (record = {}) =>
    rxClose(reference, item.key);
/*
 * 单独的任务处理
 */
const onTask = (reference, record, status) => {
    let {$data = []} = reference.state;
    record.status = status;
    const dataArray = Dsl.getArray($data);
    dataArray.saveElement(record);
    reference.setState({$data: dataArray.to()});
};
export default {
    rxTimer,
    rxTabEdit,
    rxTabClose,
    rxRefresh,
    onTask,
}