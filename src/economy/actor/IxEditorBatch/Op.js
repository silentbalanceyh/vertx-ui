import renderOp from './UI.Rdr.Op';
import renderField from './UI.Rdr.Field';
import renderValue from './UI.Rdr.Value';
import Ux from "ux";

const initOp = (reference, config) => {
    const column = {};
    column.dataIndex = "key";
    column.className = "ux-column-120";
    column.render = renderOp(reference, config);
    return column;
};
const initValue = (reference, config = {}) => {
    const {valueColumn = {}, fieldColumn = {}} = config;
    const column = {};
    column.title = valueColumn.title;
    column.dataIndex = "value";
    column.className = "ux-column-300 ux-left-text";
    column.render = renderValue(reference, fieldColumn, valueColumn.render);
    return column;
};
const initField = (reference, config) => {
    const {fieldColumn = {}} = config;
    const column = {};
    column.dataIndex = "name";
    column.className = "ux-column-220";
    column.title = fieldColumn.title;
    column.render = renderField(reference, fieldColumn);
    return column;
};
const init = (reference) => {
    const {config = {}} = reference.props;
    let $columns = [];
    $columns.push(initOp(reference, config));
    $columns.push(initField(reference, config));
    $columns.push(initValue(reference, config));
    // 初始化数据
    const $data = [{key: Ux.randomUUID()}];
    reference.setState({$columns, $data});
};

export default {
    init
}