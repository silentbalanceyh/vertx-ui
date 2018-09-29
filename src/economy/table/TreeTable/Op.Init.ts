import Ux from "ux";
import * as U from 'underscore'

const readConfig = (reference: any = {}) => {
    const {$key = "tree"} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const grid = Ux.fromHoc(ref, $key);
    return Ux.clone(grid);
};
const initTable = (reference: any) => {
    let table = readConfig(reference).table;
    if (table && table.columns) {
        table.columns.forEach((column) => {
            // 是否level开始
            const level = String(column['level'] ? column.level : "");
            if (!column.dataIndex.startsWith(`${level}.`)) {
                column.dataIndex = `${level}.${column.dataIndex}`;
            }
        });
    } else {
        table = {columns: []}
    }
    table.pagination = false;
    if (!table.hasOwnProperty("bordered")) table.bordered = true;
    reference.setState({table});
};
const updateData = (reference: any) => {
    const {$circle, rxTree} = reference.props;
    if (!$circle.is()) {
        if (U.isFunction(rxTree)) {
            rxTree();
        }
    }
};
const readOptions = (reference: any) => readConfig(reference).options;
export default {
    initTable,
    readOptions,
    updateData,
}