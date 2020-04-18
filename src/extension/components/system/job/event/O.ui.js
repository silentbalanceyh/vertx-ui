import Ux from "ux";
import {Dsl} from "entity";

const rxClose = (reference, key) => {
    let {$tabs = {}} = reference.state;
    $tabs = Ux.clone($tabs);
    $tabs.items = $tabs.items.filter(item => key !== item.key);
    $tabs.activeKey = $tabs.items[0].key;
    $tabs.items[0].disabled = false;

    // const {$duration = 10} = reference.state;
    // const $timer = rxTimer(reference, $duration * 1000);

    const state = {};
    state.$tabs = $tabs;
    // state.$timer = $timer;
    state.$loading = true;
    reference.setState(state);
};
/*
const rxTimer = (reference, duration = 10000) =>{
    rxClear(reference,
        () => setInterval(() =>
            reference.setState({$loading: true}), duration))
}*/


const rxClear = (reference, consumer) => {
    const {$timer} = reference.state;
    if ($timer) {
        clearInterval($timer);
    }
    /*
     * 清除 $timer
     */
    if (Ux.isFunction(consumer)) {
        consumer($timer);
    }
}

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
const rxDurationBlur = (reference) => (event) => {
    const text = event.target.value;
    const result = Number(text);
    if (!isNaN(result) && 10 <= result) {
        rxClear(reference, () => {
            const state = {};
            state.$duration = result;
            // state.$timer = rxTimer(reference, result * 1000);
            reference.setState(state);
        })
    }
};
const rxDurationChange = (reference) => (event) => {
    const $durationValue = event.target.value;
    reference.setState({$durationValue});
};
const rxDurationFocus = (reference) => (event) => {
    Ux.prevent(event);
    rxClear(reference);
};
const rxSearch = (reference) => (text) => {
    const $searchText = text;
    reference.setState({$searchText});
};
const rxFilter = (reference) => (item) => {
    reference.setState({$searchPrefix: item.key, $menusKey: [item.key]})
};
const rxFilterClean = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$searchPrefix: undefined, $menusKey: []})
}
const rxRefresh = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$loading: true})
}
const rxChecked = (reference) => (keys = []) => {
    reference.setState({$searchChecked: keys});
}
export default {
    rxTabEdit,
    rxTabClose,

    onTask,

    rxDurationFocus,
    rxDurationBlur,
    rxDurationChange,

    rxChecked,
    rxRefresh,
    rxSearch,

    rxFilter,
    rxFilterClean
}