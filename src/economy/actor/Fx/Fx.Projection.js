import U from 'underscore';
import Ux from "ux";

const initFull = (reference, columns = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return columns.filter(fnFilterColumn);
    } else return columns;
};
const initColumns = (reference, columns = []) => {
    const {fnFilterView} = reference.props;
    if (U.isFunction(fnFilterView)) {
        return columns.filter(fnFilterView);
    } else return columns;
};
const initOptions = (reference, options = []) => {
    const {fnFilterView} = reference.props;
    if (U.isFunction(fnFilterView)) {
        return options.filter(item => fnFilterView({dataIndex: item.key}));
    } else return options;
};
const initOptionFull = (reference, options = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return options.filter(item => fnFilterColumn({dataIndex: item.key}));
    } else return options;
};

const initFields = (reference, fields = []) => {
    const {fnFilterView} = reference.props;
    if (U.isFunction(fnFilterView)) {
        return fields.map(field => fnFilterView({dataIndex: field}));
    } else return fields;
};
const initSelected = (reference) => {
    const {$table = {}, $options = {}, $columns = []} = reference.props;
    let source = [];
    if ($options['column.dynamic']) {
        source = Ux.clone($table.columns).concat($columns);
    } else {
        source = Ux.clone($table.columns);
    }
    // 列过滤
    return initColumns(reference, source)
        .map(column => column.dataIndex);
};
const inColumns = (reference, $config = {}) => {
    // 列过滤
    let $selected = initSelected(reference);

    const {full = {}} = $config;
    let $options = Ux.RxAnt.toOptions(this, full);
    $options = initOptionFull(reference, $options);

    return {$selected, $options};
};
export default {
    initOptions,
    initFull,
    initColumns,
    initFields,
    inColumns
}