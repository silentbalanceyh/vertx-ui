import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';
import Assist from './Op.Assist';
import Mount from './Op.Mount';

const _isDynamic = (reference) => {
    const {$options = {}} = reference.props;
    return $options['column.dynamic'];
};

const _initColumns = (reference, table = {}) => {
    const source = _saveColumn(reference, table);
    /*
     * 不造成多次改动，这里只进行列数量过滤
     * 动态列处理
     */
    table.columns = Ux.uiTableColumn(reference, source, {
        rxEdit: Fx.rxEdit,
        rxDelete: Fx.rxDelete,
    });
    table.columns = Fx.mapColumns(reference, table.columns);
};

const _saveColumn = (reference, table = {}) => {
    const {$columns = []} = reference.props;
    const {columns = []} = table;
    // 合并查找
    const source = Ux.clone(columns).concat($columns);
    const resultColumns = [];
    // 插入专用的map
    const mapColumn = {};
    source.forEach(column => {
        if (!mapColumn[column.dataIndex]) {
            const normalized = Ux.valueLadder(column);
            resultColumns.push(normalized);
            mapColumn[column.dataIndex] = true;
        }
    });
    return resultColumns;
};

const _initTable = (reference, options = {}, table = {}) => {
    table = Ux.clone(table);
    // 扩展行外置处理
    const {rxExpandRow} = reference.props;
    if (U.isFunction(rxExpandRow)) {
        table.expandedRowRender = rxExpandRow;
    }
    // 必须初始化，用于列过滤
    table.columns = _saveColumn(reference, table);
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
const _initMocker = (ref, options = {}) => {
    const state = {};
    /*
     * 初始化 $mocker
     */
    const $mocker = Fx.Mock.mockInit(ref, options);
    if ($mocker) {
        state.$mocker = $mocker;
    }
    return state;
    // Mock这里不设
    // ref.setState(state);
};
const _getDefaultQuery = (ref) => {
    const {$defaultQuery = {}} = ref.state;
    const {$query = {}} = ref.props;
    // 主要针对 criteria 变量
    if (Ux.isDiff($defaultQuery.criteria, $query.criteria)) {
        return {
            value: Ux.clone($query),
            updated: true,
        }
    } else {
        return {
            value: $defaultQuery,
            updated: false,
        }
    }
};
const init = (ref) => {
    const {$options = {}, $table = {}} = ref.props;
    // 初始化状态
    const state = {};
    /* 初始化Mocker */
    const mockState = _initMocker(ref, $options);
    Object.assign(state, mockState);
    // 表格状态初始化
    state.$table = _initTable(ref, $options, $table);
    // 加载数据专用，第一次加载
    state.$defaultQuery = _getDefaultQuery(ref).value;
    // const {$query = {}} = ref.props;
    // Fx.rxSearch(ref, $query, state);
    ref.setState(state);
    // 挂载反向函数
    Mount.mountPointer(ref);
};
const update = (ref, previous = {}) => {
    const query = _getDefaultQuery(ref);
    if (query.updated) {
        /*
         * 先执行，执行过后 updated 就是 false 了
         * 这里要使用 if / else 防止过多的 update
         */
        const $defaultQuery = query.value;
        ref.setState({$defaultQuery});
    } else {
        // 特殊条件
        if (Fx.testQuery(ref, previous)) {
            ref.setState({$loading: true});  // 开启Loading效果
            /*
             * 1. 分页会触发
             */
            Fx.rxRefresh(ref);
            /*
             * 2. 更新根路径中的 $cond 变量
             */
            Mount.mountCond(ref);
        }
    }
};
const configTable = (reference, options = {}, table = {}) => {
    const {$loading = true} = reference.state;
    const $table = Ux.clone(table);
    $table.loading = $loading;

    if (_isDynamic(reference)) {
        _initColumns(reference, $table);
    }
    // 分页处理
    $table.pagination = Assist.initPager(reference);
    return $table;
};

export default {
    init,
    update,
    configTable,
};