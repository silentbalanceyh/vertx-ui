import Ux from 'ux';
import U from 'underscore';

const onChange = (reference = {}) => (pagination, filter, sorter) => {

};
const init = (reference, options = {}, table = {}) => {
    table = Ux.clone(table);
    // 扩展行外置处理
    const {rxExpandRow} = reference.props;
    if (U.isFunction(rxExpandRow)) {
        table.expandedRowRender = rxExpandRow;
    }
    // 扩展
    table.className = Ux.ECONOMY.TABLE_CONTROL;
    return table;
};
const render = (reference) => {
    const {table = {}, data = {}, loading = true} = reference.state;
    const $table = Ux.clone(table);
    $table.loading = loading;
    $table.dataSource = data.list ? data.list : [];
    return $table;
};

export default {
    init,
    render,
}