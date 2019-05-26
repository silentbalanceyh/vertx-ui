import U from 'underscore';

const initOptions = (reference, options = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return options.filter(item => fnFilterColumn({dataIndex: item.key}));
    } else return options;
};
const initColumns = (reference, columns = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return columns.filter(fnFilterColumn);
    } else return columns;
};
const initFields = (reference, fields = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return fields.map(field => fnFilterColumn({dataIndex: field}));
    } else return fields;
};
export default {
    initOptions,
    initColumns,
    initFields,
}