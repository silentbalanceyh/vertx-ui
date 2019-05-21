import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';
import Selection from './Op.Selection';

const onPager = (reference = {}) => {
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
    };

    return pagination;
};
const initColumns = (reference, table = {}) => {
    const props = reference.props;
    const op = {
        rxEdit: Fx.rxEdit,
        rxDelete: Fx.rxDelete
    };
    return Ux.uiTableColumn({
        props: {
            // 当前引用对应的props属性
            ...props,
            // 专用的rxEdit/rxDelete的Api调用专用数据
            ...op,
            // 当前组件引用
            $self: reference
        },
    }, table.columns);
};

const initTable = (reference, options = {}, table = {}) => {
    table = Ux.clone(table);
    // 扩展行外置处理
    const {rxExpandRow} = reference.props;
    if (U.isFunction(rxExpandRow)) {
        table.expandedRowRender = rxExpandRow;
    }
    // 静态行处理
    if (!options['column.dynamic']) {
        table.columns = initColumns(reference, table);
    }
    if (Fx.testBatch(options)) {
        table.rowSelection = Selection.initSelection(reference);
    }
    return table;
};
const init = (ref) => {
    const {reference, $options = {}, $table = {}} = ref.props;
    /*
     * 准备 Table 的初始化状态
     */
    const table = initTable(reference, $options, $table);
    ref.setState({table});
};
const render = (reference, options = {}, table = {}) => {
    const {loading = true} = reference.state;
    const $table = Ux.clone(table);
    $table.loading = loading;
    // 动态列处理
    if (options['column.dynamic']) {
        table.columns = initColumns(reference, table);
    }
    // 分页处理
    table.pagination = onPager(reference);
    // onChange事件
    table.onChange = Fx.rxChange(reference);
    return $table;
};

export default {
    init,
    render,
};