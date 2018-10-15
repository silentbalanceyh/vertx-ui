import Ux from "ux";
import U from 'underscore';
import Rdr from './UI.Render';

const initData = (reference) => {
    // 特殊数据
    const {source = [], value = []} = reference.props;
    const data = [];
    // 原始数据
    const previous = value ? value : [];
    source.forEach(row => {
        let dataItem = {};
        dataItem.key = row.key;
        dataItem.label = row.label;
        // 读取
        if (U.isArray(previous)) {
            const unique = Ux.elementUnique(previous, 'key', row.key);
            if (unique && U.isObject(unique)) {
                dataItem = Object.assign({}, unique, dataItem);
            }
        }
        data.push(dataItem);
    });
    console.info(data);
    return {data};
};
const initTable = (reference) => {
    const {table = {}} = reference.props;
    table.columns = Ux.xtColumn(reference, table.columns);
    // 追加第一列
    table.columns.splice(0, 0, {
        dataIndex: "label",
        render: Rdr.renderOp(reference)
    });
    return table;
};
const getDefault = (reference) => initData(reference).data;
export default {
    initData,
    initTable,
    getDefault
};