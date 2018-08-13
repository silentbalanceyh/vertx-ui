import Op from './Op.Init';
import Act from './Op.Action';
import Ux from 'ux'

const _initColumns = (reference, columns = []) => {
    columns = Ux.uiTableColumn(reference, columns);
    columns.forEach(column => {
        if ("key" === column) {
            
        }
    });
    return columns;
};

const initTable = (reference) => {
    const table = Op.readTable(reference);
    if (table.columns) {
        table.columns = _initColumns(reference, table.columns);
    }
    // 数据读取
    const {$items, $inited} = reference.props;
    const dataArray = $items.$($inited.key);
    let data = [];
    if (dataArray && dataArray.is()) {
        data = dataArray.to();
    }
    return {table, data}
};

const initDialog = (reference) => {
    const {connectKey} = reference.state;
    let window = {};
    if (connectKey) {
        window = Op.readWindow(reference, connectKey);
        if (window) {
            window.onCancel = Act.rxClose(reference);
        }
    }
    return window;
};
export default {
    initTable,
    initDialog
}