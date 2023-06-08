import Ux from "ux";
import {Dsl} from "entity";

const rxClose = (reference, key) => {
    let {$tabs = {}} = reference.state;
    $tabs = Ux.clone($tabs);
    $tabs.items = $tabs.items.filter(item => key !== item.key);
    $tabs.activeKey = $tabs.items[0].key;
    $tabs.items[0].disabled = false;

    const state = {};
    state.$tabs = $tabs;
    // state.$timer = $timer;
    Ux.of(reference).in(state).loading(false).done();
    // state.$loading = true;
    // reference.?etState(state);
};

const rxTabEdit = (reference) => (key, action) => {
    if ("remove" === action) {
        rxClose(reference, key);
    }
};
const rxTabClose = (reference, item) => () =>
    rxClose(reference, item.key);
/*
 * 单独的任务处理
 */
const onTask = (reference, record, status) => {
    let {$data = []} = reference.state;
    record.status = status;
    const dataArray = Dsl.getArray($data);
    dataArray.saveElement(record);
    Ux.of(reference).in({$data: dataArray.to()}).done();
    // reference.?etState({$data: dataArray.to()});
};
export default {
    rxTabEdit,
    rxTabClose,

    onTask,
}