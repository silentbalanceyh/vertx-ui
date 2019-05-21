import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';
import Assist from './Op.Assist';

const initColumns = (reference, table = {}) => {
    const props = reference.props;
    /* 不可使用 $self */
    return Ux.uiTableColumn(reference, table.columns,);
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
        table.rowSelection = Assist.initSelection(reference);
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
const render = (ref, options = {}, table = {}) => {
    const {reference} = ref.props;
    const {loading = true} = reference.state;
    const $table = Ux.clone(table);
    $table.loading = loading;
    // 动态列处理
    if (options['column.dynamic']) {
        $table.columns = initColumns(reference, table);
    }
    // 分页处理
    $table.pagination = Assist.initPager(ref);
    // onChange事件
    $table.onChange = Fx.rxChange(reference);
    return $table;
};

export default {
    init,
    render,
};