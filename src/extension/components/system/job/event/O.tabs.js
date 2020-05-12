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
    state.$loading = true;
    reference.setState(state);
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
    reference.setState({$data: dataArray.to()});
};
export default {
    rxTabEdit,
    rxTabClose,

    onTask,
}