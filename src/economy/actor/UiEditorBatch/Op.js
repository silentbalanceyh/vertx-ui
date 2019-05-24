import renderOp from './UI.Rdr.Op';
import renderField from './UI.Rdr.Field';
import renderValue from './UI.Rdr.Value';
import Ux from "ux";
import {message} from 'antd'
import U from 'underscore';

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
    // 提交专用
    const {fnBatchEdit} = reference.props;
    const state = {$columns, $data};
    if (U.isFunction(fnBatchEdit)) {
        state.fnEdit = fnBatchEdit(reference);
    }
    reference.setState(state);
};
const submit = (reference) => (event) => {
    event.preventDefault();
    // 构造数据信息
    const {$data = []} = reference.state;
    const {$selected = []} = reference.props;
    const validated = $data.filter(item => !!item.name && !!item.value).length;
    if ($data.length === validated) {
        // 构造批量更新的数据
        const records = [];
        $selected.forEach(key => {
            const record = {};
            record.key = key;
            $data.forEach(field => {
                record[field.name] = field.value;
            });
            records.push(record);
        });
        // 提取 fnEdit
        const {fnEdit} = reference.state;
        if (U.isFunction(fnEdit)) {
            fnEdit(records);
        }
    } else {
        const {config: {modal = {}}} = reference.props;
        message.config({maxCount: 1});
        const {error = {}} = modal;
        message.error(error.content, 2);
    }
};
export default {
    init,
    submit,
}