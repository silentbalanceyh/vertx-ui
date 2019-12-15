import Ux from 'ux';
import Event from './Op.Event';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * tabs 动态专用处理
     */
    const {config = {}} = reference.props;
    const {tabs = {}, page = {}, window, table = {}} = config;
    const $tabs = Ux.configTab(reference, tabs);
    if (Ux.isObject($tabs.items[0])) {
        $tabs.items[0].closable = false;
    }
    $tabs.hideAdd = true;
    $tabs.type = "editable-card";
    $tabs.onEdit = Event.rxEditTab(reference);
    state.$tabs = $tabs;
    state.$page = page;
    /*
     * alert 配置
     */
    const dialogRaw = Ux.aiExprWindow(window);
    state.$op = dialogRaw.onOk;

    state.$dialog = Ux.configDialog(reference, window);
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.className = "web-table";
    $table.rowSelection = {
        type: "radio",
        onChange: ($selected = []) => reference.setState({$selected})
    };
    state.$table = $table;
    const {alert} = config;
    if (alert) {
        state.$alert = Ux.clone(alert);
    }
    reference.setState(state);
};
export default {
    yiPage,
    ...Event
}