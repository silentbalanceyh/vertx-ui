import Ai from './ai/AI';
import Value from './Ux.Value';
import Column from './column';

/**
 * Ant Design的Table组件专用的专用属性`columns`列处理器，处理每一列的`render`属性
 * @method uiColumnRender
 * @param reference
 * @param columns
 * @param key
 * @param fnRender
 * @param {Boolean} hoc 是否生成函数
 */
const uiColumnRender = (reference, columns = [], key, fnRender = () => false, hoc = false) => {
    columns.filter(column => column.dataIndex && key === column.dataIndex)
        .forEach(column => (hoc) ? column.render = fnRender(column) : column.render = fnRender);
};
/**
 * Ant Design的Table组件的Table组件专用属性`columns`列处理器，处理每一列的`render`属性
 * @method uiTableColumn
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Array} columns 当前Table组件的columns配置
 * @param ops 当前列是否可操作列：如列中包含了编辑、删除按钮
 * @return {Array}
 */
const uiTableColumn = (reference, columns = [], ops = {}) => {
    columns = Ai.aiExprColumn(columns);
    const $op = Value.immutable(["BUTTON", "OP", "LINK"]);
    const $columns = [];
    // 添加列的平行解析
    columns.forEach(column => {
        const columnItem = Value.valueLadder(column);
        $columns.push(columnItem);
    });
    // 生成最终列信息
    $columns.forEach(column => {
        // $render处理
        Column.columnRender(column, reference, ops);
        // fixed固定值处理
        Column.columnFixed(column, $op);
        // $filter过滤处理
        Column.columnFilter(column, reference);
    });
    return $columns;
};
/**
 * Ant Design中的Table组件的Table组件专用属性`pagination`处理
 * @method uiTablePager
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Object} pager 分页对象，包含了`size`和`page`两个属性
 * @param {Number} count 当前分页组件的数据中的记录数
 * @return {Object}
 */
const uiTablePager = (reference, pager = {}, count = 0) => {
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true
    };
    pagination.total = count;
    pagination.pageSize = pager.size ? pager.size : 10;
    pagination.current = pager.page ? pager.page : 1;
    return pagination;
};
/**
 * 【高阶函数：二阶】Ant Design中的Table组件专用属性`rowSelection`生成函数
 * @method uiTableSelection
 * @param {React.PureComponent} reference React对应组件引用
 * @return {Object}
 */
const uiTableSelection = reference => {
    const {selectedRowKeys = []} = reference.state;
    return {
        selectedRowKeys,
        onChange: keys => {
            // Selected Keys
            reference.setState({selectedRowKeys: keys});
        },
        getCheckboxProps: record => ({
            disabled: record.disabled
        })
    };
};
/**
 * @class Column
 * @description Ant Design中的Table专用系列方法，暂时只有PageList在调用这三个函数，
 * 注意这里的columns必须是`Array`类型用于注入到Table组件
 */
export default {
    uiColumnRender,
    uiTableColumn,
    uiTablePager,
    uiTableSelection
};
