import Ux from "ux";
import * as U from 'underscore'
import Rdr from './UI.Render'
import Data from './Op.Data'

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
    return table;
};
const updateData = (reference: any) => {
    const {$circle, rxTree} = reference.props;
    if (!$circle.is()) {
        if (U.isFunction(rxTree)) {
            rxTree();
        }
    } else {
        // 这里才开始有数据
        const {current} = reference.state;
        if (!current) {
            let current = _readCurrent(reference);
            current = Data.initData(reference, current);
            reference.setState({current});
        }
    }
};
const readOptions = (reference: any) => readConfig(reference).options;
const readOperations = (reference: any) => readConfig(reference).operations;
const initComponent = (reference: any) => {
    // 表格初始化
    const table = initTable(reference);
    // operations初始化
    const operations = Rdr.initOperations(reference);
    reference.setState({table, operations});
};
const _readCurrent = (reference) => {
    const {$inited = {}, $circle} = reference.props;
    let calculated = [];
    if ($circle.is()) {
        const dataSource = $circle.to();
        if ($inited.key) {
            const dataArray = dataSource[$inited.key];
            if (dataArray && U.isArray(dataArray)) {
                calculated = dataArray;
            }
        }
    }
    return calculated;
};
const initDataSource = (reference: any) => {
    // 默认走$redux流程
    const {data, $redux = true, $circle} = reference.props;
    if ($redux) {
        // 优先读取data
        if ($circle.is()) {
            return _readCurrent(reference);
        }
    } else {
        return data;
    }
};
export default {
    initComponent,
    initDataSource,
    readOptions,
    readOperations,
    readCurrent: _readCurrent,
    updateData,
}