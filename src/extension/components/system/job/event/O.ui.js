import Ux from "ux";
import Ex from "ex";
import {Dsl} from "entity";

const rxClose = (reference, key) => {
    let {$tabs = {}} = reference.state;
    $tabs = Ux.clone($tabs);
    $tabs.items = $tabs.items.filter(item => key !== item.key);
    $tabs.activeKey = $tabs.items[0].key;
    $tabs.items[0].disabled = false;

    const {$duration = 10} = reference.state;
    const $timer = rxTimer(reference, $duration * 1000);

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
const rxTimer = (reference, duration = 10000) =>
    setInterval(() => rxRefresh(reference,
        state => reference.setState(state)),
        duration);

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
const rxDuration = (reference) => (event) => {
    const text = event.target.value;
    const result = Number(text);
    if (!isNaN(result) && 10 <= result) {
        const {$timer} = reference.state;
        if ($timer) {
            clearInterval($timer);
            const state = {};
            state.$duration = result;
            state.$timer = rxTimer(reference, result * 1000);
            reference.setState(state);
        }
    }
};
const rxDurationChange = (reference) => (event) => {
    const text = event.target.value;
    const $durationValue = Number(text);
    if (!isNaN($durationValue) && 10 <= $durationValue) {
        reference.setState({$durationValue})
    }
};
const rxSearch = (reference) => (text) => {
    const $searchText = text;
    reference.setState({$searchText});
};
export default {
    rxTimer,
    rxTabEdit,
    rxTabClose,
    rxRefresh,
    rxDuration,
    rxDurationChange,
    rxSearch,
    onTask,
}