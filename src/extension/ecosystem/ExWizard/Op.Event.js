import Ux from "ux";
import U from "underscore";

const openTab = (reference, state = {}) => {
    const {$tabs = {}, $page} = reference.state;
    const $state = Ux.clone(state);
    if ($tabs.items) {
        $tabs.items.forEach(item => item.disabled = true);
        $tabs.items.push($page);
        $tabs.activeKey = $page.key;
        $state.$tabs = $tabs;
        reference.setState($state);
    }
};

const rxEditTab = (reference) => (key, action) => {
    if ("remove" === action) {
        rxClose(reference, key)();
    }
};

const rxClose = (reference, key) => () => {
    let {$tabs = {}} = reference.state;
    const items = $tabs.items.filter(item => key !== item.key);
    $tabs = Ux.clone($tabs);
    $tabs.items = items;
    $tabs.items.forEach(item => item.disabled = false);
    $tabs.activeKey = $tabs.items[0].key;       // 切换激活 tab
    reference.setState({$tabs, $inited: undefined});
};

const rxSubmit = (reference) => ($data) => {
    if (1 < $data.length) {
        /*
         * 窗口流程
         */
        reference.setState({$visible: true, $inited: undefined, $data});
    } else {
        /*
         * 开Tab流程
         */
        openTab(reference, {$inited: $data[0]});
    }
};
const rxFailure = (reference) => (callback, pre = true) => {
    const {config = {}} = reference.props;
    const {modal = {}} = config;
    const message = pre ? modal.empty : modal['no'];
    Ux.messageFailure(message);
    if (U.isFunction(callback)) {
        return callback();
    }
};
const rxClick = (reference) => () => {
    const {$selected = []} = reference.state;
    if (0 < $selected.length) {
        /*
         * 关闭窗口，打开新页
         */
        const $inited = $selected[0];
        openTab(reference, {$visible: false, $inited});
    } else {
        const {config = {}} = reference.props;
        const {modal = {}} = config;
        const message = modal.selected;
        if (message) {
            Ux.messageFailure(message);
        }
    }
};
export default {
    rxFailure,
    rxSubmit,
    rxClick,
    rxClose,
    rxEditTab
}