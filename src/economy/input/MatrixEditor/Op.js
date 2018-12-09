import Ux from "ux";
import U from 'underscore';
import Rdr from './UI.Render';

const initData = (reference) => {
    // 特殊数据
    const {source = [], value = []} = reference.props;
    const data = [];
    // 原始数据
    const previous = value ? value : [];
    source.forEach((row, sequence) => {
        let dataItem = {};
        dataItem.key = row.key;
        dataItem.label = row.label;
        dataItem.sequence = (sequence + 1);
        // 读取
        if (U.isArray(previous)) {
            const unique = Ux.elementUnique(previous, 'key', row.key);
            if (unique && U.isObject(unique)) {
                dataItem = Object.assign({}, unique, dataItem);
            }
        }
        data.push(dataItem);
    });
    // 是否包含了Footer
    const {config = {}} = reference.props;
    if (config.footer) {
        data.push(config.footer);
    }
    return {data};
};
const initTable = (reference) => {
    const {table = {}} = reference.props;
    table.columns = Ux.xtColumn(reference, table.columns);
    // 追加第一列
    const labelColumn = table.columns.filter(column => "label" === column.dataIndex);
    const filtered = table.columns.filter(column => "label" !== column.dataIndex);
    // 追加列
    const appended = {
        dataIndex: "label",
        render: Rdr.renderOp(reference)
    };
    if (0 < labelColumn.length) {
        appended.title = labelColumn[0].title;
        appended.className = labelColumn[0].className;
    }
    filtered.splice(0, 0, appended);
    // 是否包含序号
    const {config = {}} = reference.props;
    if (config.sequence) {
        const sequenceCol = {
            dataIndex: "sequence",
            title: config.sequence,
            className: "zero-column-width-min-60"
        };
        filtered.splice(0, 0, sequenceCol);
    }
    // 最终替换table中的columns
    table.columns = filtered;
    return table;
};
const getDefault = (reference) => initData(reference).data;
export default {
    initData,
    initTable,
    getDefault
};