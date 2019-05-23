import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';
import Assist from './Op.Assist';

const initTable = (reference, options = {}, table = {}) => {
    table = Ux.clone(table);
    // 扩展行外置处理
    const {rxExpandRow} = reference.props;
    if (U.isFunction(rxExpandRow)) {
        table.expandedRowRender = rxExpandRow;
    }
    // 静态行处理
    table.columns = Ux.uiTableColumn(reference, table.columns, {
        rxEdit: Fx.rxEdit,
        rxDelete: Fx.rxDelete,
    });
    if (Fx.testBatch(options)) {
        table.rowSelection = Assist.initSelection(reference);
    }
    const onRow = Assist.initRow(reference, table.row);
    if (U.isFunction(onRow)) {
        table.onRow = onRow;
    }
    // onChange事件
    table.onChange = Fx.rxChange(reference);
    return table;
};
const mountPointer = (ref) => {
    const reference = Ux.onReference(ref, 1);
    reference.setState({
        // 加载函数
        fnLoading: ($loading) => ref.setState({$loading}),
        // 刷新函数
        fnRefresh: () => Fx.rxRefresh(ref),
        // 读取 mocker 引用
        fnMock: () => ref.state ? ref.state.$mocker : null
    })
};
const init = (ref) => {
    const {$options = {}, $table = {}} = ref.props;
    /*
     * 准备 Table 的初始化状态
     */
    const state = {};
    state.$table = initTable(ref, $options, $table);
    /*
     * 初始化 $mocker
     */
    const $mocker = Fx.Mock.mockInit(ref, $options);
    if ($mocker) {
        state.$mocker = $mocker;
    }
    ref.setState(state);
    // 加载数据专用，第一次加载
    const {$query = {}} = ref.props;
    Fx.rxSearch(ref, $query);
    // 挂载反向函数
    mountPointer(ref);
};
const update = (ref, previous = {}) => {
    if (Fx.testQuery(ref, previous)) {
        /*
         * 1. 分页会触发
         */
        Fx.rxRefresh(ref);
    }
};
const configTable = (ref, options = {}, table = {}) => {
    const {$loading = true} = ref.state;
    const $table = Ux.clone(table);
    $table.loading = $loading;
    /*
     * 不造成多次改动，这里只进行列数量过滤
     * 动态列处理
     */
    $table.columns = Ux.uiTableColumn(ref, table.columns, {
        rxEdit: Fx.rxEdit,
        rxDelete: Fx.rxDelete,
    });
    // 分页处理
    $table.pagination = Assist.initPager(ref);
    return $table;
};

export default {
    init,
    update,
    configTable,
};